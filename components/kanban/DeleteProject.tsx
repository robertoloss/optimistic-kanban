import { useRouter } from "next/navigation"
import { Project } from "@prisma/client"
import AlertComponent from "./AlertComponent"
import { Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { supaDeleteProject } from "@/utils/supabase/queries"
import { useStore } from "@/utils/store/useStore"

type Props = {
	project: Project | null, 
	drawer?: boolean
	optimisticProjects?: Project[]
	revalidate : () => Promise<void>
}
export default function DeleteProject({ project, drawer, revalidate } : Props) {
	const router = useRouter()
	const { store , setStore } = useStore(s=>s)

	async function deleteProject() {
		if (project?.id) {
			await supaDeleteProject(project?.id)
			console.log(revalidate())
			const rev = await revalidate()
			console.log(rev)
			setStore({
				...store,
				project: null,
				home: true
			})
			router.push('/kanban/home')
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
					action={() => deleteProject()}
				>
				<Trash2 size="16" className={cn(
					`text-muted-foreground place-self-center hover:text-foreground transition-all`, {
						'opacity-50': false 
					}
				)}/>
			</AlertComponent>
		</div>
	)
}
