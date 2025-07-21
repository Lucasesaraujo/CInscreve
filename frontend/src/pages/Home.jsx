import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Tipografia from '../components/Tipografia';
import Botao from '../components/Botao';
import Carrossel from '../components/Carrossel';
import Funcionalidade from '../components/Funcionalidade';
import Logo from '../assets/recife.png';
import Fundo from '../assets/base.png';
import { getEditaisValidados } from '../services/apiEditais';

export default function Home() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getEditaisValidados().then(({ editais }) => {
            const formatados = editais.map((edital) => ({
                variante: "detalhado",
                titulo: edital.nome,
                instituicao: edital.organizacao,
                descricao: edital.descricao
            }));
            setCards(formatados);
        });
    }, []);

    return (
        <section className="text-zinc-800" style={{ backgroundImage: `url(${Fundo})` }}>

            {/* Bloco de destaque visual e chamadas principais */}
            <section className="flex flex-col md:flex-row items-center justify-between py-0 bg-[#f0f7fd] relative overflow-hidden w-full h-[540px]">
                <div className="md:w-1/2 z-10 px-32">
                    <Tipografia tipo="titulo" className="mb-8 text-black text-5xl">
                        Sua ponte entre oportunidades e impacto social.
                    </Tipografia>
                    <Tipografia tipo="subtitulo" className="mb-16 max-w-md text-gray-500">
                        O CInscreve oferece a você um ambiente unificado onde você pode buscar e acompanhar editais de seu interesse.
                    </Tipografia>
                    <div className="flex gap-8">
                        <Botao variante="azul-escuro">Ver editais</Botao>
                        <Botao variante="azul-escuro">Sugerir editais</Botao>
                    </div>
                </div>
                <div className="md:w-1/2 h-full z-10">
                    <img src={Logo} alt="imagem de login" className="h-full w-full object-cover" />
                </div>
                <div className="absolute top-0 bottom-0 left-1/2 w-24 bg-gradient-to-r from-[#f0f7fd] to-transparent z-20 pointer-events-none" />
            </section>

            {/* Bloco de editais não validados */}
            <section className="relative bg-cover bg-center bg-no-repeat py-16">
                <div className="w-full px-6 md:px-20 lg:px-32">
                    <Tipografia tipo="titulo" className="mb-2 text-5xl text-black">
                        Juntos, construímos uma base confiável.
                    </Tipografia>
                    <Tipografia tipo="subtitulo" className="text-gray-500">
                        Conheça os editais abaixo.
                    </Tipografia>
                </div>

                <div className="px-28 mt-8">
                    <Carrossel cards={cards} />
                </div>

                <hr className="border-white my-4" />
                <Tipografia tipo="subtitulo" className="text-center text-gray-500">
                    Você conhece a realidade. Sua validação faz a diferença.
                </Tipografia>
            </section>

            {/* Bloco de funcionalidades */}
            <section className="bg-[#f0f7fd] py-20 text-center">
                <div className="max-w-6xl mx-auto px-8">
                    <Tipografia tipo="titulo" className="mb-2 text-5xl text-black">
                        Recursos que simplificam seu dia a dia
                    </Tipografia>
                    <Tipografia tipo="subtitulo" className="text-gray-500 text-4xl mb-2">
                        Conheça nossas ferramentas:
                    </Tipografia>
                    <div className="flex flex-col items-center gap-8 mt-16">
                        <div className="flex justify-center gap-8">
                            <Funcionalidade icone="lupa" titulo="Busque" descricao="Encontre editais para transformar sua organização." />
                            <Funcionalidade icone="inscrever" titulo="Inscreva-se" descricao="Acesse o edital completo e materiais complementares." />
                            <Funcionalidade icone="pessoas" titulo="Valide" descricao="Contribua para uma base mais confiável com sua ONG." />
                        </div>
                        <div className="flex justify-center gap-8">
                            <Funcionalidade icone="coracao" titulo="Favorite" descricao="Salve os editais mais relevantes pra acessar depois." />
                            <Funcionalidade icone="notificacao" titulo="Notifique-se" descricao="Ative alertas para não perder prazos importantes." />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bloco final de chamada para ação */}
            <section className="bg-cover bg-center text-center px-8 py-20">
                <div className="max-w-5xl mx-auto text-black">
                    <Tipografia tipo="titulo" className="mb-2 text-5xl text-black">
                        Conecte-se às oportunidades certas
                    </Tipografia>
                    <Tipografia tipo="subtitulo" className="text-gray-500 text-3xl mb-2">
                        Descubra editais alinhados com sua ONG, salve favoritos <br />
                        e receba alertas no momento certo.
                    </Tipografia>
                    <div className="flex justify-center gap-8 mt-12">
                        <Botao variante="azul-escuro">Ver editais</Botao>
                        <Botao variante="azul-escuro">Sugerir editais</Botao>
                    </div>
                </div>
            </section>

            <Footer />
        </section>
    );
}