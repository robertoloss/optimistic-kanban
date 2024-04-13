import { Store } from "@/utils/store/useStore";
import { UniqueIdentifier } from "@dnd-kit/core";

type Props = {
	setStore: (store: Store) => void
	store: Store
	activeId: UniqueIdentifier
	overId: UniqueIdentifier
}
export default function updateColumnOverColumn({ setStore, store, activeId, overId	} : Props) {
	setTimeout(() => { 
		const activeColumn = store.columns?.filter((col) => col.id === activeId)[0];
		const overColumn = store.columns?.filter((col) => col.id === overId)[0];
		if (store.columns && activeColumn != undefined && overColumn != undefined) {
			const res = store.columns.map(col => {
				if (col.id === activeId) return {...overColumn, position: activeColumn.position}
				if (col.id === overId) return {...activeColumn, position: overColumn.position};
				return col
			})	
			setStore({
				...store, 
				columns: res,
				log: "updateColumnOverColumn"
			})
		}  
	}, 0)
}
