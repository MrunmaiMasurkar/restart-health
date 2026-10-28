from fastapi import FastAPI, status, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Literal
from sqlalchemy.orm import Session
from database import engine, Base, get_db
import models

app = FastAPI(title="ReStart Health API")

Base.metadata.create_all(bind=engine)

class HabitGoalCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    category: str
    daily_target: int = Field(gt=0, le=1440)

class HabitCheckInCreate(BaseModel):
    goal_id: int = Field(gt=0)
    status: Literal["completed", "partially_completed", "missed"]
    note: str = Field(default="", max_length=300)


@app.get("/")
def home():
    return {"message": "Welcome to ReStart!"}


@app.post("/goals", status_code=status.HTTP_201_CREATED)
def create_goal(goal: HabitGoalCreate, db:Session=Depends(get_db)):
    new_goal = models.Goal(
        title=goal.title,   
        category=goal.category,
        daily_target=goal.daily_target
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return {
        "id": new_goal.id,
        "title": new_goal.title,
        "category": new_goal.category,
        "daily_target": new_goal.daily_target
    }


@app.get("/goals")
def get_goals(db:Session=Depends(get_db)):
    goals = db.query(models.Goal).all()
    return [
        {
            "id": goal.id,
            "title": goal.title,
            "category": goal.category,
            "daily_target": goal.daily_target
        }
        for goal in goals
    ]


@app.post("/check-ins", status_code=status.HTTP_201_CREATED)
def create_check_in(check_in: HabitCheckInCreate, db: Session = Depends(get_db)):
    goal = db.query(models.Goal).filter(models.Goal.id == check_in.goal_id).first()

    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    new_check_in = models.CheckIn(
        goal_id=check_in.goal_id,
        status=check_in.status,
        note=check_in.note
    )

    db.add(new_check_in)
    db.commit()
    db.refresh(new_check_in)

    return {
        "id": new_check_in.id,
        "goal_id": new_check_in.goal_id,
        "status": new_check_in.status,
        "note": new_check_in.note
    }


@app.get("/check-ins")
def get_check_ins(db:Session=Depends(get_db)):
    check_ins = db.query(models.CheckIn).all()
    return [
        {
            "id": check_in.id,
            "goal_id": check_in.goal_id,
            "status": check_in.status,
            "note": check_in.note
        }
        for check_in in check_ins
    ]