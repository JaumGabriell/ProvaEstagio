import { useState, useEffect } from "react";
import { api } from "./api";

function App() {
  const [categories, setCategories] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  const [catForm, setCatForm] = useState({ name: "", color: "#3498db" });
  const [editingCat, setEditingCat] = useState(null);

  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category_id: "",
  });
  const [editingNote, setEditingNote] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [cats, nts] = await Promise.all([
        api.getCategories(),
        api.getNotes(),
      ]);
      setCategories(cats);
      setNotes(nts);
    } catch (err) {
      showMsg("error", "Failed to load data: " + err.message);
    }
    setLoading(false);
  }

  function showMsg(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 3000);
  }

  async function handleCatSubmit(e) {
    e.preventDefault();
    if (!catForm.name.trim()) {
      showMsg("error", "Genre name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingCat) {
        await api.updateCategory(editingCat.id, catForm);
        showMsg("success", "Genre updated!");
      } else {
        await api.createCategory(catForm);
        showMsg("success", "Genre created!");
      }
      setCatForm({ name: "", color: "#3498db" });
      setEditingCat(null);
      loadData();
    } catch (err) {
      showMsg("error", err.message);
    }
    setSaving(false);
  }

  async function handleDeleteCat(id) {
    if (!confirm("Delete this genre and all its bands?")) return;
    try {
      await api.deleteCategory(id);
      showMsg("success", "Genre deleted!");
      loadData();
    } catch (err) {
      showMsg("error", err.message);
    }
  }

  function startEditCat(cat) {
    setEditingCat(cat);
    setCatForm({ name: cat.name, color: cat.color });
  }

  async function handleNoteSubmit(e) {
    e.preventDefault();
    if (!noteForm.title.trim()) {
      showMsg("error", "Band name is required");
      return;
    }
    if (!noteForm.category_id) {
      showMsg("error", "Select a genre");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: noteForm.title,
        content: noteForm.content,
        category_id: parseInt(noteForm.category_id),
      };
      if (editingNote) {
        await api.updateNote(editingNote.id, payload);
        showMsg("success", "Band updated!");
      } else {
        await api.createNote(payload);
        showMsg("success", "Band created!");
      }
      setNoteForm({ title: "", content: "", category_id: "" });
      setEditingNote(null);
      loadData();
    } catch (err) {
      showMsg("error", err.message);
    }
    setSaving(false);
  }

  async function handleDeleteNote(id) {
    if (!confirm("Delete this band?")) return;
    try {
      await api.deleteNote(id);
      showMsg("success", "Band deleted!");
      loadData();
    } catch (err) {
      showMsg("error", err.message);
    }
  }

  function startEditNote(note) {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category_id: note.category_id.toString(),
    });
  }

  function cancelEdit() {
    setEditingCat(null);
    setEditingNote(null);
    setCatForm({ name: "", color: "#3498db" });
    setNoteForm({ title: "", content: "", category_id: "" });
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>
        <span>Bands</span> App
      </h1>

      {msg && <div className={`message ${msg.type}`}>{msg.text}</div>}

      <div className="sections">
        <div className="section">
          <h2>Genres</h2>
          <form onSubmit={handleCatSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={catForm.name}
                onChange={(e) =>
                  setCatForm({ ...catForm, name: e.target.value })
                }
                placeholder="Genre name"
              />
            </div>
            <div className="form-group">
              <label>Color</label>
              <input
                type="color"
                value={catForm.color}
                onChange={(e) =>
                  setCatForm({ ...catForm, color: e.target.value })
                }
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingCat ? "Update" : "Add"}
            </button>
            {editingCat && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="list">
            {categories.length === 0 && <p>No genres yet</p>}
            {categories.map((cat) => (
              <div key={cat.id} className="list-item">
                <span>
                  <span
                    className="category-badge"
                    style={{ background: cat.color }}
                  >
                    {cat.name}
                  </span>
                </span>
                <span>
                  <button
                    className="btn btn-primary"
                    onClick={() => startEditCat(cat)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteCat(cat.id)}
                  >
                    X
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h2>Bands</h2>
          <form onSubmit={handleNoteSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={noteForm.title}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, title: e.target.value })
                }
                placeholder="Band name"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={noteForm.content}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, content: e.target.value })
                }
                placeholder="Band description..."
              />
            </div>
            <div className="form-group">
              <label>Genre</label>
              <select
                value={noteForm.category_id}
                onChange={(e) =>
                  setNoteForm({ ...noteForm, category_id: e.target.value })
                }
              >
                <option value="">Select genre</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingNote ? "Update" : "Add"}
            </button>
            {editingNote && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </form>

          <div className="list">
            {notes.length === 0 && <p>No bands yet</p>}
            {notes.map((note) => (
              <div
                key={note.id}
                className="note-card"
                style={{ borderLeftColor: note.category?.color || "#3498db" }}
              >
                <h4>{note.title}</h4>
                <p>{note.content || "(empty)"}</p>
                <div className="meta">
                  <span
                    className="category-badge"
                    style={{ background: note.category?.color || "#3498db" }}
                  >
                    {note.category?.name || "Unknown"}
                  </span>
                  {" · "}
                  {new Date(note.created_at).toLocaleDateString()}
                </div>
                <div className="actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => startEditNote(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
