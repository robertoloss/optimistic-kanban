import { Project } from '@prisma/client'
import { create } from 'zustand'

type Store = {
  project: Project | null
  setProject: (project:Project) => void
}
export const useProject = create<Store>()((set) => ({
  project: null,
  setProject: (project: Project) => set((_state) => ({ project: project })),
}))

