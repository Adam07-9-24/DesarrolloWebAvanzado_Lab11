"use client"

import { useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { AlertCircle, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react"

import { DatePickerField } from "@/components/dashboard/DatePickerField"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useDashboard } from "@/context/dashboard-context"
import type { Priority, Task, TaskInput, TaskStatus } from "@/types/dashboard"
import { PRIORITIES, TASK_STATUSES } from "@/types/dashboard"

const PAGE_SIZE = 5
const emptyTask: TaskInput = { description: "", projectId: "", status: "Pendiente", priority: "Media", userId: null, deadline: "" }

const statusClasses: Record<TaskStatus, string> = {
  Pendiente: "bg-slate-100 text-slate-700",
  "En progreso": "bg-blue-100 text-blue-700",
  "En revisión": "bg-amber-100 text-amber-700",
  Completado: "bg-teal-100 text-teal-700",
}
const priorityClasses: Record<Priority, string> = {
  Baja: "border-teal-200 text-teal-700",
  Media: "border-blue-200 text-blue-700",
  Alta: "border-orange-200 text-orange-700",
  Urgente: "border-red-200 text-red-700",
}

export function TasksTable() {
  const { tasks, projects, members, deleteTask } = useDashboard()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [projectFilter, setProjectFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [viewing, setViewing] = useState<Task | null>(null)
  const [deleting, setDeleting] = useState<Task | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const matchesText = task.description.toLowerCase().includes(search.trim().toLowerCase())
    return matchesText && (statusFilter === "all" || task.status === statusFilter) && (projectFilter === "all" || task.projectId === projectFilter)
  }), [projectFilter, search, statusFilter, tasks])

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageTasks = filteredTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const allPageSelected = pageTasks.length > 0 && pageTasks.every((task) => selectedIds.has(task.id))
  const somePageSelected = pageTasks.some((task) => selectedIds.has(task.id)) && !allPageSelected

  const togglePage = (checked: boolean) => setSelectedIds((current) => { const next = new Set(current); pageTasks.forEach((task) => { if (checked) next.add(task.id); else next.delete(task.id) }); return next })
  const toggleTask = (id: string, checked: boolean) => setSelectedIds((current) => { const next = new Set(current); if (checked) next.add(id); else next.delete(id); return next })

  const confirmDelete = async () => { if (!deleting || isDeleting) return; setIsDeleting(true); await deleteTask(deleting.id); setSelectedIds((current) => { const next = new Set(current); next.delete(deleting.id); return next }); setIsDeleting(false); setDeleting(null) }

  return <div className="space-y-5">
    <Card><CardHeader className="border-b"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div><CardTitle>Gestión de tareas</CardTitle><p className="mt-1 text-sm text-muted-foreground">{filteredTasks.length} registros · {selectedIds.size} seleccionados</p></div><Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus data-icon="inline-start" />Nueva tarea</Button></div><div className="mt-4 grid gap-3 md:grid-cols-3"><div className="relative"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Buscar tarea..." className="pl-9" /></div><Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1) }}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los estados</SelectItem>{TASK_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select><Select value={projectFilter} onValueChange={(value) => { setProjectFilter(value); setPage(1) }}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">Todos los proyectos</SelectItem>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></div></CardHeader>
      <CardContent className="px-0"><Table><TableHeader><TableRow><TableHead className="w-12 pl-4"><Checkbox checked={allPageSelected ? true : somePageSelected ? "indeterminate" : false} onCheckedChange={(checked) => togglePage(checked === true)} aria-label="Seleccionar página" /></TableHead><TableHead>Tarea</TableHead><TableHead>Proyecto</TableHead><TableHead>Estado</TableHead><TableHead>Prioridad</TableHead><TableHead>Asignado a</TableHead><TableHead>Fecha límite</TableHead><TableHead className="pr-4 text-right">Acciones</TableHead></TableRow></TableHeader><TableBody>{pageTasks.length ? pageTasks.map((task) => {
        const project = projects.find((item) => item.id === task.projectId)
        const member = members.find((item) => item.userId === task.userId)
        return <TableRow key={task.id} data-state={selectedIds.has(task.id) ? "selected" : undefined}><TableCell className="pl-4"><Checkbox checked={selectedIds.has(task.id)} onCheckedChange={(checked) => toggleTask(task.id, checked === true)} aria-label={`Seleccionar ${task.description}`} /></TableCell><TableCell className="min-w-56 font-medium">{task.description}</TableCell><TableCell className="min-w-44">{project?.name ?? "Proyecto eliminado"}</TableCell><TableCell><Badge variant="secondary" className={statusClasses[task.status]}>{task.status}</Badge></TableCell><TableCell><Badge variant="outline" className={priorityClasses[task.priority]}>{task.priority}</Badge></TableCell><TableCell className="min-w-36">{member?.name ?? "Sin asignar"}</TableCell><TableCell className="min-w-32">{format(parseISO(task.deadline), "dd MMM yyyy", { locale: es })}</TableCell><TableCell className="pr-4"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon-sm" aria-label="Ver tarea" onClick={() => setViewing(task)}><Eye /></Button><Button variant="ghost" size="icon-sm" aria-label="Editar tarea" onClick={() => { setEditing(task); setFormOpen(true) }}><Pencil /></Button><Button variant="destructive" size="icon-sm" aria-label="Eliminar tarea" onClick={() => setDeleting(task)}><Trash2 /></Button></div></TableCell></TableRow>
      }) : <TableRow><TableCell colSpan={8} className="h-32 text-center text-muted-foreground">No hay tareas que coincidan con los filtros.</TableCell></TableRow>}</TableBody></Table></CardContent>
    </Card>

    {filteredTasks.length > PAGE_SIZE && <Pagination><PaginationContent><PaginationItem><PaginationPrevious href="#" text="Anterior" aria-disabled={currentPage === 1} className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} onClick={(event) => { event.preventDefault(); setPage(Math.max(1, currentPage - 1)) }} /></PaginationItem>{Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <PaginationItem key={number}><PaginationLink href="#" isActive={currentPage === number} onClick={(event) => { event.preventDefault(); setPage(number) }}>{number}</PaginationLink></PaginationItem>)}<PaginationItem><PaginationNext href="#" text="Siguiente" aria-disabled={currentPage === totalPages} className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} onClick={(event) => { event.preventDefault(); setPage(Math.min(totalPages, currentPage + 1)) }} /></PaginationItem></PaginationContent></Pagination>}

    {formOpen && <TaskForm open onOpenChange={setFormOpen} task={editing} />}
    <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}><DialogContent>{viewing && <><DialogHeader><DialogTitle>{viewing.description}</DialogTitle><DialogDescription>Información completa de la tarea.</DialogDescription></DialogHeader><div className="grid gap-3 py-2 sm:grid-cols-2"><Info label="Proyecto" value={projects.find((project) => project.id === viewing.projectId)?.name ?? "Sin proyecto"} /><Info label="Estado" value={viewing.status} /><Info label="Prioridad" value={viewing.priority} /><Info label="Asignado a" value={members.find((member) => member.userId === viewing.userId)?.name ?? "Sin asignar"} /><Info label="Fecha límite" value={format(parseISO(viewing.deadline), "PPP", { locale: es })} /></div><DialogFooter><Button onClick={() => setViewing(null)}>Cerrar</Button></DialogFooter></>}</DialogContent></Dialog>
    <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && !isDeleting && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar esta tarea?</AlertDialogTitle><AlertDialogDescription>{deleting?.description}. Esta acción actualizará inmediatamente las métricas del dashboard.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel><Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>{isDeleting && <Spinner data-icon="inline-start" />}Eliminar tarea</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>
}

