import React, { useState } from 'react'
import {
  Heart,
  HeartOff,
  Check,
  X,
  User
} from 'lucide-react'

export default function Botao({
  children,
  variante = 'azul-medio', // tipo do botao 
  className = '',           // classes extras
  favoritar = false,        // se for o botao de favoritar
  onClick,
  ...props
}) {
  const [ativo, setAtivo] = useState(false)

  // estilos base 
  const base = 'rounded-md px-6 py-3 transition flex items-center justify-center gap-2 text-sm font-medium'

  // estilos especificos de cada tipo de botao
  const estilos = {
    'azul-claro': 'bg-[#56b5fd] text-white hover:brightness-90 w-40',
    'azul-medio': 'bg-[#108cf0] text-white hover:brightness-90 w-40',
    'azul-escuro': 'bg-[#0b3e76] text-white hover:brightness-90 w-40',
    outline: 'border border-[#108cf0] text-[#108cf0] hover:bg-zinc-100 w-40',
    texto: 'text-black hover:text-zinc-700 w-40',

    // botoes de sim e nao 
    sim: 'bg-green-600 text-white hover:bg-green-700 flex-col text-center w-16 h-16 !p-2 !gap-0',
    nao: 'bg-red-600 text-white hover:bg-red-700 flex-col text-center w-16 h-16 !p-2 !gap-0',

    // botao de perfil e login
    perfil: 'bg-gray-200 hover:bg-gray-300 rounded-full w-16 h-14 !flex !justify-center !items-center !p-0 !gap-0',
    login: 'bg-[#108cf0] text-white hover:brightness-90 w-24 h-12'
  }

  // botao de favoritar que alterna entre dois estados
  if (favoritar) {
    return (
      <button
        onClick={() => setAtivo(!ativo)}
        className={`${base} bg-white hover:bg-zinc-100 flex-col w-32 h-24`}
        {...props}
      >
        {ativo
          ? <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
          : <HeartOff className="h-6 w-6" />
        }
        <span className="text-sm mt-1">{ativo ? 'Favorito' : 'Favoritar'}</span>
      </button>
    )
  }

  // icones padrao para botoes especificos
  const iconesPadrao = {
    sim: <Check className="h-10 w-10 mb-px" />,
    nao: <X className="h-10 w-10 mb-px" />,
    perfil: <User className="h-8 w-8" />
  }

  // estilo final juntando o base com a variante
  const estiloFinal = `${base} ${estilos[variante] || ''} ${className}`

  return (
    <button className={estiloFinal} onClick={onClick} {...props}>
      {iconesPadrao[variante] || null}
      {children && <span className="block text-center">{children}</span>}
    </button>
  )
}
