/* eslint-disable no-unused-vars */
import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Tipografia from './components/Tipografia';
import Botao from './components/Botao';
import Footer from './components/Footer';
import Header from './components/Header';
import Funcionalidade from './components/Funcionalidade';
import Card from './components/Card';
import Input from './components/Input';
import Carrossel from './components/Carrossel';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const Cards = [
    {
      variante: "simples",
      titulo: "Segurança",
      instituicao:"Grande Recife",
      imagem: './assets/react.svg',
      area:"Animal"
    },
    {
      variante:"simples",
      titulo:"Segurança",
      instituicao:"Grande Recife",
      imagem: './assets/react.svg',
      area:"Animal"
    },
    {
      variante:"simples",
      titulo:"Segurança",
      instituicao:"Grande Recife",
      imagem: './assets/react.svg',
      area:"Animal"
    },
    {
      variante:"simples",
      titulo:"Segurança",
      instituicao:"Grande Recife",
      imagem:'./assets/react.svg',
      area:"Animal"
    },
    {
      variante:"simples",
      titulo:"Segurança",
      instituicao:"Grande Recife",
      imagem: './assets/react.svg',
      area:"Animal"
    },
    {
      variante:"simples",
      titulo:"Segurança",
      instituicao:"Grande Recife",
      imagem: './assets/react.svg',
      area:"Animal"
    }
  ]

  return (
    <div classNaame="p-8">

      <div className="max-w-sm mx-auto mt-10">
        <Input
          titulo="Email"
          tipo="text"
          valor={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Digite seu email"
          tamanho="quadrado"
          className="mb-2"
        />
        <Input
          titulo="Senha"
          tipo="password"
          valor={senha}
          onChange={e => setSenha(e.target.value)}
          placeholder="Digite sua senha"
          tamanho="grande"
          className="mb-2"
        />
      </div>

      <Tipografia tipo="titulo">CInscreva</Tipografia>

      <Tipografia tipo="subtitulo">
        Sua ponte entre oportunidades e impacto social.
      </Tipografia>

      <Tipografia tipo="legenda" className="text-gray-500">
        O CInscreve oferece a você um ambiente unificado onde você pode buscar e acompanhar editais de seu interesse.
      </Tipografia>

      <Footer />
      <Header />

      <div className="flex gap-4 items-start">
        <Botao variante="azul-claro">Carregar mais</Botao>
        <Botao variante="outline">Sugerir editais</Botao>
        <Botao variante="login">Login</Botao>
        <Botao variante="sim">sim</Botao>
        <Botao variante="nao">nao</Botao>
      </div>

      <div>
        <Botao favoritar />
      </div>

      <div>
        <Botao variante="perfil" />
      </div>

      <Card
        variante="simples"
        titulo="Segurança"
        instituicao="Grande Recife"
        imagem={'./assets/react.svg'}
        area="Animal"
      />

      <Card
        variante="detalhado"
        titulo="Edital Especial"
        instituicao='Grande Recife'
        descricao="Este edital é para projetos inovadores em inteligência artificial."
        area="Inovação"
      />

      <Funcionalidade
        icone="lupa"
        titulo="Busque"
        descricao="Encontre editais para transformar sua organização."
      />

      <Funcionalidade
        icone="coracao"
        titulo="favoritos"
        descricao="marque editais que voce gostou"
      />

      <Carrossel titulo='Editais em destaque' cards={Cards}/>
    </div>
  )
}

export default App
