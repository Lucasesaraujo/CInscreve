'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Card from '../components/Card' // ✅ importa o card certo
import { Search, Users } from 'lucide-react'

// Simula uma chamada de API
const mockFetchEditais = (offset = 0, limit = 6) => {
  const totalEditais = 20
  return new Promise((resolve) => {
    setTimeout(() => {
      if (offset >= totalEditais) {
        resolve([])
        return
      }
      const editais = Array.from({ length: limit }, (_, i) => {
        const index = offset + i
        if (index >= totalEditais) return null
        return {
          id: index + 1,
          titulo:
            index % 4 === 0
              ? 'Prêmio Mejores ONGs 2025 - Colômbia'
              : `Descrição do edital #${index + 1}`,
          certificadora: index % 4 === 0 ? 'CertificadoraSocial' : null,
          areaInteresse: index % 4 === 0 ? 'Cidadania e Justiça' : null,
          descricao: 'Descrição detalhada do edital aqui.',
        }
      }).filter(Boolean)
      resolve(editais)
    }, 1000)
  })
}

const Editais_Validados = () => {
  const [editais, setEditais] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [offset, setOffset] = useState(0)
  const limit = 6

  const carregarEditais = () => {
    setLoading(true)
    setError(null)
    mockFetchEditais(offset, limit)
      .then((novosEditais) => {
        if (novosEditais.length === 0) return
        setEditais((prev) => [...prev, ...novosEditais])
        setOffset((prev) => prev + limit)
      })
      .catch(() => setError('Erro ao carregar editais.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    carregarEditais()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 md:px-12 py-8">
        <div className="w-full max-w-6xl mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Editais validados pela comunidade
            <Users className="w-7 h-7 text-gray-700" />
          </h1>
        </div>

        <div className="w-full max-w-6xl flex gap-4 mb-10 items-center">
          <div className="flex items-center gap-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Pesquisar"
                className="w-80 px-4 py-2 rounded-l border border-gray-300 focus:outline-none"
              />
              <button className="px-4 bg-gray-200 rounded-r border-t border-b border-r border-gray-300 cursor-pointer">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded border border-gray-300 bg-white text-sm text-gray-700 cursor-pointer">
                <option>Filtrar</option>
              </select>
              <div
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 rounded px-1 flex items-center justify-center"
                style={{ width: '1.5rem', height: '1.5rem' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#666"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* GRID COM OS CARDS */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {editais.map((edital) => (
            <Card
              key={edital.id}
              variante={edital.certificadora ? 'detalhado' : 'simples'}
              titulo={edital.titulo}
              instituicao={edital.certificadora || 'Instituição não informada'}
              descricao={edital.descricao}
              imagem={null} // ou coloque uma URL de imagem se quiser
              area={edital.areaInteresse || 'Sem área'}
            />
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <button
          className="mb-16 px-6 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition cursor-pointer"
          onClick={carregarEditais}
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Carregar mais'}
        </button>
      </main>

      <Footer />
    </div>
  )
}

export default Editais_Validados
