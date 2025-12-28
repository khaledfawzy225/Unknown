import { create } from 'zustand'
import type { Project, Task, Risk, Issue, ChangeRequest, Milestone, Deliverable } from '../types'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  tasks: Task[]
  risks: Risk[]
  issues: Issue[]
  changeRequests: ChangeRequest[]
  milestones: Milestone[]
  deliverables: Deliverable[]

  // Filters
  projectFilters: {
    region: string
    customer: string
    pm: string
    type: string
    stage: string
    status: string
  }

  // Actions
  setCurrentProject: (project: Project | null) => void
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, newStatus: Task['status']) => void

  setRisks: (risks: Risk[]) => void
  addRisk: (risk: Risk) => void
  updateRisk: (id: string, updates: Partial<Risk>) => void

  setIssues: (issues: Issue[]) => void
  addIssue: (issue: Issue) => void
  updateIssue: (id: string, updates: Partial<Issue>) => void

  setChangeRequests: (changes: ChangeRequest[]) => void
  addChangeRequest: (change: ChangeRequest) => void
  updateChangeRequest: (id: string, updates: Partial<ChangeRequest>) => void

  setMilestones: (milestones: Milestone[]) => void
  addMilestone: (milestone: Milestone) => void
  updateMilestone: (id: string, updates: Partial<Milestone>) => void

  setDeliverables: (deliverables: Deliverable[]) => void
  addDeliverable: (deliverable: Deliverable) => void
  updateDeliverable: (id: string, updates: Partial<Deliverable>) => void

  setProjectFilters: (filters: Partial<ProjectState['projectFilters']>) => void
  resetFilters: () => void
}

const defaultFilters = {
  region: '',
  customer: '',
  pm: '',
  type: '',
  stage: '',
  status: '',
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  risks: [],
  issues: [],
  changeRequests: [],
  milestones: [],
  deliverables: [],
  projectFilters: defaultFilters,

  setCurrentProject: (project) => set({ currentProject: project }),

  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProject:
        state.currentProject?.id === id
          ? { ...state.currentProject, ...updates }
          : state.currentProject,
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  moveTask: (id, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)),
    })),

  setRisks: (risks) => set({ risks }),
  addRisk: (risk) => set((state) => ({ risks: [...state.risks, risk] })),
  updateRisk: (id, updates) =>
    set((state) => ({
      risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
    })),

  setIssues: (issues) => set({ issues }),
  addIssue: (issue) => set((state) => ({ issues: [...state.issues, issue] })),
  updateIssue: (id, updates) =>
    set((state) => ({
      issues: state.issues.map((i) => (i.id === id ? { ...i, ...updates } : i)),
    })),

  setChangeRequests: (changeRequests) => set({ changeRequests }),
  addChangeRequest: (change) =>
    set((state) => ({ changeRequests: [...state.changeRequests, change] })),
  updateChangeRequest: (id, updates) =>
    set((state) => ({
      changeRequests: state.changeRequests.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  setMilestones: (milestones) => set({ milestones }),
  addMilestone: (milestone) => set((state) => ({ milestones: [...state.milestones, milestone] })),
  updateMilestone: (id, updates) =>
    set((state) => ({
      milestones: state.milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    })),

  setDeliverables: (deliverables) => set({ deliverables }),
  addDeliverable: (deliverable) =>
    set((state) => ({ deliverables: [...state.deliverables, deliverable] })),
  updateDeliverable: (id, updates) =>
    set((state) => ({
      deliverables: state.deliverables.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    })),

  setProjectFilters: (filters) =>
    set((state) => ({ projectFilters: { ...state.projectFilters, ...filters } })),
  resetFilters: () => set({ projectFilters: defaultFilters }),
}))
