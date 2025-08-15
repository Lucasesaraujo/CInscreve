'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'
import { Heart, FileText } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEditalById, validarEdital, denunciarEdital } from '../services/apiEditais'
import { useEdital } from '../contexts/EditalContext'
import { useAuth } from '../contexts/AuthContext'
import AlertaErro from '../components/AlertaErro'

const EditalEspecifico = () => {
  const { id } = useParams()
  const { isFavorito, toggleFavorito } = useEdital()
  const { usuario, isAutenticado } = useAuth()
  const [edital, setEdital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [jaValidou, setJaValidou] = useState(false)
  const [jaDenunciou, setJaDenunciou] = useState(false)
  const [podeValidar, setPodeValidar] = useState(true)
  const [alertaErro, setAlertaErro] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchEdital = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!id) {
          setError('ID do edital não fornecido na URL.')
          setLoading(false)
          return
        }

        const fetchedEdital = await getEditalById(id)
        setEdital(fetchedEdital)

        if (isAutenticado && usuario?.id) {
          const usuarioId = usuario.id

          const usuarioJaValidou = fetchedEdital.validadoPor?.some(
            u => u._id?.toString() === usuarioId.toString()
          ) || false
          setJaValidou(usuarioJaValidou)

          const usuarioJaDenunciou = fetchedEdital.denunciadoPor?.some(
            u => u._id?.toString() === usuarioId.toString()
          ) || false
          setJaDenunciou(usuarioJaDenunciou)

          setPodeValidar(
            !(fetchedEdital.sugeridoPor?._id?.toString() === usuarioId.toString() ||
              usuarioJaValidou ||
              usuarioJaDenunciou)
          )
        }
      } catch (err) {
        console.error("Erro ao carregar edital específico:", err)
        setError(err.message || 'Erro ao carregar o edital.')
      } finally {
        setLoading(false)
      }
    }

    fetchEdital()
  }, [id, isAutenticado, usuario])

  const redirecionarLogin = () => {
    setAlertaErro('Você precisa estar logado para realizar esta ação!')
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  const handleToggleFavorito = async () => {
    if (!isAutenticado) return redirecionarLogin()
    try {
      await toggleFavorito(edital._id)
    } catch (err) {
      console.error("Erro ao alternar favorito:", err)
      setAlertaErro(err.message || 'Erro ao favoritar/desfavoritar edital.')
    }
  }

  const handleValidarEdital = async () => {
    if (!isAutenticado) return redirecionarLogin()
    if (!podeValidar) return setAlertaErro('Você não pode validar este edital.')

    try {
      await validarEdital(edital._id)
      setEdital(prev => ({
        ...prev,
        validadoPor: [...prev.validadoPor, { _id: usuario.id }],
        validacoesCount: (prev.validacoesCount || 0) + 1
      }))
      setJaValidou(true)
      setPodeValidar(false)
    } catch (err) {
      console.error("Erro ao validar edital:", err)
      setAlertaErro(err.message || 'Erro ao validar edital.')
    }
  }

  const handleDenunciarEdital = async () => {
    if (!isAutenticado) return redirecionarLogin()
    try {
      await denunciarEdital(edital._id)
      setEdital(prev => ({
        ...prev,
        denunciadoPor: [...prev.denunciadoPor, { _id: usuario.id }]
      }))
      setJaDenunciou(true)
      setPodeValidar(false)
    } catch (err) {
      console.error("Erro ao denunciar edital:", err)
      setAlertaErro(err.message || 'Erro ao denunciar edital.')
    }
  }

  const handleInscrever = () => {
    if (!isAutenticado) return redirecionarLogin()
    if (edital.link) {
      window.open(edital.link, '_blank')
    } else {
      setAlertaErro('Link de inscrição não disponível para este edital.')
    }
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen">Carregando edital...</div>
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>
  if (!edital) return <div className="flex justify-center items-center min-h-screen text-gray-600">Edital não encontrado.</div>

  const imagemDoEdital = edital.imagem && edital.imagem.length > 0
    ? edital.imagem[0].startsWith('http') ? edital.imagem[0] : `http://localhost:3000${edital.imagem[0]}`
    : 'https://via.placeholder.com/1152x250?text=Imagem+Padrao+do+Edital'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Alerta de erro */}
      {alertaErro && <AlertaErro mensagem={alertaErro} onClose={() => setAlertaErro('')} />}

      <main className="flex-1 max-w-6xl mx-auto py-10 px-4">
        <div className="w-full h-64 bg-gray-200 mb-0 shadow-md">
          <img src={imagemDoEdital} alt={`Banner do ${edital.nome}`} className="w-full h-full object-cover" />
        </div>

        <div className="w-full bg-white border-x border-b border-gray-300 p-4 text-center mb-8 shadow-sm">
          <Tipografia tipo="subtitulo" className="text-gray-800 font-semibold">{edital.nome}</Tipografia>
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
                className="!w-48 h-full cursor-pointer mt-4"
                onClick={handleInscrever}
                disabled={!(edital.link && (edital.validado || jaValidou))}
              >
                Inscreva-se
              </Botao>

              <div className="flex gap-2 items-center flex-wrap">
                {!(jaValidou || jaDenunciou) ? (
                  <>
                    <Tipografia tipo = 'texto' className="font-semibold">
                      Este edital é confiável?
                    </Tipografia>

                    <Botao className="cursor-pointer" variante="sim" onClick={handleValidarEdital}>Sim</Botao>
                    <Botao className="cursor-pointer" variante="nao" onClick={handleDenunciarEdital}>Não</Botao>
                  </>
                ) : jaValidou ? (
                  <span className="text-green-600 font-semibold mt-6">Você validou este edital!</span>
                ) : (
                  <span className="text-red-600 font-semibold mt-6">Você denunciou este edital!</span>
                )}
              </div>
            </div>

            <section>
              <Tipografia tipo="subtitulo" className="border-b-2 border-blue-600 pb-2 mb-4">Sobre</Tipografia>
              <Tipografia tipo="texto" className="text-gray-700 whitespace-pre-line">{edital.descricao}</Tipografia>
            </section>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-around bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <button
                onClick={handleToggleFavorito}
                className="flex flex-col items-center gap-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
              >
                <Heart className={`w-7 h-7 ${isFavorito(edital._id) ? 'text-red-500 fill-current' : ''}`} />
                <span className="text-sm font-medium">{isFavorito(edital._id) ? 'Favorito' : 'Favoritar'}</span>
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

      <Footer />
    </div>
  )
}

export default EditalEspecifico
