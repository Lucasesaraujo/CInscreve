import React, { useState } from 'react'
import Input from '../components/Input'
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'
import logo from '../assets/logo.png'
import imagemLogin from '../assets/login.png'

export default function Login() {

    // estados para armazenar email senha lembrar e estado de carregamento
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [lembrar, setLembrar] = useState(false)
    const [carregando, setCarregando] = useState(false)

    // funcao para lidar com clique no botao de login
    const handleLogin = async () => {
        setCarregando(true)

        try {
            // envia requisicao post para a api com o corpo json esperado
            const resposta = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: senha
                })
            })

            // verifica se o status da resposta foi bem sucedido
            if (!resposta.ok) {
                throw new Error('Erro ao fazer login')
            }

            // extrai dados da resposta
            const dados = await resposta.json()

            // aqui voce pode salvar o token ou redirecionar para outra rota
            console.log('Login realizado com sucesso', dados)

        } catch (erro) {
            // exibe erro no console ou mostra mensagem de erro
            console.error('Erro no login', erro)
            alert('Erro ao fazer login, verifique email e senha!')

        } finally {
            // desativa o estado de carregamento
            setCarregando(false)
        }
    }

    return (

        // div do container principal q ocupa toda a tela com imagem de fundo
        <div
            className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: "url('/src/assets/capa.png')" }}
        >

            {/* div da caixa branca central */}
            <div className="flex w-[1000px] h-[600px] bg-white rounded-none shadow-lg overflow-hidden">

                {/* div pro lado esquerdo com o formulario de login */}
                <div className="w-1/2 px-18 py-22 flex flex-col justify-center">

                    <div className='flex justify-center'> 
                        <img src={logo} alt="logo" className="w-32 mb-0" />
                    </div>
                    <Tipografia tipo="subtitulo" className="mb-2 text-center w-full">
                        Reunindo oportunidades para <br /> um futuro melhor
                    </Tipografia>
                    <Tipografia tipo="descricao" className="mb-6 text-gray-500 text-center w-full">
                        Seja bem vindo! Faça login para prosseguir.
                    </Tipografia>

                    {/* input email e senha */}
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

                    {/* div com checkbox lembrar e link esqueceu senha */}
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

                    {/* botao para enviar formulario de login */}
                    <Botao
                        variante="azul-medio"
                        onClick={handleLogin}
                        className="w-full"
                        desabilitado={carregando}
                    >
                        {carregando ? 'Entrando...' : 'Entrar'}
                    </Botao>
                </div>

                {/* div do lado direito com imagem de login */}
                <div className="w-1/2 bg-gray-100 flex items-center justify-center">
                    <img src={imagemLogin} alt="imagem de login" className="h-full w-full object-cover" />
                </div>

            </div>
        </div>
    )
}