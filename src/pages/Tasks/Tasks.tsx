import { FilteredTaskList } from "../../components/FilteredTaskList/FilteredTaskList";
//import "./Tasks.css";

export function Tasks() {
  return (
    <div className="tasks-page">
      <FilteredTaskList />
    </div>
  );
}