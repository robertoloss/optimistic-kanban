'use client'
import { useChangeProject } from "@/utils/store/useChangeProject"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import ColumnComp from "./Column"
import { DndContext, useSensors, useSensor, UniqueIdentifier, MouseSensor, TouchSensor } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-utils/dragStartHandler"
import dragEndHandler from "@/dnd-utils/dragEndHandler"
import dragOverHandler from "@/dnd-utils/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
import { Column, Project, Task } from "@prisma/client"
import AddAColumn from "./AddAColumn"
import { minHeigtColumn } from "./Column"
import LoadingColumns from "./LoadingColumns"
import { useParams } from "next/navigation"
import { useTasksAndCols } from "@/utils/store/useTasksAndCols"

type Props = {
	projectArray: Project[] | null
	colsInit: Column[] | null
	tasksInit: Task[] | null
}
export default function Kanban({ projectArray, colsInit, tasksInit } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [triggerUpdate, setTriggerUpdate] = useState(false)
	const { loading, setLoading } = useChangeProject(state => state)
	const { setTasks, setColumns, tasks, columns } = useTasksAndCols(s => s)

	const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
		tasksInit, 
		(state, {action, tasks, newTask, id } : { action: string, tasks?: Task[], newTask?: Task, id?: string}) => {
			switch (action) {
				case "update":
					return tasks ? [...tasks] : []
				case "add":
					return newTask && state ? [...state, newTask] : []
				case "delete":
					return state && id ? state.filter(t => t.id != id) : []
				default:
					return null
			}
		}
	)
	const [optimisticColumns, updateOptimisticColumns] = useOptimistic(
		colsInit, 
		(state, {action, cols, newCol, id } : { action: string, cols?: Column[], newCol?: Column, id?: string}) => {
			switch (action) {
				case "update":
					return cols ? [...cols] : []
				case "add":
					return []
				case "delete":
					return null
				default:
					return null
			}
		}
	)
	const [isPending, startTransition] = useTransition()

	const params : {id: string} = useParams()
	const projectId = params.id

	const columnsIds =  optimisticColumns?.filter(col => col.project === projectId)
		.sort((a,b) => a.position! - b.position! )
		.map(column => column.id)

	const currentColumns = optimisticColumns?.filter(col => col.project === projectId)
		.sort((a,b) => a.position! - b.position!)

	useEffect(()=>{
		console.log("useEffect")
		if (tasksInit) setTasks(tasksInit)
		if (colsInit) setColumns(colsInit)
		if (loading) setLoading(false)
	},[ triggerUpdate ])

	console.log("tasks in Kanban: ", tasks)


	return (
		<div className="flex flex-col w-full h-full items-start">
			<div className="h-6 mb-2 p-2 text-muted-foreground">{isPending && <p>Saving...</p>}</div>
				<DndContext
					id="list"
					sensors={sensors}
					onDragStart={dragStartHandler({ setActiveColumn, setActiveTask })}
					onDragEnd={dragEndHandler({
						setActiveColumn, setActiveTask, 
						tasks, columns, updateOptimisticTasks, 
						startTransition, updateOptimisticColumns
					})}
					onDragOver={dragOverHandler({ 
						tasks,
						columns,
						setTasks,
						setColumns
					})}
				>
					<div className={`flex flex-row flex-shrink w-full px-4 h-full items-start   
						justify-start gap-x-4 overflow-x-auto py-8`}
						style={{ 
							scrollbarWidth: 'thin', 
							scrollbarColor: 'dark-gray black', 
							minHeight: `${minHeigtColumn}px`
						}}
					>
					{
						!loading && columnsIds ? 
						<>
							<SortableContext 
								items={columnsIds}
								strategy={horizontalListSortingStrategy}
							>
							{currentColumns?.map(column => {
								const columnTasks = optimisticTasks?.filter(t => t.columnId === column.id)
								return (
									<ColumnComp 
										projectId={projectId}
										key={column.id}
										updateOptimisticTasks={updateOptimisticTasks}	
										column={column}
										tasks={columnTasks}
										setTriggerUpdate={setTriggerUpdate}
									/>
							)})}
							</SortableContext> 
							<AddAColumn 
								numOfCols={currentColumns?.length} 
								setTriggerUpdate={setTriggerUpdate}
								projectId={projectId}
							/>
						</>
						: Array.isArray(projectArray) || loading ? 
							loading ? <LoadingColumns numOfCols={4}/>
							: <AddAColumn 
									numOfCols={currentColumns?.length} 
									setTriggerUpdate={setTriggerUpdate}
									projectId={projectId}
								/>
						: <div className="flex flex-row w-[400px]">
								Nothing found
							</div>
					}
					<div className="flex flex-row w-full" />
					</div>	
					<DragOverlayComponent 
						projectId={projectId}
						activeColumn={activeColumn}
						activeTask={activeTask}
						tasks={optimisticTasks}
						updateOptimisticTasks={updateOptimisticTasks}
						columns={optimisticColumns}
						setTriggerUpdate={setTriggerUpdate}
					/>
				</DndContext>
		</div>
	)
}
