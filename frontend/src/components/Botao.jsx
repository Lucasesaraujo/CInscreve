import React from 'react'
import { Heart, Check, X, User } from 'lucide-react'

export default function Botao({
  children,
  variante = 'azul-medio',
  className = '',
  favoritar = false,
  onClick,
  ativo = false, // opcional para favoritar
  ...props
}) {
  const base = 'rounded-md px-6 py-3 transition flex items-center justify-center gap-2 text-sm font-medium'

  const estilos = {
    'azul-claro': 'bg-[#56b5fd] text-white hover:brightness-90 w-40',
    'azul-medio': 'bg-[#108cf0] text-white hover:brightness-90 w-40',
    'azul-escuro': 'bg-[#0b3e76] text-white hover:brightness-90 w-40',
    outline: 'border border-[#108cf0] text-[#108cf0] hover:bg-zinc-100 w-40',
    texto: 'text-black hover:text-zinc-700 w-40',
    'card-simples': 'bg-[#56b5fd] text-white w-32 h-2 !rounded-xl',
    'card-detalhado': 'bg-[#56b5fd] text-white w-32 h-10',
    'vermelho': 'bg-red-600 text-white hover:bg-red-700 w-40',
    'cinza': 'bg-gray-200 text-gray-800 hover:bg-gray-300 w-40',
    sim: 'bg-green-600 text-white hover:bg-green-700 flex-row text-center w-16 h-12 !p-2 !gap-2',
    nao: 'bg-red-600 text-white hover:bg-red-700 flex-row text-center w-16 h-12 !p-2 !gap-2',
    perfil: 'bg-gray-200 hover:bg-gray-300 rounded-full w-16 h-14 flex justify-center items-center p-0 gap-0',
    login: 'bg-[#108cf0] text-white hover:brightness-90 w-24 h-12'
  }

  const iconesPadrao = {
    sim: <Check className="h-5 w-5" />,
    nao: <X className="h-5 w-5" />,
    perfil: <User className="h-8 w-8" />,
    favoritar: <Heart className={`h-6 w-6 ${ativo ? 'text-red-500 fill-current' : ''}`} />
  }

  const estiloFinal = `${base} ${estilos[variante] || ''} ${className}`

  if (favoritar) {
    return (
      <button
        onClick={onClick}
        className={`${base} bg-white hover:bg-zinc-100 flex-col w-32 h-24`}
        {...props}
      >
        {ativo
          ? <Heart className="h-6 w-6 text-red-500" fill="currentColor" />
          : <Heart className="h-6 w-6" />
        }
        <span className="text-sm mt-1">{ativo ? 'Favorito' : 'Favoritar'}</span>
      </button>
    )
  }


  return (
    <button className={estiloFinal} onClick={onClick} {...props}>
      {iconesPadrao[variante] || null}
      {children && <span className="block text-center">{children}</span>}
    </button>
  )
}
