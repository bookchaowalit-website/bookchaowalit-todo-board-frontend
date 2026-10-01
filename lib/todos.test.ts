import { describe, expect, it } from "vitest";
import { addTodo, boardView, MAX_TEXT, clearCompleted, countTodos, parseTodos, toggleTodo, type Todo } from "./todos";

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

describe("area filter", () => {
  const todos: Todo[] = [
    { id: "w1", text: "Ship", completed: false, priority: "low", category: "work" },
    { id: "p1", text: "Run", completed: true, priority: "high", category: "personal" },
    { id: "w2", text: "Review", completed: false, priority: "high", category: "work" },
  ];

  it("limits the board to one area and keeps priority order", () => {
    expect(boardView(todos, "all", "work").map((todo) => todo.id)).toEqual(["w2", "w1"]);
    expect(boardView(todos, "completed", "work")).toEqual([]);
    expect(boardView(todos, "all", "all")).toHaveLength(3);
  });

  it("counts tabs within the selected area", () => {
    expect(countTodos(todos, "work")).toEqual({ all: 2, active: 2, completed: 0 });
    expect(countTodos(todos, "personal")).toEqual({ all: 1, active: 0, completed: 1 });
    expect(countTodos(todos)).toEqual({ all: 3, active: 2, completed: 1 });
  });
});

describe("edge cases", () => {
  it("ignores a todo made only of zero-width characters", () => {
    expect(addTodo([], "\u200B\u200D\uFEFF", "high", "work", "x")).toEqual([]);
  });

  it("never cuts an emoji in half at MAX_TEXT", () => {
    const [todo] = addTodo([], `${"a".repeat(MAX_TEXT - 1)}✅🚀`, "low", "work", "x");
    expect(todo.text).toBe(`${"a".repeat(MAX_TEXT - 1)}✅`);
    const [cut] = addTodo([], `${"a".repeat(MAX_TEXT - 1)}🚀`, "low", "work", "x");
    expect(cut.text).toBe("a".repeat(MAX_TEXT - 1));
  });

  it("drops stored todos that repeat an id (one click toggled both)", () => {
    const item = { id: "a", text: "One", completed: false, priority: "high", category: "work" };
    expect(parseTodos(JSON.stringify([item, { ...item, text: "Two" }]))?.map((t) => t.text)).toEqual(["One"]);
  });
});
