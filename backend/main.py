from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud, auth, database
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
# TODO: After deployment, replace "*" with your actual Vercel URL e.g. "https://your-app.vercel.app"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if not user.password or len(user.password) == 0:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
    
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth.get_password_hash(user.password)
    new_user = crud.create_user(db=db, user=user, hashed_password=hashed_password)
    return new_user

@app.post("/auth/login", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = auth.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@app.post("/trips/", response_model=schemas.Trip)
def log_trip(trip: schemas.TripCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return crud.create_trip(db=db, trip=trip, user_id=current_user.id)

@app.get("/trips/me", response_model=List[schemas.Trip])
def get_my_trips(current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return crud.get_user_trips(db, user_id=current_user.id)

@app.get("/leaderboard", response_model=List[schemas.User])
def get_leaderboard(db: Session = Depends(get_db)):
    return crud.get_leaderboard(db)

@app.get("/users/me/states", response_model=List[schemas.StateUnlocked])
def get_my_states(current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
     return current_user.unlocked_states

@app.get("/users/me/achievements", response_model=List[schemas.AchievementOut])
def get_my_achievements(current_user: schemas.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return current_user.achievements
