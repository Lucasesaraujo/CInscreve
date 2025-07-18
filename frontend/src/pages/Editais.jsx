import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Botao from '../components/Botao';
import Tipografia from '../components/Tipografia';
import Card from '../components/Card';
import Carrossel from '../components/Carrossel';
import { Search, ChevronDown } from 'lucide-react';

// Dados mockados
const allMockEditais = [
  { id: 1, titulo: 'Prêmio Melhores ONGs 2025 - Colômbia', instituicao: 'Certificadora Social', area: 'Causa Social', categoria: 'destaque', variante: 'detalhado', descricao: 'Este edital tem como objetivo selecionar e apoiar financeiramente projetos culturais que promovam a inclusão social por meio da arte em comunidades urbanas.' },
  { id: 2, titulo: 'Edital de Inovação para a Indústria', instituicao: 'Agência de Fomento', area: 'Tecnologia', categoria: 'destaque', variante: 'detalhado', descricao: 'O edital visa impulsionar a inovação e o desenvolvimento tecnológico em diversos setores industriais.' },
  { id: 3, titulo: 'Fomento à Cultura Local', instituicao: 'Secretaria de Cultura', area: 'Cultura', categoria: 'destaque', variante: 'detalhado', descricao: 'Iniciativa para apoiar artistas e projetos culturais que valorizem as tradições e expressões locais.' },
  { id: 4, titulo: 'Apoio a Startups de Tecnologia', instituicao: 'Investe PE', area: 'Inovação', categoria: 'destaque', variante: 'detalhado', descricao: 'Edital direcionado a startups com soluções inovadoras e potencial de impacto no mercado de tecnologia.' },
  { id: 5, titulo: 'Prêmio de Sustentabilidade 2025', instituicao: 'Certificadora Social', area: 'Meio Ambiente', categoria: 'validado', variante: 'detalhado', descricao: 'Reconhece e premia projetos que contribuem para a preservação ambiental e o desenvolvimento sustentável.' },
  { id: 6, titulo: 'Edital de Saúde Comunitária', instituicao: 'Ministério da Saúde', area: 'Saúde', categoria: 'validado', variante: 'detalhado', descricao: 'Foco em projetos que visam melhorar a qualidade de vida e o acesso à saúde em comunidades carentes.' },
  { id: 7, titulo: 'Incentivo ao Esporte Amador', instituicao: 'Governo Estadual', area: 'Esporte', categoria: 'validado', variante: 'detalhado', descricao: 'Apoio a clubes e associações esportivas amadoras, promovendo a prática de atividades físicas.' },
  { id: 8, titulo: 'Programa de Bolsas de Estudo', instituicao: 'Fundação Aprender', area: 'Educação', categoria: 'validado', variante: 'detalhado', descricao: 'Oferece bolsas de estudo para alunos de baixa renda que desejam ingressar no ensino superior.' },
  { id: 9, titulo: 'Edital de Apoio a Artesãos Locais', instituicao: 'Certificadora Social', area: 'Cultura', categoria: 'esperando', variante: 'detalhado', descricao: 'Incentiva a produção artesanal, valorizando a cultura e a economia local através do artesanato.' },
  { id: 10, titulo: 'Programa Jovem Aprendiz', instituicao: 'Empresas Parceiras', area: 'Emprego', categoria: 'esperando', variante: 'detalhado', descricao: 'Promove a inserção de jovens no mercado de trabalho, oferecendo qualificação e experiência profissional.' },
  { id: 11, titulo: 'Fundo de Apoio à Pesquisa Científica', instituicao: 'CNPq', area: 'Ciência', categoria: 'esperando', variante: 'detalhado', descricao: 'Recursos para financiar pesquisas científicas que gerem conhecimento e inovação em diversas áreas.' },
  { id: 12, titulo: 'Edital de Cinema e Audiovisual', instituicao: 'Ancine', area: 'Audiovisual', categoria: 'esperando', variante: 'detalhado', descricao: 'Apoia a produção e distribuição de filmes e outras obras audiovisuais nacionais.' },
  { id: 13, titulo: 'Edital de Inovação Social', instituicao: 'Inova Brasil', area: 'Causa Social', categoria: 'destaque', variante: 'detalhado', descricao: 'Foco em soluções inovadoras para problemas sociais.' },
  { id: 14, titulo: 'Apoio a Projetos de Voluntariado', instituicao: 'Voluntariar Agora', area: 'Causa Social', categoria: 'validado', variante: 'detalhado', descricao: 'Suporte a iniciativas que promovem o engajamento voluntário.' },
  { id: 15, titulo: 'Concurso de Curtas-Metragens', instituicao: 'CinePE', area: 'Audiovisual', categoria: 'esperando', variante: 'detalhado', descricao: 'Incentivo à produção cinematográfica independente.' },
];

