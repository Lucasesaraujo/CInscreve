'use client'

import React, { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Input from '../components/Input'
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'

const SugerirEdital = () => {
  const [nomeEdital, setNomeEdital] = useState('')
  const [instituicao, setInstituicao] = useState('')
  const [link, setLink] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [descricao, setDescricao] = useState('')
  const [submitting, setSubmitting] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault();
  setSubmitting(true);

  const dataHoraInicio = new Date(`${dataInicio}T${horaInicio || '00:00:00'}`);
  const dataHoraFim = new Date(`${dataFim}T${horaFim || '23:59:59'}`);

  const payloadParaAPI = {
    nome: nomeEdital,
    organizacao: instituicao,
    periodoInscricao: {
      inicio: dataHoraInicio,
      fim: dataHoraFim,
    },
    descricao: descricao,
    link: link,
    imagens: [],
    anexos: [],
  };

  console.log('Cookies do navegador:', document.cookie)

  try {
    const resposta = await fetch('http://localhost:3000/editais', {
      method: 'POST',
      credentials: 'include',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(payloadParaAPI),
    });

    console.log(resposta);
  
    if (!resposta.ok) {
      if (resposta.status === 401) {
        alert('Sessão expirada. Faça login novamente.');
        window.location.href = '/login';
        return;
      }
      throw new Error('Erro ao enviar sugestão de edital');
    }

    const dados = await resposta.json();
    console.log('Sugestão enviada com sucesso:', dados);
    alert('Edital sugerido com sucesso!');

    setNomeEdital('');
    setInstituicao('');
    setLink('');
    setDataInicio('');
    setHoraInicio('');
    setDataFim('');
    setHoraFim('');
    setDescricao('');

  } catch (erro) {
    console.error('Erro ao sugerir edital:', erro);
    alert('Erro ao sugerir edital. Verifique os dados e tente novamente.');
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-10">
        <Tipografia tipo="titulo" className="mb-4 text-zinc-800">
          Sugerir edital
        </Tipografia>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-zinc-700">Informações</h2>
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
              <div></div>
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
            </div>
          </div>
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

export default SugerirEdital;
