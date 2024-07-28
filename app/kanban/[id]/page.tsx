'use server'
import Kanban from "@/components/kanban/Kanban";
import KanbanHome from "@/components/kanban/KanbanHome";
import { actionFetchAllProjectsAlpha, actionRevalidateFetchProjectsAlpha } from "@/app/actions/actions";

export default async function KanbanPage() {
	
	const projects = await actionFetchAllProjectsAlpha()
  return (
    <Kanban revalidate={actionRevalidateFetchProjectsAlpha}>
			<KanbanHome projects={projects}/>
		</Kanban>
  );
}
