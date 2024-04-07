import { actionFetchAllProjects, actionFetchCols } from "@/app/actions/actions";
import Kanban from "@/components/kanban/Kanban";

export const runtime = 'edge'; //...two hours later! 🙄

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
type Props = {
	params: { id: string }
}
export default async function KanbanPage({ params } : Props) {
	const projNumCols = await getNumberOfColumns()
  
  return (
    <Kanban projectId={params.id} projNumCols={projNumCols}/>
  );
}
