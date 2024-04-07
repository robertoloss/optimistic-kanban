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
import ModalAddAColumn from "./ModalAddAColumn"
import { minHeigtColumn } from "./Column"
import LoadingColumns from "./LoadingColumns"
import { supaFetchCols, supaFetchProjects, supaFetchTasks } from "@/utils/supabase/queries"
import { useParams } from "next/navigation"
import { PacmanLoader } from "react-spinners"

type Props = {
	projNumCols: ProjNumCols | null
	projectArray: Project[] | null
}
export default function Kanban({  projNumCols, projectArray } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const [columns, setColumns] = useState<Column[] | null>(null);
	const [tasks, setTasks] = useState<Task[] | null>(null);
	//const [projectArray, setProjectArray] = useState<Project[] | null>([]);
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [triggerUpdate, setTriggerUpdate] = useState(false)
	const [updating, setUpdating] = useState(false)
	const columnsIds =  columns?.
		sort((a,b) => a.position! - b.position! )
		.map(column => column.title as UniqueIdentifier)
	const { loading, setLoading, numCols } = useChangeProject(state => state)

	const params : {id: string} = useParams()
	const projectId = params.id

	useEffect(()=>{
		console.log("useEffect")
		if (loading) setLoading(false)	
		async function fetchColsAndTasks() {
			const columns = await supaFetchCols(projectId);
			columns && setColumns(columns)
			const tasks = await supaFetchTasks(projectId);
			tasks && setTasks(tasks)
			//const projectData = await supaFetchProjects(projectId)
			//if (projectData) {
			//	setProjectArray(projectData)
			//} else {
			//	setProjectArray(null)
			//}
		}
		fetchColsAndTasks()
		setUpdating(false)
	},[
		triggerUpdate, 
		//projectId
	])
	console.log("kanban")	
	

	return (
		<div className="flex flex-col w-full h-full items-start">
			<div className="h-6 mb-2 p-2">{updating && <p>Saving...</p>}</div>
			{/* <div className="h-6 mb-2 p-2">{loading && <p>Loading...</p>}</div> */}
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
								{columns?.map(column => {
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
								<ModalAddAColumn 
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
								: <div className="flex flex-col w-[200%] h-full items-center justify-center">
										<PacmanLoader color="var(--muted-foreground)" />
									</div>
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
