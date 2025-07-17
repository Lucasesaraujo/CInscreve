'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Card from '../components/Card' // Importa o Card
import { ChevronLeft, ChevronRight } from 'lucide-react'

const mockFetchEditais = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        favoritos: [
          {
            id: 1,
            titulo: 'Edital de Captação',
            descricao: 'Descrição do edital de captação.',
            favorito: true,
            notificacao: false,
          },
          {
            id: 2,
            titulo: 'Edital de Pesquisa',
            descricao: 'Descrição do edital de pesquisa.',
            favorito: true,
            notificacao: true,
          },
          {
            id: 3,
            titulo: 'Edital de Bolsa',
            descricao: 'Descrição do edital de bolsa.',
            favorito: false,
            notificacao: false,
          },
        ],
        sugeridos: [],
      })
    }, 1000)
  })
}

const Usuario = () => {
  const [favoritos, setFavoritos] = useState([])
  const [sugeridos, setSugeridos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    mockFetchEditais()
      .then(({ favoritos, sugeridos }) => {
        setFavoritos(favoritos)
        setSugeridos(sugeridos)
        setError(null)
      })
      .catch(() => setError('Erro ao carregar editais.'))
      .finally(() => setLoading(false))
  }, [])

  // Funções para atualizar os estados e repassar para Card
  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.map((edital) =>
        edital.id === id ? { ...edital, favorito: !edital.favorito } : edital
      )
    )
  }

  const toggleNotificacao = (id) => {
    setFavoritos((prev) =>
      prev.map((edital) =>
        edital.id === id ? { ...edital, notificacao: !edital.notificacao } : edital
      )
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Editais Favoritados */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">Editais favoritados</h2>
        {loading ? (
          <p className="text-center">Carregando editais...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : favoritos.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum edital favoritado.</p>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
            <div className="flex gap-4 overflow-x-auto">
              {favoritos.map((edital) => (
                <Card
                  key={edital.id}
                  variante="detalhado"
                  titulo={edital.titulo}
                  descricao={edital.descricao}
                  favoritoInicial={edital.favorito}
                  notificacaoInicial={edital.notificacao}
                  onToggleFavorito={() => toggleFavorito(edital.id)}
                  onToggleNotificacao={() => toggleNotificacao(edital.id)}
                />
              ))}
            </div>
            <ChevronRight className="w-6 h-6 cursor-pointer" />
          </div>
        )}
      </section>

      {/* Editais sugeridos por você */}
      <section className="px-6 py-10 border-t border-gray-300">
        <h2 className="text-2xl font-semibold mb-10 text-center">Editais sugeridos por você</h2>
        {loading ? (
          <p className="text-center">Carregando editais...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : sugeridos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold mb-2">Nenhuma sugestão por aqui... ainda.</p>
            <p className="text-gray-600 mb-4">Compartilhe editais que podem fazer a diferença!</p>
            <button className="bg-black text-white px-4 py-2 rounded-md cursor-pointer">
              Sugerir edital
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <ChevronLeft className="w-6 h-6 cursor-pointer" />
            <div className="flex gap-4 overflow-x-auto">
              {sugeridos.map((edital) => (
                <Card
                  key={edital.id}
                  variante="detalhado"
                  titulo={edital.titulo}
                  descricao={edital.descricao}
                  // Aqui você pode ajustar se quiser favoritar/notificar sugeridos também
                />
              ))}
            </div>
            <ChevronRight className="w-6 h-6 cursor-pointer" />
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Usuario
