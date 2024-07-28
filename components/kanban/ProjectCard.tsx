import { actionFetchCols, actionFetchTasksOfProject } from "@/app/actions/actions"
import { Project } from "@prisma/client"
import ProjectCardContent from "./ProjectCardContent"

type Props = {
	project: Project
}
export default async function ProjectCard({ project } : Props) {
	const columns = await actionFetchCols({ projectId: project.id })
	const tasks = await actionFetchTasksOfProject({ projectId: project.id})

	const colsNum = columns?.length || 0
	const tasksNum = tasks?.length || 0

	return (
		<ProjectCardContent
			project={project}
			colsNum={colsNum}
			tasksNum={tasksNum}
		/>
	)
}
