/* eslint-disable no-unused-vars */
import { useState } from 'react';
import './App.css';
import Tipografia from './components/Tipografia';

import Botao from './components/Botao';
import Footer from './components/Footer';
import Header from './components/Header';
import CardLupa from './components/CardLupa';
import Input from './components/Input';
import DateTimeSelector from "./components/InputDataHora";


function App() {  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [nomeEdital, setNomeEdital] = useState("")
  const [instituicao, setInstituicao] = useState("")
  const [linkEdital, setLinkEdital] = useState("")
  const [dataHora, setDataHora] = useState({
    startTime: '',
    startDate: '',
    endTime: '',
    endDate: '',
  });

  return (
<>

<div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold">Login</h1>
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          tipo="email"
          rotulo="Endereço de Email"
          placeholder="ongpe@gov.br"
          corPlaceholder= "placeholder-blue-400"
          obrigatorio
          nome="email"
          valor={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Input
          tipo="password"
          rotulo="Senha"
          placeholder="*************"
          corPlaceholder= "placeholder-blue-400"
          obrigatorio
          nome="senha"
          valor={senha}
          onChange={e => setSenha(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-semibold mt-8">Informações do edital</h2>
      <div className="flex flex-col gap-4">
        <Input
          tipo="text"
          rotulo="Nome do edital"
          placeholder="Escreva aqui..."
          obrigatorio
          nome="nome-edital"
          larguraCompleta
          valor={nomeEdital}
          onChange={e => setNomeEdital(e.target.value)}
        />
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            tipo="text"
            rotulo="Instituição responsável"
            placeholder="Escreva aqui..."
            nome="instituicao"
            valor={instituicao}
            onChange={e => setInstituicao(e.target.value)}
          />
          <Input
            tipo="url"
            rotulo="Link do edital"
            placeholder="https://..."
            nome="link-edital"
            valor={linkEdital}
            onChange={e => setLinkEdital(e.target.value)}
          />
        </div>
      </div>
      
        <DateTimeSelector onChange={setDataHora} />

    </div>

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
  </div>
</>
  )
}

export default App;
