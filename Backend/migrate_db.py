#!/usr/bin/env python3
"""
Simple database migration script to add image fields to existing notes table
"""
import sqlite3
import os

def migrate_database():
    db_path = "app.db"
    
    if not os.path.exists(db_path):
        print(" Database file not found. Please run the backend first to create it.")
        return
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(notes)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add image_path column if it doesn't exist
        if 'image_path' not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN image_path VARCHAR(512)")
            print("Added image_path column")
        else:
            print("ℹ image_path column already exists")
        
        # Add image_description column if it doesn't exist
        if 'image_description' not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN image_description TEXT")
            print("Added image_description column")
        else:
            print("ℹimage_description column already exists")
        
        conn.commit()
        conn.close()
        print(" Database migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {str(e)}")

if __name__ == "__main__":
    migrate_database()
