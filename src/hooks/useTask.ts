import { useEffect, useState } from "react";
import type { Task, TaskFormData } from "../types/task";
import { useAuth } from "../features/auth/useAuth";
import * as taskService from "../services/taskService";

interface UseTasksResult {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  createTask: (data: TaskFormData) => Promise<void>;
  updateTask: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export function useTasks(): UseTasksResult {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Si no hay usuario, limpiamos el estado y desactivamos el loading
    if (!user) {
      setTasks([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Nos suscribimos a los cambios en tiempo real
    const unsubscribe = taskService.subscribeToTasks(
      user.uid,
      (newTasks) => {
        setTasks(newTasks);
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || "Error al cargar tareas.");
        setIsLoading(false);
      }
    );

    // Cancelamos la suscripción cuando el usuario cambia o el componente se desmonta
    return () => {
      unsubscribe();
    };
  }, [user]);

  async function createTask(data: TaskFormData) {
    if (!user) return;
    await taskService.createTask(user.uid, data);
  }

  async function updateTask(id: string, data: Partial<TaskFormData>) {
    await taskService.updateTask(id, data);
  }

  async function deleteTask(id: string) {
    await taskService.deleteTask(id);
  }

  return { tasks, isLoading, error, createTask, updateTask, deleteTask };
}