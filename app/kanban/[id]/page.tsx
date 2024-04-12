import { actionFetchAllCols, actionFetchAllProjects, actionFetchAllTasks } from "@/app/actions/actions";
import Kanban from "@/components/kanban/Kanban";

export const dynamic = 'auto'

export default async function KanbanPage() {
	const projects = await actionFetchAllProjects() || null 
	const columns = await actionFetchAllCols() || null
	const tasks = await actionFetchAllTasks() || null
	
	console.log("KanbanPage!")
  
  return (
    <Kanban 
			projectArray={projects}
			colsInit={columns}
			tasksInit={tasks}
		/>
  );
}
