import { UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "@prisma/client";

type Props = {
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier,
	tasks: Task[] | null,
	setTasks: (tasks: Task[]) => void,
}
export default function updateTaskOverTask({ activeId, overId, tasks, setTasks } : Props) {
	//setTimeout(() => {
		let newTasks : Task[] = []
		if (tasks) {
			const task1 = tasks.filter((t) => t.id === activeId)[0];
			const task2 = tasks.filter((t) => t.id === overId)[0];
		
			const [id1, col1, position1] = [task1.id, task1.columnId, task1.position]
			const [_id2, col2, position2] = [task2.id, task2.columnId, task2.position]
			newTasks = tasks.map(t => {
				return {
					...t,
					columnId: t.id === id1 ? col2 : t.columnId,
					position: 
						col1 === col2 ?  
							position1! < position2! ? 
								(t.position! > position1! && t.position! <= position2! && t.id != id1 && t.columnId === col2) ? 
									t.position! - 1
									: t.id === id1 ? 
											position2 
											: t.position 
										: (t.position! >= position2! && t.id != id1 && t.columnId === col2) ?
									t.position! + 1
										: t.id === id1 ? 
											position2 
											: t.position
							: (t.position! >= position2! && t.id != id1 && t.columnId == col2) ?
								t.position! + 1 
								:	t.id === id1 ? 
									position2 
									: t.position
			}})
			console.log("task over task!")
			setTasks(newTasks)
		}
	//}, 0)
}
