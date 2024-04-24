import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
	DialogOverlay
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, startTransition, useState } from "react";
import { Project } from "@prisma/client";
import { useDrawerStore, useHoverStore, useStore } from "@/utils/store/useStore";
import { supabase } from "@/utils/supabase/queries";
import { useRouter } from "next/navigation";
import { actionCreateProject } from "@/app/actions/actions";


type Props = {
	updateOptimisticProjects: (action: {
		action: any;
		project?: any;
		id?: any;
	}) => void
	setDndProjects: Dispatch<SetStateAction< Project[] | null>>
}
export default function AddAProject({ updateOptimisticProjects, setDndProjects } : Props) {
	const { setHover } = useHoverStore(s=>s)
	const [open, setOpen] = useState(false)
	const { store, setStore } = useStore(s=>s) 
	const { setIsOpen } = useDrawerStore(s=>s)
	const router = useRouter()

	async function createNewProject(title: string) {
		const { data: { user } } = await supabase.auth.getUser()
		const dummyProject : Project = {
			id: `dummy_${Math.floor((Math.random() * 100))}`,
			created_at: new Date,
			title,
			owner: user?.id || null,
			position: 99 // change this
		}
		setDndProjects(prev => prev ? [...prev, dummyProject] : [ dummyProject ])
		//startTransition(() => updateOptimisticProjects({
		//	action: "create",
		//	project: dummyProject
		//}))
		setStore({
			...store,
			loading: true,
			project: dummyProject,
			log: "createNewProject before"
		})
		setIsOpen(false)
		const newProject = await actionCreateProject({ title })
		console.log("newProject: ", newProject)
		setStore({
			...store,
			loading: false,
			project: newProject || null,
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
