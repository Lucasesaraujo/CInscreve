import React from 'react'

export default function Input({
  titulo = '',
  tipo = 'text', // text, password, email, number, date, time...
  valor,
  onChange, // atualiza enquanto o usuario digita: {e => setTipo(e.target.value)}
  placeholder = '',
  className = '',
  tamanho = 'medio' // pequeno, medio ou grande
}) {
  const base = 'px-4 py-2 border border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#108cf0] focus:border-transparent text-sm'

  // define largura com base no tamanho
  const largura = {
    pequeno: 'w-36',
    medio: 'w-full',
    grande: 'w-full px-6 py-3 text-base',
    quadrado: 'w-full py-3 border !border-gray-300 !border-l-4 !border-l-blue-600 rounded-none'
  }

  const estiloFinal = `${base} ${largura[tamanho] || largura.medio} ${className}`

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {titulo && <label className="text-sm font-semibold text-zinc-700">{titulo}</label>}
      <input
        type={tipo}
        value={valor}
        onChange={onChange}
        placeholder={placeholder}
        className={estiloFinal}
      />
    </div>
  )
}
