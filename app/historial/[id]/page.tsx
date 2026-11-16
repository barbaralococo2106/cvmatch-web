'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

type Analysis = {
  id: string
  created_at: string
  company_name: string
  role_title: string
  score: {
    overall_score: number
    subscores: Record<string, { score: number; rationale: string }>
    missing_critical: { keyword: string; urgency: string }[]
  }
  rewritten_cv: string
  cover_letter: string
}

export default function DetalleAnalisis() {
  const params = useParams()
  const id = params.id as string

  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadAnalysis() {
      try {
        const response = await fetch(`http://localhost:8000/analyses/${id}`)
        if (!response.ok) throw new Error('Error ' + response.status)
        setAnalysis(await response.json())
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar este análisis.')
      } finally {
        setLoading(false)
      }
    }
    loadAnalysis()
  }, [id])

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-6">

        <Link href="/historial" className="text-sm text-purple-400 hover:text-purple-300">
          ← Volver a mis análisis
        </Link>

        {loading && <p className="text-gray-400">Cargando...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {analysis && (
          <>
            <div>
              <h1 className="text-3xl font-bold">{analysis.company_name}</h1>
              <p className="text-gray-400">{analysis.role_title}</p>
            </div>

            {/* Score */}
            <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Compatibilidad</h2>
                <span className="text-3xl font-bold text-purple-400">
                  {analysis.score?.overall_score}/100
                </span>
              </div>
              <div className="space-y-3">
                {Object.entries(analysis.score?.subscores || {}).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span>{val.score}/100</span>
                    </div>
                    <div className="w-full bg-[#1E1E2E] rounded-full h-1.5">
                      <div
                        className="bg-purple-500 h-1.5 rounded-full"
                        style={{ width: `${val.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords faltantes */}
            {analysis.score?.missing_critical?.length > 0 && (
              <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
                <h2 className="text-lg font-bold mb-4">Keywords faltantes</h2>
                <div className="flex flex-wrap gap-2">
                  {analysis.score.missing_critical.map((item) => (
                    <span
                      key={item.keyword}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.urgency === 'blocking'
                          ? 'bg-red-900/50 text-red-300 border border-red-800'
                          : 'bg-yellow-900/50 text-yellow-300 border border-yellow-800'
                      }`}
                    >
                      {item.keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CV */}
            <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">CV Optimizado</h2>
                <button
                  onClick={() => window.open(`http://localhost:8000/analyses/${id}/download-cv`, '_blank')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Descargar PDF →
                </button>
              </div>
              <pre className="text-gray-400 text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
                {analysis.rewritten_cv}
              </pre>
            </div>

            {/* Cover letter */}
            <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Cover Letter</h2>
                <button
                  onClick={() => window.open(`http://localhost:8000/analyses/${id}/download-cover-letter`, '_blank')}
                  className="text-xs bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Descargar PDF →
                </button>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                {analysis.cover_letter}
              </p>
            </div>
          </>
        )}

      </div>
    </main>
  )
}