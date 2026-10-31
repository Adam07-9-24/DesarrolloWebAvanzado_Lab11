"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

import {
  initialActivity,
  initialMembers,
  initialProjects,
  initialSettings,
  initialTasks,
} from "@/data/dashboard-data"
import type {
  ActivityItem,
  Project,
  ProjectInput,
  Task,
  TaskInput,
  TeamMember,
  TeamMemberInput,
  WorkspaceSettings,
} from "@/types/dashboard"

const OPERATION_DELAY = 750

interface DashboardMetrics {
  totalProjects: number
  completedTasks: number
  activeMembers: number
  averageProgress: number
}

interface DashboardContextValue {
  projects: Project[]
  members: TeamMember[]
  tasks: Task[]
  activity: ActivityItem[]
  settings: WorkspaceSettings
  metrics: DashboardMetrics
  createProject: (input: ProjectInput, memberIds: string[]) => Promise<string>
  updateProject: (id: string, input: ProjectInput, memberIds: string[]) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  createMember: (input: TeamMemberInput) => Promise<string>
  updateMember: (id: string, input: TeamMemberInput) => Promise<void>
  deleteMember: (id: string) => Promise<void>
  createTask: (input: TaskInput) => Promise<string>
  updateTask: (id: string, input: TaskInput) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  saveSettings: (input: WorkspaceSettings) => Promise<void>
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

const wait = () => new Promise((resolve) => setTimeout(resolve, OPERATION_DELAY))

const createId = (prefix: string) => {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  return `${prefix}-${suffix}`
}

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(initialProjects)
  const [members, setMembers] = useState(initialMembers)
  const [tasks, setTasks] = useState(initialTasks)
  const [activity, setActivity] = useState(initialActivity)
  const [settings, setSettings] = useState(initialSettings)

  const addActivity = (description: string) => {
    setActivity((current) => [
      { id: createId("activity"), description, createdAt: new Date().toISOString() },
      ...current,
    ].slice(0, 30))
  }

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const useDark = settings.theme === "dark" || (settings.theme === "system" && prefersDark)
    document.documentElement.classList.toggle("dark", useDark)
  }, [settings.theme])

  const metrics = useMemo<DashboardMetrics>(() => {
    const averageProgress = projects.length
      ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length)
      : 0

    return {
      totalProjects: projects.length,
      completedTasks: tasks.filter((task) => task.status === "Completado").length,
      activeMembers: members.filter((member) => member.isActive).length,
      averageProgress,
    }
  }, [members, projects, tasks])

  const createProject = async (input: ProjectInput, memberIds: string[]) => {
    await wait()
    const id = createId("project")
    setProjects((current) => [
      { ...input, id, createdAt: new Date().toISOString().slice(0, 10) },
      ...current,
    ])
    setMembers((current) =>
      current.map((member) =>
        memberIds.includes(member.userId) ? { ...member, projectId: id } : member
      )
    )
    addActivity(`Se creó el proyecto ${input.name}`)
    return id
  }

  const updateProject = async (id: string, input: ProjectInput, memberIds: string[]) => {
    await wait()
    setProjects((current) =>
      current.map((project) => (project.id === id ? { ...project, ...input } : project))
    )
    setMembers((current) =>
      current.map((member) => {
        if (memberIds.includes(member.userId)) return { ...member, projectId: id }
        if (member.projectId === id) return { ...member, projectId: null }
        return member
      })
    )
    addActivity(`Se actualizó el proyecto ${input.name}`)
  }

  const deleteProject = async (id: string) => {
    await wait()
    const projectName = projects.find((project) => project.id === id)?.name ?? "Proyecto"
    setProjects((current) => current.filter((project) => project.id !== id))
    setTasks((current) => current.filter((task) => task.projectId !== id))
    setMembers((current) =>
      current.map((member) =>
        member.projectId === id ? { ...member, projectId: null } : member
      )
    )
    addActivity(`Se eliminó el proyecto ${projectName} y sus tareas relacionadas`)
  }

  const createMember = async (input: TeamMemberInput) => {
    await wait()
    if (members.some((member) => member.email.toLowerCase() === input.email.toLowerCase())) {
      throw new Error("Ya existe un integrante con ese correo.")
    }
    const userId = createId("user")
    setMembers((current) => [{ ...input, userId }, ...current])
    addActivity(`Se registró a ${input.name} en el equipo`)
    return userId
  }

  const updateMember = async (id: string, input: TeamMemberInput) => {
    await wait()
    if (
      members.some(
        (member) =>
          member.userId !== id &&
          member.email.toLowerCase() === input.email.toLowerCase()
      )
    ) {
      throw new Error("Ya existe un integrante con ese correo.")
    }
    setMembers((current) =>
      current.map((member) =>
        member.userId === id ? { ...member, ...input } : member
      )
    )
    addActivity(`Se actualizó el perfil de ${input.name}`)
  }

  const deleteMember = async (id: string) => {
    await wait()
    const memberName = members.find((member) => member.userId === id)?.name ?? "Integrante"
    setMembers((current) => current.filter((member) => member.userId !== id))
    setTasks((current) =>
      current.map((task) => (task.userId === id ? { ...task, userId: null } : task))
    )
    addActivity(`Se eliminó a ${memberName}; sus tareas quedaron sin asignar`)
  }

  const createTask = async (input: TaskInput) => {
    await wait()
    if (!projects.some((project) => project.id === input.projectId)) {
      throw new Error("Selecciona un proyecto válido.")
    }
    if (input.userId && !members.some((member) => member.userId === input.userId)) {
      throw new Error("Selecciona un integrante válido.")
    }
    const id = createId("task")
    setTasks((current) => [{ ...input, id }, ...current])
    addActivity(`Se creó la tarea ${input.description}`)
    return id
  }

  const updateTask = async (id: string, input: TaskInput) => {
    await wait()
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, ...input } : task))
    )
    addActivity(`Se actualizó la tarea ${input.description}`)
  }

  const deleteTask = async (id: string) => {
    await wait()
    const taskName = tasks.find((task) => task.id === id)?.description ?? "Tarea"
    setTasks((current) => current.filter((task) => task.id !== id))
    addActivity(`Se eliminó la tarea ${taskName}`)
  }

  const saveSettings = async (input: WorkspaceSettings) => {
    await wait()
    setSettings(input)
    addActivity("Se actualizaron las preferencias del espacio de trabajo")
  }

  return (
    <DashboardContext.Provider
      value={{
        projects,
        members,
        tasks,
        activity,
        settings,
        metrics,
        createProject,
        updateProject,
        deleteProject,
        createMember,
        updateMember,
        deleteMember,
        createTask,
        updateTask,
        deleteTask,
        saveSettings,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) throw new Error("useDashboard debe utilizarse dentro de DashboardProvider")
  return context
}
