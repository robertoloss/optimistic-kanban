import { cn } from "@/app/utils/cn"
import { Dispatch, SetStateAction, useMemo } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { Column as ColumnPrisma, Task as TaskPrisma} from "@prisma/client"
import Task from "./Task"
import { UniqueIdentifier } from "@dnd-kit/core"
import { GripHorizontal, Trash2 } from "lucide-react"
import AddATask from "./AddATask"
import { supaDeleteColumn } from "@/utils/supabase/queries"

export const minHeigtColumn = 480


type Props = {
	column: ColumnPrisma
	overlay?: boolean
	tasks?: TaskPrisma[]
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	setTasks: Dispatch<SetStateAction<TaskPrisma[] | null>>
	setUpdating: Dispatch<SetStateAction<boolean>>
	setColumns: Dispatch<SetStateAction<ColumnPrisma[] | null>>
}
export default function Column({  column, setUpdating, setColumns, overlay, tasks, setTriggerUpdate, setTasks} : Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: column.title!,
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
	const sortedTasks = tasks?.sort((a,b) => (a.position || 0) - (b.position || 0))
	const tasksIds = useMemo(() => sortedTasks?.map(t => (t.id as unknown) as UniqueIdentifier), [tasks])
	const numF = tasks?.length && tasks.length >= 4 ? 
									((tasks?.length)*80) + (16*(2+(tasks?.length-1))) + 28 + 24 + 4 + 24
								:	minHeigtColumn
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

	async function deleteColumn(column: ColumnPrisma) {
		setUpdating(true)
		setColumns(cols => {
			if (cols) return cols.filter(c => c.id != column.id)
			else return [];
		})
		supaDeleteColumn(column,setTriggerUpdate)
	}

	return (
		<div ref={setNodeRef} style={style} {...attributes} 
			className="flex flex-col w-fit h-fit"	
		>
			<div    
				className={cn(
					`	flex flex-col min-w-[280px] max-w-[280px] px-4 pt-1
						pb-4 gap-y-4 z-10 bg-muted rounded-lg border
						border-muted-foreground cursor-auto transition-all `, { 
							"z-50 opacity-0": isDragging,
							"shadow-black shadow": overlay,
				})}
				style={{ height: `${numF}px` }}
			>
				<div {...listeners} 
					className={cn(`w-full h-6 flex flex-row items-center justify-between cursor-grab 
						active:cursor-grabbing rounded-lg`, {
						"cursor-grabbing": overlay,
					})}>
					<div />
					<GripHorizontal color="#6b7280"/>
						<div className={cn(`flex flex-col self-end justify-center items-center h-full w-fit`)}>
							<Trash2 
								size={16} 
								className="place-self-center self-center text-muted-foreground hover:text-foreground hover:cursor-pointer"
								onClick={()=>deleteColumn(column)}
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
						column={column}
						setTriggerUpdate={setTriggerUpdate}
						setTasks={setTasks}
						setUpdating={setUpdating}
					/>
				</div>
				{<SortableContext items={tasksIds || []}>
					{tasks?.map(task => (
						<Task 
							key={task.id}
							setTasks={setTasks}
							task={task}
							column={column}
							setTriggerUpdate={setTriggerUpdate}
							setUpdating={setUpdating}
						/>
					))}
				</SortableContext>}
			</div>
		</div>
	)
}

