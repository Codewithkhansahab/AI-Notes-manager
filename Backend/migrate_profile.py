"""
Migration script to add profile fields to existing users table
Run this script once to update your database schema
"""
import sqlite3
from pathlib import Path

DB_PATH = Path("app.db")

def migrate():
    if not DB_PATH.exists():
        print("Database not found. Please run the app first to create the database.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add full_name column if it doesn't exist
        if "full_name" not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN full_name VARCHAR(256)")
            print("✓ Added full_name column")
        else:
            print("- full_name column already exists")
        
        # Add bio column if it doesn't exist
        if "bio" not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN bio TEXT")
            print("✓ Added bio column")
        else:
            print("- bio column already exists")
        
        # Add avatar_path column if it doesn't exist
        if "avatar_path" not in columns:
            cursor.execute("ALTER TABLE users ADD COLUMN avatar_path VARCHAR(512)")
            print("✓ Added avatar_path column")
        else:
            print("- avatar_path column already exists")
        
        # Add updated_at column if it doesn't exist
        if "updated_at" not in columns:
            # SQLite doesn't support CURRENT_TIMESTAMP in ALTER TABLE, so we use a workaround
            cursor.execute("ALTER TABLE users ADD COLUMN updated_at DATETIME")
            # Update existing rows with current timestamp
            cursor.execute("UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL")
            print("✓ Added updated_at column")
        else:
            print("- updated_at column already exists")
        
        conn.commit()
        print("\n✅ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("Starting database migration...\n")
    migrate()
