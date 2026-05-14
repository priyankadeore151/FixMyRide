from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class MechanicBase(BaseModel):
    name: str
    phone: str
    specialization: Optional[str] = None
    rating: Decimal = 0.00
    is_available: bool = True

class MechanicResponse(MechanicBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    user_id: int
    mechanic_id: Optional[int] = None
    service_type: str
    location_lat: Optional[Decimal] = None
    location_lng: Optional[Decimal] = None
    description: Optional[str] = None
    status: str = "Pending"

class BookingCreate(BookingBase):
    pass

class BookingResponse(BookingBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