export default function EditalHomepage() {
  const [termoBusca, setTermoBuscado] = useState('');
  const [categoriaSelecionada, setcategoriaSelecionada] = useState('Todas');
  const [EditaisFiltradosEBuscados, setEditaisFiltradosEBuscados] = useState([]);
  const [displayStatusMessage, setDisplayStatusMessage] = useState('');

  useEffect(() => {
    let editalFiltro = allMockEditais;
    let mensagem = '';

    // Aplica filtro de pesquisa
    if (termoBusca) {
      editalFiltro = editalFiltro.filter(edital =>
        edital.titulo.toLowerCase().includes(termoBusca.toLowerCase()) ||
        edital.instituicao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        edital.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
        edital.area.toLowerCase().includes(termoBusca.toLowerCase())
      );
      mensagem = `Resultados da pesquisa por: "${termoBusca}"`;
    }

    // Aplica filtro de categoria selecinada no filtro
    if (categoriaSelecionada !== 'Todas') {
      editalFiltro = editalFiltro.filter(edital =>
        edital.area === categoriaSelecionada
      );
      if (mensagem) {
        mensagem += ` e filtro por área: "${categoriaSelecionada}"`;
      } else {
        mensagem = `Filtro aplicado por área: "${categoriaSelecionada}"`;
      }
    }

    setEditaisFiltradosEBuscados(editalFiltro);
    setDisplayStatusMessage(mensagem);

  }, [termoBusca, categoriaSelecionada]);

  const handleSearchChange = (e) => {
    setTermoBuscado(e.target.value);
  };

  const handleMudancaCategoria = (e) => {
    setcategoriaSelecionada(e.target.value);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/*Seção de Boas-Vindas e caixas de pesquisa/filtro*/}
        <section className="py-12 md:py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Oportunidades diversas em um só lugar
            </h1>
            <div className="flex items-center gap-2 mt-6">
              {/* Barra de pesquisa*/}
              <div className="flex w-full max-w-lg items-stretch rounded-md shadow-sm overflow-hidden">
                <input
                  type="text"
                  placeholder="Pesquisar"
                  className="w-[90%] pl-4 py-2 text-gray-700 placeholder-gray-500 border-none bg-white focus:ring-0"
                  value={termoBusca}
                  onChange={handleSearchChange}
                />
                <Botao variante="azul-escuro" className="w-[10%] !rounded-none flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </Botao>
              </div>

              {/* Filtro*/}
              <div className="relative w-2/3 max-w-xs ml-4 rounded-md shadow-sm overflow-hidden">
                <select
                  className="w-full h-full appearance-none bg-white border-none py-2 pl-4 pr-12 text-gray-700 focus:ring-0"
                  value={categoriaSelecionada}
                  onChange={handleMudancaCategoria}
                >
                  <option value="Todas">Filtrar</option>
                  <option value="Causa Social">Causa Social</option>
                  <option value="Tecnologia">Tecnologia</option>
                  <option value="Cultura">Cultura</option>
                  <option value="Inovação">Inovação</option>
                  <option value="Meio Ambiente">Meio Ambiente</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Esporte">Esporte</option>
                  <option value="Educação">Educação</option>
                  <option value="Emprego">Emprego</option>
                  <option value="Ciência">Ciência</option>
                  <option value="Audiovisual">Audiovisual</option>
                </select>
                <div className="absolute right-0 top-0 h-full w-[27%] pointer-events-none">
                  <Botao variante="azul-escuro" className="h-full w-full !rounded-none flex items-center justify-center">
                    <ChevronDown className="w-5 h-5" />
                  </Botao>
                </div>
              </div>
            </div>
            {/* Mostra mensagem de status de acordo com o filtro/pesquisa*/}
            {displayStatusMessage && (
              <Tipografia tipo="texto" className="text-gray-700 mt-4">
                {displayStatusMessage}
              </Tipografia>
            )}
          </div>
          <div className="md:w-1/2 flex items-center justify-center p-8">
             <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                 <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
             </div>
          </div>
        </section>

        {/* Renderiza Carrossel baseado na atividade de busca/filtro */}
        {(termoBusca || categoriaSelecionada !== 'Todas') ? (
          <Carrossel
            titulo="Resultados da Busca"
            cards={EditaisFiltradosEBuscados}
          />
        ) : (
          <>
            <Carrossel
              titulo="Editais em Destaque"
              cards={allMockEditais.filter(e => e.categoria === 'destaque')}
            />
            <Carrossel
              titulo="Editais Validados"
              cards={allMockEditais.filter(e => e.categoria === 'validado')}
            />
            <Carrossel
              titulo="Editais esperando validação"
              cards={allMockEditais.filter(e => e.categoria === 'esperando')}
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

