import { ColumnType, TaskType } from "./types"
import { cn } from "@/app/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
	task: TaskType
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
    id: task.id,
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
				{'opacity-35': isDragging }
			)}
			onClick={(e)=>{
				console.log(("Hi"))
				e.stopPropagation()
			}}
			onMouseDown={(e)=>e.stopPropagation()}
		>
			{task.content}
		</div>
	)
}
