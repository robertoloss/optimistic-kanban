'use client'
import { useDrawerStore, useStore } from "@/utils/store/useStore"
import { Project } from "@prisma/client"
import { useRouter } from "next/navigation"

type Props = {
	project: Project
	colsNum: number
	tasksNum: number
}
export default function ProectCardContent({ project, colsNum, tasksNum } : Props) {
	const { store, setStore } = useStore(s=>s)
	const { setIsOpen } = useDrawerStore(s=>s)
	const router = useRouter()

	async function navigateToProject() {
		const num = 4 
		setStore({
			...store,
			loading: true,
			numCols: num,
			project: {...project, id: project.id as string },
			home: false,
		})
		router.push(`/kanban/${project.id}`)
		setIsOpen(false)
	}
	
	return (
		<div 
			className="
				flex flex-col flex-grow w-full  h-full min-h-[200px] rounded-lg 
				bg-background border border-muted-foreground p-6 justify-between
				hover:shadow-[-4px_4px_var(--foreground)] transition
				hover:translate-x-1 hover:-translate-y-1 cursor-pointer hover:border-foreground
				active:shadow-none active:translate-x-0 active:translate-y-0"
			onMouseUp={() => navigateToProject()}
		>
			<h1 className="font-semibold text-lg">
				{project.title}
			</h1>
			<div className="flex flex-col w-fit self-end text-sm font-light">
				<h1>
					Columns: {colsNum}
				</h1>
				<h1>
					Tasks: {tasksNum}
				</h1>
			</div>
		</div>
	)
}
