'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const USER_BASE_URL = 'http://localhost:3000/user' // ajustar se necessário

async function getEditaisFavoritosDoUsuario() {
  try {
    const res = await fetch(`${USER_BASE_URL}/favoritos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      if (res.status === 401) {
        window.location.href = '/login'
      }
      throw new Error(`Erro ao buscar favoritos: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.favoritos || []
  } catch (err) {
    console.error('Erro ao buscar editais favoritos:', err)
    return []
  }
}

async function fetchEditaisSugeridos() {
  try {
    const res = await fetch(`${USER_BASE_URL}/sugeridos`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!res.ok) {
      if (res.status === 401) {
        window.location.href = '/login'
      }
      throw new Error(`Erro ao buscar sugeridos: ${res.status} ${res.statusText}`)
    }

    const data = await res.json()
    return data.sugeridos || []
  } catch (err) {
    console.error('Erro ao buscar editais sugeridos:', err)
    return []
  }
}

const Usuario = () => {
  const [favoritos, setFavoritos] = useState([])
  const [sugeridos, setSugeridos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function carregarEditais() {
      setLoading(true)
      try {
        const [fav, sug] = await Promise.all([
          getEditaisFavoritosDoUsuario(),
          fetchEditaisSugeridos()
        ])
        setFavoritos(fav)
        setSugeridos(sug)
        setError(null)
      } catch {
        setError('Erro ao carregar editais.')
      } finally {
        setLoading(false)
      }
    }

    carregarEditais()
  }, [])

  const toggleFavorito = async (id) => {
    const edital = favoritos.find(e => e.id === id)
    const novoFavorito = !edital.favorito

    try {
      await fetch(`${USER_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorito: novoFavorito }),
      })

      setFavoritos((prev) =>
        prev.map((edital) =>
          edital.id === id ? { ...edital, favorito: novoFavorito } : edital
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar favorito', error)
    }
  }

  const toggleNotificacao = async (id) => {
    const edital = favoritos.find(e => e.id === id)
    const novaNotificacao = !edital.notificacao

    try {
      await fetch(`${USER_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificacao: novaNotificacao }),
      })

      setFavoritos((prev) =>
        prev.map((edital) =>
          edital.id === id ? { ...edital, notificacao: novaNotificacao } : edital
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar notificação', error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Favoritos */}
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
                  titulo={edital.nome}
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

      {/* Sugeridos */}
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
                  titulo={edital.nome}
                  descricao={edital.descricao}
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
  