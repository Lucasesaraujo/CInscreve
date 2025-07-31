// src/pages/EditalEspecifico.jsx

'use client'

import React, { useState, useEffect, useCallback } from 'react'
// Removidas as importações de Header e Footer para evitar duplicação
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'
import { Heart, Bell, FileText } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { getEditalById, validarEdital, toggleFavoritoEdital } from '../services/apiEditais'
import { getUserData } from '../services/apiAuth'

const EditalEspecifico = () => {
  const { id } = useParams()

  const [edital, setEdital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usuarioLogado, setUsuarioLogado] = useState(null)
  const [favorito, setFavorito] = useState(false)
  const [notificacao, setNotificacao] = useState(false)
  const [jaValidou, setJaValidou] = useState(false)
  const [podeValidar, setPodeValidar] = useState(true)

  const fetchEditalAndUser = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const userData = await getUserData()
      setUsuarioLogado(userData?.usuario)

      if (!id) {
        setError('ID do edital não fornecido na URL.')
        return
      }

      const fetchedEdital = await getEditalById(id)
      setEdital(fetchedEdital)

      if (userData?.usuario) {
        setFavorito(fetchedEdital.usuarioJaFavoritou || false)
        setJaValidou(fetchedEdital.usuarioJaValidou || false)
        setPodeValidar(
          !(
            fetchedEdital.sugeridoPor?._id?.toString() === userData.usuario.id.toString() ||
            fetchedEdital.usuarioJaValidou
          )
        )
      }
    } catch (err) {
      console.error('Erro ao carregar edital específico:', err)
      setError(err.message || 'Erro ao carregar o edital.')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchEditalAndUser()
  }, [fetchEditalAndUser])

  const handleToggleFavorito = async () => {
    if (!usuarioLogado) {
      alert('Você precisa estar logado para favoritar/desfavoritar um edital!')
      return
    }
    setFavorito((prev) => !prev)
    const novoEstadoFavorito = !favorito
    try {
      const updatedFavoritosList = await toggleFavoritoEdital(edital._id)
      setFavorito(updatedFavoritosList.some((fav) => fav._id === usuarioLogado.id))
    } catch (err) {
      console.error('Erro ao alternar favorito:', err)
      alert(err.message || 'Erro ao favoritar/desfavoritar edital. Tente novamente.')
      setFavorito(novoEstadoFavorito)
    }
  }

  const handleValidarEdital = async (confiavel) => {
    if (!usuarioLogado) {
      alert('Você precisa estar logado para validar um edital!')
      return
    }
    if (!podeValidar) {
      alert('Você não pode validar este edital (já validou ou é o sugeridor).')
      return
    }
    if (!confiavel) {
      alert('A função "Não" ainda não está implementada para registrar desconfiança. Use o botão de denúncia se ele existir!');
      return;
    }
    try {
      const result = await validarEdital(edital._id)
      setEdital(result.edital)
      setJaValidou(true)
      setPodeValidar(false)
      alert(result.mensagem || 'Edital validado com sucesso!')
    } catch (err) {
      console.error('Erro ao validar edital:', err)
      alert(err.message || 'Erro ao validar edital.')
    }
  }

  const handleInscrever = () => {
    if (edital.link) {
      window.open(edital.link, '_blank')
    } else {
      alert('Link de inscrição não disponível para este edital.')
    }
  }

  // --- Lógica de renderização de conteúdo único ---
  if (loading) {
    return <div className="flex justify-center items-center flex-1">Carregando edital...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center flex-1 text-red-600">{error}</div>;
  }

  if (!edital) {
    return <div className="flex justify-center items-center flex-1 text-gray-600">Edital não encontrado.</div>;
  }

  const imagemDoEdital = edital.imagens && edital.imagens.length > 0
    ? edital.imagens[0].startsWith('http')
        ? edital.imagens[0]
        : `http://localhost:3000${edital.imagens[0]}`
    : 'https://via.placeholder.com/1152x250?text=Imagem+Padrao+do+Edital';

  return (
    <main className="flex-1 max-w-6xl mx-auto py-10 px-4">
      <div className="w-full h-64 bg-gray-200 mb-0 shadow-md">
          <img
              src={imagemDoEdital}
              alt={`Banner do ${edital.nome}`}
              className="w-full h-full object-cover"
          />
      </div>
      <div className="w-full bg-white border-x border-b border-gray-300 p-4 text-center mb-8 shadow-sm">
        <Tipografia tipo="subtitulo" className="text-gray-800 font-semibold">
          {edital.nome}
        </Tipografia>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="border border-gray-300 p-4 flex-grow">
              <p className="text-sm font-semibold text-gray-800">Inscrições de:</p>
              <p className="text-sm text-gray-600">
                {new Date(edital.periodoInscricao.inicio).toLocaleDateString()} {new Date(edital.periodoInscricao.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} até {new Date(edital.periodoInscricao.fim).toLocaleDateString()} {new Date(edital.periodoInscricao.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-xs text-gray-500">Horário de Brasília</p>
            </div>
            <Botao
              variante="azul-medio"
              className="!w-48 h-full cursor-pointer"
              onClick={handleInscrever}
              disabled={!edital.link}
            >
              Inscreva-se
            </Botao>
            <div className="flex items-center gap-4">
              <p className="font-semibold text-sm">Este edital é confiável? ({edital.validacoesCount || 0} votos)</p>
              <div className="flex gap-2">
                <Botao className='cursor-pointer' variante="sim" onClick={() => handleValidarEdital(true)} disabled={!usuarioLogado || !podeValidar}>Sim</Botao>
                <Botao className='cursor-pointer' variante="nao" onClick={() => handleValidarEdital(false)} disabled={!usuarioLogado || !podeValidar}>Não</Botao>
              </div>
            </div>
          </div>
          <section>
            <Tipografia tipo="subtitulo" className="border-b-2 border-blue-600 pb-2 mb-4">
              Sobre
            </Tipografia>
            <Tipografia tipo="texto" className="text-gray-700 whitespace-pre-line">
              {edital.descricao}
            </Tipografia>
          </section>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-around bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <button
              onClick={handleToggleFavorito}
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
              disabled={!usuarioLogado}
            >
              <Heart className={`w-7 h-7 ${favorito ? 'text-red-500 fill-current' : ''}`} />
              <span className="text-sm font-medium">{favorito ? 'Favorito' : 'Favoritar'}</span>
            </button>
            <button
              onClick={() => setNotificacao(!notificacao)}
              className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors cursor-pointer"
              disabled={!usuarioLogado}
            >
              <Bell className={`w-7 h-7 ${notificacao ? 'text-blue-500 fill-current' : ''}`} />
              <span className="text-sm font-medium">{notificacao ? 'Notificações Ativas' : 'Notificar'}</span>
            </button>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm text-center">
            <Tipografia tipo="texto" className="font-semibold">{edital.organizacao}</Tipografia>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <Tipografia tipo="texto" className="font-bold mb-3">Anexos</Tipografia>
            <ul className="space-y-2">
              {edital.anexos && edital.anexos.length > 0 ? (
                edital.anexos.map((anexoUrl, index) => (
                  <li key={index}>
                    <a href={anexoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-sm text-blue-700 hover:bg-gray-100 rounded-md">
                      <FileText className="w-5 h-5 flex-shrink-0" />
                      <span>{`Anexo ${index + 1}`}</span>
                    </a>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-sm">Nenhum anexo disponível.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditalEspecifico;