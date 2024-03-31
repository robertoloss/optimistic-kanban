import { Project } from "@prisma/client"

type Props = {
	projects: Project[]
}
export default function Sidebar({ projects }: Props) {

	return (
		<div className="hidden md:flex flex-col p-4 ">
			<div className={`
				flex flex-col h-full min-w-[80px] max-w-[80px] lg:min-w-[180px] lg:w-[240px] bg-layout rounded-xl p-4
				border dark:border-none
			`}>
				{projects && projects.map(project => (
					<p>{project.title}</p>
				))}
			</div>
		</div>
	)
}
