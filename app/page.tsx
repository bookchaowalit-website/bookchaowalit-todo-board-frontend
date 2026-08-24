"use client";

import { useEffect, useState } from "react";

type Priority = "low" | "medium" | "high";
type Category = "work" | "personal" | "shopping";
type Todo = { id: string; text: string; completed: boolean; priority: Priority; category: Category };
const STORE_KEY = "todo-board-v2";
const SEED: Todo[] = [
  { id: "1", text: "Complete project proposal", completed: false, priority: "high", category: "work" },
  { id: "2", text: "Buy groceries", completed: false, priority: "medium", category: "shopping" },
  { id: "3", text: "Morning workout", completed: true, priority: "low", category: "personal" },
];

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial); const [ready, setReady] = useState(false);
  useEffect(() => { try { const raw = window.localStorage.getItem(key); if (raw) setValue(JSON.parse(raw) as T); } catch { /* fallback */ } setReady(true); }, [key]);
  useEffect(() => { if (ready) window.localStorage.setItem(key, JSON.stringify(value)); }, [key, value, ready]);
  return [value, setValue] as const;
}

export default function Home() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORE_KEY, SEED);
  const [text, setText] = useState(""); const [priority, setPriority] = useState<Priority>("medium"); const [category, setCategory] = useState<Category>("work"); const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const visible = todos.filter((todo) => filter === "all" || (filter === "active" ? !todo.completed : todo.completed));
  const add = () => { if (!text.trim()) return; setTodos((current) => [{ id: crypto.randomUUID(), text: text.trim(), completed: false, priority, category }, ...current]); setText(""); };
  const counts = { all: todos.length, active: todos.filter((todo) => !todo.completed).length, completed: todos.filter((todo) => todo.completed).length };

  return <main className="dispatch-room">
    <header className="dispatch-bar"><div className="dispatch-mark">B/07</div><div className="dispatch-name"><strong>PERSONAL DISPATCH</strong><span>ONE OPERATOR · LOCAL BOARD</span></div><div className="dispatch-state"><i /> {counts.active} OPEN ASSIGNMENTS</div></header>
    <section className="dispatch-hero"><div><p className="dispatch-kicker">WORK / HOME / NEXT</p><h1>Make the<br /><em>next move.</em></h1><p className="hero-copy">A priority-aware board for the small set of things that deserve your attention today.</p></div><div className="dispatch-index"><span>BOARD</span><strong>01</strong><small>LOCAL<br />ONLY</small></div></section>
    <section className="new-assignment" aria-label="Add a task"><div className="form-heading"><span>INCOMING WORK</span><h2>Put it on the board.</h2></div><div className="assignment-form"><label><span>Task</span><input placeholder="What needs doing?" value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") add(); }} /></label><label><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label><span>Area</span><select value={category} onChange={(event) => setCategory(event.target.value as Category)}><option value="work">Work</option><option value="personal">Personal</option><option value="shopping">Shopping</option></select></label><button className="add-button" onClick={add}>Add assignment <b>↗</b></button></div></section>
    <section className="board-section" aria-label="Task board"><div className="board-heading"><div><p className="dispatch-kicker">THE ACTIVE BOARD</p><h2>Where attention goes.</h2></div><div className="filter-tabs" role="group" aria-label="Task filter">{(["all", "active", "completed"] as const).map((option) => <button key={option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}<b>{counts[option]}</b></button>)}</div></div><div className="task-list">{visible.length === 0 ? <div className="empty-board"><span>—</span><p>Nothing in this lane. Add a task or change the filter.</p></div> : visible.map((todo, index) => <article className={`task-row ${todo.completed ? "done" : ""}`} key={todo.id}><span className="task-number">{String(index + 1).padStart(2, "0")}</span><label className="task-check"><input type="checkbox" checked={todo.completed} onChange={() => setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item))} /><span /></label><div className="task-copy"><strong>{todo.text}</strong><span>{todo.category} · {todo.completed ? "cleared" : "waiting for action"}</span></div><span className={`priority priority-${todo.priority}`}>{todo.priority}</span><button className="remove-task" onClick={() => setTodos((current) => current.filter((item) => item.id !== todo.id))}>Remove</button></article>)}</div></section>
    <footer className="dispatch-footer"><span>BOOKCHAOWALIT / TODO BOARD</span><span>LOCAL BROWSER STATE · DEMO-GRADE</span></footer>
  </main>;
}
