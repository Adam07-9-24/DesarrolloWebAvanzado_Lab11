"use client"

import { useMemo, useState } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Eye, FolderKanban, Pencil, Search, Trash2, Users } from "lucide-react"

import ProjectForm from "@/components/ProjectForm"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { useDashboard } from "@/context/dashboard-context"
import type { Project, ProjectStatus } from "@/types/dashboard"

const statusClasses: Record<ProjectStatus, string> = {
  Planificación: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
  "En progreso": "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  "En pausa": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Completado: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
}

export function ProjectsPanel() {
  const { projects, members, tasks, deleteProject } = useDashboard()
  const [search, setSearch] = useState("")
  const [details, setDetails] = useState<Project | null>(null)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query
      ? projects.filter((project) => `${project.name} ${project.description} ${project.category}`.toLowerCase().includes(query))
      : projects
  }, [projects, search])

  const confirmDelete = async () => {
    if (!deleting || isDeleting) return
    setIsDeleting(true)
    await deleteProject(deleting.id)
    setIsDeleting(false)
    setDeleting(null)
    setDetails(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Portafolio de proyectos</h2><p className="text-sm text-muted-foreground">Administra asignaciones, progreso y tareas relacionadas.</p></div>
        <div className="relative w-full sm:max-w-xs"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar proyectos..." className="pl-9" /></div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center gap-3 py-14 text-center"><FolderKanban className="size-10 text-muted-foreground" /><div><p className="font-medium">No se encontraron proyectos</p><p className="text-sm text-muted-foreground">Prueba con otro término de búsqueda.</p></div></CardContent></Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => {
            const assigned = members.filter((member) => member.projectId === project.id).length
            return (
              <Card key={project.id} className="border-slate-200/80 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3"><div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"><FolderKanban className="size-5" /></div><Badge variant="secondary" className={statusClasses[project.status]}>{project.status}</Badge></div>
                  <CardTitle className="mt-3 text-lg">{project.name}</CardTitle><CardDescription className="line-clamp-2 min-h-10">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Progreso</span><span className="font-medium">{project.progress}%</span></div><Progress value={project.progress} className="h-2 [&_[data-slot=progress-indicator]]:bg-indigo-600" /><div className="flex items-center justify-between text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><Users className="size-4" />{assigned} integrantes</span><span>{project.priority}</span></div></CardContent>
                <CardFooter className="justify-between"><Button variant="ghost" size="sm" onClick={() => setEditing(project)}><Pencil data-icon="inline-start" />Editar</Button><Button variant="outline" size="sm" onClick={() => setDetails(project)}><Eye data-icon="inline-start" />Ver detalles</Button></CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <ProjectForm key={editing?.id ?? "no-project"} open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} project={editing} />

      <Dialog open={details !== null} onOpenChange={(open) => !open && setDetails(null)}>
        <DialogContent className="sm:max-w-2xl">
          {details && (() => {
            const assignedMembers = members.filter((member) => member.projectId === details.id)
            const relatedTasks = tasks.filter((task) => task.projectId === details.id)
            return <><DialogHeader><DialogTitle>{details.name}</DialogTitle><DialogDescription>{details.description}</DialogDescription></DialogHeader><div className="grid gap-4 py-3 sm:grid-cols-2"><Info label="Categoría" value={details.category} /><Info label="Prioridad" value={details.priority} /><Info label="Estado" value={details.status} /><Info label="Creado" value={format(parseISO(details.createdAt), "PPP", { locale: es })} /></div><div className="space-y-2"><div className="flex justify-between text-sm"><span>Progreso</span><strong>{details.progress}%</strong></div><Progress value={details.progress} className="h-2 [&_[data-slot=progress-indicator]]:bg-indigo-600" /></div><div className="grid gap-4 pt-2 sm:grid-cols-2"><div><h4 className="mb-2 text-sm font-semibold">Integrantes ({assignedMembers.length})</h4><div className="space-y-1 text-sm text-muted-foreground">{assignedMembers.length ? assignedMembers.map((member) => <p key={member.userId}>{member.name} · {member.position}</p>) : <p>Sin integrantes asignados.</p>}</div></div><div><h4 className="mb-2 text-sm font-semibold">Tareas ({relatedTasks.length})</h4><div className="space-y-1 text-sm text-muted-foreground">{relatedTasks.length ? relatedTasks.slice(0, 4).map((task) => <p key={task.id}>{task.description}</p>) : <p>Sin tareas relacionadas.</p>}</div></div></div><DialogFooter className="gap-2"><Button variant="destructive" onClick={() => setDeleting(details)}><Trash2 data-icon="inline-start" />Eliminar</Button><Button variant="outline" onClick={() => { setDetails(null); setEditing(details) }}><Pencil data-icon="inline-start" />Editar</Button></DialogFooter></>
          })()}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && !isDeleting && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar {deleting?.name}?</AlertDialogTitle><AlertDialogDescription>Se eliminarán también todas sus tareas. Los integrantes asignados quedarán disponibles sin proyecto principal.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel><Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>{isDeleting && <Spinner data-icon="inline-start" />}Eliminar proyecto</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border bg-slate-50 p-3 dark:bg-slate-900"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>
}
