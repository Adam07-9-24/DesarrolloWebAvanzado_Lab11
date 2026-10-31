"use client"

import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { AlertCircle, CheckCircle2, Settings2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { useDashboard } from "@/context/dashboard-context"
import type { WorkspaceSettings } from "@/types/dashboard"

export function SettingsPanel() {
  const { settings, saveSettings } = useDashboard()
  const [values, setValues] = useState(settings)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [saving, setSaving] = useState(false)
  const setField = <K extends keyof WorkspaceSettings>(field: K, value: WorkspaceSettings[K]) => setValues((current) => ({ ...current, [field]: value }))
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (saving) return; if (!values.workspaceName.trim()) { setError("El nombre del espacio de trabajo es obligatorio."); setSuccess(""); return } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.contactEmail)) { setError("Ingresa un correo de contacto válido."); setSuccess(""); return } setSaving(true); setError(""); setSuccess(""); await saveSettings(values); setSaving(false); setSuccess("Las preferencias se guardaron correctamente.") }

  return <Card className="mx-auto max-w-3xl"><CardHeader className="border-b"><div className="flex items-center gap-3"><div className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><Settings2 className="size-5" /></div><div><CardTitle>Configuración del espacio</CardTitle><CardDescription>Personaliza la experiencia local del dashboard.</CardDescription></div></div></CardHeader><CardContent><form onSubmit={submit} className="space-y-5">{error && <Alert variant="destructive"><AlertCircle /><AlertDescription>{error}</AlertDescription></Alert>}{success && <Alert className="border-teal-200 bg-teal-50 text-teal-800"><CheckCircle2 /><AlertDescription className="text-teal-700">{success}</AlertDescription></Alert>}<div className="grid gap-4 sm:grid-cols-2"><Field label="Nombre del espacio"><Input value={values.workspaceName} disabled={saving} onChange={(event) => setField("workspaceName", event.target.value)} /></Field><Field label="Correo de contacto"><Input type="email" value={values.contactEmail} disabled={saving} onChange={(event) => setField("contactEmail", event.target.value)} /></Field><Field label="Tema visual"><Select value={values.theme} disabled={saving} onValueChange={(value) => setField("theme", value as WorkspaceSettings["theme"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Oscuro</SelectItem><SelectItem value="system">Sistema</SelectItem></SelectContent></Select></Field><Field label="Idioma"><Select value={values.language} disabled={saving} onValueChange={(value) => setField("language", value as WorkspaceSettings["language"])}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="es">Español</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select></Field></div><Toggle label="Notificaciones" description="Recibir avisos dentro de la aplicación." checked={values.notifications} disabled={saving} onChange={(checked) => setField("notifications", checked)} /><Toggle label="Vista compacta" description="Reducir el espacio vertical entre secciones." checked={values.compactView} disabled={saving} onChange={(checked) => setField("compactView", checked)} /><div className="flex justify-end"><Button type="submit" disabled={saving}>{saving && <Spinner data-icon="inline-start" />}Guardar cambios</Button></div></form></CardContent></Card>
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <div className="grid gap-2"><Label>{label}</Label>{children}</div> }
function Toggle({ label, description, checked, disabled, onChange }: { label: string; description: string; checked: boolean; disabled: boolean; onChange: (checked: boolean) => void }) { return <label className="flex items-center justify-between rounded-lg border p-4"><span><span className="block text-sm font-medium">{label}</span><span className="block text-xs text-muted-foreground">{description}</span></span><Switch checked={checked} disabled={disabled} onCheckedChange={onChange} /></label> }
