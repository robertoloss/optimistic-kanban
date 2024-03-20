import { cn } from "@/app/utils/cn"
import { useMemo } from "react"
import { SortableContext, useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { Column, Task as TaskPrisma} from "@prisma/client"
import Task from "./Task"
import { UniqueIdentifier } from "@dnd-kit/core"

type Props = {
	column: Column
	overlay?: boolean
	tasks?: TaskPrisma[]
}
export default function Column({ column, overlay, tasks } : Props) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: column.title!,
		data: {
      type: "Column",
      column,
    },
		animateLayoutChanges: () => true,
		transition: {
			duration: 0,
			easing: 'ease'
		}
	});

	const sortedTasks = tasks?.sort((a,b) => (a.position || 0) - (b.position || 0))

	const tasksIds = useMemo(() => sortedTasks?.map(t => (t.id as unknown) as UniqueIdentifier), [tasks])
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}  
			className={cn(
				`flex flex-col w-full max-w-[240px] min-w-[200px] p-4 gap-y-4 z-10 h-[400px] bg-gray-700
				 rounded-lg`,
				{ "z-50 opacity-35": isDragging,
					"shadow-black shadow": overlay, }
			)}
		>
			{column.title}
			{<SortableContext items={tasksIds || []}>
				{tasks?.map(task => (
					<Task key={task.id} task={task} column={column}/>
				))}
			</SortableContext>}
		</div>
	)
}




	//const style = useMemo(() => {
	//		return {
	//				...(isDragging ? { transform: CSS.Translate.toString(transform) } : null),
	//				transition,
	//		}
	//}, [isDragging, transform, transition])

