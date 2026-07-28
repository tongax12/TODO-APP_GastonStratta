import { useEffect, useState } from "react"; //si uso React.SubmitEvent no hace falta importarlo?
import {
  type Task,
  type TaskFormData,
} from "../../types/task";
import "./TaskForm.css";
import { emptyTaskFormData } from "../../types/taskDefaults";
import { validateTask } from "../../utils/validators/taskValidator";

interface TaskFormProps {
  taskToEdit: Task | null; // null = modo "crear"
  onSubmit: (data: TaskFormData) => Promise<void>;
  onCancelEdit: () => void;
}

/**
 * Un solo formulario sirve para crear y editar. La diferencia la marca la
 * prop `taskToEdit`: cuando cambia, useEffect resetea el estado local con
 * los datos de esa tarea (o los vacía si vuelve a ser null).
 */
export function TaskForm({ taskToEdit, onSubmit, onCancelEdit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>(emptyTaskFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description ?? "",
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate ?? "",
      });
    } else {
      setFormData(emptyTaskFormData);
    }
  }, [taskToEdit]);

  function handleChange(
    field: keyof TaskFormData,
    value: string
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const error = validateTask(formData);
    if (error) { setFormError(error); return; }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      if (!taskToEdit) {
        setFormData(emptyTaskFormData); // solo limpiamos si era una creación
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "No se pudo guardar la tarea.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2 className="task-form__heading">
        {taskToEdit ? "Editar tarea" : "Nueva tarea"}
      </h2>

      <div className="task-form__field">
        <label htmlFor="title">Título</label>
        <input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Ej: Preparar presentación"
        />
      </div>

      <div className="task-form__field">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Detalles opcionales"
          rows={3}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label htmlFor="priority">Prioridad</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="task-form__field">
          <label htmlFor="dueDate">Vencimiento</label>
          <input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
          />
        </div>
      </div>

      {taskToEdit && (
        <div className="task-form__field">
          <label htmlFor="status">Estado</label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="pending">Pendiente</option>
            <option value="in-progress">En curso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      )}

      {formError && <p className="task-form__error">{formError}</p>}

      <div className="task-form__actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : taskToEdit ? "Guardar cambios" : "Agregar tarea"}
        </button>
        {taskToEdit && (
          <button type="button" className="task-form__cancel" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}