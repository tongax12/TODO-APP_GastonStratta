import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockTask } from "../test-utils";
import { FilteredTaskList } from "../../components/FilteredTaskList/FilteredTaskList";

function renderFilteredTaskList(props?: Partial<React.ComponentProps<typeof FilteredTaskList>>) {
  const defaults: React.ComponentProps<typeof FilteredTaskList> = {
    tasks: [],
    isLoading: false,
    error: null,
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  };
  return render(<FilteredTaskList {...defaults} {...props} />);
}

describe("FilteredTaskList", () => {
  it("renders TaskForm, filters, and TaskList", () => {
    renderFilteredTaskList();
    expect(screen.getByText("Nueva tarea")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Buscar por título…")).toBeInTheDocument();
    expect(screen.getByText(/No hay tareas para mostrar/)).toBeInTheDocument();
  });

  it("filters tasks by status", async () => {
    const user = userEvent.setup();
    const tasks = [
      createMockTask({ id: "1", title: "Pending task", status: "pending" }),
      createMockTask({ id: "2", title: "Completed task", status: "completed" }),
    ];
    renderFilteredTaskList({ tasks });
    await user.selectOptions(screen.getByDisplayValue("Todos los estados"), "completed");
    expect(screen.getByText("Completed task")).toBeInTheDocument();
    expect(screen.queryByText("Pending task")).not.toBeInTheDocument();
  });

  it("filters tasks by priority", async () => {
    const user = userEvent.setup();
    const tasks = [
      createMockTask({ id: "1", title: "High task", priority: "high" }),
      createMockTask({ id: "2", title: "Low task", priority: "low" }),
    ];
    renderFilteredTaskList({ tasks });
    await user.selectOptions(screen.getByDisplayValue("Toda prioridad"), "high");
    expect(screen.getByText("High task")).toBeInTheDocument();
    expect(screen.queryByText("Low task")).not.toBeInTheDocument();
  });

  it("filters tasks by search term", async () => {
    const user = userEvent.setup();
    const tasks = [
      createMockTask({ id: "1", title: "Buy groceries" }),
      createMockTask({ id: "2", title: "Walk the dog" }),
    ];
    renderFilteredTaskList({ tasks });
    await user.type(screen.getByPlaceholderText("Buscar por título…"), "groceries");
    expect(screen.getByText("Buy groceries")).toBeInTheDocument();
    expect(screen.queryByText("Walk the dog")).not.toBeInTheDocument();
  });

  it("shows error message when error is provided", () => {
    renderFilteredTaskList({ error: "Something went wrong" });
    expect(screen.getByText("Error: Something went wrong")).toBeInTheDocument();
  });
});
