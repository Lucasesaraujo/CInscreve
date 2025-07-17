'use client'

import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'
import { FileText, X } from 'lucide-react'

const SugerirEdital = () => {
  // Estados para armazenar os dados de cada campo do formulário
  const [nomeEdital, setNomeEdital] = useState('')
  const [instituicao, setInstituicao] = useState('')
  const [link, setLink] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [descricao, setDescricao] = useState('')
  const [capa, setCapa] = useState(null)
  const [anexos, setAnexos] = useState([])

  // Estado para controlar o botão de submit e evitar múltiplos cliques
  const [submitting, setSubmitting] = useState(false)

  const handleAnexoChange = (e) => {
    const files = Array.from(e.target.files)
    setAnexos((prev) => [...prev, ...files].slice(0, 5))
  }

  const handleRemoveAnexo = (index) => {
    setAnexos((prev) => prev.filter((_, i) => i !== index))
  }

  // Função chamada ao enviar o formulário
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = {
      nomeEdital,
      instituicao,
      link,
      dataInicio,
      horaInicio,
      dataFim,
      horaFim,
      descricao,
      capa,
      anexos,
    }

    // Apenas exibe os dados no console para fins de desenvolvimento
    console.log('Dados do Formulário:', formData)
    alert('Sugestão enviada! Verifique o console para ver os dados.')

    // Reativa o botão após um pequeno atraso
    setTimeout(() => {
      setSubmitting(false)
    }, 500)
  }

  return (
    // div principal que engloba toda a página
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/*Parte principal da página*/}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
        <Tipografia tipo="titulo" className="mb-4 text-zinc-800">
          Sugerir edital
        </Tipografia>

        {/*Formulário principal que agrupa todas as seções de input*/}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/*Informações do edital*/}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-zinc-700">Informações</h2>
            
            {/* Grid para alinhar os campos de input em duas colunas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <Input
                titulo="Nome do edital"
                placeholder="Escreva aqui..."
                valor={nomeEdital}
                onChange={(e) => setNomeEdital(e.target.value)}
                tamanho="grande"
                required
              />
              <Input
                titulo="Link do edital"
                placeholder="Escreva aqui..."
                tipo="url"
                valor={link}
                onChange={(e) => setLink(e.target.value)}
                tamanho="grande"
              />
              <Input
                titulo="Instituição responsável"
                placeholder="Escreva aqui..."
                valor={instituicao}
                onChange={(e) => setInstituicao(e.target.value)}
                tamanho="grande"
                required
              />
              <div></div> {/*Espaçador do grid*/}
              <Input
                titulo="Data de início do edital"
                tipo="date"
                valor={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                tamanho="grande"
                required
              />
              <Input
                titulo="Hora de início do edital"
                tipo="time"
                valor={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                tamanho="grande"
              />
              <Input
                titulo="Data de encerramento do edital"
                tipo="date"
                valor={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                tamanho="grande"
                required
              />
              <Input
                titulo="Horário de encerramento do edital"
                tipo="time"
                valor={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
                tamanho="grande"
              />
              
              {/*Bloco pra descrição do edital*/}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-zinc-700">Descrição do edital</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Escreva aqui..."
                  maxLength="500"
                  className="w-full mt-1 px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#108cf0] focus:border-transparent text-sm min-h-[120px]"
                  required
                />
                <p className="text-right text-xs text-gray-500 mt-1">
                  {descricao.length}/500
                </p>
              </div>
              
              {/*Capa do edital(colocar a capa)*/}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-zinc-700">Capa do edital</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="capa-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-[#108cf0] hover:text-[#0b3e76] focus-within:outline-none">
                        <span>Clique para fazer upload</span>
                        <input id="capa-upload" name="capa-upload" type="file" className="sr-only" onChange={(e) => setCapa(e.target.files[0])} accept="image/*" />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    {capa ? (
                      <p className="text-xs text-green-600 font-semibold">{capa.name}</p>
                    ) : (
                      <p className="text-xs text-gray-500">PDF, .DOCX, .ODT ou .EPUB</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*Anexos*/}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-zinc-700">Anexos</h2>
            
            {/*Anexos já colocados*/}
            <div className="space-y-3">
              {anexos.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">{file.name}</span>
                  </div>
                  <button type="button" onClick={() => handleRemoveAnexo(index)}>
                    <X className="h-5 w-5 text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ))}
            </div>
            
            {/*Botão pra por novos anexos*/}
            <label htmlFor="anexo-upload" className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer">
              + Adicionar anexo
              <input id="anexo-upload" name="anexo-upload" type="file" multiple className="sr-only" onChange={handleAnexoChange} />
            </label>
          </div>

          {/*Botões(Cancelar e Sugerir)*/}
          <div className="flex justify-end gap-4 pt-4">
            <Botao variante="outline" type="button" onClick={() => window.history.back()}>
              Cancelar
            </Botao>
            <button
              type="submit"
              className="rounded-md px-6 py-3 transition flex items-center justify-center gap-2 text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 w-40 disabled:bg-gray-400"
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : 'Sugerir'}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}

export default SugerirEdital