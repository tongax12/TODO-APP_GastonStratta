import { useEffect, useState, useCallback } from "react";
import type { Task, TaskFormData } from "../types/task";
import { useAuth } from "../features/auth/Authenticator";
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

  const fetchTasks = useCallback(async () => {
    if (!user) { setTasks([]); setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const data = await taskService.subscribeToTasks(user.uid);
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar tareas.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  async function createTask(data: TaskFormData) {
    if (!user) return;
    await taskService.createTask(user.uid, data);
    await fetchTasks();
  }

  async function updateTask(id: string, data: Partial<TaskFormData>) {
    await taskService.updateTask(id, data);
    await fetchTasks();
  }

  async function deleteTask(id: string) {
    await taskService.deleteTask(id);
    await fetchTasks();
  }

  return { tasks, isLoading, error, createTask, updateTask, deleteTask };
}