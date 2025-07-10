import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Tipografia from '../components/Tipografia';
import Botao from '../components/Botao';
import Card from '../components/Card';
import Carrossel from '../components/Carrossel';
import Funcionalidade from '../components/Funcionalidade';

export default function Home() {
    return (
        <section className="bg-[#f0f7fd] text-zinc-800">
            {/* header */}
            <Header />

            {/* bloco 1 */}
            <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-[#f0f7fd] relative overflow-hidden max-w-7xl mx-auto">
                <div className="md:w-1/2 z-10">
                    <Tipografia tipo="titulo" className="mb-4 text-black">sua ponte com oportunidades</Tipografia>
                    <Tipografia tipo="texto" className="mb-6 max-w-md text-black">
                        encontre, acompanhe e envie editais para transformar sua organização
                    </Tipografia>
                    <div className="flex gap-4">
                        <Botao variante="azul-medio">Ver editais</Botao>
                        <Botao variante="outline">Sugerir editais</Botao>
                    </div>
                </div>
                <div className="md:w-1/2 z-10">
                    <img src="/imgs/hero.png" alt="imagem principal" className="w-full max-w-md mx-auto" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f0f7fd] to-transparent" />
            </section>

            {/* bloco 2 */}
            <section className="bg-[url('/imgs/bg-pattern.png')] bg-cover bg-center px-8 py-20">
                <div className="max-w-5xl mx-auto text-black">
                    <Tipografia tipo="titulo" className="mb-2">editais em destaque</Tipografia>
                    <Tipografia tipo="texto" className="mb-6">veja alguns editais sugeridos para você</Tipografia>
                    <Carrossel />
                    <hr className="border-white my-12" />
                    <Tipografia tipo="subtitulo" className="text-center text-black">
                        conectando pessoas a oportunidades de verdade
                    </Tipografia>
                </div>
            </section>

            {/* bloco 3 */}
            <section className="bg-[#f0f7fd] py-20 text-center">
                <div className="max-w-6xl mx-auto px-8">
                    <Tipografia tipo="titulo" className="mb-2 text-black">como podemos te ajudar</Tipografia>
                    <Tipografia tipo="texto" className="mb-12 text-black">principais funcionalidades do cinscreve</Tipografia>
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex justify-center gap-8">
                            <Funcionalidade icone="lupa" titulo="buscar" descricao="encontre editais relevantes" />
                            <Funcionalidade icone="coracao" titulo="favoritar" descricao="salve seus favoritos" />
                            <Funcionalidade icone="notificacao" titulo="notificar" descricao="receba alertas de editais" />
                        </div>
                        <div className="flex justify-center gap-8">
                            <Funcionalidade icone="pessoas" titulo="rede" descricao="conecte com outras pessoas" />
                            <Funcionalidade icone="inscrever" titulo="inscreva-se" descricao="envie sua proposta" />
                        </div>
                    </div>
                </div>
            </section>

            {/* bloco 4 */}
            <section className="bg-[url('/imgs/bg-pattern.png')] bg-cover bg-center text-center px-8 py-20">
                <div className="max-w-5xl mx-auto text-black">
                    <Tipografia tipo="titulo" className="mb-2">comece agora</Tipografia>
                    <Tipografia tipo="texto" className="mb-6">junte-se à rede cinscreve e crie impacto</Tipografia>
                    <div className="flex justify-center gap-4">
                        <Botao variante="azul-medio">Ver editais</Botao>
                        <Botao variante="outline">Sugerir editais</Botao>
                    </div>
                </div>
            </section>

            {/* footer */}
            <Footer />
        </section>
    );
}
