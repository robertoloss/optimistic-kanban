'use client'
import { useState } from "react"
import { SiderbarContent } from "./SidebarContent"
import { Project } from "@prisma/client"

type Props = {
	projects: Project[] | null
}
export default function Sidebar({ projects } : Props) {
	const [ hover, setHover ] = useState(false)

	return (
		<div 
			className="flex-col p-4 w-full"
			onMouseEnter={()=>setHover(true)}
			onMouseLeave={()=>setHover(false)}
		>
			<div className={`flex flex-col h-full w-full bg-layout rounded-xl p-4 border dark:border-none `}>
				<SiderbarContent 
					hover={hover}
					setHover={setHover}
					projects={projects}
				/>
			</div>
		</div>
	)
}
