"""
Migration script to add audio fields to notes table
"""
import sqlite3
from pathlib import Path

DB_PATH = Path("app.db")

def migrate():
    if not DB_PATH.exists():
        print("Database not found.")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        cursor.execute("PRAGMA table_info(notes)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if "audio_path" not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN audio_path VARCHAR(512)")
            print("✓ Added audio_path column")
        else:
            print("- audio_path already exists")
        
        if "audio_transcription" not in columns:
            cursor.execute("ALTER TABLE notes ADD COLUMN audio_transcription TEXT")
            print("✓ Added audio_transcription column")
        else:
            print("- audio_transcription already exists")
        
        conn.commit()
        print("\n✅ Audio migration completed!")
        
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    print("Starting audio migration...\n")
    migrate()
