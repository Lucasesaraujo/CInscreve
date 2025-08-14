import React from 'react'
import Botao from './Botao'
import Tipografia from './Tipografia'
import { Heart, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Card({
  variante = 'simples',
  titulo = 'Nome do edital',
  instituicao = 'Nome instituição',
  descricao = 'Descrição padrão do edital.',
  imagem,
  area = 'label',
  favoritoInicial = false,
  notificacaoInicial = false,
  onToggleFavorito,
  onToggleNotificacao,
  _id
}) {
  const base = 'bg-white rounded-xl shadow border flex flex-col justify-between'

  const estilos = {
    simples: 'w-[300px] h-[300px] p-4 items-center text-center border-zinc-200',
    detalhado: 'w-[360px] h-[320px] border-zinc-200 p-6',
  }

  // Usa os valores vindos do pai para o estado
  const favorito = favoritoInicial;
  const notificar = notificacaoInicial;
  const navigate = useNavigate();

  if (variante === 'detalhado') {
    return (
      <div
        className={`${base} ${estilos.detalhado} transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg`}
      >

        <div>
          <Tipografia
            tipo="subtitulo"
            className="mb-2 line-clamp-2"
          >
            {titulo}
          </Tipografia>

          <hr className="mb-4" />

          <Tipografia
            tipo="texto"
            className="text-zinc-700 text-sm line-clamp-5"
          >
            {descricao}
          </Tipografia>
        </div>

        <div onClick={() => navigate(`/editais/${_id}`)} className="flex items-center gap-28 mt-4">
          <Botao className='cursor-pointer' variante="card-detalhado">Conhecer</Botao>

          <div className="flex items-center gap-6 mt-2">
            {/* botão de favoritar */}
            <button onClick={onToggleFavorito} aria-label="Favoritar" className='cursor-pointer'>
              <Heart
                className={`w-5 h-5 ${favorito ? 'text-red-500' : 'text-zinc-700 hover:text-red-500'}`}
                fill={favorito ? 'currentColor' : 'none'}
              />
            </button>

            {/* botão de notificar */}
            <button onClick={onToggleNotificacao} aria-label="Notificar" className='cursor-pointer'>
              <Bell
                className={`w-5 h-5 ${notificar ? 'text-yellow-500' : 'text-zinc-700 hover:text-yellow-500'}`}
                fill={notificar ? 'currentColor' : 'none'}
              />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Card simples
  return (
    <div
      onClick={() => navigate(`/editais/${_id}`)}
      className={`${base} ${estilos.simples} transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg cursor-pointer`}
    >

      <div>
        <div className="mb-3">
          <img
            src={imagem || 'https://via.placeholder.com/300x200'}
            alt={titulo}
            className="w-full h-36 object-cover rounded-md"
          />
        </div>

        <Tipografia tipo="texto" className="font-bold text-gray-900 mb-1 line-clamp-2">
          {titulo}
        </Tipografia>

        <Tipografia tipo="legenda" className="mb-4 text-gray-700 !text-xs line-clamp-1">
          {instituicao}
        </Tipografia>
      </div>

      <div className="flex flex-row items-center justify-center gap-2">
        <Tipografia tipo="legenda" className="text-gray-700">
          Área de atuação:
        </Tipografia>
        <Botao variante="card-simples" className="text-xs px-6 py-2 whitespace-nowrap">
          {area}
        </Botao>
      </div>
    </div>
  )
}
