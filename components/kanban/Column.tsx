import Task from "./Task"
import { cn } from "@/app/utils/cn"
import { ColumnType, TaskType } from "./types"
import { useMemo } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'

type Props = {
	column: ColumnType
	tasks: TaskType[]
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
	const tasksIds = useMemo(() => tasks.map(t => t.id), [tasks])
  
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
			{!isDragging && <SortableContext items={tasksIds}>
				{tasks.map(task => (
					<Task key={task.id} task={task} column={column}/>
				))}
			</SortableContext>}
		</div>
	)
}
