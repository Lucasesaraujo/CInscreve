'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'
import { Heart, Bell, FileText } from 'lucide-react'

// Simula a busca de dados de um edital específico na API
const mockFetchEditalEspecifico = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: id,
        titulo: 'Edital nº 05/2025 – Apoio a Projetos Culturais Municipais',
        instituicao: 'Prefeitura do Recife',
        inscricoes: {
          inicio: '22/05/2025 09:00',
          fim: '20/06/2025 18:00',
        },
        descricao:
          'Este edital tem como objetivo selecionar e apoiar financeiramente projetos culturais que promovam a inclusão social por meio da arte em comunidades urbanas da cidade de São Paulo. A iniciativa visa fortalecer agentes culturais locais, incentivar a diversidade de expressões artísticas e ampliar o acesso da população à cultura. \n\n Serão selecionadas propostas de ONGs, coletivos e artistas independentes que atuem com teatro, música, dança, literatura, audiovisual ou outras linguagens artísticas. Os projetos devem ter foco em impacto social, participação comunitária e desenvolvimento cultural local. \n\n Os valores de apoio variam entre R$ 10 mil e R$ 50 mil, com recursos provenientes do Fundo Municipal de Cultura.',
        anexos: [
          { nome: 'Edital nº 05/2025 - MEJPE', url: '#' },
          { nome: 'Edital nº 05/2025 - MEJPE', url: '#' },
          { nome: 'Edital nº 05/2025 - MEJPE', url: '#' },
          { nome: 'Edital nº 05/2025 - MEJPE', url: '#' },
          { nome: 'Edital nº 05/2025 - MEJPE', url: '#' },
        ],
        // URL da imagem do banner
        imagemUrl: 'https://via.placeholder.com/1152x250/cccccc/808080?text=Imagem+do+Edital',
      })
    }, 1000)
  })
}

const EditalEspecifico = () => {
  // Estados para gerenciar os dados, carregamento, erros e interações do usuário
  const [edital, setEdital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favorito, setFavorito] = useState(false)
  const [notificacao, setNotificacao] = useState(false)

  // Efeito para buscar os dados do edital ao carregar a página
  useEffect(() => {
    setLoading(true)
    // O 'id' seria dinâmico, vindo da URL (ex: /editais/123)
    mockFetchEditalEspecifico('05-2025')
      .then((data) => {
        setEdital(data)
        setError(null)
      })
      .catch(() => setError('Erro ao carregar o edital.'))
      .finally(() => setLoading(false))
  }, [])

  // Renderização condicional enquanto os dados são carregados ou se ocorrer um erro
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando edital...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto py-10 px-4">
        {/* Banner de Imagem do Edital */}
        <div className="w-full h-64 bg-gray-200 mb-0 shadow-md">
            <img 
              src={edital.imagemUrl} 
              alt={`Banner do ${edital.titulo}`} 
              className="w-full h-full object-cover"
            />
        </div>

        {/* Caixa com o Título do Edital */}
        <div className="w-full bg-white border-x border-b border-gray-300 p-4 text-center mb-8 shadow-sm">
            <Tipografia tipo="subtitulo" className="text-gray-800 font-semibold">
                {edital.titulo}
            </Tipografia>
        </div>

        {/* Container principal com layout de 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Coluna da esquerda (Conteúdo do edital) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Seção de Inscrição e Validação */}
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="border border-gray-300 p-4 flex-grow">
                <p className="text-sm font-semibold text-gray-800">Inscrições de:</p>
                <p className="text-sm text-gray-600">
                  {edital.inscricoes.inicio} até {edital.inscricoes.fim}
                </p>
                <p className="text-xs text-gray-500">GMT-03 (Horário Padrão de Brasília)</p>
              </div>
              <Botao variante="azul-medio" className="!w-48 h-full">Inscreva-se</Botao>
              
              <div className="flex items-center gap-4">
                  <p className="font-semibold text-sm">Este edital é confiável?</p>
                  <div className="flex gap-2">
                    <Botao variante="sim">Sim</Botao>
                    <Botao variante="nao">Não</Botao>
                  </div>
              </div>
            </div>

            {/* Seção Sobre */}
            <section>
              <Tipografia tipo="subtitulo" className="border-b-2 border-blue-600 pb-2 mb-4">
                Sobre
              </Tipografia>
              <Tipografia tipo="texto" className="text-gray-700 whitespace-pre-line">
                {edital.descricao}
              </Tipografia>
            </section>
          </div>

          {/* Coluna da direita (Ações e Anexos) */}
          <div className="space-y-6">
            {/* Ações de Favoritar e Notificar */}
            <div className="flex items-center justify-around bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <button 
                  onClick={() => setFavorito(!favorito)} 
                  className="flex flex-col items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <Heart className={`w-7 h-7 ${favorito ? 'text-red-500 fill-current' : ''}`} />
                  <span className="text-sm font-medium">{favorito ? 'Favorito' : 'Favoritar'}</span>
                </button>
                <button 
                  onClick={() => setNotificacao(!notificacao)} 
                  className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors"
                >
                  <Bell className={`w-7 h-7 ${notificacao ? 'text-blue-500 fill-current' : ''}`} />
                  <span className="text-sm font-medium">{notificacao ? 'Notificações Ativas' : 'Notificar'}</span>
                </button>
            </div>
            
            {/* Box da Instituição */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm text-center">
              <Tipografia tipo="texto" className="font-semibold">{edital.instituicao}</Tipografia>
            </div>
            
            {/* Box de Anexos */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <Tipografia tipo="texto" className="font-bold mb-3">Anexos</Tipografia>
              <ul className="space-y-2">
                {edital.anexos.map((anexo, index) => (
                  <li key={index}>
                    <a href={anexo.url} className="flex items-center gap-2 p-2 text-sm text-blue-700 hover:bg-gray-100 rounded-md">
                      <FileText className="w-5 h-5 flex-shrink-0" />
                      <span>{anexo.nome}</span>
                    </a>
                  </li>
                ))}
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