import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, createMockTask } from "../test-utils";
import EmailSummaryButton from "../../components/EmailSummaryButton/EmailSummaryButton";

function renderEmailSummaryButton(props?: Partial<React.ComponentProps<typeof EmailSummaryButton>>) {
  const defaults: React.ComponentProps<typeof EmailSummaryButton> = {
    todos: [createMockTask()],
    userEmail: "test@example.com",
  };
  return render(<EmailSummaryButton {...defaults} {...props} />);
}

describe("EmailSummaryButton", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("shows badge with pending count", () => {
    const todos = [
      createMockTask({ id: "1", status: "pending" }),
      createMockTask({ id: "2", status: "completed" }),
      createMockTask({ id: "3", status: "pending" }),
    ];
    renderEmailSummaryButton({ todos });
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("shows success message after successful send", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });
    renderEmailSummaryButton();
    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));
    expect(await screen.findByText("Email enviado correctamente")).toBeInTheDocument();
  });

  it("shows error message when API returns error", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Failed to send" }),
    });
    renderEmailSummaryButton();
    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));
    expect(await screen.findByText("Failed to send")).toBeInTheDocument();
  });

  it("shows error message on network failure", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));
    renderEmailSummaryButton();
    await user.click(screen.getByRole("button", { name: /enviar resumen/i }));
    expect(await screen.findByText("No se pudo conectar con el servidor")).toBeInTheDocument();
  });

  it("is disabled when there are no todos", () => {
    renderEmailSummaryButton({ todos: [] });
    expect(screen.getByRole("button", { name: /enviar resumen/i })).toBeDisabled();
  });

  it("shows loading state while sending", async () => {
  const user = userEvent.setup();
  let resolvePromise!: (value: unknown) => void;
  globalThis.fetch = vi.fn().mockReturnValue(
    new Promise((resolve) => { resolvePromise = resolve; })
  );

  renderEmailSummaryButton();

  const button = screen.getByRole("button", { name: /enviar resumen/i });
  await user.click(button);

  expect(screen.getByRole("button", { name: /Enviando/ })).toBeDisabled();

  // Resolver y esperar a que el estado se estabilice
  resolvePromise({ ok: true, json: async () => ({ ok: true }) });

  // Esperar a que el botón vuelva a su estado normal
  await waitFor(() => {
    expect(screen.getByRole("button", { name: /enviar resumen/i })).not.toBeDisabled();
  });
});

  it("does not show badge when there are no pending tasks", () => {
    const todos = [createMockTask({ status: "completed" })];
    renderEmailSummaryButton({ todos });
    expect(screen.queryByText("1")).not.toBeInTheDocument();
  });
});
