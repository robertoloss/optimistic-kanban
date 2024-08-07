import { Project } from "@prisma/client"
import { CSS } from '@dnd-kit/utilities';
import { cn } from "@/lib/utils"
import { GripVertical, Trash2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { useDrawerStore, useHoverStore, useStore } from "@/utils/store/useStore"
import { useRouter } from "next/navigation"
import { actionDeleteProject } from "@/app/actions/actions"
import { useSortable } from "@dnd-kit/sortable"
import { UniqueIdentifier } from "@dnd-kit/core";
import { UpdateOptimisticProjects } from "./SidebarContent";
import { useTransition } from "react";
import AlertComponent from "./kanban/AlertComponent";

type Props = {
	project: Omit<Project, 'id'> & { id: UniqueIdentifier },
	drawer?: boolean
	updateOptimisticProjects: UpdateOptimisticProjects 
	optimisticProjects: Project[]
}
export default function SidebarButton({ project, drawer, updateOptimisticProjects, optimisticProjects } : Props) {
	const { hover } = useHoverStore(s=>s)
	const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
		isDragging
  } = useSortable({
		id: project.id,
		data: {
			project
		},
		animateLayoutChanges: () => false,
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
	const [ _, startTransition ] = useTransition()

	async function navigateToProject() {
		const num = 4 
		router.push(`/kanban/${project.id}`)
		setTimeout(() => { setStore({
			...store,
			loading: true,
			formerProjectId: currentId,
			numCols: num,
			project: {...project, id: project.id as string },
			home: false,
		})
		setIsOpen(false) }, 100)
	}

	//async function deleteProject() {
	//	router.push('/kanban/home')
	//	setStore({
	//		...store,
	//		log: "deleteProject",
	//		deleting: true,
	//		home: true,
	//		loading: true,
	//		project: null,
	//		optimisticUpdate: true,
	//		ignoreUseEffectSidebar: true,
	//	})
	//	startTransition(() => updateOptimisticProjects({
	//		action: "delete",
	//		id: project.id as string
	//	}))
	//  const newProjects = await actionDeleteProject({ id: project.id as string })
	//	setStore({
	//		...store,
	//		log: "deleteProject after",
	//		project: null,
	//		home: true,
	//		deleting: false,
	//		loading: false,
	//		optimisticUpdate: false,
	//		ignoreUseEffectSidebar: false,
	//	})
	//}

	return (
		<div {...attributes} ref={setNodeRef} style={style} className={cn(`z-0`,
			{
				'z-50': isDragging
			}
		)}>
			<div
				className={cn(`
					flex flex-row justify-between py-4 px-1 cursor-pointer rounded-lg dark:text-muted-foreground
					text-foreground bg-muted items-center z-10 text-sm shadow shadow-muted-foreground
					transition hover:text-foreground select-none h-14 border border-muted 
				`,
				{
					'shadow-none border border-foreground text-foreground': 
						(store.project?.id === project.id) && !store.project?.id.includes('dummy') ||
						String(project.id).includes('dummy'),
					'shadow-none': drawer,
					'z-50': isDragging
				})}
				onClick={()=> navigateToProject()}
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
					grid grid-cols-[auto]  ${ drawer ? 'grid grid-cols-[120px]' : 'grid-cols-[0px]'}
					 overflow-hidden justify-start items-start group-hover:text-foreground
				`}>
					<p className={cn(`text-left self-start justify-self-start light:text-foreground`,
					{
						'block w-full': drawer,
						'xl:block': !drawer
					})}>
						{ 
							project.title
						}
					</p>
				</div>
				{!drawer && <p className={`hidden font-semibold w-full self-center text-center ${hover ? '' : ''}`}>
					{project.title?.at(0)?.toUpperCase()}
				</p>}
				<div></div>
				{
					//<div className={`md:block ${ drawer ? 'block' : 'hidden'}`} 
					//	onClick={(e)=>{
					//		e.stopPropagation()
					//}}>
					//		<AlertComponent
					//			title="Delete a Project"
					//			content="Are you sure you want to delete this Project? This action cannot be undone."
					//			action={() => deleteProject()}
					//		>
					//		<Trash2 size="16" className={cn(
					//			`text-muted-foreground place-self-center hover:text-foreground transition-all`, {
					//				'opacity-50': store.optimisticUpdate
					//			}
					//		)}/>
					//	</AlertComponent>
					//</div>
				}
			</div>
		</div>
	)
}
