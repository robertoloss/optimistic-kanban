import { Column, Project, Task } from '@prisma/client'
import { create } from 'zustand'

export type Store = {
	loading: boolean
	numCols: number
	selectedProjectId: string
	formerProjectId: string | undefined
	project: Project | null
	tasks: Task[] | null
	columns: Column[] | null
	projects: Project[] | null
	triggerUpdate: boolean
	updating: boolean
	log: string
	revalidateProjects: boolean
	deleting: boolean
}
type UseStore = {
	store: Store,
	setStore: (change: Store) => void
}
export const useStore = create<UseStore>()((set) => ({
  store: {
		loading: false,
		numCols: 3,
		selectedProjectId: "",
		formerProjectId: "",
		project: null,
		tasks: null,
		columns: null,
		projects: null,
		triggerUpdate: false,
		updating: false,
		log: "[empty]",
		revalidateProjects: false,
		deleting: false,
	},
	setStore: (c: Store) => set(() => ({ store: c }))
}))
