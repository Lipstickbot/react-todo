import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  // State для задач
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // State для таймера
  const [seconds, setSeconds] = useState(0);

  // Загрузка задач из localStorage при первом рендере
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  // Сохранение задач в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Таймер
  useEffect(() => {
    const timer = setInterval(() => setSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer); // cleanup
  }, []);

  // Добавление задачи
  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([
      ...todos,
      { id: Date.now(), text: newTodo.trim(), done: false }
    ]);
    setNewTodo("");
  };

  // Удаление задачи
  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Переключение выполнения
  const toggleDone = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  // Редактирование текста
  const editTodo = (id, newText) => {
    setTodos(
      todos.map(todo => (todo.id === id ? { ...todo, text: newText } : todo))
    );
  };

  // Статистика
  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const leftCount = total - doneCount;
  const percent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  // Таймер в мин/сек
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="container">
      <h1>Todo App</h1>

      <div className="add-todo">
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTodo()}
          placeholder="Добавьте задачу..."
        />
        <button onClick={addTodo}>+</button>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={todo.done ? "done" : ""}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleDone(todo.id)}
            />
            <EditableText
              text={todo.text}
              onSave={(newText) => editTodo(todo.id, newText)}
            />
            <button onClick={() => removeTodo(todo.id)}>×</button>
          </li>
        ))}
      </ul>

      <div className="stats">
        <p>Всего: {total}</p>
        <p>Выполнено: {doneCount}</p>
        <p>Осталось: {leftCount}</p>
        <p>Прогресс: {percent}%</p>
      </div>

      <div className="timer">
        Вы в приложении: {minutes} мин {secs} сек
      </div>
    </div>
  );
}

// Компонент для редактируемого текста
function EditableText({ text, onSave }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);

  useEffect(() => {
    setValue(text);
  }, [text]);

  const save = () => {
    if (value.trim() === "") setValue(text);
    else onSave(value.trim());
    setEditing(false);
  };

  const cancel = () => {
    setValue(text);
    setEditing(false);
  };

  return editing ? (
    <input
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={save}
      onKeyDown={e => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") cancel();
      }}
      autoFocus
    />
  ) : (
    <span onDoubleClick={() => setEditing(true)}>{text}</span>
  );
}
