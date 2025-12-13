from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routes import categories, notes

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bands API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories.router, prefix="/api")
app.include_router(notes.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Bands API is running", "docs": "/docs"}
