import { CirclePlus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Column, Task } from "@prisma/client"
import { Dispatch, SetStateAction, useState } from "react"
import { Button } from "../ui/button"
import { supaCreateTask, supabase } from "@/utils/supabase/queries"

type Props = {
	column: Column
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	setTasks: Dispatch<SetStateAction<Task[] | null>>
	setUpdating: Dispatch<SetStateAction<boolean>>
	projectId: string
}
export default function AddATask({ column, setTriggerUpdate, setTasks, setUpdating, projectId } : Props) {
	const [open, setOpen] = useState(false)

	async function createTask(data: FormData) {
		const { data: { user } } = await supabase.auth.getUser()
		setUpdating(true)
		const newTask = {
			id: '9999',
			title: data.get('title') as string,
			content: data.get('content') as string,
			columnId: column.title as string,
			created_at: new Date(), 
			position: -1,
			owner: user?.id ? user.id : null,
			project: projectId
		}
		setTasks((t) => {
			if (t) return [...t, newTask]
			else return [newTask]
		})
		const input = {
			title: data.get('title'),
			content: data.get('content'),
			columnId: column.title,
			position: 0, 
			project: projectId 
		}
		supaCreateTask(input, column, setTriggerUpdate)
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<div className="flex flex-col h-6 hover:cursor-pointer rounded-full w-6">
					<CirclePlus className="text-muted-foreground hover:text-black dark:hover:text-white" />
				</div>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="gap-y-8">
					<DialogTitle className="text-md font-normal">
						Add a task to the column: 
						<span className="bg-card ml-2 px-2 py-1 w-fit rounded-md border border-muted-foreground">
							{`${column.title}`}
						</span>
					</DialogTitle>
						<form 
							className="flex flex-col gap-y-4 text-foreground"
							action={(data: FormData)=>{
								setOpen(false)
								createTask(data)
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
							<div className="flex flex-col w-full ">
								Content
								<textarea 
									name="content"
									className="bg-pure rounded-md border border-muted-foreground p-2 min-h-[64px]"
									maxLength={120}
								/>
							</div>
							<Button 
								className="w-[180x] self-end"
								type="submit"
							>
									Continue
							</Button>
						</form>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}
