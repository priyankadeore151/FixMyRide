from sqlalchemy import Column, Integer, String, DECIMAL, TIMESTAMP, Boolean, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    created_at = Column(TIMESTAMP, server_default=func.now())

class Mechanic(Base):
    __tablename__ = "mechanics"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=False)
    specialization = Column(String(255))
    rating = Column(DECIMAL(3, 2), default=0.00)
    is_available = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    mechanic_id = Column(Integer, ForeignKey("mechanics.id", ondelete="SET NULL"))
    service_type = Column(String(255), nullable=False)
    location_lat = Column(DECIMAL(10, 8))
    location_lng = Column(DECIMAL(11, 8))
    description = Column(Text)
    status = Column(Enum('Pending', 'Accepted', 'In Progress', 'Completed', 'Cancelled'), default='Pending')
    created_at = Column(TIMESTAMP, server_default=func.now())

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"))
    amount = Column(DECIMAL(10, 2), nullable=False)
    payment_method = Column(String(50))
    status = Column(Enum('Pending', 'Completed', 'Failed'), default='Pending')
    created_at = Column(TIMESTAMP, server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    mechanic_id = Column(Integer, ForeignKey("mechanics.id", ondelete="CASCADE"))
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
