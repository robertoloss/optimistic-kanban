import { Store } from "@/utils/store/useStore";
import { UniqueIdentifier } from "@dnd-kit/core";
import { Task } from "@prisma/client";

type Props = {
	activeId: UniqueIdentifier,
	overId: UniqueIdentifier,
	store: Store,
	setStore: (store: Store) => void
}
export default function updateTaskOverTask({ activeId, overId, store, setStore } : Props) {
	setTimeout(() => { 
			let newTasks : Task[] = []
			if (store.tasks) {
				const task1 = store.tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === activeId)[0];
				const task2 = store.tasks.filter((t) => (t.id as unknown) as UniqueIdentifier === overId)[0];
				const [id1, col1, position1] = [task1.id, task1.columnId, task1.position]
				const [_id2, col2, position2] = [task2.id, task2.columnId, task2.position]
				newTasks = store.tasks.map(t => {
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
				setStore({ 
					...store, 
					tasks: newTasks, 
					log: "updateTaskOverTask"
				})
			}
	}, 0)
}
