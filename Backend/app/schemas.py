from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# User
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_path: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[EmailStr] = None


# Token
class Token(BaseModel):
    access_token: str
    token_type: str


# Note
class NoteBase(BaseModel):
    title: Optional[str] = None
    content: str


class NoteCreate(NoteBase):
    pass


class NoteUpdate(NoteBase):
    pass


class NoteOut(BaseModel):
    id: int
    title: Optional[str]
    content: str
    summary: Optional[str]
    image_path: Optional[str]
    image_description: Optional[str]
    audio_path: Optional[str]
    audio_transcription: Optional[str]
    owner_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
