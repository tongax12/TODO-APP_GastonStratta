import { FilteredTaskList } from "../../components/FilteredTaskList/FilteredTaskList";
import EmailSummaryButton from "../../components/EmailSummaryButton/EmailSummaryButton";
import { useAuth } from "../../features/auth/Authenticator";
import { useTasks } from "../../hooks/useTask";

export function Tasks() {
  const { user } = useAuth();
  // Única instancia de useTasks en toda la página: tanto EmailSummaryButton
  // como FilteredTaskList leen y modifican este mismo estado, así que
  // cualquier cambio (crear/editar/borrar) queda visible para los dos.
  const { tasks, isLoading, error, createTask, updateTask, deleteTask } = useTasks();

  return (
    <div className="tasks-page">
      <EmailSummaryButton
        todos={tasks}
        userEmail={user?.email ?? ""}
      />
      <FilteredTaskList
        tasks={tasks}
        isLoading={isLoading}
        error={error}
        createTask={createTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}