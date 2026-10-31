"use client"

import { useState } from "react"
import { LayoutDashboard, Plus, Sparkles } from "lucide-react"

import ProjectForm from "@/components/ProjectForm"
import { ProjectsPanel } from "@/components/dashboard/ProjectsPanel"
import { SettingsPanel } from "@/components/dashboard/SettingsPanel"
import { SummaryPanel } from "@/components/dashboard/SummaryPanel"
import { TeamPanel } from "@/components/dashboard/TeamPanel"
import { TasksTable } from "@/components/TaskTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardProvider, useDashboard } from "@/context/dashboard-context"

export default function DashboardPage() {
  return <DashboardProvider><DashboardWorkspace /></DashboardProvider>
}

function DashboardWorkspace() {
  const { settings } = useDashboard()
  const [activeTab, setActiveTab] = useState("overview")
  const [projectFormOpen, setProjectFormOpen] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-start gap-4">
            <div className="hidden rounded-2xl bg-white/10 p-3 ring-1 ring-white/15 sm:block"><LayoutDashboard className="size-7 text-cyan-300" /></div>
            <div><Badge className="mb-3 border-cyan-400/30 bg-cyan-400/10 text-cyan-200"><Sparkles data-icon="inline-start" />Workspace profesional</Badge><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{settings.workspaceName}</h1><p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">Gestiona proyectos, integrantes y tareas desde una única fuente de datos.</p></div>
          </div>
          <Button size="lg" className="bg-indigo-500 text-white hover:bg-indigo-400" onClick={() => setProjectFormOpen(true)}><Plus data-icon="inline-start" />Nuevo proyecto</Button>
        </div>
      </header>

      <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${settings.compactView ? "py-5" : "py-8"}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 gap-1 rounded-xl bg-slate-200/70 p-1 group-data-horizontal/tabs:h-auto md:grid-cols-5 dark:bg-slate-900">
            <TabsTrigger className="h-auto py-2" value="overview">Resumen</TabsTrigger><TabsTrigger className="h-auto py-2" value="projects">Proyectos</TabsTrigger><TabsTrigger className="h-auto py-2" value="tasks">Tareas</TabsTrigger><TabsTrigger className="h-auto py-2" value="team">Equipo</TabsTrigger><TabsTrigger className="h-auto py-2" value="settings">Configuración</TabsTrigger>
          </TabsList>
          <div className={settings.compactView ? "mt-4" : "mt-7"}>
            <TabsContent value="overview"><SummaryPanel /></TabsContent>
            <TabsContent value="projects"><ProjectsPanel /></TabsContent>
            <TabsContent value="tasks"><TasksTable /></TabsContent>
            <TabsContent value="team"><TeamPanel /></TabsContent>
            <TabsContent value="settings"><SettingsPanel /></TabsContent>
          </div>
        </Tabs>
      </div>

      <ProjectForm key={projectFormOpen ? "new-project-open" : "new-project-closed"} open={projectFormOpen} onOpenChange={setProjectFormOpen} />
    </main>
  )
}
