import { Project } from "@prisma/client"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStore } from "@/utils/store/useStore"
import { supaDeleteProject, supaFetchAllProjects, supabase } from "@/utils/supabase/queries"
import { useRouter } from "next/navigation"

type Props = {
	project: Project,
	hover: boolean
}
export default function SidebarButton({ project, hover } : Props) {
	const { store, setStore } = useStore(state => state)
	const path = usePathname()
	const pathArray = path.split('/')
	const currentId = pathArray.at(pathArray.length - 1)
	const router = useRouter()

	async function getNumCols(project: Project) {
		const { data } = await supabase
			.from("Column")
			.select()
			.eq('project', project.id)
		return data?.length || 4
	}
	async function navigateToProject() {
		const num = 4 // await getNumCols(project)
		setStore({
			...store,
			loading: true,
			triggerUpdate: !store.triggerUpdate,
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
			loading: true,
			projects: store?.projects?.filter(p => p.id != project.id) || [] 
		})
		await supaDeleteProject(project.id)
		const newProjects = await supaFetchAllProjects()
		setTimeout(() => setStore({
			...store,
			log: "deleteProject after",
			updating: false,
			loading: false,
			projects: newProjects || store.projects || []
		}) , 100)
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
						(store.selectedProjectId === "" && currentId === project.id) || 
						(store.selectedProjectId === project.id),
					})
				}
				onClick={()=> {
					setStore({
						...store,
						loading: true
					})
					console.log("LINK WAS CLICKED")
					if (project.id != currentId) navigateToProject()
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
						console.log("Trash was clicked")
						e.stopPropagation()
						deleteProject()	
				}}>
					<Trash2 size="16" className="text-muted-foreground place-self-center hover:text-foreground"/>
				</div>
			</div>
		</div>
	)
}
