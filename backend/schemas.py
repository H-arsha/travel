from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: str

class UserCreate(UserBase):
    password: str

class StateUnlocked(BaseModel):
    id: int
    state_name: str
    date_unlocked: datetime

    class Config:
        from_attributes = True

class AchievementOut(BaseModel):
    id: int
    achievement_name: str
    date_earned: datetime

    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    xp: int
    level: int
    current_streak: int
    last_trip_date: Optional[datetime]
    unlocked_states: List[StateUnlocked] = []
    achievements: List[AchievementOut] = []

    class Config:
        from_attributes = True

class TripBase(BaseModel):
    destination: str
    state: str
    transport_mode: str
    budget: float
    solo: bool
    terrain_type: str

class TripCreate(TripBase):
    pass

class Trip(TripBase):
    id: int
    user_id: int
    date: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
