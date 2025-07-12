import React, { useRef } from 'react'
import Card from './Card'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carrossel({ titulo = 'editais em destaque', cards = [] }) {
  const ref = useRef(null)

  // largura de cada card em px 
  const larguraCard = 250

  // gap entre cards em px 
  const gap = 24

  // distancia que queremos scrollar: 3 cards + gaps entre eles
  const scrollStep = (larguraCard + gap) * 3 - gap

  const scrollEsquerda = () => {
    if (ref.current) {
      ref.current.scrollBy({ left: -scrollStep, behavior: 'smooth' })
    }
  }

  const scrollDireita = () => {
    if (ref.current) {
      ref.current.scrollBy({ left: scrollStep, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full relative py-6">
      {/* titulo do carrossel */}
      <h2 className="text-2xl font-bold mb-6 px-4 capitalize">{titulo}</h2>

      {/* botoes de scroll */}
      <button
        onClick={scrollEsquerda}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-4 rounded-full"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={scrollDireita}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md p-4 rounded-full"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* container dos cards */}
      <div
        ref={ref}
        className="flex gap-8 overflow-x-hidden scroll-smooth px-32"
      >
        {cards.map((card, index) => (
          <div key={index} className="flex-shrink-0">
            <Card {...card} />
          </div>
        ))}
      </div>
    </div>
  )
}