import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Task } from "@prisma/client"
import { Button } from "../ui/button"
import { useState } from "react"
import AlertComponent from "./AlertComponent"
import { useStore } from "@/utils/store/useStore"
import { supaFetchAllTasks, supaUpdateTask } from "@/utils/supabase/queries"

type Props = {
	children: React.ReactNode
	task: Task
	action: () => void
}
export default function({ children, task, action } : Props) {
	const [ edit, setEdit	] = useState(false)
	const { store, setStore }  = useStore(s=>s)

	async function updateTask(data: FormData) {
		//console.log("updateTask:", data)
		setEdit(false)
		const newTitle = data.get('title') as string
		const newContent = data.get('content') as string
		//console.log("title, content: ", newTitle, newContent)
		const updateTask = {
			...task,
			id: 'update',
			title: newTitle,
			content: newContent,
		}
		setStore({
			...store,
			tasks: store.tasks ? [...store.tasks.filter(t=>t.id!=task.id), updateTask] : [updateTask],
			log: "updateTask before",
			optimisticUpdate: true
		}) 
		await supaUpdateTask({ newTitle, newContent, taskId: task.id })
		const newTasks = await supaFetchAllTasks()
		setTimeout(() => setStore({
			...store,
			tasks: newTasks || store.tasks || [], 
			log: "updateTask after supa",
			optimisticUpdate: false
		}), 100) 
	}


	return (
		<div className="flex flex-col w-full h-full self-center justify-center">
			<Dialog onOpenChange={()=>setEdit(false)}>
				<DialogTrigger disabled={store.optimisticUpdate} >
					{ children }
				</DialogTrigger>
				<DialogContent >
					<form 
						action={(data: FormData)=>updateTask(data)}
						className="flex flex-col  min-h-[216px] justify-between items-start"
					>
					<DialogHeader className="h-full w-full">
						<div
							className="flex flex-col gap-y-4 w-full"
						>
							<DialogTitle className="mt-4 text-md font-semibold w-full h-fit">
								{!edit && 
									<p className="p-2 font-medium">
										{task.title}
									</p>
								}
								{edit && 
									<input
										name="title"
										className="bg-muted rounded-lg p-2 w-full font-medium"
										defaultValue={task.title || ""}
									/>
								}
							</DialogTitle>
							{!edit && <DialogDescription className="w-full p-2">
										{task.content}
							</DialogDescription>}
							{edit && 
								<DialogDescription className="w-full h-full text-foreground">
									<textarea
										name="content"
										defaultValue={task.content || ""}
										rows={3}
										className="border-0 w-full bg-muted rounded-lg p-2 resize-none"
										maxLength={400}
								/>
								</DialogDescription>
							}
						</div>
					</DialogHeader>
					<div className="h-4"/>
					<DialogFooter className="flex flex-row w-full justify-end gap-4">
						<div className="flex flex-row w-full justify-end gap-4 items-center">
							{!edit && 
								<AlertComponent
									title="Delete a Task"
									content="Are you sure you want to delete this task? This action cannot be undone"
									action={action}
								>
									<div className={`
										flex flex-row justify-center items-center w-16 h-6 py-4 bg-destructive 
										justify-self-center self-center rounded-md text-sm 
										hover:brightness-110 transition text-center 
									`}>
										Delete
									</div>
								</AlertComponent>
							}
							{!edit && <Button 
								className={`w-16 h-6 py-4 hover:brightness-110 transition`} 
								variant="secondary"
								onClick={(e) => {
									e.preventDefault()
									setEdit(true)
								}}
							>
								Edit
							</Button>}
							{edit && <Button 
								className={`w-16 h-6 py-4 hover:brightness-110 transition`} 
								variant="secondary"
								type="submit"
							>
								Save
							</Button>}
							{edit && (
								<Button
									className="w-16 h-6 py-4 hover:brightness-110 transition"
									variant="outline" onClick={()=> setEdit(false)}>
									Cancel
								</Button>
							)}
						</div>
					</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}
