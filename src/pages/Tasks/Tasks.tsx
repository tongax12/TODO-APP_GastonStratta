import { FilteredTaskList } from "../../components/FilteredTaskList/FilteredTaskList";
import { EmailSummaryButton } from "../../components/EmailSummaryButton/EmailSummaryButton";

export function Tasks() {
  return (
    <div className="tasks-page">
      <EmailSummaryButton />
      <FilteredTaskList />
    </div>
  );
}