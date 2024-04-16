import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
	DialogOverlay
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { Project } from "@prisma/client";
import { useStore } from "@/utils/store/useStore";
import { supaCreateProject, supaFetchAllProjects, supabase } from "@/utils/supabase/queries";
import { useRouter } from "next/navigation";


type Props = {
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>
}
export default function AddAProject({ setHover } : Props) {
	const [open, setOpen] = useState(false)
	const { store, setStore } = useStore(s=>s) 
	const router = useRouter()

	async function createNewProject(title: string) {
		const { data: { user } } = await supabase.auth.getUser()
		const dummyProject : Project = {
			id: "dummy",
			created_at: new Date,
			title,
			owner: user?.id || null
		}
		console.log("dummy project: ", dummyProject)
		setStore({
			...store,
			loading: true,
			updating: true,
			projects: store.projects ? [...store.projects, dummyProject] : [ dummyProject ],
			log: "createNewProject before"
		})
		const newProject = await supaCreateProject(title, user?.id || "none")
		const newProjects = await supaFetchAllProjects()
		setStore({
			...store,
			loading: false,
			updating: false,
			projects: newProjects || store.projects || [],
			log: "createNewProject after"
		})
		router.push(`/kanban/${newProject?.id || 'home'}`)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="w-full">
				<div className={`
					flex flex-row justify-center p-4 cursor-pointer rounded-lg
					border-dashed items-center text-sm border-2 border-muted-foreground
					transition hover:text-foreground select-none h-14
					w-full text-muted-foreground font-bold hover:border-foreground
				`}>
					+	
				</div>
			</DialogTrigger>
			<DialogOverlay 
				className="opacity-50"
				onClick={()=>{
					setHover(false)
				}}
			>
			<DialogContent >
				<DialogHeader className="gap-y-8">
					<DialogTitle className="text-md font-normal">
						Create a New Project:					
					</DialogTitle>
						<form 
							className="flex flex-col gap-y-4 text-foreground"
							action={(data: FormData)=>{
								const title = JSON.stringify(data.get('title')).split(`"`)[1]
								createNewProject(title)
							}}
						>
							<div className="flex flex-col w-full">
								Title
								<input 
									type="text" 
									name="title"
									className="bg-pure border border-muted-foreground rounded-md p-2"
								/>
							</div>
							<Button 
								onClick={()=>{
									setOpen(false)
								}}
								className="w-[180x] self-end"
								type="submit"
							>
									Create
							</Button>
						</form>
				</DialogHeader>
			</DialogContent>
			</DialogOverlay>
		</Dialog>
	)
}
