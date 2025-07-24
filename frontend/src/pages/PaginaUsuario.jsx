'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Card from '../components/Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Carrossel from '../components/Carrossel'
import Tipografia from '../components/Tipografia'
import Fundo from '../assets/base.png'

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
    <div className="flex flex-col min-h-screen" style={{ backgroundImage: `url(${Fundo})` }}>

      {/* Bloco de editais favoritados */}
      <section className="relative bg-cover bg-center bg-no-repeat py-16">
        <div className="w-full px-6 md:px-20 lg:px-32">
          <Tipografia tipo="titulo" className="mb-2 text-4xl text-black text-center">
            Editais favoritados por você
          </Tipografia>
          <Tipografia tipo="subtitulo" className="text-gray-500 text-center">
            Seus favoritos ficam todos aqui.
          </Tipografia>
        </div>

        {loading ? (
          <p className="text-center mt-8 text-gray-600">Carregando editais...</p>
        ) : error ? (
          <p className="text-center mt-8 text-red-600">{error}</p>
        ) : favoritos.length === 0 ? (
          <p className="text-center mt-8 text-gray-600">Nenhum edital favoritado.</p>
        ) : (
          <div className="px-28 mt-8">
            <Carrossel
              titulo=""
              cards={favoritos.map((edital) => ({
                key: edital.id,
                variante: 'detalhado',
                titulo: edital.nome,
                descricao: edital.descricao,
                favoritoInicial: edital.favorito,
                notificacaoInicial: edital.notificacao,
                area: edital.area || 'Outros',
                _id: edital._id || 'Erro',
                onToggleFavorito: () => toggleFavorito(edital.id),
                onToggleNotificacao: () => toggleNotificacao(edital.id),
              }))}
            />
          </div>
        )}
      </section>

      {/* Sugeridos */}
      <section className="relative bg-cover bg-center bg-no-repeat py-16">
        <div className="w-full px-6 md:px-20 lg:px-32">
          <Tipografia tipo="titulo" className="mb-2 text-4xl text-black text-center">
            Editais sugeridos por você
          </Tipografia>
          <Tipografia tipo="subtitulo" className="text-gray-500 text-center">
            Seus sugeridos ficam todos aqui.
          </Tipografia>
        </div>

        {loading ? (
          <p className="text-center mt-8 text-gray-600">Carregando editais...</p>
        ) : error ? (
          <p className="text-center mt-8 text-red-600">{error}</p>
        ) : sugeridos.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-8">
            <p className="text-lg font-semibold mb-2">Nenhuma sugestão por aqui... ainda.</p>
            <p className="text-gray-600 mb-4">Compartilhe editais que podem fazer a diferença!</p>
            <button className="bg-black text-white px-4 py-2 rounded-md cursor-pointer">
              Sugerir edital
            </button>
          </div>
        ) : (
          <div className="px-28 mt-8">
            <Carrossel
              titulo=""
              cards={sugeridos.map((edital) => ({
                key: edital.id,
                variante: 'detalhado',
                titulo: edital.nome,
                descricao: edital.descricao,
                area: edital.area || 'Outros',
                _id: edital._id || 'Erro'
              }))}
            />
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}

export default Usuario
