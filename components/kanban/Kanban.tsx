'use client'
import { useChangeProject } from "@/utils/store/useChangeProject"
import { useEffect, useState } from "react"
import { ProjNumCols } from "@/app/kanban/[id]/page"
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
import { supaFetchAllCols, supaFetchAllTasks } from "@/utils/supabase/queries"
import { useParams } from "next/navigation"

type Props = {
	projNumCols: ProjNumCols | null
	projectArray: Project[] | null
	colsInit: Column[] | null
	tasksInit: Task[] | null
}
export default function Kanban({  projNumCols, projectArray, colsInit, tasksInit } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const [columns, setColumns] = useState<Column[] | null>(colsInit);
	const [tasks, setTasks] = useState<Task[] | null>(tasksInit);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [triggerUpdate, setTriggerUpdate] = useState(false)
	const [updating, setUpdating] = useState(false)
	const [count, setCount] = useState(0)
	const { loading, setLoading, numCols } = useChangeProject(state => state)

	const params : {id: string} = useParams()
	const projectId = params.id

	const columnsIds =  columns?.filter(col => col.project === projectId)
		.sort((a,b) => a.position! - b.position! )
		.map(column => column.title as UniqueIdentifier)

	const currentColumns = columns?.filter(col => col.project === projectId)
		.sort((a,b) => a.position! - b.position!)

	useEffect(()=>{
		async function fetchColsAndTasks() {
			const columns = await supaFetchAllCols();
			columns && setColumns(columns)
			const tasks = await supaFetchAllTasks();
			tasks && setTasks(tasks)
		}
		if (loading) {
			setLoading(false)	
		} 
		if (count > 0) {
			fetchColsAndTasks()
		}
		setUpdating(false)
		setCount(prev => prev < 10000 ? prev + 1 : 10)
	},[ triggerUpdate ])


	return (
		<div className="flex flex-col w-full h-full items-start">
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
									const columnTasks = tasks?.filter(t => t.columnId === column.title)
									return (
										<ColumnComp 
											projectId={projectId}
											key={column.id}
											setTasks={setTasks}
											column={column}
											tasks={columnTasks}
											setUpdating={setUpdating}
											setTriggerUpdate={setTriggerUpdate}
											setColumns={setColumns}
										/>
								)})}
								</SortableContext> 
								<AddAColumn 
									setColumns={setColumns} 
									numOfCols={columns?.length} 
									setTriggerUpdate={setTriggerUpdate}
									setUpdating={setUpdating}
									projectId={projectId}
								/>
							</>
						: Array.isArray(projectArray) || loading ? 
							!loading ? (projNumCols && Object.keys(projNumCols).length > 0 ?
									<LoadingColumns numOfCols={projNumCols[projectId]}/> 
								: <LoadingColumns numOfCols={1}/>)
							: numCols && numCols > 0 ? 
								<LoadingColumns numOfCols={numCols}/>
								: <AddAColumn 
										setColumns={setColumns} 
										numOfCols={columns?.length} 
										setTriggerUpdate={setTriggerUpdate}
										setUpdating={setUpdating}
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
