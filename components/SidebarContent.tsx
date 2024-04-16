import { Dispatch, SetStateAction, useOptimistic } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { useStore } from "@/utils/store/useStore";
import { Project, Task } from "@prisma/client";

type Props = {
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>			
	projects: Project[] | null
}
export function SiderbarContent({ hover, setHover, projects } : Props) {
	const [ optimisticProjects, setOptimisticProjects ] = useOptimistic(projects, 
		( state, { action, project, id } :
		{ action: string, project?: Project, id?: string}) => {
			switch (action) {
				case "create":
				 return (project && state) ? [...state, project] : state ? state : project ? [ project ] : []
				case "delete":
				 return (state && id) ? state.filter(p => p.id != id) : state ? state : []
				default:
					return state
			}
		})

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
				{optimisticProjects?.sort((a,b) => Number(a.created_at.getTime) - Number(b.created_at.getTime)).map(project => (
					<SidebarButton 
						hover={hover}
						key={project.id}
						project={project}
						setOptimisticProjects={setOptimisticProjects}
					/>
				))}
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					hover={hover}
					setHover={setHover}
					setOptimisticProjects={setOptimisticProjects}
				/>
			</div>
		</div>
	)
}
