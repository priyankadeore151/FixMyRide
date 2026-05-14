from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
from dotenv import load_dotenv

import models, schemas, database
from database import engine, get_db
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt

load_dotenv()

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="FixMyRide API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.get("/")
def read_root():
    return {"message": "FixMyRide Python API is running..."}

# Auth Routes
@app.post("/api/users/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_password,
        phone=user.phone
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/users/login")
def login_user(user_credentials: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30)))
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "name": user.name, "email": user.email}}

# Mechanic Routes
@app.get("/api/mechanics", response_model=List[schemas.MechanicResponse])
def get_mechanics(db: Session = Depends(get_db)):
    return db.query(models.Mechanic).all()

# Booking Routes
@app.post("/api/bookings", response_model=schemas.BookingResponse)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    new_booking = models.Booking(**booking.dict())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return new_booking

@app.get("/api/bookings/{user_id}", response_model=List[schemas.BookingResponse])
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Booking).filter(models.Booking.user_id == user_id).all()
