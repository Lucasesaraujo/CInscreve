import React, { useState, useEffect } from 'react';

// 1. Importando componentes 
import Header from '../components/Header';
import Footer from '../components/Footer';
import Carrossel from '../components/Carrossel';
import Input from '../components/Input'; // Usado para a barra de pesquisa

// --- ÍCONES (Mantidos para a barra de pesquisa, se necessário) ---
const Search = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// --- DADOS MOCKADOS (Simula os dados que viriam de uma API) ---
const mockEditais = [
  { id: 1, titulo: 'Prêmio Melhores ONGs 2025 - Colômbia', instituicao: 'Certificadora Social', area: 'Causa Social', tipo: 'destaque', variante: 'simples' },
  { id: 2, titulo: 'Edital de Inovação para a Indústria', instituicao: 'Agência de Fomento', area: 'Tecnologia', tipo: 'destaque', variante: 'simples' },
  { id: 3, titulo: 'Fomento à Cultura Local', instituicao: 'Secretaria de Cultura', area: 'Cultura', tipo: 'destaque', variante: 'simples' },
  { id: 4, titulo: 'Apoio a Startups de Tecnologia', instituicao: 'Investe PE', area: 'Inovação', tipo: 'destaque', variante: 'simples' },
  { id: 5, titulo: 'Prêmio de Sustentabilidade 2025', instituicao: 'Certificadora Social', area: 'Meio Ambiente', tipo: 'validado', variante: 'simples' },
  { id: 6, titulo: 'Edital de Saúde Comunitária', instituicao: 'Ministério da Saúde', area: 'Saúde', tipo: 'validado', variante: 'simples' },
  { id: 7, titulo: 'Incentivo ao Esporte Amador', instituicao: 'Governo Estadual', area: 'Esporte', tipo: 'validado', variante: 'simples' },
  { id: 8, titulo: 'Programa de Bolsas de Estudo', instituicao: 'Fundação Aprender', area: 'Educação', tipo: 'validado', variante: 'simples' },
  { id: 9, titulo: 'Edital de Apoio a Artesãos Locais', instituicao: 'Certificadora Social', area: 'Cultura', tipo: 'esperando', variante: 'simples' },
  { id: 10, titulo: 'Programa Jovem Aprendiz', instituicao: 'Empresas Parceiras', area: 'Emprego', tipo: 'esperando', variante: 'simples' },
  { id: 11, titulo: 'Fundo de Apoio à Pesquisa Científica', instituicao: 'CNPq', area: 'Ciência', tipo: 'esperando', variante: 'simples' },
  { id: 12, titulo: 'Edital de Cinema e Audiovisual', instituicao: 'Ancine', area: 'Audiovisual', tipo: 'esperando', variante: 'simples' },
];

/**
 * Componente da Página Principal (Homepage de Editais)
 * Estrutura a página inteira utilizando componentes compartilhados.
 */
export default function EditalHomepage() {
  const [editaisDestaque, setEditaisDestaque] = useState([]);
  const [editaisValidados, setEditaisValidados] = useState([]);
  const [editaisEsperando, setEditaisEsperando] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');

  // Filtra os editais por tipo quando o componente é montado
  useEffect(() => {
    setEditaisDestaque(mockEditais.filter(e => e.tipo === 'destaque'));
    setEditaisValidados(mockEditais.filter(e => e.tipo === 'validado'));
    setEditaisEsperando(mockEditais.filter(e => e.tipo === 'esperando'));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      {}
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- Seção de Boas-Vindas e Pesquisa --- */}
        <section className="py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Oportunidades diversas em um só lugar
            </h1>
            <div className="flex items-center gap-2 mt-6">
              <div className="flex w-full max-w-sm">
                {}
                <Input
                  tipo="text"
                  valor={termoPesquisa}
                  onChange={e => setTermoPesquisa(e.target.value)}
                  placeholder="Pesquisar"
                  className="rounded-r-none border-r-0" // Ajustes para encaixar o botão
                />
                <button className="p-2 bg-gray-700 rounded-r-lg border border-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <Search className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <select className="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Filtrar</option>
                  <option>Causa Social</option>
                  <option>Meio Ambiente</option>
                  <option>Cultura</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex items-center justify-center p-8">
             <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                 <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
             </div>
          </div>
        </section>

        {}
        <Carrossel titulo="Editais em destaque" cards={editaisDestaque} />
        <Carrossel titulo="Editais Validados" cards={editaisValidados} />
        <Carrossel titulo="Editais esperando validação" cards={editaisEsperando} />
        
      </main>

      {}
      <Footer />
    </div>
  );
}
