#!/usr/bin/env python3
"""
Script to create an admin user for testing role-based functionality
Run this script to create an admin account for testing the admin dashboard.
"""

from sqlalchemy.orm import Session
from database import engine, get_db
from models import User
from passlib.context import CryptContext
import sys

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    """Create an admin user"""
    print("🔧 Creating Admin User...")
    print("=" * 40)
    
    # Get user input
    username = input("Enter admin username (default: admin): ").strip()
    if not username:
        username = "admin"
    
    password = input("Enter admin password (default: admin123): ").strip()
    if not password:
        password = "admin123"
    
    print(f"\nCreating admin user with username: {username}")
    
    # Create database session
    db: Session = next(get_db())
    
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == username).first()
        if existing_user:
            print(f"❌ User '{username}' already exists!")
            response = input("Do you want to update their role to admin? (y/N): ").strip().lower()
            if response == 'y':
                existing_user.role = "admin"
                db.commit()
                print(f"✅ Updated '{username}' role to admin")
            else:
                print("❌ Operation cancelled")
            return
        
        # Hash password
        hashed_password = pwd_context.hash(password)
        
        # Create admin user
        admin_user = User(
            username=username,
            hashed_password=hashed_password,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Username: {username}")
        print(f"   Role: {admin_user.role}")
        print(f"   User ID: {admin_user.id}")
        print("\n🚀 You can now login with these credentials and access the admin dashboard!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error creating admin user: {e}")
    finally:
        db.close()

def list_users():
    """List all users in the database"""
    print("👥 Current Users:")
    print("=" * 40)
    
    db: Session = next(get_db())
    
    try:
        users = db.query(User).all()
        if not users:
            print("No users found in database.")
            return
        
        for user in users:
            role_icon = "👑" if user.role == "admin" else "👤"
            print(f"{role_icon} {user.username} (ID: {user.id}, Role: {user.role})")
            
    except Exception as e:
        print(f"❌ Error listing users: {e}")
    finally:
        db.close()

def main():
    """Main function"""
    print("🎯 Admin User Management Tool")
    print("=" * 40)
    
    if len(sys.argv) > 1 and sys.argv[1] == "--list":
        list_users()
        return
    
    while True:
        print("\nOptions:")
        print("1. Create admin user")
        print("2. List all users")
        print("3. Exit")
        
        choice = input("\nEnter your choice (1-3): ").strip()
        
        if choice == "1":
            create_admin_user()
        elif choice == "2":
            list_users()
        elif choice == "3":
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1, 2, or 3.")

if __name__ == "__main__":
    main()
