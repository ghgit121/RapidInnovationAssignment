#!/usr/bin/env python3
"""
Database migration script to update History table column name from 'timestamp' to 'created_at'
"""

import os
from sqlalchemy import create_engine, text
from database import DATABASE_URL

def migrate_database():
    print(f"Connecting to database: {DATABASE_URL}")
    
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        try:
            # Check if the history table exists and what columns it has
            if DATABASE_URL.startswith("postgresql://"):
                result = conn.execute(text("""
                    SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'history'
                """))
            else:
                # SQLite fallback
                result = conn.execute(text("PRAGMA table_info(history)"))
            
            columns = result.fetchall()
            
            if DATABASE_URL.startswith("postgresql://"):
                column_names = [row[0] for row in columns]
            else:
                column_names = [row[1] for row in columns]
            
            print(f"Found columns in history table: {column_names}")
            
            if 'timestamp' in column_names and 'created_at' not in column_names:
                print("Found 'timestamp' column, renaming to 'created_at'...")
                
                # For PostgreSQL, we can use ALTER TABLE to rename column
                if DATABASE_URL.startswith("postgresql://"):
                    conn.execute(text("ALTER TABLE history RENAME COLUMN timestamp TO created_at"))
                    conn.commit()
                    print("PostgreSQL migration completed successfully!")
                else:
                    print("SQLite column rename requires table recreation - please recreate database")
                    
            elif 'created_at' in column_names:
                print("Database already migrated - 'created_at' column exists.")
            else:
                print("History table not found or no timestamp column exists.")
                print("Database will be created with correct schema on first run.")
                    
        except Exception as e:
            print(f"Migration failed: {e}")
            print("This might be expected if the table doesn't exist yet.")
            print("The correct schema will be created when you first run the application.")

if __name__ == "__main__":
    migrate_database()
