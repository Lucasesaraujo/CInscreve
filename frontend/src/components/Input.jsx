import React from 'react';

export default function Input({
  titulo = '',
  tipo = 'text', // text, password, email, number, date, time...
  valor,
  onChange, // atualiza enquanto o usuario digita: {e => setTipo(e.target.value)}
  placeholder = '',
  className = '',
  tamanho = 'medio' // pequeno, medio, grande, quadrado, pesquisa...
}) {
  // estilos base do input
  const base = 'px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#108cf0] focus:border-transparent text-sm';

  // define largura e estilo com base no tamanho escolhido
  const largura = {
    pequeno: 'w-36',
    medio: 'w-full',
    grande: 'w-full px-6 py-3 text-base',
    quadrado: 'w-full py-3 border !border-gray-300 !border-l-4 !border-l-blue-600 rounded-none',
    
    // variante especial para barra de pesquisa
    pesquisa: 'w-full px-4 py-2 text-sm rounded-full border !border-gray-100 focus:ring-[#108cf0] focus:ring-2 shadow focus:shadow-md bg-white'
  };

  // combina estilos base + tamanho escolhido + classe adicional
  const estiloFinal = `${base} ${largura[tamanho] || largura.medio} ${className}`;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      
      {/* rótulo visível acima do input */}
      {titulo && <label className="text-sm font-semibold text-zinc-700">{titulo}</label>}
      
      {/* campo de entrada editável */}
      <input
        type={tipo}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        className={estiloFinal}
      />
    </div>
  );
}