'use client'

import { useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'shopping';
}

export default function TodoBoard() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Complete project proposal', completed: false, priority: 'high', category: 'work' },
    { id: '2', text: 'Buy groceries', completed: false, priority: 'medium', category: 'shopping' },
    { id: '3', text: 'Morning workout', completed: true, priority: 'low', category: 'personal' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: newTodo,
        completed: false,
        priority: 'medium',
        category: 'work'
      }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">📋 Todo Board</h1>
          <p className="text-gray-600 dark:text-gray-300">Organize your tasks efficiently</p>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="text-3xl font-bold text-blue-600">{todos.length}</div>
            <div className="text-gray-500">Total Tasks</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-yellow-500">
            <div className="text-3xl font-bold text-yellow-600">{todos.filter(t => !t.completed).length}</div>
            <div className="text-gray-500">In Progress</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="text-3xl font-bold text-green-600">{todos.filter(t => t.completed).length}</div>
            <div className="text-gray-500">Completed</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="text-3xl font-bold text-purple-600">
              {todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0}%
            </div>
            <div className="text-gray-500">Completion</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <button onClick={addTodo} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition">
              Add Task
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2 rounded-full font-medium transition ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-lg transition flex items-center gap-4"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition ${
                  todo.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {todo.completed && '✓'}
              </button>
              <div className="flex-1">
                <p className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                  {todo.text}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {todo.priority}
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    {todo.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
