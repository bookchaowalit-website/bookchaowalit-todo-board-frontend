"use client";

import { useState, type FormEvent } from "react";
import { addTodo, boardView, clearCompleted, countTodos, MAX_TEXT, parseTodos, toggleTodo, type Category, type Filter, type Priority, type Todo } from "@/lib/todos";
import { useStoredState } from "@/lib/use-stored-state";

const STORE_KEY = "todo-board-v2";
const SEED: Todo[] = [
  { id: "1", text: "Complete project proposal", completed: false, priority: "high", category: "work" },
  { id: "2", text: "Buy groceries", completed: false, priority: "medium", category: "shopping" },
  { id: "3", text: "Morning workout", completed: true, priority: "low", category: "personal" },
];

export default function Home() {
  const [todos, setTodos] = useStoredState(STORE_KEY, SEED, parseTodos);
  const [text, setText] = useState(""); const [priority, setPriority] = useState<Priority>("medium"); const [category, setCategory] = useState<Category>("work"); const [filter, setFilter] = useState<Filter>("all");
  const visible = boardView(todos, filter);
  const add = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!text.trim()) return; setTodos((current) => addTodo(current, text, priority, category, crypto.randomUUID())); setText(""); };
  const counts = countTodos(todos);

  return <main className="dispatch-room">
    <header className="dispatch-bar"><div className="dispatch-mark">B/07</div><div className="dispatch-name"><strong>PERSONAL DISPATCH</strong><span>ONE OPERATOR · LOCAL BOARD</span></div><div className="dispatch-state"><i /> {counts.active} OPEN ASSIGNMENTS</div></header>
    <section className="dispatch-hero"><div><p className="dispatch-kicker">WORK / HOME / NEXT</p><h1>Make the<br /><em>next move.</em></h1><p className="hero-copy">A priority-aware board for the small set of things that deserve your attention today.</p></div><div className="dispatch-index"><span>BOARD</span><strong>01</strong><small>LOCAL<br />ONLY</small></div></section>
    <section className="new-assignment" aria-label="Add a task"><div className="form-heading"><span>INCOMING WORK</span><h2>Put it on the board.</h2></div><form className="assignment-form" onSubmit={add}><label><span>Task</span><input placeholder="What needs doing?" value={text} maxLength={MAX_TEXT} required onChange={(event) => setText(event.target.value)} /></label><label><span>Priority</span><select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label><span>Area</span><select value={category} onChange={(event) => setCategory(event.target.value as Category)}><option value="work">Work</option><option value="personal">Personal</option><option value="shopping">Shopping</option></select></label><button className="add-button" type="submit">Add assignment <b aria-hidden="true">↗</b></button></form></section>
    <section className="board-section" aria-label="Task board"><div className="board-heading"><div><p className="dispatch-kicker">THE ACTIVE BOARD</p><h2>Where attention goes.</h2></div><div className="filter-tabs" role="group" aria-label="Task filter">{(["all", "active", "completed"] as const).map((option) => <button type="button" key={option} aria-pressed={filter === option} className={filter === option ? "active" : ""} onClick={() => setFilter(option)}>{option}<b>{counts[option]}</b></button>)}{counts.completed > 0 ? <button type="button" onClick={() => setTodos(clearCompleted)}>clear done</button> : null}</div></div><div className="task-list">{visible.length === 0 ? <div className="empty-board"><span>—</span><p>Nothing in this lane. Add a task or change the filter.</p></div> : visible.map((todo, index) => <article className={`task-row ${todo.completed ? "done" : ""}`} key={todo.id}><span className="task-number">{String(index + 1).padStart(2, "0")}</span><label className="task-check"><input type="checkbox" aria-label={`Mark "${todo.text}" as ${todo.completed ? "not done" : "done"}`} checked={todo.completed} onChange={() => setTodos((current) => toggleTodo(current, todo.id))} /><span /></label><div className="task-copy"><strong>{todo.text}</strong><span>{todo.category} · {todo.completed ? "cleared" : "waiting for action"}</span></div><span className={`priority priority-${todo.priority}`}>{todo.priority}</span><button type="button" className="remove-task" aria-label={`Remove "${todo.text}"`} onClick={() => setTodos((current) => current.filter((item) => item.id !== todo.id))}>Remove</button></article>)}</div></section>
    <footer className="dispatch-footer"><span>BOOKCHAOWALIT / TODO BOARD</span><span>LOCAL BROWSER STATE · DEMO-GRADE</span></footer>
  </main>;
}
