'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'

import Card from '@/components/cards/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const sectionClasses = 'rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm md:p-8'

export default function StylingPage() {
  const [buttonLoading, setButtonLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleButtonClick = async () => {
    setButtonLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setButtonLoading(false)
    window.alert('¡Acción completada!')
  }

  const validateEmail = (value: string) => {
    setEmail(value)
    setEmailError(value && !value.includes('@') ? 'Email inválido' : '')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name.trim() || !email || !email.includes('@')) {
      if (email && !email.includes('@')) {
        setEmailError('Email inválido')
      }
      return
    }

    window.alert(`Nombre: ${name}\nCorreo: ${email}`)
  }

  const userIcon = (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
    </svg>
  )

  const emailIcon = (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6.75 10.94 12a2 2 0 0 0 2.12 0L21 6.75M5.25 19.5h13.5A2.25 2.25 0 0 0 21 17.25V6.75a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Componentes Reutilizables
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            CSS Modules + Tailwind CSS
          </p>
        </header>

        <section className={sectionClasses}>
          <h2 className="text-2xl font-bold text-gray-900">
            1. Botones con CSS Modules
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button variant="primary" size="sm">
              Small Primary
            </Button>
            <Button variant="secondary" size="md">
              Medium Secondary
            </Button>
            <Button variant="outline" size="lg">
              Large Outline
            </Button>
            <Button
              loading={buttonLoading}
              onClick={handleButtonClick}
            >
              Click para cargar
            </Button>
            <Button disabled>Disabled Button</Button>
          </div>

          <div className="mt-4">
            <Button fullWidth>Full Width Button</Button>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            CSS Modules permite encapsular gradientes, pseudo-elementos,
            animaciones y estados visuales sin generar conflictos entre clases.
          </p>
        </section>

        <section className={sectionClasses}>
          <h2 className="text-2xl font-bold text-gray-900">
            2. Badges con Tailwind
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="success">Success</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="neutral">Neutral</Badge>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Badge variant="info" size="sm" rounded>
              Small
            </Badge>
            <Badge variant="success" size="md" rounded>
              Medium
            </Badge>
            <Badge variant="warning" size="lg" rounded>
              Large
            </Badge>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            Tailwind CSS facilita la creación de variantes mediante utilidades de
            color, tamaño, espaciado y bordes redondeados.
          </p>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            3. Cards con Tailwind CSS
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card title="Card Simple" subtitle="Contenido reutilizable">
              <p className="leading-6">
                Esta tarjeta presenta una estructura limpia para mostrar
                información de forma clara y organizada.
              </p>
            </Card>

            <Card
              title="Card con Imagen"
              subtitle="Espacio de trabajo moderno"
              image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80"
              footer={
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="info" rounded>
                    Desarrollo
                  </Badge>
                  <span className="text-sm text-gray-500">Hace 2 horas</span>
                </div>
              }
            >
              <p className="leading-6">
                Las imágenes también pueden formar parte de un componente Card
                flexible y responsive.
              </p>
            </Card>

            <Card title="Card Interactivo" subtitle="Tecnologías principales">
              <p className="leading-6">
                Combina componentes reutilizables para construir interfaces más
                completas.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="info" rounded>
                  React
                </Badge>
                <Badge variant="neutral" rounded>
                  Next.js
                </Badge>
              </div>
              <div className="mt-5">
                <Button variant="outline" size="sm">
                  Ver más
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section className={sectionClasses}>
          <h2 className="text-2xl font-bold text-gray-900">
            3. Formulario con Inputs (Combinación)
          </h2>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Nombre completo"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={setName}
              required
              icon={userIcon}
            />

            <Input
              label="Email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={validateEmail}
              error={emailError}
              helperText="Utiliza una dirección de correo válida."
              required
              icon={emailIcon}
            />

            <Button type="submit">Enviar Formulario</Button>
          </form>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            La combinación utiliza Tailwind CSS para la estructura y el
            espaciado, mientras CSS Modules controla las etiquetas flotantes,
            animaciones y efectos de foco.
          </p>
        </section>

        <section>
          <Card title="5. Resumen de Técnicas Usadas" hover={false}>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-purple-700">
                  CSS Modules
                </h3>
                <ul className="mt-3 list-inside list-disc space-y-2 text-gray-600">
                  <li>Animaciones</li>
                  <li>Pseudo-elementos</li>
                  <li>Gradientes</li>
                  <li>Keyframes</li>
                  <li>Etiquetas flotantes</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-700">
                  Tailwind CSS
                </h3>
                <ul className="mt-3 list-inside list-disc space-y-2 text-gray-600">
                  <li>Layout y grid</li>
                  <li>Colores</li>
                  <li>Espaciado</li>
                  <li>Diseño responsive</li>
                  <li>Efectos hover</li>
                </ul>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </main>
  )
}
