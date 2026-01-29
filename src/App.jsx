import { useState } from "react";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [sort, setSort] = useState("status"); // status | alpha

  // ---------- ADD ----------
  const addTodo = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setText("");
  };

  // ---------- TOGGLE ----------
  const toggleTodo = (id) => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // ---------- DELETE ----------
  const deleteTodo = (id) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // ---------- EDIT ----------
  const saveEdit = (id) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, text: editingText } : t))
    );
    setEditingId(null);
  };

  // ---------- SORT ----------
  const sortedTodos = [...todos].sort((a, b) => {
    if (sort === "status") return a.completed - b.completed;
    return a.text.localeCompare(b.text);
  });

  // ---------- STATS ----------
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const progress = total ? (completed / total) * 100 : 0;

  return (
    <div className="app">
      <h1>✅ Todo App</h1>

      {/* ADD */}
      <div className="add">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Новая задача..."
        />
        <button onClick={addTodo}>+</button>
      </div>

      {/* SORT */}
      <div className="sort">
        <button onClick={() => setSort("status")}>По статусу</button>
        <button onClick={() => setSort("alpha")}>По алфавиту</button>
      </div>

      {/* LIST */}
      <ul className="list">
        {sortedTodos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "done" : ""}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />

            {editingId === todo.id ? (
              <input
                className="edit"
                autoFocus
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(todo.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditingId(todo.id);
                  setEditingText(todo.text);
                }}
              >
                {todo.text}
              </span>
            )}

            <button onClick={() => deleteTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>

      {/* STATS */}
      <div className="stats">
        <p>Все: {total}</p>
        <p>Активные: {active}</p>
        <p>Выполнено: {completed}</p>

        <div className="progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
