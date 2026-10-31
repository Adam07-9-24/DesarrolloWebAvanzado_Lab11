"use client"

import { useEffect, useState } from "react"
import { formatDistance } from "date-fns"
import { es } from "date-fns/locale"
import { Activity, CheckCircle2, FolderKanban, Gauge, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDashboard } from "@/context/dashboard-context"
import { TASK_STATUSES } from "@/types/dashboard"

const distributionColors = ["bg-slate-500", "bg-blue-600", "bg-amber-500", "bg-teal-500"]
const distributionProgressColors = [
  "[&_[data-slot=progress-indicator]]:bg-slate-500",
  "[&_[data-slot=progress-indicator]]:bg-blue-600",
  "[&_[data-slot=progress-indicator]]:bg-amber-500",
  "[&_[data-slot=progress-indicator]]:bg-teal-500",
]

export function SummaryPanel() {
  const { metrics, tasks, activity } = useDashboard()
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    const updateClock = () => setNow(new Date())
    const initialTimer = window.setTimeout(updateClock, 0)
    const interval = window.setInterval(updateClock, 60_000)
    return () => {
      window.clearTimeout(initialTimer)
      window.clearInterval(interval)
    }
  }, [])
  const stats = [
    { label: "Total proyectos", value: metrics.totalProjects, icon: FolderKanban, description: "Proyectos registrados", color: "bg-indigo-50 text-indigo-700" },
    { label: "Tareas completadas", value: metrics.completedTasks, icon: CheckCircle2, description: `${tasks.length} tareas totales`, color: "bg-teal-50 text-teal-700" },
    { label: "Integrantes activos", value: metrics.activeMembers, icon: Users, description: "Disponibles para asignación", color: "bg-cyan-50 text-cyan-700" },
    { label: "Progreso promedio", value: `${metrics.averageProgress}%`, icon: Gauge, description: "Promedio del portafolio", color: "bg-blue-50 text-blue-700" },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-slate-200/80">
              <CardHeader className="flex-row items-center justify-between">
                <div><CardDescription>{stat.label}</CardDescription><CardTitle className="mt-2 text-3xl">{stat.value}</CardTitle></div>
                <div className={`rounded-xl p-3 ${stat.color}`}><Icon className="size-5" /></div>
              </CardHeader>
              <CardContent><p className="text-xs text-muted-foreground">{stat.description}</p></CardContent>
            </Card>
          )
        })}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <Card>
          <CardHeader><CardTitle>Distribución de tareas</CardTitle><CardDescription>Estado actual de la carga de trabajo.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            {TASK_STATUSES.map((status, index) => {
              const count = tasks.filter((task) => task.status === status).length
              const percentage = tasks.length ? Math.round(count / tasks.length * 100) : 0
              return (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${distributionColors[index]}`} />{status}</span>
                    <strong>{count} · {percentage}%</strong>
                  </div>
                  <Progress value={percentage} className={`h-2 ${distributionProgressColors[index]}`} />
                </div>
              )
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b"><CardTitle className="flex items-center gap-2"><Activity className="size-5 text-indigo-600" />Actividad reciente</CardTitle><CardDescription>Operaciones realizadas durante la sesión.</CardDescription></CardHeader>
          <CardContent className="divide-y">
            {activity.length ? activity.slice(0, 8).map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-4 first:pt-0 last:pb-0">
                <span className="mt-1.5 size-2 rounded-full bg-teal-500" />
                <div className="min-w-0 flex-1"><p className="text-sm">{item.description}</p><p className="mt-1 text-xs text-muted-foreground">{now ? formatDistance(new Date(item.createdAt), now, { addSuffix: true, locale: es }) : "Actividad reciente"}</p></div>
              </div>
            )) : <div className="py-10 text-center"><Badge variant="outline">Sin actividad reciente</Badge></div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
