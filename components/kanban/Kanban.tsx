'use client'
import { useEffect, useState } from "react"
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable"
import ColumnComp from "./Column"
import { DndContext, useSensors, useSensor, UniqueIdentifier, MouseSensor, TouchSensor } from "@dnd-kit/core"
import dragStartHandler from "@/dnd-utils/dragStartHandler"
import dragEndHandler from "@/dnd-utils/dragEndHandler"
import dragOverHandler from "@/dnd-utils/dragOverHandler"
import DragOverlayComponent from "./DragOverlayComponent"
import { Column, Task } from "@prisma/client"
import AddAColumn from "./AddAColumn"
import { minHeigtColumn } from "./Column"
import LoadingColumns from "./LoadingColumns"
import { supaFetchAllCols, supaFetchAllProjects, supaFetchAllTasks } from "@/utils/supabase/queries"
import { useParams } from "next/navigation"
import { useStore } from "@/utils/store/useStore"
import { cn } from "@/lib/utils"

export type ProjNumCols = {
	[projectId: string] : number
}
export default function Kanban() {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const { store, setStore} = useStore(state => state)
	const [activeColumn, setActiveColumn] = useState<Column | null>(null)
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const { loading, numCols, triggerUpdate, updating } = store

	const params : {id: string} = useParams()
	const projectId = store.selectedProjectId === "" 
										? params.id
										: store.selectedProjectId != params.id
											? store.selectedProjectId
											: params.id

	const columnsIds =  store.columns?.filter(col => col.project === projectId)
		.sort((a,b) => a.position! - b.position! )
		.map(column => column.id as UniqueIdentifier)
	const currentColumns = store.columns?.filter(col => col.project === projectId)
		.sort((a,b) => a.position! - b.position!)

	useEffect(()=>{
		console.log("useEffect")
		async function fetchColsAndTasks() {
			console.log("FETCHING STUFF")
			const columns = await supaFetchAllCols();
			const tasks = await supaFetchAllTasks()
			//const projects = await supaFetchAllProjects()
			if (columns && tasks ) {
				setStore({
					...store,
					columns,
					tasks,
				//	projects,
					loading: false,
					updating: false,
					deleting: false,
					triggerUpdate: false,
					log: "Kanban-setColTaskProj"
				})
			}
		}
		if (
			store.formerProjectId === store.selectedProjectId || 
			(!store.columns || !store.tasks || !store.projects)
		) fetchColsAndTasks();
		setStore({
			...store, 
			loading: false,
			updating: false,
			triggerUpdate: false,
			deleting: false,
			log: "Kanban"
		})	
	},[ triggerUpdate ])
	
	///console.log("params: ", params.id)
	//console.log("log: ", store.log)
	console.log("deleting: ", store.deleting)

	return (
		<div className="flex flex-col w-full h-full items-start ">
			<div className="flex flex-row w-full justify-between">
				<div className={cn("text-lg font-semibold ml-4 mt-4 min-h-8", {
					"text-muted-foreground": !store.project || !store.project.title 
					})}>
						{ store.project?.title || "Home"}
					</div>
				{/*<div className="h-6 mb-2 p-2">{updating && <p>Saving...</p>}</div>*/}
			</div>
				<DndContext
					id="list"
					sensors={sensors}
					onDragStart={dragStartHandler({ setActiveColumn, setActiveTask })}
					onDragEnd={dragEndHandler({
						setActiveColumn, setActiveTask, setStore, store,
						tasks: store.tasks, columns: store.columns
					})}
					onDragOver={dragOverHandler({ setStore, store })}
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
						(!loading && columnsIds && params.id === store.selectedProjectId) || true && columnsIds? 
							<>
								<SortableContext 
									items={columnsIds}
									strategy={horizontalListSortingStrategy}
								>
								{currentColumns?.map(column => {
									const columnTasks = store.tasks?.filter(t => t.columnId === column.id)
									return (
										<ColumnComp 
											projectId={projectId}
											key={column.id}
											column={column}
											tasks={columnTasks}
										/>
								)})}
								</SortableContext> 
								<AddAColumn 
									numOfCols={store.columns?.length} 
									projectId={projectId}
								/>
							</>
						: (
								store.projects?.length != undefined || 
								loading || 
								!store.tasks
							) 
							&& params.id != 'home'
						? 
							<LoadingColumns numOfCols={numCols}/>
							: store.projects?.length === 0 || params.id === 'home'?
								<AddAColumn 
									numOfCols={store.columns?.length} 
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
					/>
				</DndContext>
		</div>
	)
}
