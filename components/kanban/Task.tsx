import { UniqueIdentifier } from "@dnd-kit/core";
import { ColumnType } from "./types"
import { cn } from "@/app/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@prisma/client";

type Props = {
	task: Task
	column: ColumnType
}

export default function Task({ task, column } : Props) {
	const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: (task.id as unknown) as UniqueIdentifier,
    data: {
      type: "Task",
      task,
			columnId: column.id
    },
		animateLayoutChanges: () => false,
		transition: {
			duration: 500,
			easing: 'ease'
		}
  });

	const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}
			className={cn(
				`flex flex-col w-full h-fit min-h-4 bg-gray-300 font-normal font-sans 
					rounded-sm p-4 text-gray-900 z-50 active:scale-105 text-sm`,
				{'opacity-0': isDragging }
			)}
			onClick={(e)=>{
				e.stopPropagation()
			}}
			onMouseDown={(e)=>e.stopPropagation()}
		>
			<h1>Pos: {task.position} Col: {task.columnId}</h1>
			<h1>{task.content}</h1>
		</div>
	)
}
