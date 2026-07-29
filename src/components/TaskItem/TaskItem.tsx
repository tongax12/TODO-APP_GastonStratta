import { useState } from "react";
import type { Task, TaskStatus } from "../../types/task";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: string, nextStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "Pendiente",
  completed: "Completada",
};

function isOverdue(dueDate: string | null | undefined): boolean {
  if (!dueDate) return false;  // null, undefined o string vacío
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  return due < today;
}

export function TaskItem({ task, onToggleStatus, onEdit, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleted = task.status === "completed";
  const overdue = isOverdue(task.dueDate);

  function handleCheckboxChange() {
    onToggleStatus(task.id, isCompleted ? "pending" : "completed");
  }

  function handleDelete() {
    setIsDeleting(true);
    // Wait for animation to finish before actually removing
    setTimeout(() => {
      onDelete(task.id);
    }, 300);
  }

  return (
    <li className={`task-item task-item--${task.priority} ${isDeleting ? "task-item--deleting" : ""}`}>
      <div className="task-item__body">
        <div className="task-item__header">
          <label className="task-item__checkbox">
            <input
              type="checkbox"
              checked={isCompleted}
              onChange={handleCheckboxChange}
              aria-label={`Marcar "${task.title}" como ${isCompleted ? "pendiente" : "completada"}`}
            />
          </label>
          <p className={`task-item__title ${isCompleted ? "task-item__title--done" : ""}`}>
            {task.title}
          </p>
        </div>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
        <div className="task-item__meta">
          <span className="task-item__badge">{PRIORITY_LABEL[task.priority]}</span>
          <span className="task-item__badge">{STATUS_LABEL[task.status]}</span>
          {task.dueDate && (
            <span className={`task-item__due ${overdue ? "task-item__due--overdue" : ""}`}>
              Vence: {task.dueDate}
            </span>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <button onClick={() => onEdit(task)} aria-label={`Editar "${task.title}"`}>
          Editar
        </button>
        <button
          className="task-item__delete"
          onClick={handleDelete}
          aria-label={`Eliminar "${task.title}"`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}