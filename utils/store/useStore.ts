import { Column, Project, Task } from '@prisma/client'
import { create } from 'zustand'

export type Store = {
	triggerUpdate: boolean,
	loading: boolean
	numCols: number
	formerProjectId: string | undefined
	project: Project | null
	tasks: Task[] | null
	columns: Column[] | null
	log: string
	deleting: boolean
	optimisticUpdate: boolean
	ignoreUseEffectSidebar: boolean
	justUpdatedColId: string
	home: boolean,
	projects: undefined | Project[] | null,
	updateOptimisticProjects: ((action: {
    action: string;
    project?: Project | undefined;
    id?: string | undefined;
    newProjects?: Project[] | undefined;
	}) => void) | null
}
type UseStore = {
	store: Store,
	setStore: (change: Store) => void
}
export const useStore = create<UseStore>()((set) => ({
  store: {
		triggerUpdate: false,
		loading: false,
		numCols: 4,
		formerProjectId: "",
		project: null,
		tasks: null,
		columns: null,
		log: "[empty]",
		deleting: false,
		optimisticUpdate: false,
		ignoreUseEffectSidebar: false,
		justUpdatedColId: "",
		home: false,
		projects: undefined,
		updateOptimisticProjects: null,
	},
	setStore: (c: Store) => set(() => ({ store: c }))
}))


export type DrawerStore = {
	isOpen: boolean,
	setIsOpen: (b: boolean) => void
}
export const useDrawerStore = create<DrawerStore>()((set) => ({
	isOpen: false,
	setIsOpen: (b:boolean) => set(() => ({isOpen: b}))
}))


export type HoverStore = {
	hover: boolean,
	setHover: (b: boolean) => void
}
export const useHoverStore = create<HoverStore>()((set) => ({
	hover: false,
	setHover: (b: boolean) => set(() => ({ hover: b}))
}))

