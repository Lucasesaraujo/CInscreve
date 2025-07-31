import React, { useState, useEffect } from 'react';
import {
  getEditaisValidados,
  getEditaisDestaque,
  getEditaisNaoValidados
} from '../services/apiEditais';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Input from '../components/Input';
import Botao from '../components/Botao';
import Tipografia from '../components/Tipografia';
import Card from '../components/Card';
import Carrossel from '../components/Carrossel';
import { Search, ChevronDown } from 'lucide-react';
import Fundo from '../assets/base.png';
import Logo from '../assets/recife.png';

export default function Edital() {
  const [termoBusca, setTermoBuscado] = useState('');
  const [categoriaSelecionada, setcategoriaSelecionada] = useState('');
  const [editaisFiltradosEBuscados, setEditaisFiltradosEBuscados] = useState([]);
  const [displayStatusMessage, setDisplayStatusMessage] = useState('');
  const [cardsValidados, setCardsValidados] = useState([]);
  const [cardsDestaque, setCardsDestaque] = useState([]);
  const [cardsNaoValidados, setCardsNaoValidados] = useState([]);
  const [quantidadeRenderizada, setQuantidadeRenderizada] = useState(9);
  const [buscaDisparada, setBuscaDisparada] = useState(false);

  const buscarEditaisPorUrl = async () => {
    const params = new URLSearchParams();

    if (termoBusca) params.append('nome', termoBusca);
    if (categoriaSelecionada) params.append('area', categoriaSelecionada);

    const url = `http://localhost:3000/editais?${params.toString()}`;

    try {
      setQuantidadeRenderizada(9);
      setBuscaDisparada(true);

      const mensagem =
        formatados.length === 0
          ? 'Nenhum edital encontrado com os critérios selecionados.'
          : `Resultados para: ${termoBusca || 'sem termo'} + área: ${categoriaSelecionada || 'todas'}`;

      setDisplayStatusMessage(mensagem);

    } catch (erro) {
      console.error('Erro ao buscar editais:', erro);
      setEditaisFiltradosEBuscados([]);
      setDisplayStatusMessage('Erro ao buscar editais.');
      setBuscaDisparada(true);
    }
  };

  useEffect(() => {
    const formatar = (edital) => ({
      variante: 'simples',
      titulo: edital.nome,
      instituicao: edital.organizacao,
      descricao: edital.descricao,
      imagem: edital.imagem?.[0] || 'https://via.assets.so/img.jpg?w=400&h=300&tc=blue&bg=#cecece&t=nome_ong',
      area: edital.categoria || 'Outros',
      _id: edital._id || 'Erro'
    });
    
    getEditaisValidados().then(({ editais }) =>
      setCardsValidados(editais.map(formatar))
    );

    getEditaisDestaque().then(({ editais }) =>
      setCardsDestaque(editais.map(formatar))
    );

    getEditaisNaoValidados().then(({ editais }) =>
      setCardsNaoValidados(editais.map(formatar))
    );
  }, []);


  useEffect(() => {
    const todos = [...cardsValidados, ...cardsDestaque, ...cardsNaoValidados];
    let resultado = todos;
    let mensagem = '';

    if (categoriaSelecionada) {
      resultado = resultado.filter(edital =>
        edital.categoria?.toLowerCase() === categoriaSelecionada.toLowerCase()
      );
      mensagem = `Editais filtrados por área: "${categoriaSelecionada}"`;
    }

    if (termoBusca) {
      resultado = resultado.filter(edital =>
        edital.titulo?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        edital.instituicao?.toLowerCase().includes(termoBusca.toLowerCase()) ||
        edital.descricao?.toLowerCase().includes(termoBusca.toLowerCase())
      );
      mensagem += mensagem
        ? ` + busca por: "${termoBusca}"`
        : `Resultados da pesquisa por: "${termoBusca}"`;
    }

    setEditaisFiltradosEBuscados(resultado);
    setDisplayStatusMessage(mensagem);
    setQuantidadeRenderizada(9);
  }, [termoBusca, categoriaSelecionada, cardsValidados, cardsDestaque, cardsNaoValidados]);

  return (
    <section className="relative text-zinc-800 w-full min-h-screen">
      <img
        src={Fundo}
        alt="fundo"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

      <section className="w-full bg-[#f0f7fd] py-24 relative">
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:w-1/2">
            <Tipografia tipo="titulo" className="mb-6 text-gray-800 text-5xl">
              Oportunidades diversas em um só lugar
            </Tipografia>

            <div className="flex items-center gap-2 mt-6">
              <div className="flex w-full max-w-lg items-center">
                <Input
                  tipo="text"
                  valor={termoBusca}
                  onChange={(e) => setTermoBuscado(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') buscarEditaisPorUrl();
                  }}
                  placeholder="Pesquisar editais..."
                  tamanho="pesquisa"
                  className="rounded-r-none !border-r-0 !py-2 !text-sm !w-70"
                />
                <Botao
                  variante="azul-escuro"
                  className="rounded-l-none px-3 py-[0.44rem] !w-10 flex items-center justify-center h-[40px] -ml-px cursor-pointer"
                  onClick={buscarEditaisPorUrl}
                >
                  <Search className="w-4 h-4" />
                </Botao>
              </div>

              <div className="relative w-2/3 max-w-xs ml-4 rounded-md shadow-sm overflow-hidden">
                <select
                  className="w-full h-full appearance-none bg-white border-none py-2 pl-4 pr-12 text-gray-700 focus:ring-0 cursor-pointer"
                  value={categoriaSelecionada}
                  onChange={(e) => {
                    setcategoriaSelecionada(e.target.value);
                    setBuscaDisparada(false);
                  }}
                >
                  <option value="">Escolha uma área...</option>
                  <option value="Outros">Outros</option>
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
                  <Botao
                    variante="azul-escuro"
                    className="h-full w-full !rounded-none flex items-center justify-center"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </Botao>
                </div>
              </div>
            </div>

            {displayStatusMessage && buscaDisparada && (
              <Tipografia tipo="texto" className="text-gray-700 mt-4">
                {displayStatusMessage}
              </Tipografia>
            )}
          </div>

          <div className="absolute top-0 right-0 bottom-0 left-auto w-full max-w-[700px] z-0 overflow-hidden">
            <img
              src={Logo}
              alt="imagem ilustrativa"
              className="h-[384px] w-full object-cover"
            />
          </div>
        </div>
        <div className="absolute top-0 bottom-0 left-[51%] w-24 bg-gradient-to-r from-[#f0f7fd] to-transparent z-20 pointer-events-none" />
      </section>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(categoriaSelecionada !== '' || buscaDisparada) && editaisFiltradosEBuscados.length > 0 ? (
          <section className="mt-8">
            <Tipografia tipo="subtitulo" className="mb-6 capitalize font-bold">
              Editais encontrados
            </Tipografia>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-16 mt-10 max-w-6xl pl-16">
              {editaisFiltradosEBuscados.slice(0, quantidadeRenderizada).map((edital, index) => (
                <Card key={index} {...edital} />
              ))}
            </div>

            {editaisFiltradosEBuscados.length > quantidadeRenderizada && (
              <div className="flex justify-center mt-16 mb-0 ">
                <Botao className='cursor-pointer'
                  variante="azul-escuro"
                  onClick={() => setQuantidadeRenderizada(quantidadeRenderizada + 9)}
                >
                  Carregar mais
                </Botao>
              </div>
            )}
          </section>
        ) : (
          <>
            <div className="mb-10">
              <Carrossel titulo="Editais em Destaque" cards={cardsDestaque} />
            </div>
            <div className="mb-10">
              <Carrossel titulo="Editais Validados" cards={cardsValidados} />
            </div>
            <div className="mb-0">
              <Carrossel titulo="Editais esperando validação" cards={cardsNaoValidados} />
            </div>
          </>
        )}
      </main>

      {/* Rodapé */}
      <section className="bg-[#f0f7fd] mt-24">
        <Footer />
      </section>
    </section>
  );
}