import type { TaskFormData, TaskFilters } from "./task";

export const emptyTaskFormData: TaskFormData = {
  title: "",
  description: "",
  priority: "low",
  status: "pending",
  dueDate: "",
};

export const defaultTaskFilters: TaskFilters = {
  status: "all",
  priority: "all",
  search: "",
};