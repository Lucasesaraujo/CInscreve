import React, { useRef } from 'react';
import Card from './Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Tipografia from './Tipografia';

export default function Carrossel({ titulo = '', cards = [] }) {
  const ref = useRef(null);


  const scrollEsquerda = () => {
    if (ref.current) {
      // Ajuste para rolar pela largura visível do contêiner
      ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollDireita = () => {
    if (ref.current) {
      // Ajuste para rolar pela largura visível do contêiner
      ref.current.scrollBy({ left: ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative py-6 overflow-visible">
      {/* título do carrossel */}
      <Tipografia tipo="subtitulo" className="mb-6 capitalize font-bold">
        {titulo}
      </Tipografia>

      {/* wrapper com padding lateral */}
      <div className="px-16 overflow-visible">
        {/* botões de scroll - mais distantes dos cards */}
        <button
          onClick={scrollEsquerda}
          className="absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-4 rounded-full"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={scrollDireita}
          className="absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-4 rounded-full"
          aria-label="Próximo"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* container dos cards */}
        <div
          ref={ref}
          className="flex gap-8 overflow-x-auto overflow-y-visible scroll-smooth pb-4 no-scrollbar"
        >

          {cards.map((card, index) => (
            <div key={index} className="flex-shrink-0 mt-6">
              <Card {...card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}