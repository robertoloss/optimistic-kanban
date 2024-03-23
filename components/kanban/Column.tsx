import { cn } from "@/app/utils/cn"
import { useState } from "react"
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
	const [showTaskEditor, setShowTaskEditor] = useState(false)
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

  async function createTask() {

	}





	return (
		<div ref={setNodeRef} style={style} {...attributes}   
			className={cn(
				`flex flex-col min-w-[280px] max-w-[280px]  px-4 py-4 gap-y-4 z-10 h-[400px] bg-gray-700
				 rounded-lg border-2 border-gray-700 cursor-auto`, { 
					"z-50 opacity-35": isDragging,
					"shadow-black shadow": overlay, 
		})}>
			<div {...listeners} 
				className={cn(`bg-gray-800 w-full h-6 cursor-grab active:cursor-grabbing rounded-lg`, {
					"cursor-grabbing": overlay,
				})}/>
			<div className="flex flex-row w-full justify-between">
				<div className="flex flex-row gap-x-2 items-center text-sm font-semibold">
					<h1 className="text-sm bg-gray-500 w-fit px-2 py-1 rounded">
					 {column.title}
					</h1>
					<h1 className="">{tasks?.length}</h1>
				</div>
				<div className="flex flex-col h-6 rounded-full w-6 bg-green-600"
				onClick={()=>setShowTaskEditor(true)}>
				</div>
			</div>
			{showTaskEditor && 
				<div className="flex flex-col px-2 py-1 gap-y-2 justify-between w-full rounded h-fit min-h-[56px] bg-orange-500"
					onClick={(e)=>e.stopPropagation()}>
					<textarea className="text-black" onFocus={(e)=>e.stopPropagation()}/>
					<div className="flex flex-row justify-end gap-x-2">
						<h1 className="self-end text-sm" onClick={createTask}>
							Create	
						</h1>
						<h1 className="self-end text-sm" onClick={()=>setShowTaskEditor(false)}>
							Cancel
						</h1>
					</div>
				</div>
			}
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

