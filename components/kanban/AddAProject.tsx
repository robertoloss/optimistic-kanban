import { actionCreateProject } from "@/app/actions/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
	DialogOverlay
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { Dispatch, SetStateAction, useState, useTransition } from "react";
import { UpdateOptimisticProjects } from "../SidebarContent";

type Props = {
	updateOptimisticProjects: UpdateOptimisticProjects
	hover: boolean
	setHover: Dispatch<SetStateAction<boolean>>
}
export default function AddAProject({ updateOptimisticProjects, setHover } : Props) {
	const [open, setOpen] = useState(false)
	const [_isPending, startTransition] = useTransition()

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
					console.log("click")
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
								startTransition(()=>updateOptimisticProjects({
									action: "create",
									title,
								}))
								title && actionCreateProject({ title })
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
								onClick={()=>setOpen(false)}
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
