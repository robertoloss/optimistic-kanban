'use client'
import { useEffect, useState } from "react"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import ColumnComp from "./Column"
import { DndContext, useSensors, PointerSensor, useSensor, UniqueIdentifier } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-utils/dragStartHandler"
import dragEndHandler from "@/dnd-utils/dragEndHandler"
import dragOverHandler from "@/dnd-utils/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
import { Column, Task } from "@prisma/client"
import { createClient } from "@/utils/supabase/client"

export const supabase = createClient()
export type optimisticProps = {
	action?: string,
	task?: Task
}
export default function Kanban() {
	const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 }})
	)
	const [columns, setColumns] = useState<Column[] | null>(null);
	const [tasks, setTasks] = useState<Task[] | null>(null);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [triggerUpdate, setTriggerUpdate] = useState(false)
	const [updating, setUpdating] = useState(false)

	const columnsIds =  columns?.map(column => column.title as UniqueIdentifier)
	
	async function supaFetchCols() {
		let { data }  = await supabase
			.from('Column')
			.select('*')
		if (data) {
			const res : Column[] = [...data]
			return res
		}
	}
	async function supaFetchTasks() {
		let { data }  = await supabase
			.from('Task')
			.select('*')
		if (data) {
			const res : Task[] = [...data]
			return res
		}
	}
	useEffect(()=>{
		console.log("useEffect")
		async function fetchColsAndTasks() {
			const columns = await supaFetchCols();
			columns && setColumns(columns)
			const tasks = await supaFetchTasks();
			tasks && setTasks(tasks)
		}
		fetchColsAndTasks()
		setUpdating(false)
	},[triggerUpdate])

	//console.log("tasks: ", tasks)

	return (
		<div className="flex flex-col w-full h-full items-center overscroll-none">
			<h1 className="h-6 mb-2">{updating && <p>Saving...</p>}</h1>
			<div className="flex flex-row overflow-x-auto gap-y-8 w-full justify-center gap-x-4 overflow-y-hidden"
				style={{ 
					scrollbarWidth: 'thin', 
					scrollbarColor: 'dark-gray black' 
				}}
			>
				<DndContext
					id="list"
					sensors={sensors}
					onDragStart={dragStartHandler({ setActiveColumn, setActiveTask })}
					onDragEnd={dragEndHandler({
						setActiveColumn, setActiveTask, tasks, columns, setUpdating, setTriggerUpdate
					})}
					onDragOver={dragOverHandler({ setTasks, setColumns })}
				>
					{columnsIds && 
						<SortableContext 
							items={columnsIds}
							strategy={horizontalListSortingStrategy}
						>
							{columns && columns.map(column => {
								const columnTasks = tasks?.filter(t => t.columnId === column.title)
								return <ColumnComp 
									key={column.id}
									setTasks={setTasks}
									column={column}
									tasks={columnTasks}
									setTriggerUpdate={setTriggerUpdate}
								/>
							})}
						</SortableContext>
					}
					<DragOverlayComponent 
						activeColumn={activeColumn}
						activeTask={activeTask}
						tasks={tasks}
						setTasks={setTasks}
						columns={columns}
						setTriggerUpdate={setTriggerUpdate}
					/>
				</DndContext>
			</div>
		</div>
	)
}
