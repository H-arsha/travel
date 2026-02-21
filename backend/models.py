from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    current_streak = Column(Integer, default=0)
    last_trip_date = Column(DateTime, nullable=True)

    trips = relationship("Trip", back_populates="owner")
    unlocked_states = relationship("StateUnlocked", back_populates="owner")
    achievements = relationship("Achievement", back_populates="owner")

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    destination = Column(String)
    state = Column(String)
    transport_mode = Column(String) # bus, train, flight, bike, car, foot
    budget = Column(Float)
    solo = Column(Boolean, default=False)
    terrain_type = Column(String) # mountain, beach, desert, forest, city
    date = Column(DateTime, default=datetime.datetime.utcnow)
    
    owner = relationship("User", back_populates="trips")

class StateUnlocked(Base):
    __tablename__ = "states_unlocked"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    state_name = Column(String)
    date_unlocked = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="unlocked_states")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_name = Column(String)
    date_earned = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="achievements")
