
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    daily_target = Column(Integer, nullable=False)


class CheckIn(Base):
    __tablename__ = "check_ins"

    id = Column(Integer, primary_key=True, index=True)
    goal_id = Column(Integer, ForeignKey("goals.id"), nullable=False)
    status = Column(String(30), nullable=False)
    note = Column(String(300), nullable=False, default="")
