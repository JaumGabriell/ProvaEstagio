import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";

// Mock fetch API
global.fetch = vi.fn();

const mockCategories = [
  { id: 1, name: "Rock", color: "#e74c3c" },
  { id: 2, name: "Jazz", color: "#3498db" },
];

const mockNotes = [
  {
    id: 1,
    title: "Metallica",
    content: "Heavy metal band",
    category_id: 1,
    category: mockCategories[0],
    created_at: "2024-01-01",
  },
];

beforeEach(() => {
  vi.clearAllMocks();

  global.fetch.mockImplementation((url) => {
    if (url.includes("/api/categories")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCategories),
      });
    }
    if (url.includes("/api/notes")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockNotes),
      });
    }
    return Promise.reject(new Error("Unknown URL"));
  });
});

describe("App Component", () => {
  it("shows loading state initially", () => {
    render(<App />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches data on mount", async () => {
    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("renders genres section after loading", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Genres")).toBeInTheDocument();
  });

  it("has genre input after loading", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Genre name")).toBeInTheDocument();
  });

  it("has band input after loading", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("Band name")).toBeInTheDocument();
  });

  it("displays fetched notes", async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Metallica")).toBeInTheDocument();
    });
  });
});
