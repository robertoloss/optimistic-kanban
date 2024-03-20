import { cn } from "@/app/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@prisma/client";

type Props = {
	task: Task
	column?: Column 
	overlay?: boolean
}

export default function Task({ task, column, overlay } : Props) {
	const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id ,
    data: {
      type: "Task",
      task,
			columnId: column?.title!
    },
		animateLayoutChanges: () => true,
		 transition: {
			duration: 200, // milliseconds
			easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
		},
  });

	const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };



	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}
			className={cn(
				`	flex flex-col w-full h-[80px] min-h-4 bg-gray-300 font-normal font-sans 
					rounded-sm p-4 text-gray-900 z-50 active:shadow-black active:shadow text-sm transition-transform`,
				{ 'opacity-0': isDragging,
					'shadow-black shadow opacity-85': overlay }
			)}
			onClick={(e)=>{
				e.stopPropagation()
			}}
			onMouseDown={(e)=>{
				e.stopPropagation()
			}}
		>
			<h1>Pos: {task.position} Col: {task.columnId}</h1>
			<h1>{task.content}</h1>
		</div>
	)
}
