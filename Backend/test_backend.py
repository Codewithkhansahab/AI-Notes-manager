#!/usr/bin/env python3
"""
Comprehensive backend test script
"""
import sys

def test_imports():
    """Test if all required packages are installed"""
    print("🔍 Testing imports...")
    try:
        import fastapi
        print("  ✅ FastAPI")
        import uvicorn
        print("  ✅ Uvicorn")
        import sqlalchemy
        print("  ✅ SQLAlchemy")
        import pydantic
        print("  ✅ Pydantic")
        import jose
        print("  ✅ Python-JOSE")
        import passlib
        print("  ✅ Passlib")
        import google.generativeai
        print("  ✅ Google Generative AI")
        from PIL import Image
        print("  ✅ Pillow")
        return True
    except ImportError as e:
        print(f"  ❌ Import error: {e}")
        return False

def test_config():
    """Test configuration"""
    print("\n🔍 Testing configuration...")
    try:
        from app.config import settings
        print(f"  ✅ Config loaded")
        print(f"  ℹ️  Database: {settings.DATABASE_URL}")
        print(f"  ℹ️  Gemini API Key: {'*' * 20}{settings.GEMINI_API_KEY[-10:]}")
        return True
    except Exception as e:
        print(f"  ❌ Config error: {e}")
        return False

def test_database():
    """Test database connection"""
    print("\n🔍 Testing database...")
    try:
        from app.database import engine, Base
        from app import models
        
        # Try to connect
        with engine.connect() as conn:
            print("  ✅ Database connection successful")
        
        # Check tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"  ℹ️  Tables: {', '.join(tables)}")
        
        # Check notes table columns
        if 'notes' in tables:
            columns = [col['name'] for col in inspector.get_columns('notes')]
            print(f"  ℹ️  Notes columns: {', '.join(columns)}")
            
            # Check for image fields
            if 'image_path' in columns and 'image_description' in columns:
                print("  ✅ Image fields present")
            else:
                print("  ⚠️  Image fields missing - run migrate_db.py")
        
        return True
    except Exception as e:
        print(f"  ❌ Database error: {e}")
        return False

def test_gemini():
    """Test Gemini API"""
    print("\n🔍 Testing Gemini API...")
    try:
        import google.generativeai as genai
        from app.config import settings
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        response = model.generate_content("Say 'Hello from Gemini!'")
        if response and response.text:
            print(f"  ✅ Gemini API working")
            print(f"  ℹ️  Response: {response.text.strip()[:50]}...")
            return True
        else:
            print("  ❌ No response from Gemini")
            return False
    except Exception as e:
        print(f"  ❌ Gemini error: {e}")
        return False

def test_routes():
    """Test if routes are properly configured"""
    print("\n🔍 Testing routes...")
    try:
        from app.main import app
        routes = [route.path for route in app.routes]
        print(f"  ✅ Found {len(routes)} routes")
        
        # Check key routes
        key_routes = ['/auth/register', '/auth/login', '/notes/', '/notes/{note_id}/summarize', '/notes/{note_id}/upload-image']
        for route in key_routes:
            if any(route in r for r in routes):
                print(f"  ✅ {route}")
            else:
                print(f"  ⚠️  {route} not found")
        
        return True
    except Exception as e:
        print(f"  ❌ Routes error: {e}")
        return False

def main():
    print("=" * 60)
    print("🚀 AI Notes Manager - Backend Test Suite")
    print("=" * 60)
    
    results = []
    results.append(("Imports", test_imports()))
    results.append(("Configuration", test_config()))
    results.append(("Database", test_database()))
    results.append(("Gemini API", test_gemini()))
    results.append(("Routes", test_routes()))
    
    print("\n" + "=" * 60)
    print("📊 Test Results Summary")
    print("=" * 60)
    
    for name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{name:20} {status}")
    
    all_passed = all(result for _, result in results)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All tests passed! Backend is ready to run.")
        print("\nTo start the backend:")
        print("  python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload")
    else:
        print("⚠️  Some tests failed. Please fix the issues above.")
    print("=" * 60)
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
