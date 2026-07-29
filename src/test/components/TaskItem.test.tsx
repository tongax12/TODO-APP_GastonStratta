import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockTask } from "../test-utils";
import { TaskItem } from "../../components/TaskItem/TaskItem";

function renderTaskItem(props?: Partial<React.ComponentProps<typeof TaskItem>>) {
  const defaults: React.ComponentProps<typeof TaskItem> = {
    task: createMockTask(),
    onToggleStatus: vi.fn(),
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };
  return render(<TaskItem {...defaults} {...props} />);
}

describe("TaskItem", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  it("renders task title and metadata", () => {
    const task = createMockTask({ title: "Test title", priority: "high" });
    renderTaskItem({ task });
    expect(screen.getByText("Test title")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  it("calls onToggleStatus when checkbox is clicked", async () => {
    const user = userEvent.setup();
    const onToggleStatus = vi.fn();
    renderTaskItem({ onToggleStatus });
    await user.click(screen.getByRole("checkbox"));
    expect(onToggleStatus).toHaveBeenCalledWith("task-1", "completed");
  });

  it("calls onToggleStatus to revert when completed task is unchecked", async () => {
    const user = userEvent.setup();
    const task = createMockTask({ status: "completed" });
    const onToggleStatus = vi.fn();
    renderTaskItem({ task, onToggleStatus });
    await user.click(screen.getByRole("checkbox"));
    expect(onToggleStatus).toHaveBeenCalledWith("task-1", "pending");
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderTaskItem({ onEdit });
    await user.click(screen.getByRole("button", { name: /editar/i }));
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: "task-1" }));
  });

  it("calls onDelete after delay when delete button is clicked", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    renderTaskItem({ onDelete });
    await user.click(screen.getByRole("button", { name: /eliminar/i }));
    vi.advanceTimersByTime(300);
    expect(onDelete).toHaveBeenCalledWith("task-1");
  });

  it("applies done class when task is completed", () => {
    const task = createMockTask({ status: "completed" });
    renderTaskItem({ task });
    expect(screen.getByText("Test task")).toHaveClass("task-item__title--done");
  });

  it("shows description when provided", () => {
    const task = createMockTask({ description: "A detailed description" });
    renderTaskItem({ task });
    expect(screen.getByText("A detailed description")).toBeInTheDocument();
  });

  it("shows overdue class when due date is in the past", () => {
    const task = createMockTask({ dueDate: "2020-01-01" });
    renderTaskItem({ task });
    const dueElement = screen.getByText(/Vence:/);
    expect(dueElement).toHaveClass("task-item__due--overdue");
  });

  it("does not show overdue when due date is in the future", () => {
    const task = createMockTask({ dueDate: "2030-01-01" });
    renderTaskItem({ task });
    const dueElement = screen.getByText(/Vence:/);
    expect(dueElement).not.toHaveClass("task-item__due--overdue");
  });
});
