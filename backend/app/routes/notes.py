from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Note, Category
from ..schemas import NoteCreate, NoteOut, NoteUpdate

router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("/", response_model=List[NoteOut])
def list_notes(db: Session = Depends(get_db)):
    return db.query(Note).all()


@router.get("/{note_id}", response_model=NoteOut)
def get_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.post("/", response_model=NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(data: NoteCreate, db: Session = Depends(get_db)):
    if not data.title or len(data.title.strip()) == 0:
        raise HTTPException(status_code=400, detail="Title is required")
    
    cat = db.query(Category).filter(Category.id == data.category_id).first()
    if not cat:
        raise HTTPException(status_code=400, detail="Category does not exist")
    
    note = Note(
        title=data.title.strip(),
        content=data.content or "",
        category_id=data.category_id
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, data: NoteUpdate, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    if data.title is not None:
        if len(data.title.strip()) == 0:
            raise HTTPException(status_code=400, detail="Title cannot be empty")
        note.title = data.title.strip()
    
    if data.content is not None:
        note.content = data.content
    
    if data.category_id is not None:
        cat = db.query(Category).filter(Category.id == data.category_id).first()
        if not cat:
            raise HTTPException(status_code=400, detail="Category does not exist")
        note.category_id = data.category_id
    
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return None
