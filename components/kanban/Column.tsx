import { cn } from "@/app/utils/cn"
import { Dispatch, SetStateAction, useMemo } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { Column, Task as TaskPrisma} from "@prisma/client"
import Task from "./Task"
import { UniqueIdentifier } from "@dnd-kit/core"
import { GripHorizontal } from "lucide-react"
import AddATask from "./AddATask"

type Props = {
	column: Column
	overlay?: boolean
	tasks?: TaskPrisma[]
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
}
export default function Column({ column, overlay, tasks, setTriggerUpdate } : Props) {
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
								:	480
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

	return (
		<div ref={setNodeRef} style={style} {...attributes} 
			className="flex flex-col w-fit h-fit"	
		>
			<div    
				className={cn(
					`	flex flex-col min-w-[280px] max-w-[280px] px-4 pt-1
						pb-4 gap-y-4 z-10 bg-muted rounded-lg border-2
						border-secondary cursor-auto transition-all `, { 
							"z-50 opacity-35": isDragging,
							"shadow-black shadow": overlay,
				})}
				style={{ height: `${numF}px` }}
			>
				<div {...listeners} 
					className={cn(`w-full h-6 flex flex-row justify-center cursor-grab active:cursor-grabbing rounded-lg`, {
						"cursor-grabbing": overlay,
					})}>
					<GripHorizontal color="#6b7280"/>
				</div>
				<div className="flex flex-row w-full justify-between">
					<div className="flex flex-row gap-x-2 items-center text-sm font-medium">
						<h1 className="text-sm bg-secondary w-fit px-2 py-1 rounded">
						 {column.title}
						</h1>
						<h1 className="">{tasks?.length}</h1>
					</div>
					<AddATask column={column} setTriggerUpdate={setTriggerUpdate} />
				</div>
				{<SortableContext items={tasksIds || []}>
					{tasks?.map(task => (
						<Task 
							key={task.id}
							task={task}
							column={column}
							setTriggerUpdate={setTriggerUpdate}
						/>
					))}
				</SortableContext>}
			</div>
		</div>
	)
}

