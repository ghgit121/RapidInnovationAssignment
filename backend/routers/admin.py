from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import User, History
from schemas import UserResponse, UserCreate
from database import get_db
from dependencies import get_admin_user, get_current_user
from passlib.context import CryptContext
from typing import Optional, List
import logging
from datetime import datetime, timedelta

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    role_filter: Optional[str] = Query(None, description="Filter by role (user/admin)")
):
    """Get all users (admin only)"""
    query = db.query(User)
    
    if role_filter:
        query = query.filter(User.role == role_filter)
    
    users = query.offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get specific user by ID (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/users", response_model=UserResponse)
async def create_user(
    user_data: UserCreate,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Create a new user (admin only)"""
    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Hash password and create user
    hashed_password = pwd_context.hash(user_data.password)
    new_user = User(
        username=user_data.username,
        hashed_password=hashed_password,
        role=user_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"Admin {admin_user.username} created new user: {new_user.username}")
    return new_user

@router.put("/users/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    update_data: dict,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Update user information (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update allowed fields
    if "username" in update_data:
        # Check if new username already exists (but not for the current user)
        existing = db.query(User).filter(
            User.username == update_data["username"], 
            User.id != user_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already exists")
        user.username = update_data["username"]
    
    if "role" in update_data:
        if update_data["role"] not in ["user", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role")
        user.role = update_data["role"]
    
    if "password" in update_data:
        user.hashed_password = pwd_context.hash(update_data["password"])
    
    db.commit()
    db.refresh(user)
    
    logger.info(f"Admin {admin_user.username} updated user: {user.username}")
    return user

@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Delete a user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from deleting themselves
    if user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    
    # Delete user's history first (cascade)
    db.query(History).filter(History.user_id == user_id).delete()
    
    # Delete the user
    username = user.username
    db.delete(user)
    db.commit()
    
    logger.info(f"Admin {admin_user.username} deleted user: {username}")
    return {"detail": f"User {username} deleted successfully"}

@router.get("/stats")
async def get_system_stats(
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Get system statistics (admin only)"""
    
    # Basic counts
    total_users = db.query(func.count(User.id)).scalar()
    admin_users = db.query(func.count(User.id)).filter(User.role == "admin").scalar()
    regular_users = total_users - admin_users
    
    total_searches = db.query(func.count(History.id)).filter(History.type == "search").scalar()
    total_images = db.query(func.count(History.id)).filter(History.type == "image").scalar()
    total_activities = total_searches + total_images
    
    # Recent activity (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_activities = db.query(func.count(History.id)).filter(
        History.created_at >= week_ago
    ).scalar()
    
    # Most active users (top 5 by activity count)
    most_active = db.query(
        User.username,
        func.count(History.id).label('activity_count')
    ).join(History, User.id == History.user_id)\
    .group_by(User.id, User.username)\
    .order_by(desc(func.count(History.id)))\
    .limit(5).all()
    
    return {
        "users": {
            "total": total_users,
            "admin": admin_users,
            "regular": regular_users
        },
        "activities": {
            "total": total_activities,
            "searches": total_searches,
            "images": total_images,
            "recent_week": recent_activities
        },
        "most_active_users": [
            {"username": username, "activity_count": count} 
            for username, count in most_active
        ]
    }

@router.get("/users/{user_id}/history")
async def get_user_history(
    user_id: int,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=200)
):
    """Get history for a specific user (admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    history = db.query(History).filter(
        History.user_id == user_id
    ).order_by(desc(History.created_at)).limit(limit).all()
    
    return {
        "user": {"id": user.id, "username": user.username, "role": user.role},
        "history": history,
        "total_count": len(history)
    }

@router.put("/users/{user_id}/role")
async def change_user_role(
    user_id: int,
    new_role: dict,
    admin_user: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    """Change user role (admin only)"""
    if "role" not in new_role or new_role["role"] not in ["user", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be 'user' or 'admin'")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Prevent admin from changing their own role to prevent lockout
    if user.id == admin_user.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")
    
    old_role = user.role
    user.role = new_role["role"]
    db.commit()
    db.refresh(user)
    
    logger.info(f"Admin {admin_user.username} changed user {user.username} role from {old_role} to {user.role}")
    return {"detail": f"User {user.username} role changed from {old_role} to {user.role}"}
