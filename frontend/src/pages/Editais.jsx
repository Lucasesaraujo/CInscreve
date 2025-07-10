import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Botao from '../components/Botao';
import Tipografia from '../components/Tipografia';
import { Search, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// Componente de Carrossel
const Carousel = ({ title, data }) => {
  const [startIndex, setStartIndex] = useState(0);
  // Garante que temos um número mínimo de itens mostrando na tela
  const itemsPerPage = data.length < 4 ? data.length : 4;

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
  };

  // Cria a "janela" de itens a serem exibidos para o efeito de loop
  const displayedItems = useMemo(() => {
    const items = [];
    if (data.length === 0) return items;
    for (let i = 0; i < itemsPerPage; i++) {
      items.push(data[(startIndex + i) % data.length]);
    }
    return items;
  }, [startIndex, data, itemsPerPage]);

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <Tipografia tipo="subtitulo" className="!font-bold">{title}</Tipografia>
          <Botao variante="azul-escuro">Ver mais</Botao>
        </div>
        <div className="relative flex items-center">
          <button
            onClick={handlePrev}
            className="absolute -left-4 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          
          <div className="overflow-hidden w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
              {displayedItems.map((edital, index) => (
                <div key={`${edital.titulo}-${index}`} className="flex-shrink-0">
                  <Card {...edital} />
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleNext}
            className="absolute -right-4 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 transition"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    </section>
  );
};


const Editais = () => {
  // Dados mocados para o carrossel
  const editais = [
    { titulo: 'Edital A', instituicao: 'Instituição 1' },
    { titulo: 'Edital B', instituicao: 'Instituição 2' },
    { titulo: 'Edital C', instituicao: 'Instituição 3' },
    { titulo: 'Edital D', instituicao: 'Instituição 4' },
    { titulo: 'Edital E', instituicao: 'Instituição 5' },
    { titulo: 'Edital F', instituicao: 'Instituição 6' },
  ];

  return (
    <div className="bg-[#F0F7FD] min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-blue-300 to-transparent pt-10 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            <Tipografia tipo="titulo" className="text-4xl font-bold mb-4">
              Oportunidades diversas<br />em um só lugar
            </Tipografia>
            <div className="mt-8 flex justify-start items-center gap-4">

              {/* Barra de pesquisa com largura proporcional */}
              <div className="flex w-full max-w-lg items-stretch rounded-md shadow-sm overflow-hidden">
                <input
                  type="text"
                  placeholder="Pesquisar"
                  className="w-[90%] pl-4 py-2 text-gray-700 placeholder-gray-500 border-none bg-white focus:ring-0"
                />
                <Botao variante="azul-escuro" className="w-[10%] !rounded-none flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </Botao>
              </div>

              {/* Filtro com largura proporcional e texto visível */}
              <div className="relative w-48 rounded-md shadow-sm overflow-hidden">
                <select className="w-full h-full appearance-none bg-white border-none py-2 pl-4 pr-12 text-gray-700 focus:ring-0">
                    <option>Filtrar</option>
                    <option>Recentes</option>
                    <option>Antigos</option>
                </select>
                <div className="absolute right-0 top-0 h-full w-[27%] pointer-events-none">
                     <Botao variante="azul-escuro" className="h-full w-full !rounded-none flex items-center justify-center">
                       <ChevronDown className="w-5 h-5" />
                     </Botao>
                </div>
              </div>

            </div>
          </div>
        </div>

        <Carousel title="Editais em destaque" data={editais} />
        <Carousel title="Editais validados" data={editais} />
        <Carousel title="Editais esperando sua validação" data={editais} />
      </main>
      <Footer />
    </div>
  );
};

export default Editais;