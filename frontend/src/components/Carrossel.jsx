import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Tipografia from './Tipografia';
import Botao from './Botao';

export default function Carrossel({ titulo = '', cards = [], tipo = '' }) {
  const ref = useRef(null);
  const navigate = useNavigate();

  const scrollEsquerda = () => {
    if (ref.current) {
      ref.current.scrollBy({ left: -ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollDireita = () => {
    if (ref.current) {
      ref.current.scrollBy({ left: ref.current.clientWidth, behavior: 'smooth' });
    }
  };

  // ✅ Agora o botão "Ver mais" envia o tipo como state para /editais
  const verMais = () => {
    if (tipo) {
      navigate('/editais', {
        state: { tipo }, // 👈 envia o tipo para o Edital.jsx
      });
    }
  };

  return (
    <div className="w-full relative py-6 overflow-visible">
      {/* Título do carrossel + botão "Ver mais" */}
      <div className="flex justify-between items-center mb-6 px-16">
        <Tipografia tipo="subtitulo" className="capitalize font-bold">
          {titulo}
        </Tipografia>

        {tipo && (
          <Botao
            variante="azul-medio"
            className="!w-auto !px-4 !py-2 !text-sm !h-auto translate-y-1.5"
            onClick={verMais}
          >
            Ver mais
          </Botao>
        )}
      </div>

      <div className="px-16 overflow-visible">
        {/* Botões de scroll */}
        <button
          onClick={scrollEsquerda}
          className="absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-4 rounded-full cursor-pointer"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={scrollDireita}
          className="absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white shadow-md p-4 rounded-full cursor-pointer"
          aria-label="Próximo"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Cards do carrossel */}
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