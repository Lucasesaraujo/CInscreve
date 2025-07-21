import React, { useState } from 'react';
import Input from '../components/Input';
import Botao from '../components/Botao';
import Tipografia from '../components/Tipografia';
import logo from '../assets/logo.png';
import imagemLogin from '../assets/login.png';
import AlertaErro from '../components/AlertaErro';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroLogin, setErroLogin] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setCarregando(true);

    try {
      const resposta = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: senha
        })
      })

      if (!resposta.ok) {
        throw new Error('Erro ao fazer login')
      }

      const dados = await resposta.json();
      console.log('Login realizado com sucesso', dados);
      navigate("/")

    } catch (erro) {
      console.error('Erro no login', erro);
      setErroLogin('Erro ao fazer login, verifique email e senha!');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/src/assets/capa.png')" }}
    >
      {/* Alerta de erro */}
      {erroLogin && (
        <AlertaErro
          mensagem={erroLogin}
          onClose={() => setErroLogin('')}
        />
      )}

      {/* Caixa branca central */}
      <div className="flex w-[1000px] h-[600px] bg-white rounded-none shadow-lg overflow-hidden">
        {/* Formulário do lado esquerdo */}
        <div className="w-1/2 px-18 py-22 flex flex-col justify-center">
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-32 mb-0" />
          </div>
          <Tipografia tipo="subtitulo" className="mb-2 text-center w-full">
            Reunindo oportunidades para <br /> um futuro melhor
          </Tipografia>
          <Tipografia tipo="descricao" className="mb-6 text-gray-500 text-center w-full">
            Seja bem vindo! Faça login para prosseguir.
          </Tipografia>

          <Input
            titulo="Email"
            tipo="email"
            valor={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Digite seu email"
            tamanho="quadrado"
            className="mb-1"
          />
          <Input
            titulo="Senha"
            tipo="password"
            valor={senha}
            onChange={e => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            tamanho="quadrado"
            className="mb-2"
          />

          <div className="flex items-center justify-between text-sm text-gray-500 mb-10">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={() => setLembrar(!lembrar)}
                className="accent-[#108cf0]"
              />
              Lembrar se de mim
            </label>
            <a href="#" className="hover:underline">Esqueceu a senha</a>
          </div>

          <Botao
            variante="azul-medio"
            onClick={handleLogin}
            className="w-full"
            desabilitado={carregando}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </Botao>
        </div>

        {/* Imagem do lado direito */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <img src={imagemLogin} alt="imagem de login" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}