import { cn } from "@/app/utils/cn"
import { useMemo } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { Column as ColumnPrisma, Task as TaskPrisma} from "@prisma/client"
import Task from "./Task"
import { UniqueIdentifier } from "@dnd-kit/core"
import { GripHorizontal, Trash2 } from "lucide-react"
import AddATask from "./AddATask"
import { supaDeleteColumn, supaFetchAllCols } from "@/utils/supabase/queries"
import { useStore } from "@/utils/store/useStore"

export const minHeigtColumn = 480
type Props = {
	column: ColumnPrisma
	overlay?: boolean
	tasks?: TaskPrisma[]
	projectId: string
}
export default function Column({ column, overlay, tasks, projectId } : Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: column.id!,
		data: {
      type: "Column",
      column,
    },
		animateLayoutChanges: () => true,
		transition: {
			duration: 200,
			easing: 'ease'
		}
	});
	const { store, setStore } = useStore(s => s) 
	const sortedTasks = tasks?.sort((a,b) => (a.position || 0) - (b.position || 0))
	const tasksIds = useMemo(() => sortedTasks?.map(t => (t.id as unknown) as UniqueIdentifier), [tasks])
	const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

	async function deleteColumn(column: ColumnPrisma) {
		setStore({
			...store,
			columns: store.columns?.filter(c => c.id != column.id) || [],
		})
		await supaDeleteColumn(column)
		const newCols = await supaFetchAllCols()
		setTimeout(()=> setStore({
			...store,
			columns: newCols || store.columns || [],
		}),100)
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} 
			className="flex flex-col w-fit h-full"	
		>
			<div    
				className={cn(
					`	flex flex-col min-w-[280px] max-w-[280px] px-4 pt-1
						pb-4 gap-y-4 z-10 bg-column rounded-lg border
						border-border cursor-auto transition-all h-full`, { 
							"z-50 opacity-0": isDragging,
							"shadow-black shadow": overlay,
				})}
				//style={{ height: `${numF}px` }}
			>
				<div  
					className={cn(`w-full h-6 flex flex-row items-center justify-between cursor-grab 
						active:cursor-grabbing rounded-lg`, {
						"cursor-grabbing": overlay,
					})}>
					<div className="w-4" />
					<div {...listeners} >
						<GripHorizontal color="#6b7280"/>
					</div>
						<div className={cn(`flex flex-col self-end justify-center items-center h-full w-fit`)}>
							<Trash2 
								size={16} 
								className="place-self-center self-center text-muted-foreground hover:text-foreground hover:cursor-pointer"
								onClick={() => {
									deleteColumn(column)
								}}
							/>
						</div>
				</div>
				<div className="flex flex-row w-full justify-between">
					<div className="flex flex-row gap-x-2 items-center text-sm font-medium">
						<h1 className="text-sm bg-muted-foreground text-background w-fit px-2 py-1 rounded">
						 {column.title}
						</h1>
						<h1 className="">{tasks?.length}</h1>
					</div>
					<AddATask 
						projectId={projectId}
						column={column}
					/>
				</div>
				<div className="no-scrollbar flex flex-col h-full overflow-y-scroll gap-y-2 pb-10">
				{<SortableContext items={tasksIds || []}>
					{tasks?.map(task => (
						<Task 
							key={task.id}
							column={column}
							task={task}
						/>
					))}
				</SortableContext>}
				</div>
			</div>
		</div>
	)
}

