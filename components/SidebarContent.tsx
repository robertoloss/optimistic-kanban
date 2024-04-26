import {memo, useEffect, useState } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { DndContext, DragOverEvent, MouseSensor, TouchSensor, UniqueIdentifier, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToParentElement, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { actionUpdateProjects } from "@/app/actions/actions";

type Props = {
	projects: Project[] | null
	drawer?: boolean
}
export const SiderbarContent = memo(function({ projects, drawer } : Props) {
	const sensors = useSensors( 
		useSensor(MouseSensor),
		useSensor(TouchSensor),
	)
	const [ dndProjects, setDndProjects ] = useState<Project[] | null>(projects)
	useEffect(() => {
		setDndProjects(projects)
	}, [projects])

	const projectsIds = dndProjects?.
		sort((a,b) => a.position - b.position).
		map(p => p.id as UniqueIdentifier)

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
			<DndContext
				sensors={sensors}
				id="projects"
				modifiers={[restrictToVerticalAxis, restrictToParentElement]}
				onDragEnd={(event) => { 
					const { active, over } = event
					setDndProjects(prev => {
						const activeProject = prev?.find(p => p.id === active.id)	
						const overProject = prev?.find(p => p.id === over?.id)
						if (activeProject && overProject && prev) {
							const oldIndex = prev?.indexOf(activeProject);
							const newIndex = prev?.indexOf(overProject);
							
							const tmpArray = arrayMove(prev, oldIndex, newIndex);
							const newArray = tmpArray.map((p, i) => {
								return {...p, position: i}
							})
							setTimeout(() => actionUpdateProjects(newArray), 0)
							return newArray
						}
						return prev
					})
				}}
			>
				{projectsIds && 
					<SortableContext items={projectsIds}>
						{dndProjects?.sort((a,b) => a.position - b.position).map(project => (
							<SidebarButton 
								key={project.id}
								project={project}
								drawer={drawer}
								setDndProjects={setDndProjects}
							/>
						))}
					</SortableContext>
				}
			</DndContext>
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					setDndProjects={setDndProjects}
				/>
			</div>
		</div>
	)
})

