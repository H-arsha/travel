from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas
import datetime

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        last_trip_date=None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def calculate_xp(trip: schemas.TripCreate, is_new_state: bool):
    xp = 0
    # Base XP for a trip
    xp += 50 
    
    if trip.solo:
        xp += 100
    
    # Transport bonuses
    transport = trip.transport_mode.lower()
    if transport == "bus":
        xp += 80
    elif transport == "train":
        xp += 60
    elif transport == "bike":
        xp += 50
    elif transport == "foot":
        xp += 150
    
    # Budget bonus
    if trip.budget < 3000:
        xp += 70
        
    # New Territory Bonus
    if is_new_state:
        xp += 200
        
    return xp

def check_and_award_achievements(db: Session, user_id: int):
    """Check milestones and auto-award achievement badges."""
    user = get_user(db, user_id)
    existing = {a.achievement_name for a in user.achievements}
    trip_count = db.query(models.Trip).filter(models.Trip.user_id == user_id).count()
    state_count = db.query(models.StateUnlocked).filter(models.StateUnlocked.user_id == user_id).count()
    solo_count = db.query(models.Trip).filter(models.Trip.user_id == user_id, models.Trip.solo == True).count()
    
    milestones = [
        ("First Conquest", trip_count >= 1),
        ("Seasoned Explorer", trip_count >= 5),
        ("Veteran Traveler", trip_count >= 10),
        ("Legendary Nomad", trip_count >= 25),
        ("5 States Conquered", state_count >= 5),
        ("10 States Conquered", state_count >= 10),
        ("India Dominator", state_count >= 20),
        ("Solo Warrior", solo_count >= 3),
        ("Lone Wolf", solo_count >= 10),
        ("Budget Master", user.xp >= 2000),
        ("XP Legend", user.xp >= 10000),
    ]
    
    new_achievements = []
    for name, condition in milestones:
        if condition and name not in existing:
            achievement = models.Achievement(user_id=user_id, achievement_name=name)
            db.add(achievement)
            new_achievements.append(name)
    
    if new_achievements:
        db.commit()
    
    return new_achievements

def create_trip(db: Session, trip: schemas.TripCreate, user_id: int):
    # Check if state is already unlocked
    existing_state = db.query(models.StateUnlocked).filter(
        models.StateUnlocked.user_id == user_id,
        models.StateUnlocked.state_name == trip.state
    ).first()
    
    is_new_state = existing_state is None
    
    # Calculate XP
    earned_xp = calculate_xp(trip, is_new_state)
    
    # Create Trip Record
    db_trip = models.Trip(**trip.dict(), user_id=user_id)
    db.add(db_trip)
    
    # Update User Stats
    user = get_user(db, user_id)
    user.xp += earned_xp
    
    # Update Level (Simple logic: Level = XP // 1000 + 1)
    user.level = (user.xp // 1000) + 1
    
    # Streak Logic
    today = datetime.datetime.utcnow().date()
    if user.last_trip_date:
        last_trip = user.last_trip_date.date()
        days_diff = (today - last_trip).days
        
        if days_diff <= 7 and days_diff > 0:
            user.current_streak += 1
        elif days_diff > 7:
            user.current_streak = 1
        # If same day, streak doesn't increase but doesn't reset
    else:
         user.current_streak = 1
         
    user.last_trip_date = datetime.datetime.utcnow()
    
    # Unlock State if new
    if is_new_state:
        new_state = models.StateUnlocked(user_id=user_id, state_name=trip.state)
        db.add(new_state)
    
    db.commit()
    db.refresh(db_trip)
    
    # Check and award achievements after trip
    check_and_award_achievements(db, user_id)
    
    return db_trip

def get_user_trips(db: Session, user_id: int):
    return db.query(models.Trip).filter(models.Trip.user_id == user_id).order_by(models.Trip.date.desc()).all()

def get_trips(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Trip).offset(skip).limit(limit).all()

def get_leaderboard(db: Session, limit: int = 10):
    return db.query(models.User).order_by(models.User.xp.desc()).limit(limit).all()

