import type { Task, TaskStatus } from "../../types/task";
import { TaskItem } from "../TaskItem/TaskItem";

//import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleStatus: (id: string, nextStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

/**
 * TaskList es puramente de presentación: recibe qué tareas mostrar por props
 * (ya filtradas por quien lo use, ej. FilteredTaskList) y no sabe de dónde
 * salen ni cómo se filtraron. Así se puede reusar para "todas las tareas",
 * "solo pendientes", resultados de búsqueda, etc.
 */
export function TaskList({ tasks, isLoading, onToggleStatus, onEdit, onDelete }: TaskListProps) {
  if (isLoading) {
    return <p className="task-list__status">Cargando tareas…</p>;
  }

  if (tasks.length === 0) {
    return (
      <p className="task-list__status task-list__status--empty">
        No hay tareas para mostrar. Creá la primera con el formulario de arriba.
      </p>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}