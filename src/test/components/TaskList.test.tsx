import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { render, createMockTask } from "../test-utils";
import { TaskList } from "../../components/TaskList/TaskList";

function renderTaskList(props?: Partial<React.ComponentProps<typeof TaskList>>) {
  const defaults: React.ComponentProps<typeof TaskList> = {
    tasks: [],
    isLoading: false,
    onToggleStatus: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };
  return render(<TaskList {...defaults} {...props} />);
}

describe("TaskList", () => {
  it("shows loading message when isLoading is true", () => {
    renderTaskList({ isLoading: true });
    expect(screen.getByText("Cargando tareas…")).toBeInTheDocument();
  });

  it("shows empty message when tasks array is empty", () => {
    renderTaskList({ tasks: [] });
    expect(screen.getByText(/No hay tareas para mostrar/)).toBeInTheDocument();
  });

  it("renders tasks as TaskItem components", () => {
    const tasks = [
      createMockTask({ id: "1", title: "Task one" }),
      createMockTask({ id: "2", title: "Task two" }),
    ];
    renderTaskList({ tasks });
    expect(screen.getByText("Task one")).toBeInTheDocument();
    expect(screen.getByText("Task two")).toBeInTheDocument();
  });

  it("does not show loading or empty when tasks are present", () => {
    const tasks = [createMockTask()];
    renderTaskList({ tasks });
    expect(screen.queryByText("Cargando tareas...")).not.toBeInTheDocument();
    expect(screen.queryByText(/No hay tareas para mostrar/)).not.toBeInTheDocument();
  });
});
