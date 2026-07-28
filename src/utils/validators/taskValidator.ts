import type { TaskFormData } from "../../types/task";

const MAX_TITLE = 100;
const MAX_DESCRIPTION = 255;

export function validateTask(data: TaskFormData): string | null {
  if (!data.title.trim()) return "El título es obligatorio.";
  if (data.title.length > MAX_TITLE) return `El título no puede superar ${MAX_TITLE} caracteres.`;
  if (data.description.length > MAX_DESCRIPTION) return `La descripción no puede superar ${MAX_DESCRIPTION} caracteres.`;

  if (data.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selected = new Date(data.dueDate);
    if (selected < today) return "La fecha de vencimiento no puede ser en el pasado.";
  }

  return null;
}