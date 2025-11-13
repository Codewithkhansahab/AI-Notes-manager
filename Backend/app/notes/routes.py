from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from PIL import Image
import io

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user
import google.generativeai as genai
from app.config import settings

# Configure Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)
router = APIRouter(prefix="/notes", tags=["notes"])


def summarize_text(text: str) -> str:
    """Summarize text using Google's Gemini model."""
    try:
        if not text.strip():
            return "No content to summarize."
        
        print(f" Starting AI summarization for text: {text[:100]}...")
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = f"Please provide a brief and clear summary of the following text in 2-3 sentences:\n\n{text}"
        response = model.generate_content(prompt)
        
        if response and response.text:
            summary = response.text.strip()
            print(f" AI summary generated: {summary[:100]}...")
            return summary
        else:
            print(" No response from AI model")
            return "Unable to generate summary - no response from AI model."
            
    except Exception as e:
        print(f" Gemini API Error: {str(e)}")
        return f"Error generating summary: {str(e)}"


def analyze_image(image_path: str) -> str:
    """Analyze image using Google's Gemini Vision model."""
    try:
        print(f"🖼️ Starting AI image analysis for: {image_path}")
        
        # Load image
        image = Image.open(image_path)
        
        # Use Gemini Vision model
        model = genai.GenerativeModel("gemini-2.5-flash")
        prompt = "Analyze this image and provide a detailed description of what you see. Include objects, people, activities, colors, and any text visible in the image."
        
        response = model.generate_content([prompt, image])
        
        if response and response.text:
            description = response.text.strip()
            print(f" AI image analysis completed: {description[:100]}...")
            return description
        else:
            print(" No response from AI vision model")
            return "Unable to analyze image - no response from AI model."
            
    except Exception as e:
        print(f" Gemini Vision API Error: {str(e)}")
        return f"Error analyzing image: {str(e)}"


def save_uploaded_file(file: UploadFile, user_id: int) -> str:
    """Save uploaded file and return the file path."""
    try:
        # Create uploads directory if it doesn't exist
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{user_id}_{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
        
        print(f" File saved: {file_path}")
        return file_path
        
    except Exception as e:
        print(f" File save error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")


@router.post("/", response_model=schemas.NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(note_in: schemas.NoteCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    note = models.Note(title=note_in.title, content=note_in.content, owner_id=user.id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/", response_model=List[schemas.NoteOut])
def list_notes(db: Session = Depends(get_db), user=Depends(get_current_user)):
    notes = db.query(models.Note).filter(models.Note.owner_id == user.id).all()
    return notes


@router.get("/{note_id}", response_model=schemas.NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return note


@router.put("/{note_id}", response_model=schemas.NoteOut)
def update_note(note_id: int, note_in: schemas.NoteUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    note.title = note_in.title
    note.content = note_in.content
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    db.delete(note)
    db.commit()
    return None


@router.post("/{note_id}/summarize", response_model=schemas.NoteOut)
def summarize_note(note_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user=Depends(get_current_user)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")

    def _bg_summarize(note_id: int, content: str):
        summary_text = summarize_text(content)
        from app.database import SessionLocal
        db_bg = SessionLocal()
        try:
            n = db_bg.query(models.Note).filter(models.Note.id == note_id).first()
            if n:
                n.summary = summary_text
                db_bg.add(n)
                db_bg.commit()
        finally:
            db_bg.close()

    background_tasks.add_task(_bg_summarize, note.id, note.content)
    return note


@router.post("/{note_id}/upload-image", response_model=schemas.NoteOut)
def upload_image_to_note(
    note_id: int, 
    file: UploadFile = File(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db), 
    user=Depends(get_current_user)
):
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Get note and verify ownership
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    
    # Save file
    file_path = save_uploaded_file(file, user.id)
    
    # Update note with image path
    note.image_path = file_path
    db.add(note)
    db.commit()
    db.refresh(note)
    
    # Analyze image in background
    def _bg_analyze_image(note_id: int, image_path: str):
        description = analyze_image(image_path)
        from app.database import SessionLocal
        db_bg = SessionLocal()
        try:
            n = db_bg.query(models.Note).filter(models.Note.id == note_id).first()
            if n:
                n.image_description = description
                db_bg.add(n)
                db_bg.commit()
        finally:
            db_bg.close()
    
    background_tasks.add_task(_bg_analyze_image, note.id, file_path)
    return note


@router.post("/{note_id}/analyze-image", response_model=schemas.NoteOut)
def analyze_note_image(note_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), user=Depends(get_current_user)):
    note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.owner_id == user.id).first()
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    
    if not note.image_path:
        raise HTTPException(status_code=400, detail="Note has no image to analyze")

    def _bg_analyze_image(note_id: int, image_path: str):
        description = analyze_image(image_path)
        from app.database import SessionLocal
        db_bg = SessionLocal()
        try:
            n = db_bg.query(models.Note).filter(models.Note.id == note_id).first()
            if n:
                n.image_description = description
                db_bg.add(n)
                db_bg.commit()
        finally:
            db_bg.close()

    background_tasks.add_task(_bg_analyze_image, note.id, note.image_path)
    return note


@router.get("/image/{filename}")
def get_image(filename: str):
    file_path = os.path.join("uploads", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(file_path)
