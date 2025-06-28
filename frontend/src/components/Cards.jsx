import React from 'react';
import Botao from './Botao';
import Tipografia from './Tipografia';

export default function Card({
  variante = 'simples',
  titulo = 'Nome do edital',
  instituicao = 'Nome instituição',
  descricao = 'Descrição padrão do edital.',
  imagem,
  area = 'label'
}) {
  
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

        <div className="flex justify-start mt-4">
          <Botao variante="azul-escuro">{area}</Botao>
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
        <Botao variante="azul-escuro" className="text-xs px-3 py-1">
          {area}
        </Botao>
      </div>
    </div>
  );
}
