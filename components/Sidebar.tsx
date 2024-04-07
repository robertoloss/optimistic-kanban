'use client'
import { Project } from "@prisma/client"
import { useState } from "react"
import { SiderbarContent } from "./SidebarContent"
import { ProjNumCols } from "@/app/kanban/[id]/page"

type Props = {
	projects: Project[]
	projNumCols: ProjNumCols
}
export default function Sidebar({ projects, projNumCols }: Props) {
	const [hover, setHover] = useState(false)

	return (
		<div 
			className="flex-col p-4 w-full"
			onMouseEnter={()=>setHover(true)}
			onMouseLeave={()=>setHover(false)}
		>
			<div className={`flex flex-col h-full w-full bg-layout rounded-xl p-4 border dark:border-none `}>
				<SiderbarContent 
					hover={hover}
					projects={projects}
					setHover={setHover}
					projNumCols={projNumCols}
				/>
			</div>
		</div>
	)
}
