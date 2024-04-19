import { Dispatch, SetStateAction, useOptimistic } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";

type Props = {
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>			
	projects: Project[] | null
}
export function SiderbarContent({ hover, setHover, projects } : Props) {
	const [ optimisticProjects, updateOptimisticProjects ] = useOptimistic(projects, 
		(state, {action, project, id}: {action: string, project?: Project, id?: string}) => {
			switch (action) {
				case "create":
					return project && state ? [...state, project] : state || []
				case "delete":
					return id && state ? state.filter(p => p.id != id) : state || []
				default:
					return state
			}
	})

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
				{optimisticProjects?.map(project => (
					<SidebarButton 
						hover={hover}
						key={project.id}
						project={project}
						updateOptimisticProjects={updateOptimisticProjects}
					/>
				))}
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					hover={hover}
					setHover={setHover}
					updateOptimisticProjects={updateOptimisticProjects}
				/>
			</div>
		</div>
	)
}
