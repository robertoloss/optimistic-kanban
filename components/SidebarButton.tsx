import { Project } from "@prisma/client"
import { cn } from "@/lib/utils"
import { UpdateOptimisticProjects } from "./SidebarContent"
import { startTransition } from "react"
import { actionDeleteProject } from "@/app/actions/actions"
import {  Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ProjNumCols } from "./kanban/Kanban"
import { useStore } from "@/utils/store/useStore"

type Props = {
	project: Project,
	updateOptimisticProjects: UpdateOptimisticProjects
	hover: boolean
	projNumCols: ProjNumCols
}
export default function SidebarButton({ project, updateOptimisticProjects, hover, projNumCols } : Props) {
	const { store, setStore } = useStore(state => state)
	const path = usePathname()
	const pathArray = path.split('/')
	const currentId = pathArray.at(pathArray.length - 1)

	return (
		<Link href={`/kanban/${project.id}`}>
			<div 
				className={cn(`
					flex flex-row justify-between p-4 cursor-pointer rounded-lg text-muted-foreground
					bg-muted items-center text-sm shadow shadow-muted-foreground
					transition hover:text-foreground select-none h-14 border-2 border-muted 
				`, {
					'shadow-none border-2 border-foreground text-foreground': 
						(!store.loading && currentId === project.id) || 
						(store.loading && project.id === store.selectedProjectId),
					})
				}
				onClick={()=> {
					if (project.id != currentId) {
						setStore({
							...store,
							loading: true,
							selectedProjectId: project.id,
							formerProjectId: currentId,
							numCols : projNumCols[project.id],
							project: project
						})
					}
				}}
			>
				<div className={`
					grid xl:grid-cols-[auto]  ${hover ? 'grid grid-cols-[120px]' : 'grid-cols-[0px]'}
					 overflow-hidden
				`}>
					<p className={`xl:block`}>
						{project.title}
					</p>
				</div>
				<p className={`xl:hidden font-semibold w-full self-center text-center ${hover ? 'hidden' : ''}`}>
					{project.title?.at(0)?.toUpperCase()}
				</p>
				<div className={`xl:block ${hover ? 'block' : 'hidden'}`} 
					onClick={(e)=>{
						e.stopPropagation()
						startTransition(()=>updateOptimisticProjects({
							action: "delete",
							id: project.id,
					}))
					actionDeleteProject({ id: project.id })
				}}>
					<Trash2 size="16" className="text-muted-foreground place-self-center hover:text-foreground"/>
				</div>
			</div>
		</Link>
	)
}
