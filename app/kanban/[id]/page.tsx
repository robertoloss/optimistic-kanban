import { actionFetchAllProjects, actionFetchCols } from "@/app/actions/actions";
import Kanban from "@/components/kanban/Kanban";

//export const runtime = 'edge'; //...two hours later! 🙄

export type ProjNumCols = {
	[projectId: string] : number
}
async function getNumberOfColumns() : Promise<ProjNumCols> {
	["getNumberOfColumns"]
	const projects = await actionFetchAllProjects()
	const projNumCols : ProjNumCols = {}
	if (projects) {
		for (let i=0; i<projects?.length; i++) {
			const projectId = projects[i].id
			const columns = await actionFetchCols({ projectId })
			if (columns) {
				projNumCols[projectId] = columns.length
			}
		}
	}
	return projNumCols
}

export default async function KanbanPage() {
	const projNumCols = await getNumberOfColumns()
	const projects = await actionFetchAllProjects() || null 
  
  return (
    <Kanban projNumCols={projNumCols} projectArray={projects} />
  );
}
