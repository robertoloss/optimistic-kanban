import {memo, startTransition, useOptimistic } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DndContext, DragOverEvent, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { actionUpdateProjects } from "@/app/actions/actions";
import { useRef } from "react";

type Props = {
	projects: Project[] | null
	drawer?: boolean
}
export const SiderbarContent = memo(function({ projects, drawer } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const refProjects = useRef<Project[] | null>(projects)
	const [ optimisticProjects, updateOptimisticProjects ] = useOptimistic(projects?.map(p => ({...p, id: p.id as UniqueIdentifier})), 
		(state, {action, project, id, newProjects} : 
		{action: string, project?: Project, id?: string, newProjects?: Project[]}) => {
			switch (action) {
				case "create":
					return project && state ? [...state, project] : state || []
				case "delete":
					return id && state ? state.filter(p => p.id != id) : state || []
				case "update":
					return  newProjects || []
				default:
					console.log("DEFAULT")
					return state
			}
	})
	console.log("refProjects: ", refProjects.current)

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
			<DndContext
				sensors={sensors}
				id="projects"
				onDragStart={() => refProjects.current = projects}
				onDragEnd={() => {
					if (refProjects.current ) {
						setTimeout(() => {
							startTransition(() => updateOptimisticProjects({
								action: "update",
								newProjects: refProjects.current || []
							}))
						}, 0)
							actionUpdateProjects(refProjects.current || [])
					}
				}}
				onDragOver={(event: DragOverEvent)=>{
					const {active, over} = event;
					if (active.id !== over?.id && refProjects.current && over) {
						console.log("\n\nProj before: ", refProjects.current)
						const activePos = refProjects
							.current
							.filter(p => p.id === active.id)
							.at(0)
							?.position || 0
						const overPos = refProjects
							.current
							.filter(p => p.id === over.id)
							.at(0)
							?.position || 0
						console.log("active, over: ", activePos, overPos)
						refProjects.current = refProjects
							.current
							.map(p => {
								if (![active.id, over.id].includes(p.id)) return p
								if (p.id === active.id) return {...p, position: overPos}
								return {...p, position: activePos}
							})
						console.log("Proj after: ", refProjects.current)
					}
				}}
				modifiers={[restrictToVerticalAxis]}
			>
			<SortableContext
				items={projects?.sort((a,b) => a.position - b.position).map(p => p.id as UniqueIdentifier) || []}
				strategy={verticalListSortingStrategy}
			>
				{optimisticProjects?.sort((a,b) => a.position - b.position).map(project => (
					<SidebarButton 
						key={project.id}
						project={project}
						updateOptimisticProjects={updateOptimisticProjects}
						drawer={drawer}
					/>
				))}
				</SortableContext>
				</DndContext>
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					updateOptimisticProjects={updateOptimisticProjects}
				/>
			</div>
		</div>
	)
})

