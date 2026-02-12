import { useState } from "react";
import "./App.css";
import { Todo, SortType } from "./types/todo";
import { TodoItem } from "./components/TodoItem";
import { List } from "./components/List";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [sort, setSort] = useState<SortType>(SortType.Status);

  // ADD
  const addTodo = (): void => {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setText("");
  };

  // TOGGLE
  const toggleTodo = (id: number): void => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // DELETE
  const deleteTodo = (id: number): void => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  // START EDIT
  const startEdit = (todo: Todo): void => {
    setEditingId(todo.id);
    setEditingText(todo.text);
  };

  // SAVE EDIT
  const saveEdit = (id: number): void => {
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, text: editingText } : t
      )
    );
    setEditingId(null);
  };

  // SORT
  const sortedTodos = [...todos].sort((a, b) => {
    if (sort === SortType.Status) {
      return Number(a.completed) - Number(b.completed);
    }
    return a.text.localeCompare(b.text);
  });

  // STATS
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const active = total - completed;
  const progress = total ? (completed / total) * 100 : 0;

  return (
    <div className="app">
      <h1>✅ Todo App (TypeScript)</h1>

      {/* ADD */}
      <div className="add">
        <input
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") addTodo();
          }}
          placeholder="Новая задача..."
        />
        <button onClick={addTodo}>+</button>
      </div>

      {/* SORT */}
      <div className="sort">
        <button onClick={() => setSort(SortType.Status)}>
          По статусу
        </button>
        <button onClick={() => setSort(SortType.Alpha)}>
          По алфавиту
        </button>
      </div>

      {/* LIST (GENERIC USED HERE 🔥) */}
      <List
        items={sortedTodos}
        renderItem={(todo) =>
          editingId === todo.id ? (
            <li key={todo.id}>
              <input
                className="edit"
                autoFocus
                value={editingText}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditingText(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") saveEdit(todo.id);
                  if (e.key === "Escape") setEditingId(null);
                }}
              />
            </li>
          ) : (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onStartEdit={startEdit}
            />
          )
        }
      />

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
