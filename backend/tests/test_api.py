import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db


# Create in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    """Create tables before each test and drop after"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


client = TestClient(app)


class TestRootEndpoint:
    """Tests for root endpoint"""

    def test_root_endpoint(self):
        """Test GET / returns welcome message"""
        response = client.get("/")
        
        assert response.status_code == 200
        assert "message" in response.json()


class TestCategoriesAPI:
    """Tests for Categories (Genres) endpoints"""

    def test_get_categories_empty(self):
        """Test GET /api/categories/ returns empty list initially"""
        response = client.get("/api/categories/")
        
        assert response.status_code == 200
        assert response.json() == []

    def test_create_category_success(self):
        """Test POST /api/categories/ creates a category"""
        response = client.post("/api/categories/", json={"name": "Rock"})
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Rock"
        assert "id" in data

    def test_create_category_invalid_data(self):
        """Test POST /api/categories/ with invalid data returns 422"""
        response = client.post("/api/categories/", json={})
        
        assert response.status_code == 422

    def test_get_category_by_id(self):
        """Test GET /api/categories/{id} returns category"""
        # Create category first
        create_response = client.post("/api/categories/", json={"name": "Jazz"})
        category_id = create_response.json()["id"]
        
        # Get category
        response = client.get(f"/api/categories/{category_id}")
        
        assert response.status_code == 200
        assert response.json()["name"] == "Jazz"

    def test_get_category_not_found(self):
        """Test GET /api/categories/{id} returns 404 for non-existent category"""
        response = client.get("/api/categories/999")
        
        assert response.status_code == 404

    def test_delete_category(self):
        """Test DELETE /api/categories/{id} deletes category"""
        # Create category first
        create_response = client.post("/api/categories/", json={"name": "Blues"})
        category_id = create_response.json()["id"]
        
        # Delete category
        response = client.delete(f"/api/categories/{category_id}")
        
        assert response.status_code == 204


class TestNotesAPI:
    """Tests for Notes (Bands) endpoints"""

    def test_get_notes_empty(self):
        """Test GET /api/notes/ returns empty list initially"""
        response = client.get("/api/notes/")
        
        assert response.status_code == 200
        assert response.json() == []

    def test_create_note_success(self):
        """Test POST /api/notes/ creates a note"""
        # Create category first
        cat_response = client.post("/api/categories/", json={"name": "Metal"})
        category_id = cat_response.json()["id"]
        
        # Create note
        note_data = {
            "title": "Metallica",
            "content": "Heavy metal band from LA",
            "category_id": category_id
        }
        response = client.post("/api/notes/", json=note_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Metallica"
        assert data["content"] == "Heavy metal band from LA"

    def test_create_note_invalid_data(self):
        """Test POST /api/notes/ with invalid data returns 422"""
        response = client.post("/api/notes/", json={})
        
        assert response.status_code == 422

    def test_create_note_invalid_category(self):
        """Test POST /api/notes/ with non-existent category returns 400"""
        note_data = {
            "title": "Test Band",
            "content": "Test content",
            "category_id": 999
        }
        response = client.post("/api/notes/", json=note_data)
        
        assert response.status_code == 400

    def test_get_note_by_id(self):
        """Test GET /api/notes/{id} returns note"""
        # Create category and note
        cat_response = client.post("/api/categories/", json={"name": "Rock"})
        category_id = cat_response.json()["id"]
        
        note_data = {
            "title": "AC/DC",
            "content": "Australian rock band",
            "category_id": category_id
        }
        create_response = client.post("/api/notes/", json=note_data)
        note_id = create_response.json()["id"]
        
        # Get note
        response = client.get(f"/api/notes/{note_id}")
        
        assert response.status_code == 200
        assert response.json()["title"] == "AC/DC"

    def test_get_note_not_found(self):
        """Test GET /api/notes/{id} returns 404 for non-existent note"""
        response = client.get("/api/notes/999")
        
        assert response.status_code == 404

    def test_delete_note(self):
        """Test DELETE /api/notes/{id} deletes note"""
        # Create category and note
        cat_response = client.post("/api/categories/", json={"name": "Punk"})
        category_id = cat_response.json()["id"]
        
        note_data = {
            "title": "Ramones",
            "content": "Punk rock band",
            "category_id": category_id
        }
        create_response = client.post("/api/notes/", json=note_data)
        note_id = create_response.json()["id"]
        
        # Delete note
        response = client.delete(f"/api/notes/{note_id}")
        
        assert response.status_code == 204

    def test_update_note(self):
        """Test PUT /api/notes/{id} updates note"""
        # Create category and note
        cat_response = client.post("/api/categories/", json={"name": "Grunge"})
        category_id = cat_response.json()["id"]
        
        note_data = {
            "title": "Nirvana",
            "content": "Grunge band",
            "category_id": category_id
        }
        create_response = client.post("/api/notes/", json=note_data)
        note_id = create_response.json()["id"]
        
        # Update note
        update_data = {
            "title": "Nirvana Updated",
            "content": "Legendary grunge band from Seattle",
            "category_id": category_id
        }
        response = client.put(f"/api/notes/{note_id}", json=update_data)
        
        assert response.status_code == 200
        assert response.json()["title"] == "Nirvana Updated"
