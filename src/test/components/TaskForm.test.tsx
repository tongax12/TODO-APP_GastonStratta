import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "../test-utils";
import { TaskForm } from "../../components/TaskForm/TaskForm";
import { createMockTask } from "../test-utils";

function renderTaskForm(props?: Partial<React.ComponentProps<typeof TaskForm>>) {
  const defaults: React.ComponentProps<typeof TaskForm> = {
    taskToEdit: null,
    onSubmit: vi.fn(),
    onCancelEdit: vi.fn(),
  };
  return render(<TaskForm {...defaults} {...props} />);
}

describe("TaskForm", () => {
  it("renders create mode with empty fields", () => {
    renderTaskForm();
    expect(screen.getByText("Nueva tarea")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toHaveValue("");
    expect(screen.getByRole("button", { name: "Agregar tarea" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancelar" })).not.toBeInTheDocument();
  });

  it("renders edit mode with pre-filled fields and cancel button", () => {
    const task = createMockTask();
    renderTaskForm({ taskToEdit: task });
    expect(screen.getByText("Editar tarea")).toBeInTheDocument();
    expect(screen.getByLabelText("Título")).toHaveValue(task.title);
    expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("shows validation error when submitting with empty title", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderTaskForm({ onSubmit });
    await user.click(screen.getByRole("button", { name: "Agregar tarea" }));
    expect(screen.getByText("El título es obligatorio.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows server error when onSubmit throws", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Server error message"));
    renderTaskForm({ onSubmit });
    await user.type(screen.getByLabelText("Título"), "Valid title");
    await user.click(screen.getByRole("button", { name: "Agregar tarea" }));
    expect(await screen.findByText("Server error message")).toBeInTheDocument();
  });

  it("calls onSubmit with form data on valid submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    renderTaskForm({ onSubmit });
    await user.type(screen.getByLabelText("Título"), "My task");
    await user.type(screen.getByLabelText("Descripción"), "My description");
    await user.click(screen.getByRole("button", { name: "Agregar tarea" }));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "My task",
      description: "My description",
      priority: "low",
      status: "pending",
      dueDate: "",
    });
  });

 it("disables submit button while isSubmitting", async () => {
  const user = userEvent.setup();
  let resolvePromise!: () => void;
  const onSubmit = vi.fn().mockReturnValue(
    new Promise<void>((resolve) => { resolvePromise = resolve; })
  );

  renderTaskForm({ onSubmit });

  await user.type(screen.getByLabelText("Título"), "My task");
  await user.click(screen.getByRole("button", { name: "Agregar tarea" }));

  // Botón deshabilitado durante el submit
  expect(screen.getByRole("button", { name: "Guardando…" })).toBeDisabled();

  // Resolver la promesa
  resolvePromise();

  // ⬅️ ESPERAR a que React actualice el estado
  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Agregar tarea" })).not.toBeDisabled();
  });
});
  it("calls onCancelEdit when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancelEdit = vi.fn();
    renderTaskForm({ taskToEdit: createMockTask(), onCancelEdit });
    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onCancelEdit).toHaveBeenCalled();
  });
});
