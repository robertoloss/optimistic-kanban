import { Project } from "@prisma/client"
import ProjectCard from "./ProjectCard"

type Props = {
	projects: Project[] | null | undefined
}
export default function KanbanHome({ projects } : Props) {

	return (
		<div className={
			`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5
			col auto-cols-auto w-full px-4 items-start h-fit gap-4`
		}>
			{projects?.map((p,i) => {
				return <ProjectCard project={p} key={i}/>
			})}
		</div>
	)
}
