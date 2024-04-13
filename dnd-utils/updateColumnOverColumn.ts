import { UniqueIdentifier } from "@dnd-kit/core";
import { Column } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

type Props = {
	setColumns: Dispatch<SetStateAction<Column[] | null>>
	activeId: UniqueIdentifier
	overId: UniqueIdentifier
}
export default function updateColumnOverColumn({ setColumns, activeId, overId	} : Props) {
	setTimeout(() => 
		setColumns((columns) => {
			const activeColumn = columns?.filter((col) => col.title === activeId)[0];
			const overColumn = columns?.filter((col) => col.title === overId)[0];
			if (columns && activeColumn != undefined && overColumn != undefined) {
				const res = columns.map(col => {
					if (col.title === activeId) return {...overColumn, position: activeColumn.position}
					if (col.title === overId) return {...activeColumn, position: overColumn.position};
					return col
				})	
				return res
			} else return [] 
	}), 0)
}
