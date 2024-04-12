import { create } from 'zustand'

type Store = {
	loading: boolean
	numCols: number
	selectedProjectId: string
	setLoading: (b: boolean) => void
	setNumCols: (s: number) => void
	setSelectedProjectId: (s: string) => void
}
export const useChangeProject = create<Store>()((set) => ({
  loading: false,
	numCols: 4,
	selectedProjectId: "",
  setLoading: (b: boolean) => set(() => ({ loading: b })),
	setNumCols: (n: number) => set(() => ({ numCols: n})),
	setSelectedProjectId: (s: string) => set(() => ({ selectedProjectId: s}))
}))
