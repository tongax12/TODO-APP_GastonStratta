import { useState } from "react";
import { useAuth } from "../../features/auth/Authenticator";
import { useTasks } from "../../hooks/useTask";

export function EmailSummaryButton() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleClick() {
    if (!user?.email) {
      setErrorMsg("No se encontró el email del usuario.");
      setStatus("error");
      return;
    }

    if (tasks.length === 0) {
      setErrorMsg("No tenés tareas para resumir.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    const summary = tasks
      .map(
        (t) =>
          `- [${t.status}] ${t.title} (prioridad: ${t.priority})${
            t.description ? ` — ${t.description}` : ""
          }`
      )
      .join("\n");

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: user.email, summary }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Error al enviar el mail");
      }

      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
      setStatus("error");
    }
  }

  return (
    <div className="email-summary">
      <button
        onClick={handleClick}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Enviando..." : "Enviar resumen por mail"}
      </button>

      {status === "success" && <span>✅ Mail enviado a {user?.email}</span>}
      {status === "error" && <span>❌ {errorMsg}</span>}
    </div>
  );
}