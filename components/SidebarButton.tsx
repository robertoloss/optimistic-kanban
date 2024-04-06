import { Project } from "@prisma/client"
import { useRouter } from "next/navigation"
import { UpdateOptimisticProjects } from "./SidebarContent"
import { startTransition } from "react"
import { actionDeleteProject } from "@/app/actions/actions"
import { Trash2 } from "lucide-react"
import { useProject } from "@/utils/store/useProject"

type Props = {
	project: Project,
	updateOptimisticProjects: UpdateOptimisticProjects
	hover: boolean
}
export default function SidebarButton({ project, updateOptimisticProjects, hover } : Props) {
	const setProject = useProject(state => state.setProject)
	const router  = useRouter()

	return (
		<div className={`
				flex flex-row justify-between p-4 cursor-pointer rounded-lg
				bg-muted items-center text-sm shadow shadow-muted-foreground
				transition active:scale-100 hover:scale-[102%] select-none h-14
			`}
			onClick={()=> {
				//console.log("navigate to project route")
				router.push(`/kanban/${project.id}`)
				setProject(project)
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
				onClick={()=>{
				startTransition(()=>updateOptimisticProjects({
					action: "delete",
					id: project.id,
				}))
				actionDeleteProject({ id: project.id })
			}}>
				<Trash2 size="16" className="text-muted-foreground place-self-center hover:text-foreground"/>
			</div>
		</div>
	)
}
