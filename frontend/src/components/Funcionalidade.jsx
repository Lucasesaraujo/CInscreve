import React from 'react'
import { Search, Heart, Bell, Users, Pencil, Folder} from 'lucide-react'
import Tipografia from './Tipografia'

// Ícones padrão com tamanho base (pode ser sobrescrito)
const icones = {
  lupa: <Search className="w-24 h-24 text-zinc-800" />,
  coracao: <Heart className="w-24 h-24 text-zinc-800" />,
  notificacao: <Bell className="w-24 h-24 text-zinc-800" />,
  pessoas: <Users className="w-24 h-24 text-zinc-800" />,
  inscrever: <Pencil className="w-24 h-24 text-zinc-800" />,
  pasta: <Folder className="w-24 h-24 text-zinc-800" />
}

export default function Funcionalidade({
  titulo = 'titulo',
  descricao = 'descricao do bloco',
  icone = 'lupa',
  iconeCustomizado = null,
  className = ''
}) {
  const iconeFinal = iconeCustomizado || icones[icone] || icones.lupa

  return (
    <div className={`flex flex-col items-center text-center p-6 rounded-xl w-56 h-60 bg-transparent ${className}`}>
      
      {/* Ícone com espaço abaixo */}
      <div className="mb-4">
        {iconeFinal}
      </div>

      {/* Título com classe customizável */}
      <Tipografia tipo="subtitulo">
        {titulo}
      </Tipografia>

      {/* Descrição com classe customizável */}
      <Tipografia tipo="texto">
        {descricao}
      </Tipografia>
    </div>
  )
}