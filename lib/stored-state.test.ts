import { describe, expect, it } from "vitest";
import { readStoredState, writeStoredState } from "./stored-state";
import { addTodo, parseTodos, toggleTodo, type Todo } from "./todos";

function storageStub() {
  const values: Record<string, string> = Object.create(null);
  return {
    getItem(key: string) { return values[key] ?? null; },
    setItem(key: string, value: string) { values[key] = value; },
  };
}

describe("stored-state localStorage boundary", () => {
  it("hydrates existing browser storage through getItem and the supplied parser", () => {
    const storage = storageStub();
    const saved: Todo[] = [{ id: "saved", text: "Existing", priority: "high", category: "work", completed: true }];
    storage.setItem("todo-board-v2", JSON.stringify(saved));
    expect(readStoredState(storage, "todo-board-v2", parseTodos)).toEqual(saved);
    expect(readStoredState(storage, "other-key", parseTodos)).toBeNull();
  });

  it("writes real updates through setItem so a fresh hydration restores them", () => {
    const storage = storageStub();
    const key = "todo-board-v2";
    const initial = readStoredState(storage, key, parseTodos) ?? [];
    const updated = toggleTodo(addTodo(initial, "Ship", "high", "personal", "new"), "new");
    writeStoredState(storage, key, updated);
    expect(storage.getItem(key)).toBe(JSON.stringify(updated));
    const remountedState = readStoredState(storage, key, parseTodos);
    expect(remountedState).toEqual(updated);
    expect(remountedState).not.toBe(updated);
  });

  it("persists an intentionally empty board and lets the parser reject corrupt data", () => {
    const storage = storageStub();
    writeStoredState(storage, "todos", []);
    expect(readStoredState(storage, "todos", parseTodos)).toEqual([]);
    storage.setItem("todos", "broken");
    expect(readStoredState(storage, "todos", parseTodos)).toBeNull();
  });
});
