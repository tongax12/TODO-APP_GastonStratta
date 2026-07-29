import { useState, useEffect } from "react"
import type { Task } from "../../types/task"
import "./EmailSummaryButton.css"

interface Props {
    todos: Task[]
    userEmail: string
}

type Status = "idle" | "loading" | "success" | "error"

function buildTodoSummary(todos: Task[]): string {
    const pending = todos.filter((t) => t.status === "pending")
    const done = todos.filter((t) => t.status === "completed")

    return (
        `Tareas pendientes (${pending.length}):\n` +
        pending.map((t) => `- ${t.title}`).join("\n") +
        `\n\nTareas completadas (${done.length}):\n` +
        done.map((t) => `- ${t.title}`).join("\n")
    )
}

function EmailSummaryButton({ todos, userEmail }: Props) {
    const [status, setStatus] = useState<Status>("idle")
    const [errorMsg, setErrorMsg] = useState("")

    // Auto-hide success message after 3 seconds
    useEffect(() => {
        if (status === "success" || status === "error") {
            const timer = setTimeout(() => {
                setStatus("idle")
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [status])

    async function handleSend() {
        setStatus("loading")
        setErrorMsg("")

        const summary = buildTodoSummary(todos)

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: userEmail, summary }),
            })

            const data = await res.json()

            if (!res.ok) {
                setStatus("error")
                setErrorMsg(data?.message || "Error al enviar el email")
                return
            }

            setStatus("success")
        } catch (error) {
            setStatus("error")
            setErrorMsg("No se pudo conectar con el servidor")
        }
    }

    const pendingCount = todos.filter((t) => t.status === "pending").length

    return (
        <div className="email-summary">
            <button
                className={`email-btn ${status === "loading" ? "email-btn--loading" : ""}`}
                onClick={handleSend}
                disabled={status === "loading" || todos.length === 0}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>

                {status === "loading" ? "Enviando..." : "Enviar resumen por email"}

                {pendingCount > 0 && (
                    <span className="email-btn__badge">{pendingCount}</span>
                )}
            </button>

            {status === "success" && (
                <p className="email-status email-status--success">
                    Email enviado correctamente
                </p>
            )}
            {status === "error" && (
                <p className="email-status email-status--error">
                    {errorMsg}
                </p>
            )}
        </div>
    )
}

export default EmailSummaryButton