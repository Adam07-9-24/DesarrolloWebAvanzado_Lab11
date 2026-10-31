export const PROJECT_CATEGORIES = [
  "Desarrollo Web",
  "Desarrollo Mobile",
  "Diseño",
  "Marketing",
  "Otro",
] as const

export const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"] as const
export const PROJECT_STATUSES = ["Planificación", "En progreso", "En pausa", "Completado"] as const
export const TASK_STATUSES = ["Pendiente", "En progreso", "En revisión", "Completado"] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]
export type Priority = (typeof PRIORITIES)[number]
export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type TaskStatus = (typeof TASK_STATUSES)[number]

export interface Project {
  id: string
  name: string
  description: string
  category: ProjectCategory
  priority: Priority
  status: ProjectStatus
  progress: number
  createdAt: string
}

export type ProjectInput = Omit<Project, "id" | "createdAt">

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string | null
  isActive: boolean
}

export type TeamMemberInput = Omit<TeamMember, "userId">

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string | null
  deadline: string
}

export type TaskInput = Omit<Task, "id">

export interface ActivityItem {
  id: string
  description: string
  createdAt: string
}

export interface WorkspaceSettings {
  workspaceName: string
  contactEmail: string
  notifications: boolean
  theme: "light" | "dark" | "system"
  compactView: boolean
  language: "es" | "en"
}
