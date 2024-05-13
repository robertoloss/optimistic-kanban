import { Column, Project, Task } from '@prisma/client'
import { create } from 'zustand'

export type Store = {
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
	home: boolean
}
type UseStore = {
	store: Store,
	setStore: (change: Store) => void
}
export const useStore = create<UseStore>()((set) => ({
  store: {
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
		home: true,
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

