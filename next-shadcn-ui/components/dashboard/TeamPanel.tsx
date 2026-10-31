"use client"

import { useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { AlertCircle, Eye, Mail, Pencil, Phone, Plus, Search, Trash2, UserRound } from "lucide-react"

import { DatePickerField } from "@/components/dashboard/DatePickerField"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Avatar, AvatarBadge, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { useDashboard } from "@/context/dashboard-context"
import type { TeamMember, TeamMemberInput } from "@/types/dashboard"

const emptyMember: TeamMemberInput = { role: "Colaborador", name: "", email: "", position: "", birthdate: "", phone: "", projectId: null, isActive: true }

export function TeamPanel() {
  const { members, projects, tasks, deleteMember } = useDashboard()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<TeamMember | null>(null)
  const [viewing, setViewing] = useState<TeamMember | null>(null)
  const [deleting, setDeleting] = useState<TeamMember | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return query ? members.filter((member) => `${member.name} ${member.email} ${member.position}`.toLowerCase().includes(query)) : members
  }, [members, search])

  const confirmDelete = async () => {
    if (!deleting || isDeleting) return
    setIsDeleting(true)
    await deleteMember(deleting.userId)
    setIsDeleting(false)
    setDeleting(null)
  }

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Equipo</h2><p className="text-sm text-muted-foreground">Gestiona perfiles y asignaciones del espacio de trabajo.</p></div><Button onClick={() => { setEditing(null); setFormOpen(true) }}><Plus data-icon="inline-start" />Nuevo integrante</Button></div>
    <div className="relative max-w-sm"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar integrante..." className="pl-9" /></div>
    {filtered.length === 0 ? <Card><CardContent className="flex flex-col items-center gap-2 py-14"><UserRound className="size-10 text-muted-foreground" /><p className="font-medium">No hay integrantes para mostrar</p></CardContent></Card> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((member) => {
      const project = projects.find((item) => item.id === member.projectId)
      const initials = member.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()
      return <Card key={member.userId}><CardContent className="space-y-4"><div className="flex items-start gap-3"><Avatar size="lg"><AvatarFallback>{initials}</AvatarFallback><AvatarBadge className={member.isActive ? "bg-teal-500" : "bg-slate-400"} /></Avatar><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{member.name}</h3><Badge variant={member.isActive ? "secondary" : "outline"} className={member.isActive ? "bg-teal-100 text-teal-700" : ""}>{member.isActive ? "Activo" : "Inactivo"}</Badge></div><p className="text-sm text-muted-foreground">{member.position}</p></div></div><div className="space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><Mail className="size-4" /><span className="truncate">{member.email}</span></p><p className="flex items-center gap-2"><Phone className="size-4" />{member.phone}</p><p className="rounded-md bg-muted px-2.5 py-2">{project?.name ?? "Sin proyecto asignado"}</p></div><div className="flex justify-end gap-2"><Button variant="ghost" size="sm" onClick={() => setViewing(member)}><Eye data-icon="inline-start" />Ver</Button><Button variant="outline" size="sm" onClick={() => { setEditing(member); setFormOpen(true) }}><Pencil data-icon="inline-start" />Editar</Button><Button variant="destructive" size="icon-sm" aria-label={`Eliminar ${member.name}`} onClick={() => setDeleting(member)}><Trash2 /></Button></div></CardContent></Card>
    })}</div>}

    {formOpen && <MemberForm open onOpenChange={setFormOpen} member={editing} />}

    <Dialog open={viewing !== null} onOpenChange={(open) => !open && setViewing(null)}><DialogContent>{viewing && <><DialogHeader><DialogTitle>{viewing.name}</DialogTitle><DialogDescription>{viewing.position} · {viewing.role}</DialogDescription></DialogHeader><div className="grid gap-3 py-2 text-sm"><Detail label="Correo" value={viewing.email} /><Detail label="Teléfono" value={viewing.phone} /><Detail label="Nacimiento" value={format(parseISO(viewing.birthdate), "PPP", { locale: es })} /><Detail label="Proyecto" value={projects.find((project) => project.id === viewing.projectId)?.name ?? "Sin asignación"} /></div><DialogFooter><Button onClick={() => setViewing(null)}>Cerrar</Button></DialogFooter></>}</DialogContent></Dialog>

    <AlertDialog open={deleting !== null} onOpenChange={(open) => !open && !isDeleting && setDeleting(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Eliminar a {deleting?.name}?</AlertDialogTitle><AlertDialogDescription>Sus {tasks.filter((task) => task.userId === deleting?.userId).length} tareas asignadas quedarán sin responsable. Esta acción no elimina las tareas.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel><Button variant="destructive" disabled={isDeleting} onClick={confirmDelete}>{isDeleting && <Spinner data-icon="inline-start" />}Eliminar integrante</Button></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </div>
}

function MemberForm({ open, onOpenChange, member }: { open: boolean; onOpenChange: (open: boolean) => void; member: TeamMember | null }) {
  const { projects, createMember, updateMember } = useDashboard()
  const [values, setValues] = useState<TeamMemberInput>(() => member ? {
    role: member.role,
    name: member.name,
    email: member.email,
    position: member.position,
    birthdate: member.birthdate,
    phone: member.phone,
    projectId: member.projectId,
    isActive: member.isActive,
  } : emptyMember)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const setField = <K extends keyof TeamMemberInput>(field: K, value: TeamMemberInput[K]) => setValues((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (saving) return
    if (!values.name.trim() || !values.email.trim() || !values.phone.trim() || !values.role.trim() || !values.position.trim() || !values.birthdate) { setError("Completa todos los campos obligatorios."); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) { setError("Ingresa un correo electrónico válido."); return }
    if (!/^[+\d\s-]{7,}$/.test(values.phone)) { setError("Ingresa un teléfono válido."); return }
    if (parseISO(values.birthdate) > new Date()) { setError("La fecha de nacimiento no puede ser futura."); return }
    setSaving(true); setError("")
    try { if (member) await updateMember(member.userId, values); else await createMember(values); onOpenChange(false) } catch (caughtError) { setError(caughtError instanceof Error ? caughtError.message : "No se pudo guardar el integrante.") } finally { setSaving(false) }
  }

  return <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}><DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"><form onSubmit={submit}><DialogHeader><DialogTitle>{member ? "Editar integrante" : "Nuevo integrante"}</DialogTitle><DialogDescription>Registra datos personales, rol y asignación principal.</DialogDescription></DialogHeader><div className="grid gap-4 py-5">{error && <Alert variant="destructive"><AlertCircle /><AlertDescription>{error}</AlertDescription></Alert>}<div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre *"><Input value={values.name} onChange={(event) => setField("name", event.target.value)} disabled={saving} /></Field><Field label="Correo *"><Input type="email" value={values.email} onChange={(event) => setField("email", event.target.value)} disabled={saving} /></Field><Field label="Teléfono *"><Input value={values.phone} onChange={(event) => setField("phone", event.target.value)} disabled={saving} /></Field><Field label="Cargo *"><Input value={values.position} onChange={(event) => setField("position", event.target.value)} disabled={saving} /></Field><Field label="Rol *"><Input value={values.role} onChange={(event) => setField("role", event.target.value)} disabled={saving} /></Field><Field label="Fecha de nacimiento *"><DatePickerField value={values.birthdate} onChange={(value) => setField("birthdate", value)} placeholder="Seleccionar fecha" birthdate disabled={saving} /></Field></div><Field label="Proyecto principal"><Select value={values.projectId ?? "none"} disabled={saving} onValueChange={(value) => setField("projectId", value === "none" ? null : value)}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Sin proyecto</SelectItem>{projects.map((project) => <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>)}</SelectContent></Select></Field><label className="flex items-center justify-between rounded-lg border p-3"><span><span className="block text-sm font-medium">Integrante activo</span><span className="block text-xs text-muted-foreground">Puede recibir nuevas asignaciones.</span></span><Switch checked={values.isActive} disabled={saving} onCheckedChange={(checked) => setField("isActive", checked)} /></label></div><DialogFooter><Button type="button" variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>Cancelar</Button><Button type="submit" disabled={saving}>{saving && <Spinner data-icon="inline-start" />}{member ? "Guardar cambios" : "Crear integrante"}</Button></DialogFooter></form></DialogContent></Dialog>
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="grid gap-2"><Label>{label}</Label>{children}</div> }
function Detail({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div> }
