import { Project } from "@prisma/client"
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils"
import { GripVertical, Trash2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useDrawerStore, useHoverStore, useStore } from "@/utils/store/useStore"
import { useRouter } from "next/navigation"
import { actionDeleteProject } from "@/app/actions/actions"
import { Dispatch, SetStateAction } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { UniqueIdentifier } from "@dnd-kit/core";

type Props = {
	project: Omit<Project, 'id'> & { id: UniqueIdentifier },
	drawer?: boolean
	setDndProjects: Dispatch<SetStateAction<Project[] | null>>
}
export default function SidebarButton({ project, drawer, setDndProjects } : Props) {
	const { hover } = useHoverStore(s=>s)
	const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
		isDragging
  } = useSortable({
		id: project.id as UniqueIdentifier,
		data: {
			project
		},
		animateLayoutChanges: () => true,
		 transition: {
			duration: 200, // milliseconds
			easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
		},
	});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
	const { store, setStore } = useStore(state => state)
	const { setIsOpen } = useDrawerStore(s=>s)
	const path = usePathname()
	const pathArray = path.split('/')
	const currentId = pathArray.at(pathArray.length - 1)
	const router = useRouter()

	async function navigateToProject() {
		const num = 4 
		setStore({
			...store,
			loading: true,
			formerProjectId: currentId,
			numCols: num,
			project: {...project, id: project.id as string }
		})
		router.push(`/kanban/${project.id}`)
		setIsOpen(false)
	}

	async function deleteProject() {
		router.push('/kanban/home')
		setStore({
			...store,
			log: "deleteProject",
			deleting: true,
			loading: true,
			project: null,
		})
		router.push(`/kanban/home`)
		setDndProjects(prev => prev ? prev.filter(p => p.id != project.id) : [])
		//startTransition(()=>updateOptimisticProjects({
		//	action: "delete",
		//	id: project.id
		//}))
	  await actionDeleteProject({ id: project.id as string })
		setStore({
			...store,
			log: "deleteProject after",
			project: null,
			deleting: false,
			loading: false,
		})
	}

	return (
		<div {...attributes} ref={setNodeRef} style={style} className={cn(`z-0`,
			{
				'z-50': isDragging
			}
		)}>
			<div
				className={cn(`
					flex flex-row justify-between py-4 px-1 cursor-pointer rounded-lg text-muted-foreground
					bg-muted items-center z-10 text-sm shadow shadow-muted-foreground
					transition hover:text-foreground select-none h-14 border-2 border-muted 
				`,
				{
					'shadow-none border-2 border-foreground text-foreground': 
						(store.project?.id === project.id) && !store.project?.id.includes('dummy') ||
						project.id === 'dummy',
					'shadow-none': drawer,
					'z-50': isDragging
				})}
				onClick={()=> {
					setStore({
						...store,
						loading: true
					})
					if (project.id != currentId) navigateToProject()
				}}
			>
				<div {...listeners}
					className={cn(`flex flex-col justify-center h-[64px] cursor-grab active:grabbing`, {
						//'h-[64px] cursor-grabbing': overlay,
					})}
				>
					<GripVertical  
						className="text-muted-foreground hover:text-pure"
						strokeWidth={2}
						size={16}
					/>
				</div>
				<div className={`
					grid xl:grid-cols-[auto]  ${hover || drawer ? 'grid grid-cols-[120px]' : 'grid-cols-[0px]'}
					 overflow-hidden justify-start items-start
				`}>
					<p className={cn(`text-left self-start justify-self-start`,{
						'block w-full': drawer,
						'xl:block': !drawer
					})}>
						{ 
							project.title
						}
					</p>
				</div>
				{!drawer && <p className={`xl:hidden font-semibold w-full self-center text-center ${hover ? 'hidden' : ''}`}>
					{project.title?.at(0)?.toUpperCase()}
				</p>}
				<div className={`xl:block ${hover || drawer ? 'block' : 'hidden'}`} 
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
