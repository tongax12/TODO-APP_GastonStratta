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

/**
 * TaskItem no sabe nada de Firestore ni de useState propio: es "tonto" a
 * propósito. Toda acción sube por callbacks (props) para que TaskList decida
 * qué hacer, lo que lo hace fácil de reusar y de testear.
 */
export function TaskItem({ task, onToggleStatus, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === "completed";

  function handleCheckboxChange() {
    onToggleStatus(task.id, isCompleted ? "pending" : "completed");
  }

  return (
    <li className={`task-item task-item--${task.priority}`}>
      <label className="task-item__checkbox">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleCheckboxChange}
          aria-label={`Marcar "${task.title}" como ${isCompleted ? "pendiente" : "completada"}`}
        />
      </label>

      <div className="task-item__body">
        <p className={`task-item__title ${isCompleted ? "task-item__title--done" : ""}`}>
          {task.title}
        </p>
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