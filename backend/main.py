from fastapi import FastAPI, status, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Literal
from sqlalchemy.orm import Session
from database import engine, Base, get_db,add_barrier_column
import models
from ai_service import generate_habit_suggestion
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ReStart Health API")
    
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

Base.metadata.create_all(bind=engine)
add_barrier_column()  # Ensure the barrier column exists in the check_ins table

class HabitGoalCreate(BaseModel):
    title: str = Field(min_length=3, max_length=100)
    category: str
    daily_target: int = Field(gt=0, le=1440)

class HabitCheckInCreate(BaseModel):
    goal_id: int = Field(gt=0)
    status: Literal["completed", "partially_completed", "missed"]
    note: str = Field(default="", max_length=300)
    barrier:Literal["not_enough_time", "low_energy", "forgot", "other"] | None=None


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
        note=check_in.note,
        barrier=check_in.barrier
    )

    db.add(new_check_in)
    db.commit()
    db.refresh(new_check_in)

    return {
        "id": new_check_in.id,
        "goal_id": new_check_in.goal_id,
        "status": new_check_in.status,
        "note": new_check_in.note,
        "barrier": new_check_in.barrier
    }


@app.get("/check-ins")
def get_check_ins(db:Session=Depends(get_db)):
    check_ins = db.query(models.CheckIn).all()
    return [
        {
            "id": check_in.id,
            "goal_id": check_in.goal_id,
            "status": check_in.status,
            "note": check_in.note,
            "barrier": check_in.barrier
        }
        for check_in in check_ins
    ]

@app.get("/check-ins/{check_in_id}/suggestion")
def get_habit_suggestion(
    check_in_id: int,
    db: Session = Depends(get_db)
):
    # Find the check-in
    check_in = db.query(models.CheckIn).filter(
        models.CheckIn.id == check_in_id
    ).first()

    if check_in is None:
        raise HTTPException(
            status_code=404,
            detail="Check-in not found"
        )

    # Generate suggestions only for missed habits
    if check_in.status != "missed":
        raise HTTPException(
            status_code=400,
            detail="Suggestions are available only for missed habits"
        )

    # Find the associated goal
    goal = db.query(models.Goal).filter(
        models.Goal.id == check_in.goal_id
    ).first()

    if goal is None:
        raise HTTPException(
            status_code=404,
            detail="Associated goal not found"
        )

    # Ask the AI to generate a personalized suggestion
    try:
        suggestion = generate_habit_suggestion(
            goal_title=goal.title,
            category=goal.category,
            daily_target=goal.daily_target,
            barrier=check_in.barrier
        )
    except Exception:
        raise HTTPException(
            status_code=502,
            detail="Unable to generate a suggestion right now. Please try again."
        )

    return {
        "check_in_id": check_in.id,
        "goal_id": goal.id,
        "suggestion": suggestion
    }