import React from 'react'
import { Search, Heart, Bell, Users, Pencil } from 'lucide-react'
import Tipografia from './Tipografia'

// mapeia os nomes para os ícones do lucide
const icones = {
  lupa: <Search className="w-16 h-16 text-zinc-800" />,
  coracao: <Heart className="w-16 h-16 text-zinc-800" />,
  notificacao: <Bell className="w-16 h-16 text-zinc-800" />,
  pessoas: <Users className="w-16 h-16 text-zinc-800" />,
  inscrever: <Pencil className="w-16 h-16 text-zinc-800" />
}

export default function Funcionalidade({
  titulo = 'titulo',
  descricao = 'descricao do bloco',
  icone = 'lupa',              // nome do icone padrao
  iconeCustomizado = null,     // opcional: icone proprio
  className = ''               // classes extras
}) {
  // escolhe o icone a ser renderizado
  const iconeFinal = iconeCustomizado || icones[icone] || icones.lupa

  return (
    <div className={`flex flex-col items-center text-center p-6 rounded-xl w-48 h-52 bg-white shadow-md ${className}`}>
      {/* icone na parte de cima */}
      <div className="h-14 flex justify-center items-center">
        {iconeFinal}
      </div>

      {/* titulo da funcionalidade */}
      <Tipografia tipo="subtitulo">
        {titulo}
      </Tipografia>

      {/* descricao da funcionalidade */}
      <Tipografia tipo="legenda" className="text-zinc-700">
        {descricao}
      </Tipografia>
    </div>
  )
}