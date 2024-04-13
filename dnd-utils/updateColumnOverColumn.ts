import { UniqueIdentifier } from "@dnd-kit/core";
import { Column } from "@prisma/client";

type Props = {
	activeId: UniqueIdentifier
	overId: UniqueIdentifier
	columns: Column[] | null
	setColumns: (columns: Column[]) => void
}
export default function updateColumnOverColumn({ activeId, overId, columns, setColumns	} : Props) {
	//setTimeout(() => { 
		if (columns) {
			const activeColumn = columns.filter((col) => col.id === activeId)[0];
			const overColumn = columns.filter((col) => col.id === overId)[0];
			const res = columns.map(col => {
				if (col.id === activeId) return {...overColumn, position: activeColumn.position}
				if (col.id === overId) return {...activeColumn, position: overColumn.position};
				return col
			})	
			setColumns(res)
	}
	//}, 0)
}
