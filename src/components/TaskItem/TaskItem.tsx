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

export function TaskItem({ task, onToggleStatus, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === "completed";

  function handleCheckboxChange() {
    onToggleStatus(task.id, isCompleted ? "pending" : "completed");
  }

  return (
    <li className={`task-item task-item--${task.priority}`}>
      <div className="task-item__body">
        {/* Checkbox y título ahora van juntos en la misma fila, en cualquier
            tamaño de pantalla, en vez de que el checkbox quede arriba suelto. */}
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
          {task.dueDate && <span className="task-item__due">Vence: {task.dueDate}</span>}
        </div>
      </div>

      <div className="task-item__actions">
        <button onClick={() => onEdit(task)} aria-label={`Editar "${task.title}"`}>
          Editar
        </button>
        <button
          className="task-item__delete"
          onClick={() => onDelete(task.id)}
          aria-label={`Eliminar "${task.title}"`}
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}