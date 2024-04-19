import { Project } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStore } from "@/utils/store/useStore"
import { supaDeleteProject, supaFetchAllProjects, supabase } from "@/utils/supabase/queries"
import { useRouter } from "next/navigation"
import { actionDeleteProject } from "@/app/actions/actions"
import { startTransition } from "react"

type Props = {
	project: Project,
	hover: boolean
	updateOptimisticProjects: (action: {
		action: any;
		project?: any;
		id?: any;
	}) => void
}
export default function SidebarButton({ project, hover, updateOptimisticProjects } : Props) {
	const { store, setStore } = useStore(state => state)
	const path = usePathname()
	const pathArray = path.split('/')
	const currentId = pathArray.at(pathArray.length - 1)
	const router = useRouter()

	async function navigateToProject() {
		const num = 4 
		setStore({
			...store,
			loading: true,
			triggerUpdate: true,
			selectedProjectId: project.id,
			formerProjectId: currentId,
			numCols: num,
			project: project
		})
		router.push(`/kanban/${project.id}`)
	}

	async function deleteProject() {
		router.push('/kanban/home')
		setStore({
			...store,
			log: "deleteProject",
			updating: true,
			deleting: true,
			loading: true,
			project: null,
			projects: store?.projects?.filter(p => p.id != project.id) || [] 
		})
		router.push(`/kanban/home`)
		startTransition(()=>updateOptimisticProjects({
			action: "delete",
			id: project.id
		}))
	  await actionDeleteProject({ id: project.id })
		setStore({
			...store,
			log: "deleteProject after",
			updating: false,
			project: null,
			deleting: false,
			loading: false,
		})
	}

	return (
		<div>
			<div 
				className={cn(`
					flex flex-row justify-between p-4 cursor-pointer rounded-lg text-muted-foreground
					bg-muted items-center text-sm shadow shadow-muted-foreground
					transition hover:text-foreground select-none h-14 border-2 border-muted 
				`, {
					'shadow-none border-2 border-foreground text-foreground': 
						(store.selectedProjectId === project.id) && store.project?.id !== 'dummy' ||
						project.id === 'dummy'
					})
				}
				onClick={()=> {
					setStore({
						...store,
						loading: true
					})
					if (project.id != currentId) navigateToProject()
				}}
			>
				<div className={`
					grid xl:grid-cols-[auto]  ${hover ? 'grid grid-cols-[120px]' : 'grid-cols-[0px]'}
					 overflow-hidden
				`}>
					<p className={`xl:block`}>
						{ 
							project.title
						}
					</p>
				</div>
				<p className={`xl:hidden font-semibold w-full self-center text-center ${hover ? 'hidden' : ''}`}>
					{project.title?.at(0)?.toUpperCase()}
				</p>
				<div className={`xl:block ${hover ? 'block' : 'hidden'}`} 
					onClick={(e)=>{
						console.log("Trash was clicked")
						e.stopPropagation()
						if (!store.deleting) deleteProject()	
				}}>
					<Trash2 size="16" className={`
						text-muted-foreground 
						place-self-center hover:text-foreground transition-all
					`}/>
				</div>
			</div>
		</div>
	)
}
