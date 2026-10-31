import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProjectFlow | Gestión de proyectos",
  description: "Dashboard profesional para gestionar proyectos, tareas y equipos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
