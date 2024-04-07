import AuthButton from "@/components/AuthButton";
import Sidebar from "@/components/Sidebar";
import { createClient } from "@/utils/supabase/server";
import { Project } from "@prisma/client";
import { redirect } from "next/navigation";
import { actionFetchAllProjects, actionFetchCols } from "../actions/actions";
import { ProjNumCols } from "./[id]/page";

export const dynamic = 'force-dynamic'  

type Props = {
  children: React.ReactNode;
}
async function getNumberOfColumns() : Promise<ProjNumCols> {
	["getNumberOfColumns"]
	const projects = await actionFetchAllProjects()
	const projNumCols : ProjNumCols = {}
	if (projects) {
		for (let i=0; i<projects?.length; i++) {
			const projectId = projects[i].id
			console.log(projectId)
			const columns = await actionFetchCols({ projectId })
			if (columns) {
				projNumCols[projectId] = columns.length
			}
		}
	}
	return projNumCols
}

export default async function KanbanLayout({ children }: Props ) {
	const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { return redirect("/login") }

	async function getProjects() {
		["getProjects"]
		const { data }  = await supabase.from('Project')
			.select('*')
		//console.log(JSON.stringify(data))
		return data
	}

	const projNumCols = await getNumberOfColumns()
	
	const projects : Project[] | null = await getProjects() || [] 
	//console.log("Projects found: ", projects)

  return (
		<div className="flex flex-col w-screen h-screen overflow-hidden">
			<div className="w-full px-4 pt-4">
				<nav className="w-full flex bg-layout justify-end rounded-xl h-16 border dark:border-none">
					<div className="w-fit max-w-4xl flex justify-between items-center p-3 text-sm">
						<AuthButton />
					</div>
				</nav>
			</div>
			<div className="flex flex-row justify-between w-full h-full pb-4 overflow-hidden">
				<div className={`
					hidden sm:grid sm:grid-cols-[116px] hover:grid-cols-[240px] transition-all
					xl:grid-cols-[240px]
				`}>
					<Sidebar projects={projects} projNumCols={projNumCols}/>
				</div>
				<div className=" w-full overflow-auto h-full">
					{ children }
				</div>
			</div>
		</div>
  );
}
