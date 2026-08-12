"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

function Shell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
            Local mini-app · state in this browser
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">{subtitle}</p>
        </header>
        {children}
        <footer className="mt-10 border-t border-zinc-200 pt-4 text-xs text-zinc-500 dark:border-zinc-800">
          Data is stored in localStorage on this origin only. Portfolio demo — not a multi-user product.
        </footer>
      </div>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition disabled:opacity-50 " +
    className;
  const styles =
    variant === "primary"
      ? "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900"
      : variant === "secondary"
        ? "bg-white text-zinc-900 ring-1 ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-100 dark:ring-zinc-700"
        : variant === "danger"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900";
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles}`}>
      {children}
    </button>
  );
}

const inputClass =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950";

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, ready]);
  return [value, setValue, ready] as const;
}

function uid() {
  return crypto.randomUUID();
}

type Priority = "low" | "medium" | "high";
type Category = "work" | "personal" | "shopping";
type Todo = { id: string; text: string; completed: boolean; priority: Priority; category: Category };

export default function Home() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todo-board-v1", [
    { id: "1", text: "Complete project proposal", completed: false, priority: "high", category: "work" },
    { id: "2", text: "Buy groceries", completed: false, priority: "medium", category: "shopping" },
    { id: "3", text: "Morning workout", completed: true, priority: "low", category: "personal" },
  ]);
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<Category>("work");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  const prColor: Record<Priority, string> = {
    high: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
    low: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  };

  return (
    <Shell title="Todo Board" subtitle="Capture tasks with priority and category. Filter what still needs doing.">
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          className={`${inputClass} min-w-[16rem] flex-1`}
          placeholder="What needs doing?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              setTodos((prev) => [
                { id: uid(), text: text.trim(), completed: false, priority, category },
                ...prev,
              ]);
              setText("");
            }
          }}
        />
        <select className={inputClass} value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
        </select>
        <Button
          onClick={() => {
            if (!text.trim()) return;
            setTodos((prev) => [
              { id: uid(), text: text.trim(), completed: false, priority, category },
              ...prev,
            ]);
            setText("");
          }}
        >
          Add
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        {(["all", "active", "completed"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "primary" : "secondary"} onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>

      <ul className="space-y-2">
        {visible.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950"
          >
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() =>
                setTodos((prev) => prev.map((x) => (x.id === t.id ? { ...x, completed: !x.completed } : x)))
              }
            />
            <span className={`flex-1 ${t.completed ? "text-zinc-400 line-through" : ""}`}>{t.text}</span>
            <span className={`rounded-full px-2 py-0.5 text-xs ${prColor[t.priority]}`}>{t.priority}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-900">{t.category}</span>
            <Button variant="ghost" onClick={() => setTodos((prev) => prev.filter((x) => x.id !== t.id))}>
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </Shell>
  );
}
