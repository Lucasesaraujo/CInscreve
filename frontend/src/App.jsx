/* eslint-disable no-unused-vars */
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tipografia from './components/Tipografia'


function App() {

  return (
    <div className="p-8">
      <Tipografia tipo="titulo" tamanho={48} peso="bold">
        CInscreva
      </Tipografia>

      <Tipografia tipo="corpo" tamanho={24} peso="medium">
        Sua ponte entre oportunidades e impacto social.
      </Tipografia>

      <Tipografia tipo="corpo" tamanho={12} peso="regular" className="text-gray-500">
        O CInscreve oferece a você um ambiente unificado onde você pode buscar e acompanhar editais de seu interesse.
      </Tipografia>
    </div>
  );
}

export default App
