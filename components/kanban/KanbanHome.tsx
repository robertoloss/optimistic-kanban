import { actionFetchAllProjectsAlpha } from "@/app/actions/actions"
import ProjectCard from "./ProjectCard"



export default async function KanbanHome() {
	const projects = await actionFetchAllProjectsAlpha()
	return (
		<div className={
			`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5
			col auto-cols-auto w-full px-4 items-start h-fit gap-4`
		}>
			{projects?.map(p => {
				return <ProjectCard project={p} />
			})}
		</div>
	)
}
