import React from "react";
import { Todo } from "../types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onStartEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onStartEdit,
}) => {
  return (
    <li className={todo.completed ? "done" : ""}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      <span onDoubleClick={() => onStartEdit(todo)}>
        {todo.text}
      </span>

      <button onClick={() => onDelete(todo.id)}>×</button>
    </li>
  );
};
