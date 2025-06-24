import React from 'react';

export default function Card({
  variante = 'simples',
  titulo = 'Título do Edital',
  instituicao = 'Nome da Instituição',
  descricao = 'Descrição padrão do edital.',
  imagem
}) {
  if (variante === 'detalhado') {
    return (
      <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
        <div className="flex justify-center">
          <img
            src={imagem || 'https://via.placeholder.com/300x200'}
            alt={titulo}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
          <p className="text-gray-600 mt-2">{descricao}</p>
          <div className="mt-4" />
        </div>
      </div>
    );
  }

  // Variante simples
  return (
    <div className="max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-4">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{titulo}</h2>
        <p className="text-gray-600">{instituicao}</p>
        <p className="text-gray-600 mt-2">{descricao}</p>
        <div className="mt-4">
          <p className="text-gray-600">Áreas de interesse:</p>
        </div>
      </div>
    </div>
  );
}
