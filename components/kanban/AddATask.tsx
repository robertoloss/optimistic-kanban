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
import { supabase } from "./Kanban"
import { Button } from "../ui/button"

type Props = {
	column: Column
	setTriggerUpdate: Dispatch<SetStateAction<boolean>>
	setTasks: Dispatch<SetStateAction<Task[] | null>>
}
export default function AddATask({ column, setTriggerUpdate, setTasks } : Props) {
	const [open, setOpen] = useState(false)

	async function createTask(data: FormData) {
		const newTask = {
				id: 9999,
				title: data.get('title') as string,
				content: data.get('content') as string,
				columnId: column.title as string,
				created_at: new Date(), 
				position: -1 
			}
			setTasks((t) => {
				if (t) return [...t, newTask]
				else return [newTask]
			})
			try {
			await supabase.rpc(
				'update_position_for_column', 
				{ column_id_value: column.title }
			)
			await supabase.from('Task')
				.insert([
					{
						title: data.get('title'),
						content: data.get('content'),
						columnId: column.title,
						position: 0 
					}
				])
			setTriggerUpdate(prev => !prev)
		} catch(error) {
			console.error(error)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger>
				<div className="flex flex-col h-6 hover:cursor-pointer rounded-full w-6">
					<CirclePlus color="#6b7280" />
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
