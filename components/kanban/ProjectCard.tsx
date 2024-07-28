import { Project } from "@prisma/client"
import ProjectCardContent from "./ProjectCardContent"
import { supaFetchCols, supaFetchTasks } from "@/utils/supabase/queries"
import { useState, useEffect } from "react"
import { Column, Task } from "@prisma/client"

type Props = {
	project: Project
}
export default function ProjectCard({ project } : Props) {
	const [ columns, setColumns ] = useState<null | Column[] | undefined>(null)
	const [ tasks, setTasks ] = useState<null | Task[] | undefined>(null)

	async function getColsAndTasks() {
		const resCols = await supaFetchCols(project.id)
		const resTasks = await supaFetchTasks(project.id)
		setColumns(resCols)
		setTasks(resTasks)
	}
	useEffect(()=>{
		getColsAndTasks()
	},[])

	return (
		<ProjectCardContent
			project={project}
			colsNum={columns?.length || 0}
			tasksNum={tasks?.length || 0}
		/>
	)
}
