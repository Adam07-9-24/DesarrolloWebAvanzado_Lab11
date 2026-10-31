"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { AlertCircle } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { useDashboard } from "@/context/dashboard-context"
import type { Project, ProjectInput } from "@/types/dashboard"
import { PRIORITIES, PROJECT_CATEGORIES, PROJECT_STATUSES } from "@/types/dashboard"

interface ProjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
}

const emptyProject: ProjectInput = {
  name: "",
  description: "",
  category: "Desarrollo Web",
  priority: "Media",
  status: "Planificación",
  progress: 0,
}

export default function ProjectForm({ open, onOpenChange, project }: ProjectFormProps) {
  const { members, createProject, updateProject } = useDashboard()
  const [values, setValues] = useState<ProjectInput>(() => project ? {
    name: project.name,
    description: project.description,
    category: project.category,
    priority: project.priority,
    status: project.status,
    progress: project.progress,
  } : emptyProject)
  const [memberIds, setMemberIds] = useState<string[]>(() => project
    ? members.filter((member) => member.projectId === project.id).map((member) => member.userId)
    : [])
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const updateValue = <K extends keyof ProjectInput>(field: K, value: ProjectInput[K]) => setValues((current) => ({ ...current, [field]: value }))

  const toggleMember = (userId: string, checked: boolean) => {
    setMemberIds((current) => checked ? [...current, userId] : current.filter((id) => id !== userId))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    if (!values.name.trim() || !values.description.trim()) {
      setError("El nombre y la descripción son obligatorios.")
      return
    }
    if (values.progress < 0 || values.progress > 100) {
      setError("El progreso debe estar entre 0 y 100.")
      return
    }

    setSaving(true)
    setError("")
    try {
      const input = { ...values, name: values.name.trim(), description: values.description.trim() }
      if (project) await updateProject(project.id, input, memberIds)
      else await createProject(input, memberIds)
      onOpenChange(false)
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el proyecto.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{project ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
            <DialogDescription>Define la información, el progreso y los integrantes asignados.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-5">
            {error && <Alert variant="destructive"><AlertCircle /><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="grid gap-2"><Label htmlFor="project-name">Nombre *</Label><Input id="project-name" value={values.name} disabled={saving} onChange={(event) => updateValue("name", event.target.value)} /></div>
            <div className="grid gap-2"><Label htmlFor="project-description">Descripción *</Label><Textarea id="project-description" value={values.description} disabled={saving} onChange={(event) => updateValue("description", event.target.value)} /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2"><Label>Categoría</Label><Select value={values.category} disabled={saving} onValueChange={(value) => updateValue("category", value as ProjectInput["category"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{PROJECT_CATEGORIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label>Prioridad</Label><Select value={values.priority} disabled={saving} onValueChange={(value) => updateValue("priority", value as ProjectInput["priority"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{PRIORITIES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label>Estado inicial</Label><Select value={values.status} disabled={saving} onValueChange={(value) => updateValue("status", value as ProjectInput["status"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent>{PROJECT_STATUSES.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
              <div className="grid gap-2"><Label htmlFor="project-progress">Progreso (%)</Label><Input id="project-progress" type="number" min={0} max={100} value={values.progress} disabled={saving} onChange={(event) => updateValue("progress", Number(event.target.value))} /></div>
            </div>
            <div className="grid gap-3">
              <div><Label>Integrantes asignados</Label><p className="mt-1 text-xs text-muted-foreground">Seleccionar un integrante moverá su asignación principal a este proyecto.</p></div>
              <div className="grid gap-2 sm:grid-cols-2">
                {members.map((member) => <label key={member.userId} className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50"><Checkbox checked={memberIds.includes(member.userId)} disabled={saving} onCheckedChange={(checked) => toggleMember(member.userId, checked === true)} /><span className="min-w-0"><span className="block truncate text-sm font-medium">{member.name}</span><span className="block truncate text-xs text-muted-foreground">{member.position}</span></span></label>)}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving && <Spinner data-icon="inline-start" />}{project ? "Guardar cambios" : "Crear proyecto"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
