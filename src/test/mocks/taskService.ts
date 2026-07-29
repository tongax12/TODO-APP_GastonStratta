import { vi } from "vitest";

export const mockTaskService = {
  subscribeToTasks: vi.fn(),
  createTask: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
};
