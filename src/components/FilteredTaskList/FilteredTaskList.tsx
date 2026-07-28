import { useEffect, useState } from "react";

import { TaskForm } from "../TaskForm/TaskForm";
import { TaskList } from "../TaskList/TaskList";
import {
  type Task,
  type TaskFilters,
  type TaskFormData,
  type TaskStatus,
} from "../../types/task";
import "./FilteredTaskList.css";
import { defaultTaskFilters } from "../../types/taskDefaults";

interface FilteredTaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

/**
 * Componente "inteligente" para filtros y edición, pero ya NO dueño de los
 * datos: tasks/createTask/updateTask/deleteTask llegan por props desde
 * Tasks.tsx, que es quien llama a useTasks() una sola vez. Así este
 * componente y EmailSummaryButton comparten el mismo estado en vez de tener
 * cada uno su propia copia desincronizada.
 */
export function FilteredTaskList({
  tasks,
  isLoading,
  error,
  createTask,
  updateTask,
  deleteTask,
}: FilteredTaskListProps) {
  const [filters, setFilters] = useState<TaskFilters>(defaultTaskFilters);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Si la tarea que se estaba editando desaparece de la lista (la borraron
  // desde otra pestaña, por ejemplo), salimos del modo edición para no dejar
  // el formulario mostrando datos de una tarea que ya no existe.
  useEffect(() => {
    if (editingTask && !tasks.some((task) => task.id === editingTask.id)) {
      setEditingTask(null);
    }
  }, [tasks, editingTask]);

  // El filtrado es un cálculo derivado de tasks + filters: se recalcula en
  // cada render, no necesita su propio useState (evita tener dos fuentes de
  // verdad desincronizadas).
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filters.status === "all" || task.status === filters.status;
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
    const matchesSearch = task.title
      .toLowerCase()
      .includes(filters.search.trim().toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  async function handleToggleStatus(id: string, nextStatus: TaskStatus) {
    await updateTask(id, { status: nextStatus });
  }

  async function handleFormSubmit(data: TaskFormData) {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    } else {
      await createTask(data);
    }
  }

  return (
    <section className="filtered-task-list">
      <TaskForm
        taskToEdit={editingTask}
        onSubmit={handleFormSubmit}
        onCancelEdit={() => setEditingTask(null)}
      />

      <div className="filtered-task-list__filters">
        <input
          type="search"
          placeholder="Buscar por título…"
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        />

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value as TaskFilters["status"] }))
          }
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="in-progress">En curso</option>
          <option value="completed">Completada</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              priority: e.target.value as TaskFilters["priority"],
            }))
          }
        >
          <option value="all">Toda prioridad</option>
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </select>
      </div>

      {error && <p className="filtered-task-list__error">Error: {error}</p>}

      <TaskList
        tasks={filteredTasks}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onEdit={setEditingTask}
        onDelete={deleteTask}
      />
    </section>
  );
}