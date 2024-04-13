import { Column, Task } from '@prisma/client'
import { create } from 'zustand'

type Store = {
	tasks: Task[] | null,
	columns: Column[] | null,
	setTasks: (tasks: Task[]) => void,
	setColumns: (columns: Column[]) => void
}
export const useTasksAndCols = create<Store>()((set) => ({
  tasks: null,
	columns: null,
	setTasks: (tasks: Task[]) => set(() => ({ tasks: tasks })),
	setColumns: (columns: Column[]) => set(() => ({ columns: columns }))
}))
