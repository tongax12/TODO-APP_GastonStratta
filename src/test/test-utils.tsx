import { type ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { render, type RenderOptions } from "@testing-library/react";
import type { Task, TaskFormData } from "../types/task";

export function createMockTask(overrides: Partial<Task> = {}): Task {
  return {
    id: "task-1",
    title: "Test task",
    description: "Test description",
    status: "pending",
    priority: "medium",
    dueDate: "2026-12-31",
    ...overrides,
  };
}

export function createMockFormData(overrides: Partial<TaskFormData> = {}): TaskFormData {
  return {
    title: "New task",
    description: "New description",
    priority: "medium",
    status: "pending",
    dueDate: "2026-12-31",
    ...overrides,
  };
}

interface ProvidersWrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

function ProvidersWrapper({ children, initialEntries }: ProvidersWrapperProps) {
  return (
    <MemoryRouter initialEntries={initialEntries ?? ["/"]}>
      {children}
    </MemoryRouter>
  );
}

function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { initialEntries?: string[] },
) {
  const { initialEntries, ...renderOptions } = options ?? {};
  return render(ui, {
    wrapper: ({ children }) => (
      <ProvidersWrapper initialEntries={initialEntries}>
        {children}
      </ProvidersWrapper>
    ),
    ...renderOptions,
  });
}

export { customRender as render };
