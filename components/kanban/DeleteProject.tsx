import { useRouter } from "next/navigation"
import { Project } from "@prisma/client"
import AlertComponent from "./AlertComponent"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStore } from "@/utils/store/useStore"
import { actionDeleteProject } from "@/app/actions/actions"
import { useTransition } from "react"

type Props = {
	project: Project | null, 
	drawer?: boolean
	projects: Project[] | null | undefined
}
export default function DeleteProject({ project, drawer, projects } : Props) {
	const router = useRouter()
	const { store , setStore } = useStore(s=>s)
	const [ _, startTransition ] = useTransition()

	async function deleteProject() {
		if (project?.id) {
			const newProjects = projects?.filter(p => p.id != project.id)
			setStore({
				...store,
				project: null,
				home: true,
				projects: newProjects
			})
			router.push('/kanban/home')
			store.updateOptimisticProjects && startTransition(() =>  store.updateOptimisticProjects!({
				action: 'delete',
				id: project.id
			}))
			await actionDeleteProject(({ id: project.id}))
		}
	}

	return (
		<div className={`md:block ${ drawer ? 'block' : 'hidden'}`} 
			onClick={(e)=>{
				e.stopPropagation()
		}}>
			<AlertComponent
				title="Delete a Project"
				content="Are you sure you want to delete this Project? This action cannot be undone."
				action={() => { 
					console.log("trying to delete...")
					if (!store.loading) deleteProject() 
				}}
			>
				<Trash2 size="24" strokeWidth={2} className={cn(
					`text-muted-foreground place-self-center hover:text-foreground transition-all`, {
						'text-secondary': store.loading 
					}
				)}/>
			</AlertComponent>
		</div>
	)
}
