import React, { useState } from 'react';
import Botao from './Botao';
import Tipografia from './Tipografia';
import { Heart, Bell } from 'lucide-react';

export default function Card({
  variante = 'simples',
  titulo = 'Nome do edital',
  instituicao = 'Nome instituição',
  descricao = 'Descrição padrão do edital.',
  imagem,
  area = 'label'
}) {

  const [favorito, setFavorito] = useState(false)
  const [notificar, setNotificar] = useState(false)

  const base = 'w-[300px] h-[300px] bg-white rounded-xl shadow border flex flex-col justify-between';

  const estilos = {
    simples: 'p-4 items-center text-center',       // centraliza o conteúdo no card simples
    detalhado: 'p-6'                                // conteúdo alinhado à esquerda no detalhado
  };

  if (variante === 'detalhado') {

    return (
      <div className={`${base} ${estilos.detalhado}`}>
        <div>
          <Tipografia tipo="subtitulo" className="mb-2">
            {titulo}
          </Tipografia>

          <hr className="mb-4" />

          <Tipografia tipo="texto" className="text-zinc-700 text-sm line-clamp-[5]">
            {descricao}
          </Tipografia>
        </div>

        <div className="flex items-center gap-14 mt-4">
          <Botao variante="card-detalhado">{area}</Botao>

          <div className="flex items-center gap-6 mt-2">
            {/* botao de favoritar */}
            <button onClick={() => setFavorito(!favorito)}>
              <Heart
                className={`w-5 h-5 ${favorito ? 'text-red-500' : 'text-zinc-700 hover:text-red-500'}`}
                fill={favorito ? 'currentColor' : 'none'}
              />
            </button>

            {/* botao de notificar */}
            <button onClick={() => setNotificar(!notificar)}>
              <Bell
                className={`w-5 h-5 ${notificar ? 'text-yellow-500' : 'text-zinc-700 hover:text-yellow-500'}`}
                fill={notificar ? 'currentColor' : 'none'}
              />
            </button>
          </div>

        </div>


      </div>
    );
  }

  // Card simples
  return (
    <div className={`${base} ${estilos.simples}`}>
      <div>
        <div className="mb-3">
          <img
            src={imagem || 'https://via.placeholder.com/300x200'}
            alt={titulo}
            className="w-full h-36 object-cover rounded-md"
          />
        </div>

        <Tipografia tipo="texto" className="font-bold text-gray-900 mb-1">
          {titulo}
        </Tipografia>

        <Tipografia tipo="legenda" className="mb-4 text-gray-700">
          {instituicao}
        </Tipografia>
      </div>

      <div className="flex flex-row items-center justify-center gap-2">
        <Tipografia tipo="legenda" className="text-gray-700">
          Áreas de Interesse:
        </Tipografia>
        <Botao variante="card-simples" className="text-xs px-3 py-1">
          {area}
        </Botao>
      </div>
    </div>
  );
}
