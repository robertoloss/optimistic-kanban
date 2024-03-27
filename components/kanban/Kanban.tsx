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
import ModalAddAColumn from "./ModalAddAColumn"
import { minHeigtColumn } from "./Column"
import LoadingColumns from "./LoadingColumns"
import { supaFetchCols, supaFetchTasks } from "@/utils/supabase/queries"

export default function Kanban() {
	const sensors = useSensors( useSensor(PointerSensor, { activationConstraint: { distance: 0 }}) )
	const [columns, setColumns] = useState<Column[] | null>(null);
	const [tasks, setTasks] = useState<Task[] | null>(null);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [triggerUpdate, setTriggerUpdate] = useState(false)
	const [updating, setUpdating] = useState(false)
	const columnsIds =  columns?.sort((a,b) => a.position! - b.position! ).map(column => column.title as UniqueIdentifier)

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

	return (
		<div className="flex flex-col w-full h-full items-center ">
			<div className="h-6 mb-2 p-2">{updating && <p>Saving...</p>}</div>
				<DndContext
					id="list"
					sensors={sensors}
					onDragStart={dragStartHandler({ setActiveColumn, setActiveTask })}
					onDragEnd={dragEndHandler({
						setActiveColumn, setActiveTask, tasks, columns, setUpdating, setTriggerUpdate
					})}
					onDragOver={dragOverHandler({ setTasks, setColumns })}
				>
					<div className={`flex flex-row flex-shrink w-full px-4 h-full items-center  
						justify-start gap-x-4 overflow-x-auto py-8`}
						style={{ 
							scrollbarWidth: 'thin', 
							scrollbarColor: 'dark-gray black', 
							minHeight: `${minHeigtColumn}px`
						}}
					>
					<div className="flex flex-row w-full" />
					{columnsIds ? 
					<SortableContext 
						items={columnsIds}
						strategy={horizontalListSortingStrategy}
					>
						{columns?.map(column => {
							const columnTasks = tasks?.filter(t => t.columnId === column.title)
							return (
								<ColumnComp 
									key={column.id}
									setTasks={setTasks}
									column={column}
									tasks={columnTasks}
									setUpdating={setUpdating}
									setTriggerUpdate={setTriggerUpdate}
									setColumns={setColumns}
								/>
						)})}
					</SortableContext> : <LoadingColumns />}
						{<ModalAddAColumn 
							setColumns={setColumns} 
							numOfCols={columns?.length} 
							setTriggerUpdate={setTriggerUpdate}
							setUpdating={setUpdating}
						/>}
					<div className="flex flex-row w-full" />
					</div>	
					<DragOverlayComponent 
						activeColumn={activeColumn}
						setColumns={setColumns}
						activeTask={activeTask}
						tasks={tasks}
						setTasks={setTasks}
						setUpdating={setUpdating}
						columns={columns}
						setTriggerUpdate={setTriggerUpdate}
					/>
				</DndContext>
		</div>
	)
}
