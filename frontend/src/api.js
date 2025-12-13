const BASE = "http://localhost:8000/api";

async function request(url, options = {}) {
  const res = await fetch(BASE + url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export const api = {
  getCategories: () => request("/categories/"),
  createCategory: (body) =>
    request("/categories/", { method: "POST", body: JSON.stringify(body) }),
  updateCategory: (id, body) =>
    request(`/categories/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

  getNotes: () => request("/notes/"),
  createNote: (body) =>
    request("/notes/", { method: "POST", body: JSON.stringify(body) }),
  updateNote: (id, body) =>
    request(`/notes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteNote: (id) => request(`/notes/${id}`, { method: "DELETE" }),
};
