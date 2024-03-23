import { cn } from "@/app/utils/cn"
import { useState } from "react"
import { useMemo } from "react"
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
			duration: 200,
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
		<div ref={setNodeRef} style={style} {...attributes}   
			className={cn(
				`	flex flex-col min-w-[280px] max-w-[280px] px-4 pt-1
					pb-4 gap-y-4 z-10 h-[400px] bg-gray-700 rounded-lg border-2
					border-gray-700 cursor-auto `, { 
						"z-50 opacity-35": isDragging,
						"shadow-black shadow": overlay, 
		})}>
			<div {...listeners} 
				className={cn(`w-full h-6 flex flex-row justify-center cursor-grab active:cursor-grabbing rounded-lg`, {
					"cursor-grabbing": overlay,
				})}>
				<GripHorizontal color="#6b7280"/>
			</div>
			<div className="flex flex-row w-full justify-between">
				<div className="flex flex-row gap-x-2 items-center text-sm font-medium">
					<h1 className="text-sm bg-gray-500 w-fit px-2 py-1 rounded">
					 {column.title}
					</h1>
					<h1 className="">{tasks?.length}</h1>
				</div>
				<AddATask />
			</div>
			{<SortableContext items={tasksIds || []}>
				{tasks?.map(task => (
					<Task key={task.id} task={task} column={column}/>
				))}
			</SortableContext>}
		</div>
	)
}

