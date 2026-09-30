import { describe, expect, it } from "vitest";
import { addTodo, boardView, clearCompleted, countTodos, parseTodos, toggleTodo, type Todo } from "./todos";

const todos: Todo[] = [
  { id: "1", text: "low open", completed: false, priority: "low", category: "work" },
  { id: "2", text: "high done", completed: true, priority: "high", category: "work" },
  { id: "3", text: "high open", completed: false, priority: "high", category: "personal" },
  { id: "4", text: "medium open", completed: false, priority: "medium", category: "shopping" },
];

describe("boardView", () => {
  it("sorts open work by priority and sinks completed items", () => {
    expect(boardView(todos, "all").map((t) => t.id)).toEqual(["3", "4", "1", "2"]);
  });

  it("filters active and completed", () => {
    expect(boardView(todos, "active").map((t) => t.id)).toEqual(["3", "4", "1"]);
    expect(boardView(todos, "completed").map((t) => t.id)).toEqual(["2"]);
  });
});

describe("mutations", () => {
  it("adds trimmed todos and ignores blanks", () => {
    expect(addTodo([], "  ", "low", "work", "x")).toEqual([]);
    expect(addTodo([], " Call ", "high", "personal", "x")[0]).toEqual({ id: "x", text: "Call", completed: false, priority: "high", category: "personal" });
  });

  it("toggles, counts, and clears completed", () => {
    const toggled = toggleTodo(todos, "1");
    expect(countTodos(toggled)).toEqual({ all: 4, active: 2, completed: 2 });
    expect(clearCompleted(toggled).map((t) => t.id)).toEqual(["3", "4"]);
  });
});

describe("parseTodos", () => {
  it("keeps valid items only", () => {
    expect(parseTodos(JSON.stringify([todos[0], { ...todos[1], priority: "urgent" }]))).toEqual([todos[0]]);
    expect(parseTodos("x")).toBeNull();
  });
});
