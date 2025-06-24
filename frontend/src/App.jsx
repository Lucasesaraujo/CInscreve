/* eslint-disable no-unused-vars */
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Tipografia from './components/Tipografia';
import Botao from './components/Botao';
import Footer from './components/Footer';
import Header from './components/Header';
import CardLupa from './components/CardLupa';


function App() {
  return (
    <>
      <div className="p-8">
        <Tipografia tipo="titulo" tamanho={48} peso="bold">
          CInscreva
        </Tipografia>

    <div className="p-8">
      <Tipografia tipo="titulo">
        CInscreva
      </Tipografia>

      <Tipografia tipo="subtitulo">
        Sua ponte entre oportunidades e impacto social.
      </Tipografia>

      <Tipografia tipo="legenda" className="text-gray-500">
        O CInscreve oferece a você um ambiente unificado onde você pode buscar e acompanhar editais de seu interesse.
      </Tipografia>

      <CardLupa></CardLupa>
      
      <Footer></Footer>

      <Header></Header>

      <div className='flex gap-4 items-start'>
        <Botao variante="azul-claro">Carregar mais</Botao>
        <Botao variante="outline">Sugerir editais</Botao>
        <Botao variante='login'>Login</Botao>

        <Botao variante="sim">sim</Botao>
        <Botao variante="nao">nao</Botao>
      </div>

      <div>
        <Botao favoritar />
      </div>

      <div>
        <Botao variante="perfil" />
      </div>

    </div>
    </>
  );

export default App;
