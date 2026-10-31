import type {
  ActivityItem,
  Project,
  Task,
  TeamMember,
  WorkspaceSettings,
} from "@/types/dashboard"

export const initialProjects: Project[] = [
  { id: "project-ecommerce", name: "E-commerce Platform", description: "Plataforma de ventas con catálogo, pagos y gestión de pedidos.", category: "Desarrollo Web", priority: "Alta", status: "En progreso", progress: 78, createdAt: "2026-08-12" },
  { id: "project-mobile", name: "Mobile App", description: "Aplicación móvil para mejorar la experiencia de clientes.", category: "Desarrollo Mobile", priority: "Alta", status: "En progreso", progress: 52, createdAt: "2026-08-28" },
  { id: "project-analytics", name: "Dashboard Analytics", description: "Panel de métricas y reportes para decisiones estratégicas.", category: "Desarrollo Web", priority: "Media", status: "En progreso", progress: 91, createdAt: "2026-07-17" },
  { id: "project-api", name: "API Gateway", description: "Capa centralizada para seguridad y gestión de microservicios.", category: "Desarrollo Web", priority: "Urgente", status: "Planificación", progress: 35, createdAt: "2026-10-02" },
  { id: "project-design", name: "Design System", description: "Biblioteca visual reutilizable para todos los productos.", category: "Diseño", priority: "Media", status: "En pausa", progress: 64, createdAt: "2026-06-20" },
  { id: "project-marketing", name: "Marketing Website", description: "Sitio institucional optimizado para campañas y conversión.", category: "Marketing", priority: "Baja", status: "Completado", progress: 100, createdAt: "2026-05-04" },
]

export const initialMembers: TeamMember[] = [
  { userId: "user-ana", role: "Administradora", name: "Ana Torres", email: "ana.torres@empresa.com", position: "Project Manager", birthdate: "1991-04-12", phone: "+51 987 654 321", projectId: "project-ecommerce", isActive: true },
  { userId: "user-luis", role: "Colaborador", name: "Luis Mendoza", email: "luis.mendoza@empresa.com", position: "Frontend Developer", birthdate: "1995-09-23", phone: "+51 986 112 430", projectId: "project-ecommerce", isActive: true },
  { userId: "user-carla", role: "Colaboradora", name: "Carla Ruiz", email: "carla.ruiz@empresa.com", position: "UX/UI Designer", birthdate: "1993-01-18", phone: "+51 982 430 775", projectId: "project-mobile", isActive: true },
  { userId: "user-diego", role: "Colaborador", name: "Diego Flores", email: "diego.flores@empresa.com", position: "Backend Developer", birthdate: "1989-11-07", phone: "+51 981 550 226", projectId: "project-api", isActive: true },
  { userId: "user-sofia", role: "Colaboradora", name: "Sofía Vega", email: "sofia.vega@empresa.com", position: "QA Engineer", birthdate: "1996-06-30", phone: "+51 980 447 819", projectId: "project-analytics", isActive: false },
]

export const initialTasks: Task[] = [
  { id: "task-auth", description: "Implementar autenticación", projectId: "project-ecommerce", status: "En progreso", priority: "Alta", userId: "user-luis", deadline: "2026-11-15" },
  { id: "task-profile", description: "Diseñar pantalla de perfil", projectId: "project-mobile", status: "Pendiente", priority: "Media", userId: "user-carla", deadline: "2026-11-18" },
  { id: "task-cicd", description: "Configurar CI/CD", projectId: "project-api", status: "Completado", priority: "Alta", userId: "user-diego", deadline: "2026-11-10" },
  { id: "task-sql", description: "Optimizar queries SQL", projectId: "project-analytics", status: "En progreso", priority: "Urgente", userId: "user-sofia", deadline: "2026-11-12" },
  { id: "task-docs", description: "Documentar API endpoints", projectId: "project-api", status: "En revisión", priority: "Baja", userId: "user-diego", deadline: "2026-11-22" },
  { id: "task-cart", description: "Integrar carrito de compras", projectId: "project-ecommerce", status: "Pendiente", priority: "Alta", userId: "user-luis", deadline: "2026-11-26" },
  { id: "task-tests", description: "Crear pruebas de regresión", projectId: "project-analytics", status: "En progreso", priority: "Media", userId: "user-sofia", deadline: "2026-12-01" },
  { id: "task-tokens", description: "Definir tokens de diseño", projectId: "project-design", status: "Completado", priority: "Media", userId: null, deadline: "2026-10-30" },
  { id: "task-landing", description: "Optimizar landing principal", projectId: "project-marketing", status: "Completado", priority: "Baja", userId: null, deadline: "2026-10-20" },
  { id: "task-push", description: "Configurar notificaciones push", projectId: "project-mobile", status: "Pendiente", priority: "Media", userId: "user-carla", deadline: "2026-12-04" },
  { id: "task-rate", description: "Implementar rate limiting", projectId: "project-api", status: "En revisión", priority: "Urgente", userId: "user-diego", deadline: "2026-11-20" },
  { id: "task-charts", description: "Agregar gráficos comparativos", projectId: "project-analytics", status: "Pendiente", priority: "Baja", userId: "user-sofia", deadline: "2026-12-08" },
]

export const initialActivity: ActivityItem[] = [
  { id: "activity-1", description: "Ana Torres actualizó E-commerce Platform", createdAt: "2026-10-31T10:15:00-05:00" },
  { id: "activity-2", description: "Luis Mendoza completó una revisión de autenticación", createdAt: "2026-10-31T09:42:00-05:00" },
  { id: "activity-3", description: "Carla Ruiz actualizó los diseños de Mobile App", createdAt: "2026-10-31T08:20:00-05:00" },
]

export const initialSettings: WorkspaceSettings = {
  workspaceName: "Dashboard de Proyectos",
  contactEmail: "equipo@empresa.com",
  notifications: true,
  theme: "light",
  compactView: false,
  language: "es",
}
