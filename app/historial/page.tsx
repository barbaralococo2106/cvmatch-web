'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type AnalysisItem = {
  id: string
  created_at: string
  company_name: string
  role_title: string
  score: number | null
}

export default function Historial() {
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAnalyses() {
      try {
        const response = await fetch('http://localhost:8000/analyses')
        if (!response.ok) throw new Error('Error ' + response.status)
        const data = await response.json()
        setAnalyses(data)
      } catch (err) {
        console.error('No se pudo cargar el historial:', err)
        setError('No se pudo conectar con el servidor. ¿Está corriendo el backend?')
      } finally {
        setLoading(false)
      }
    }
    loadAnalyses()
  }, [])

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Mis análisis</h1>
          <Link
            href="/"
            className="text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            + Nuevo análisis
          </Link>
        </div>

        {loading && <p className="text-gray-400">Cargando...</p>}

        {error && (
          <p className="text-red-400 bg-red-950/40 border border-red-900 rounded-xl p-4 text-sm">
            {error}
          </p>
        )}

        {!loading && !error && analyses.length === 0 && (
          <p className="text-gray-400">Todavía no hiciste ningún análisis.</p>
        )}

        <div className="space-y-3">
          {analyses.map((a) => (
            <Link
              key={a.id}
              href={`/historial/${a.id}`}
              className="block bg-[#13131A] border border-[#1E1E2E] hover:border-purple-500 rounded-xl p-5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{a.company_name}</p>
                  <p className="text-sm text-gray-400">{a.role_title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(a.created_at).toLocaleDateString('es-AR')}
                  </p>
                </div>
                <span className="text-2xl font-bold text-purple-400">
                  {a.score ?? '-'}
                  <span className="text-sm text-gray-500">/100</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  )
}