from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    color: Optional[str] = "#3498db"


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class CategoryOut(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class NoteBase(BaseModel):
    title: str
    content: Optional[str] = ""
    category_id: int


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category_id: Optional[int] = None


class NoteOut(BaseModel):
    id: int
    title: str
    content: str
    created_at: datetime
    category_id: int
    category: CategoryOut

    class Config:
        from_attributes = True
