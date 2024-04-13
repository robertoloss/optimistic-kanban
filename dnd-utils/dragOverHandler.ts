import { DragOverEvent } from "@dnd-kit/core";
import updateTaskOverTask from "./updateTaskOverTask";
import updateTaskOverColumn from "./updateTaskOverColumn";
import updateColumnOverColumn from "./updateColumnOverColumn";
import { Store } from "@/utils/store/useStore";

type Props = {
	setStore: (store: Store) => void
	store: Store
}
export default function dragOverHandler({ setStore, store } : Props) {
	return (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;
		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";
		const isActiveAColumn = active.data.current?.type === "Column";
		const isOverAColumn = over.data.current?.type === "Column";

		if (isActiveATask && isOverATask) {
			updateTaskOverTask({activeId, overId, setStore, store })
		}
		if (isActiveATask && isOverAColumn) {
			updateTaskOverColumn({activeId, over, setStore, store })
		}
		if (isActiveAColumn && isActiveAColumn) {
			updateColumnOverColumn({setStore, store, activeId, overId})
		}
	}
}



