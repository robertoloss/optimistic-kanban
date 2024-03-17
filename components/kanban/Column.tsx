import { cn } from "@/app/utils/cn"
import { ColumnType } from "./types"
import { useMemo } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { Task as TaskPrismaType } from "@prisma/client"
import Task from "./Task"
import { UniqueIdentifier } from "@dnd-kit/core"

type Props = {
	column: ColumnType
	tasks: TaskPrismaType[] | undefined
	overlay?: boolean
}
export default function Column({ column, tasks, overlay } : Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: column.id,
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
  
 // const style = {
 //   transform: CSS.Transform.toString(transform),
 //   transition,
 // };

	const style = useMemo(() => {
			return {
					...(isDragging ? { transform: CSS.Translate.toString(transform) } : null),
					transition,
			}
	}, [isDragging, transform, transition])

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}  
			className={cn(
				`flex flex-col w-full max-w-[240px] min-w-[200px] p-4 gap-y-4 z-10 h-[400px] bg-gray-700
				 rounded-lg`,
				{ 
					"border-4 z-50 border-yellow-200 bg-transparent": isDragging,
					"shadow-black shadow": overlay,
				}
			)}
			
		>
			{!isDragging && <SortableContext items={tasksIds || []}>
				{tasks?.map(task => (
					<Task key={task.id} task={task} column={column}/>
				))}
			</SortableContext>}
		</div>
	)
}
