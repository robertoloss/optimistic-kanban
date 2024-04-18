import { Dispatch, SetStateAction } from "react";
import AddAProject from "./kanban/AddAProject";
import SidebarButton from "./SidebarButton";
import { Project } from "@prisma/client";

type Props = {
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>			
	projects: Project[] | null
}
export function SiderbarContent({ hover, setHover, projects } : Props) {

	return (
		<div className="flex flex-col gap-y-2">
			<div className="flex flex-col gap-y-2">
				{projects?.map(project => (
					<SidebarButton 
						hover={hover}
						key={project.id}
						project={project}
					/>
				))}
			</div>
			<div className="flex flex-row justify-end w-full ">
				<AddAProject 
					hover={hover}
					setHover={setHover}
				/>
			</div>
		</div>
	)
}
