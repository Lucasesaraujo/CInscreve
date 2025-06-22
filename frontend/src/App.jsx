
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Tipografia from './components/Tipografia';
import Button from './components/Botao';
import Header from './components/Header';

function App() {
  return (
    <>
    <Header />

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

      <div className="flex flex-wrap gap-4 mt-10">
        <Button variant="outline" tipo="corpo" tamanho={16} peso="medium">
          Sugerir edital
        </Button>
        <Button variant="azul-claro" tipo="corpo" tamanho={16} peso="medium">
          Login
        </Button>
        <Button variant="azul-medio" tipo="corpo" tamanho={16} peso="medium">
          Carregar mais
        </Button>
        <Button variant="azul-escuro" tipo="corpo" tamanho={16} peso="medium">
          Ver editais
        </Button>
      </div>

      {/* botao maior com icone e texto */}
      <Button
        variant="botao-maior"
        tipo="corpo"
        tamanho={18}
        peso="medium"
        className="w-40 h-40 flex flex-col items-center justify-center text-center p-6 rounded-full"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2} // usar camelCase no react
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Busque
        <span className="text-xs">encontre editais para transformar sua organizacao.</span>
      </Button>

      {/* botoes sim, nao, favoritar e usuario */}
      <div className="flex flex-wrap gap-2 mt-8">
        <Button variant="sim" tipo="corpo" tamanho={16} peso="medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          sim
        </Button>

        <Button variant="nao" tipo="corpo" tamanho={16} peso="medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6" // usar className no react
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          nao
        </Button>

        {/* substituir FavoritarButton pelo Button com prop favoritar */}
        <Button tipo="corpo" tamanho={16} peso="medium" favoritar />

        <Button variant="usuario" tipo="corpo" tamanho={16} peso="medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </Button>
      </div>

    </div>
    </>
  );
}

export default App;