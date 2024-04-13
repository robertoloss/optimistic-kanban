import { cn } from "@/app/utils/cn";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@prisma/client";
import { GripVertical, Trash2 } from "lucide-react";
import { supaDeleteTask, supaFetchAllTasks } from "@/utils/supabase/queries";
import { useStore } from "@/utils/store/useStore";

type Props = {
	task: Task
	column?: Column 
	overlay?: boolean
}
export default function Task({ task, column, overlay } : Props) {
	const { store, setStore } = useStore(s => s)
	const { setNodeRef, attributes, listeners, transform, transition, isDragging,
  } = useSortable({
    id: task.id ,
    data: {
      type: "Task",
      task,
			columnId: column?.id!
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

	async function deleteTask(task: Task) {
		setStore({
			...store,
			tasks: store.tasks?.filter(t => t.id != task.id) || [],
			updating: true,
			log: "deleteTask"
		})
		await supaDeleteTask(task)
		const newTasks = await supaFetchAllTasks()
		setTimeout(() => setStore({
			...store,
			tasks: newTasks || store.tasks || [],
			updating: false,
			log: "deleteTask"
		}), 100)
	}

	return (
		<div className="p-[2px]" style={style} {...attributes}>
		<div ref={setNodeRef} 
			className={cn(
				`	flex flex-row gap-y-1  justify-between w-full min-h-[80px] max-h-[80px] bg-task font-normal font-sans  
					rounded-lg pr-2 py-2 text-background z-50 shadow shadow-gray-500 active:shadow-black 
					active:shadow text-sm transition-transform dark:border dark:border-gray-900 
					dark:shadow-none`, { 
						'opacity-0': isDragging,
						'shadow-black shadow opacity-85 -m-[2px] size-[101.7%]': overlay, 
			})}
		>
			<div {...listeners}
				className={cn(`flex flex-col justify-center h-[64px] cursor-grab active:grabbing`, {
					'h-[64px] cursor-grabbing': overlay,
				})} >
				<GripVertical  
					className="text-muted-foreground hover:text-pure"
					strokeWidth={2}
					size={16}
				/>
			</div>
			<div className="flex flex-col px-2 py-1 w-full items-start text-foreground dark:text-background ">
				<h1 className="font-semibold">{task.title}</h1>
				<h1 className="text-md leading-[16px]">{task.content}</h1>
			</div>
			<div className={cn(`flex flex-col self-start justify-start h-fit w-fit`)}>
				<Trash2 
					size={16} 
					className="text-muted-foreground hover:text-black dark:hover:text-pure "
					onClick={()=>deleteTask(task)}
				/>
			</div>
		</div>
		</div>
	)
}
