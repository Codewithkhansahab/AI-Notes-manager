from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import uuid
from PIL import Image
import os

from app import models, schemas
from app.database import get_db
from app.deps import get_current_user

router = APIRouter(prefix="/profile", tags=["profile"])

UPLOAD_DIR = Path("uploads/avatars")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/me", response_model=schemas.UserOut)
def get_profile(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Get current user profile"""
    return current_user


@router.put("/me", response_model=schemas.UserOut)
def update_profile(
    profile_update: schemas.UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update current user profile"""
    
    # Check if email is being changed and if it's already taken
    if profile_update.email and profile_update.email != current_user.email:
        existing_user = db.query(models.User).filter(
            models.User.email == profile_update.email,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = profile_update.email
    
    # Update other fields
    if profile_update.full_name is not None:
        current_user.full_name = profile_update.full_name
    
    if profile_update.bio is not None:
        current_user.bio = profile_update.bio
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/avatar", response_model=schemas.UserOut)
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Upload user avatar image"""
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Delete old avatar if exists
    if current_user.avatar_path:
        old_avatar_path = Path(current_user.avatar_path)
        if old_avatar_path.exists():
            old_avatar_path.unlink()
    
    # Generate unique filename
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save and resize image
    try:
        # Save uploaded file temporarily
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Resize image to 200x200
        with Image.open(file_path) as img:
            # Convert to RGB if necessary
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            
            # Resize maintaining aspect ratio and crop to square
            img.thumbnail((200, 200), Image.Resampling.LANCZOS)
            
            # Create square image
            width, height = img.size
            if width != height:
                # Crop to square
                min_dim = min(width, height)
                left = (width - min_dim) // 2
                top = (height - min_dim) // 2
                right = left + min_dim
                bottom = top + min_dim
                img = img.crop((left, top, right, bottom))
            
            # Save optimized image
            img.save(file_path, optimize=True, quality=85)
        
        # Update user avatar path
        current_user.avatar_path = str(file_path)
        db.commit()
        db.refresh(current_user)
        
        return current_user
        
    except Exception as e:
        # Clean up file if error occurs
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )


@router.delete("/avatar", response_model=schemas.UserOut)
def delete_avatar(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Delete user avatar"""
    
    if not current_user.avatar_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No avatar to delete"
        )
    
    # Delete avatar file
    avatar_path = Path(current_user.avatar_path)
    if avatar_path.exists():
        avatar_path.unlink()
    
    # Update user
    current_user.avatar_path = None
    db.commit()
    db.refresh(current_user)
    
    return current_user