function TaskForm({ open, onOpenChange, task }: { open: boolean; onOpenChange: (open: boolean) => void; task: Task | null }) {
  const { projects, members, createTask, updateTask } = useDashboard()
  const [values, setValues] = useState<TaskInput>(() => task ? {
    description: task.description,
    projectId: task.projectId,
    status: task.status,
    priority: task.priority,
    userId: task.userId,
    deadline: task.deadline,
  } : { ...emptyTask, projectId: projects[0]?.id ?? "" })
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const eligibleMembers = members.filter((member) => member.isActive && member.projectId === values.projectId)
  const setField = <K extends keyof TaskInput>(field: K, value: TaskInput[K]) => setValues((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (saving) return; if (!values.description.trim() || !values.projectId || !values.deadline) { setError("Descripción, proyecto y fecha límite son obligatorios."); return } if (!values.userId || !eligibleMembers.some((member) => member.userId === values.userId)) { setError("Selecciona un integrante activo asignado al proyecto."); return } setSaving(true); setError(""); try { if (task) await updateTask(task.id, values); else await createTask(values); onOpenChange(false) } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar la tarea.") } finally { setSaving(false) } }

  return <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}><DialogContent className="sm:max-w-xl"><form onSubmit={submit}><DialogHeader><DialogTitle>{task ? "Editar tarea" : "Nueva tarea"}</DialogTitle><DialogDescription>Asigna una tarea a un proyecto e integrante válidos.</DialogDescription></DialogHeader><div className="grid gap-4 py-5">{error && <Alert variant="destructive"><AlertCircle /><AlertDescription>{error}</AlertDescription></Alert>}<div className="grid gap-2"><Label>Descripción *</Label><Textarea value={values.description} disabled={saving} onChange={(event) => setField("description", event.target.value)} /></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Proyecto *"><Select value={values.projectId} disabled={saving} onValueChange={(value) => setValues((current) => ({ ...current, projectId: value, userId: null }))}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Asignado a *"><Select value={values.userId ?? ""} disabled={saving || eligibleMembers.length === 0} onValueChange={(value) => setField("userId", value)}><SelectTrigger className="w-full"><SelectValue placeholder={eligibleMembers.length ? "Seleccionar" : "Sin integrantes"} /></SelectTrigger><SelectContent>{eligibleMembers.map((member) => <SelectItem key={member.userId} value={member.userId}>{member.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Estado"><Select value={values.status} disabled={saving} onValueChange={(value) => setField("status", value as TaskStatus)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{TASK_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></Field><Field label="Prioridad"><Select value={values.priority} disabled={saving} onValueChange={(value) => setField("priority", value as Priority)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{PRIORITIES.map((priority) => <SelectItem key={priority} value={priority}>{priority}</SelectItem>)}</SelectContent></Select></Field></div><Field label="Fecha límite *"><DatePickerField value={values.deadline} onChange={(value) => setField("deadline", value)} placeholder="Seleccionar fecha límite" disabled={saving} /></Field></div><DialogFooter><Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={saving}>{saving && <Spinner data-icon="inline-start" />}{task ? "Guardar cambios" : "Crear tarea"}</Button></DialogFooter></form></DialogContent></Dialog>
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="grid gap-2"><Label>{label}</Label>{children}</div> }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div> }
