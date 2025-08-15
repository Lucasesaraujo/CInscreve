import React from 'react'

export default function Tipografia({ children, tipo = 'titulo', className = '' }) {
  // define estilos baseados no tipo
  const estilos = {
    titulo: {
      fonte: 'font-montserrat',
      peso: 'font-bold',
      tamanho: 'text-4xl', // ~32px
    },
    subtitulo: {
      fonte: 'font-montserrat',
      peso: 'font-medium',
      tamanho: 'text-2xl', // ~24px
    },
    texto: {
      fonte: 'font-lato',
      peso: 'font-regular',
      tamanho: 'text-base', // ~16px
    },
    legenda: {
      fonte: 'font-lato',
      peso: 'font-light',
      tamanho: 'text-sm', // ~14px
    },
  }

  const estilo = estilos[tipo] || estilos.texto
  const classes = `${estilo.fonte} ${estilo.peso} ${estilo.tamanho} ${className}`

  return <p className={classes}>{children}</p>
}
 
/*
comandos importantes:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
node server.js
npx prisma studio
npm run dev
*/