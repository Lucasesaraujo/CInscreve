import React from 'react';
import Botao from './Botao';

export default function Card({
  variante = 'simples',
  titulo = 'Nome do edital',
  instituicao = 'Nome instituição',
  descricao = 'Descrição padrão do edital.',
  imagem,
  areaInteresse = 'label'
}) {
  
  if (variante === 'detalhado') {

    return (
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow p-6 border">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{titulo}</h2>
        <hr className="mb-4" />
        <p className="text-gray-700 text-sm mb-6">
          {descricao}
        </p>
        <div className="flex justify-start">
          <button className="bg-blue-900 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-800">
            label
          </button>
        </div>
      </div>
    );
  }

  // Variante simples
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow p-4 border">
      <div className="mb-4">
        <img
          src={imagem || 'https://via.placeholder.com/300x200'}
          alt={titulo}
          className="w-full h-40 object-cover rounded-md"
        />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">{titulo}</h2>
      <p className="text-sm text-gray-700 mb-4">{instituicao}</p>
      <div className="flex items-center text-sm text-gray-700">
        <span className="mr-2">Áreas de Interesse:</span>
        <button className="bg-blue-900 text-white px-3 py-1 text-xs rounded-full shadow hover:bg-blue-800">
          {areaInteresse}
        </button>
      </div>
    </div>
  );
}
