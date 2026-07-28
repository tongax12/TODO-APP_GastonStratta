import { Timestamp } from "firebase/firestore";

export type TaskPriority = "low" | "medium" | "high";

export type TaskStatus = "pending" | "completed";


export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;        
  priority: TaskPriority;
  dueDate?: string | null;   
  createdAt?: Timestamp | null;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export interface TaskFilters {
  status: TaskStatus | "all";
  priority: TaskPriority | "all";
  search: string;
}