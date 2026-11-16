'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Configuración del menú: para sumar una sección nueva, agregá un objeto acá.
const MENU_ITEMS = [
  { label: 'Nuevo análisis', href: '/' },
  { label: 'Mis análisis', href: '/historial' },
]

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Cierra el panel con la tecla Esc (solo mientras está abierto).
  useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  // "/" solo está activo en la home exacta; el resto también cuenta sus subrutas
  // (así "Mis análisis" queda resaltado dentro de /historial/{id}).
  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Botón hamburguesa, fijo arriba a la izquierda */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="fixed top-4 left-4 z-30 w-11 h-11 flex flex-col items-center justify-center gap-1.5 bg-[#13131A] border border-[#1E1E2E] hover:border-purple-500 rounded-xl transition-colors"
      >
        <span className="block w-5 h-0.5 bg-white" />
        <span className="block w-5 h-0.5 bg-white" />
        <span className="block w-5 h-0.5 bg-white" />
      </button>

      {/* Fondo oscuro: al hacer clic afuera del panel se cierra */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel que se desliza desde la izquierda */}
      <aside
        role="dialog"
        aria-label="Menú"
        aria-hidden={!open}
        inert={!open}
        className={`fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-[#0A0A0F] border-r border-[#1E1E2E] p-6 flex flex-col gap-6 overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">
            CV<span className="text-purple-400">Match</span>
          </span>
          <button
            onClick={close}
            aria-label="Cerrar menú"
            className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                aria-current={active ? 'page' : undefined}
                className={`block px-4 py-3 rounded-xl text-sm font-medium border transition-colors ${
                  active
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                    : 'bg-[#13131A] border-[#1E1E2E] text-gray-300 hover:border-purple-500'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
