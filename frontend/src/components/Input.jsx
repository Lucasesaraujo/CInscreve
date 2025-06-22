import React from 'react'

export default function Input({
  tipo = "text",
  rotulo,
  placeholder = "",
  corPlaceholder = "placeholder-gray-400",
  obrigatorio = false,
  nome,
  larguraCompleta = false,
  valor,
  onChange
}) {
  return (
    <div className={`flex flex-col gap-1 ${larguraCompleta ? 'w-full' : 'w-[280px]'}`}>
      {rotulo && (
        <label htmlFor={nome} className="text-sm font-medium text-gray-700">
          {rotulo} {obrigatorio && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={tipo}
        id={nome}
        name={nome}
        placeholder={placeholder}
        required={obrigatorio}
        value={valor}
        onChange={onChange}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  )
}