export const PRIORITIES = ["high", "medium", "low"] as const;
export const CATEGORIES = ["work", "personal", "shopping"] as const;
export type Priority = (typeof PRIORITIES)[number];
export type Category = (typeof CATEGORIES)[number];
export type Filter = "all" | "active" | "completed";
export type Todo = { id: string; text: string; completed: boolean; priority: Priority; category: Category };

export const MAX_TEXT = 140;
const RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Open work first, then by priority; original order breaks ties. */
export function boardView(todos: Todo[], filter: Filter): Todo[] {
  return todos
    .map((todo, index) => ({ todo, index }))
    .filter(({ todo }) => filter === "all" || (filter === "active" ? !todo.completed : todo.completed))
    .sort((a, b) => Number(a.todo.completed) - Number(b.todo.completed) || RANK[a.todo.priority] - RANK[b.todo.priority] || a.index - b.index)
    .map(({ todo }) => todo);
}

export function countTodos(todos: Todo[]): Record<Filter, number> {
  const completed = todos.filter((todo) => todo.completed).length;
  return { all: todos.length, active: todos.length - completed, completed };
}

export function addTodo(todos: Todo[], text: string, priority: Priority, category: Category, id: string): Todo[] {
  const clean = text.trim().slice(0, MAX_TEXT);
  if (!clean) return todos;
  return [{ id, text: clean, completed: false, priority, category }, ...todos];
}

export function toggleTodo(todos: Todo[], id: string): Todo[] {
  return todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
}

export function clearCompleted(todos: Todo[]): Todo[] {
  return todos.filter((todo) => !todo.completed);
}

export function parseTodos(raw: string | null): Todo[] | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return null;
    return data.filter((item): item is Todo => {
      if (typeof item !== "object" || item === null) return false;
      const t = item as Record<string, unknown>;
      return typeof t.id === "string" && typeof t.text === "string" && typeof t.completed === "boolean" && (PRIORITIES as readonly unknown[]).includes(t.priority) && (CATEGORIES as readonly unknown[]).includes(t.category);
    });
  } catch {
    return null;
  }
}
