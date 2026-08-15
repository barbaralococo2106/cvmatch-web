'use client'

import { useState } from 'react'

export default function Home() {
  // Estado — variables que guardan lo que escribe el usuario
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [jdText, setJdText] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Función que se ejecuta cuando el usuario hace clic en "Analizar"
  async function handleSubmit() {
    if (!cvFile || !jdText) return

    setLoading(true)

    // Armamos el FormData — así se mandan archivos a una API
    const formData = new FormData()
    formData.append('cv_file', cvFile)
    formData.append('jd_text', jdText)
    formData.append('company_name', companyName)
    formData.append('role_title', roleTitle)

    // Llamamos a la API de FastAPI
    const response = await fetch('http://localhost:8000/analyze', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0A0A0F] text-white flex flex-col items-center justify-center px-4 py-12">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">
          CV<span className="text-purple-400">Match</span> AI
        </h1>
        <p className="text-gray-400 text-lg">
          Subí tu CV. Pegá el trabajo. Conseguí la entrevista.
        </p>
      </div>

      {/* Formulario */}
      <div className="w-full max-w-2xl space-y-6">

        {/* Upload CV */}
        <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-4">
            Tu CV
          </label>
          <label className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-[#2E2E3E] rounded-xl p-8 hover:border-purple-500 transition-colors">
            <span className="text-4xl mb-3">📄</span>
            <span className="text-purple-400 font-semibold text-sm mb-1">
              {cvFile ? cvFile.name : 'Seleccioná tu CV'}
            </span>
            <span className="text-gray-500 text-xs">
              {cvFile ? '✓ Archivo listo' : 'PDF o DOCX · Hacé clic para elegir'}
            </span>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setCvFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        </div>

        {/* Job Description */}
        <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Job Description
          </label>
          <textarea
            rows={6}
            placeholder="Pegá acá el texto de la oferta laboral..."
            onChange={(e) => setJdText(e.target.value)}
            className="w-full bg-transparent text-gray-300 text-sm resize-none outline-none placeholder-gray-600"
          />
        </div>

        {/* Campos opcionales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Empresa
            </label>
            <input
              type="text"
              placeholder="Ej: Mercado Libre"
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-transparent text-gray-300 text-sm outline-none placeholder-gray-600"
            />
          </div>
          <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-4">
            <label className="block text-xs font-medium text-gray-400 mb-2">
              Rol
            </label>
            <input
              type="text"
              placeholder="Ej: Senior Data Scientist"
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-transparent text-gray-300 text-sm outline-none placeholder-gray-600"
            />
          </div>
        </div>

        {/* Botón */}
        <button
          onClick={handleSubmit}
          disabled={!cvFile || !jdText || loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:text-purple-400 text-white font-semibold py-4 rounded-xl transition-colors"
        >
          {loading ? 'Analizando...' : 'Analizar mi CV →'}
        </button>

        {/* Resultado temporal — para verificar que funciona */}
        {result && (
          <div className="bg-[#13131A] border border-[#1E1E2E] rounded-xl p-6">
            <p className="text-purple-400 font-bold text-lg mb-2">
              Score: {result.score?.overall_score}/100
            </p>
            <p className="text-gray-400 text-sm">
              ID: {result.id}
            </p>
          </div>
        )}

      </div>
    </main>
  )
}