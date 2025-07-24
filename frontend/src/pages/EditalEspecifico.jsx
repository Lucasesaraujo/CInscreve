// src/pages/EditalEspecifico.jsx
'use client'

import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Botao from '../components/Botao'
import Tipografia from '../components/Tipografia'
import { Heart, Bell, FileText } from 'lucide-react'
import { useParams } from 'react-router-dom'; // Importar useParams para pegar o ID da URL
import { getEditalById, validarEdital, toggleFavoritoEdital } from '../services/apiEditais'; // Importar as funções da API
import { getUserData, getUserFavoritos } from '../services/apiUser'; // Para saber quem é o usuário logado

const EditalEspecifico = () => {
  // Obter o ID do edital da URL (ex: /editais/123 -> id = 123)
  const { id } = useParams();

  // Estados para gerenciar os dados, carregamento, erros e interações do usuário
  const [edital, setEdital] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usuarioLogado, setUsuarioLogado] = useState(null); // Armazena dados do usuário logado
  const [favorito, setFavorito] = useState(false) // Será o estado do usuário logado
  const [notificacao, setNotificacao] = useState(false) // (Implementação futura, se houver backend para isso)
  const [jaValidou, setJaValidou] = useState(false); // Para controlar se o botão "Sim" fica desabilitado
  const [podeValidar, setPodeValidar] = useState(true); // Para desabilitar botões Sim/Não se sugeridor ou já validou

  // Efeito para buscar os dados do edital e do usuário ao carregar a página
  useEffect(() => {
    const fetchEditalAndUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await getUserData(); // Puxa os dados do usuário logado
        const userFavoritos = await getUserFavoritos(); // Puxa editais favoritos
        setUsuarioLogado(userData?.usuario); // Pode ser null se não logado

        if (!id) {
            setError('ID do edital não fornecido na URL.');
            setLoading(false);
            return;
        }

        const fetchedEdital = await getEditalById(id);
        setEdital(fetchedEdital);

        // Se o usuário está logado, atualiza os estados de favorito e validação
        if (userData?.usuario) {

          if (userFavoritos.favoritos.some(favorito => favorito._id == fetchedEdital._id)){
            setFavorito(true)
          }
          else{
            setFavorito(false)
          }
            // Verifica se o edital está nos favoritos do usuário
            // Verifica se o usuário já validou ou é o sugeridor
            setJaValidou(fetchedEdital.validacoes?.some(val => val._id?.toString() === userData.usuario?.id?.toString()) || false);
            setPodeValidar(!(fetchedEdital.sugeridoPor?._id?.toString() === userData.usuario?.id?.toString() || fetchedEdital.usuarioJaValidou));
            // A notificação seria similar, se o backend gerenciasse isso
        }

      } catch (err) {
        console.error("Erro ao carregar edital específico:", err);
        setError(err.message || 'Erro ao carregar o edital.');
      } finally {
        setLoading(false);
      }
    };

    fetchEditalAndUser();
  }, [id]); // Depende do ID da URL e do usuário

  // --- Função para alternar o estado de favorito ---
  const handleToggleFavorito = async () => {
    if (!usuarioLogado) {
        alert('Você precisa estar logado para favoritar/desfavoritar um edital!');
        // Se estiver usando React Router, você pode redirecionar:
        // navigate('/login');
        return;
    }

    try {
      // Chama a API para alternar o favorito
      // `toggleFavoritoEdital` retorna a lista atualizada de favoritos do usuário logado
      const statusReq = await toggleFavoritoEdital(edital._id);

      if (statusReq == 200){
        setFavorito(!favorito)
      }
      // Confirma o estado do favorito com base na lista retornada pela API
      // (caso a atualização otimista falhe ou a lista da API seja a fonte de verdade)

    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
      alert(err.message || 'Erro ao favoritar/desfavoritar edital. Tente novamente.');
      // Reverte o estado da UI se a API falhou
    }
  };

  const handleValidarEdital = async (confiavel) => {
    if (!usuarioLogado) {
        alert('Você precisa estar logado para validar um edital!');
        return;
    }
    if (!podeValidar) {
        alert('Você não pode validar este edital (já validou ou é o sugeridor).');
        return;
    }
    // A API só tem uma rota para "validar".
    // Se o botão "Não" significa "desvalidar" ou "remover validação",
    // você precisaria de outra rota no backend.
    // Assumindo que "Não" significa apenas "não votar Sim".
    if (!confiavel) {
        alert('A função "Não" ainda não está implementada para registrar desconfiança. Obrigado pela sua honestidade!');
        return;
    }

    try {
        const result = await validarEdital(edital._id);
        setEdital(result.edital); // Atualiza o edital com os dados mais recentes do backend
        setJaValidou(true); // Marca que o usuário logado já validou
        setPodeValidar(false); // Desabilita os botões

        alert(result.mensagem || 'Edital validado com sucesso!');
    } catch (err) {
        console.error("Erro ao validar edital:", err);
        alert(err.message || 'Erro ao validar edital.');
    }
  };

  const handleInscrever = () => {
    if (edital.link) {
      window.open(edital.link, '_blank'); // Abre o link em uma nova aba
    } else {
      alert('Link de inscrição não disponível para este edital.');
    }
  };

  // Renderização condicional enquanto os dados são carregados ou se ocorrer um erro
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando edital...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600">{error}</div>
  }

  // Se o edital não foi encontrado após o carregamento (ex: ID inválido que a API retornou null)
  if (!edital) {
      return <div className="flex justify-center items-center min-h-screen text-gray-600">Edital não encontrado.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 max-w-6xl mx-auto py-10 px-4">
        {/* Banner de Imagem do Edital */}
        <div className="w-full h-64 bg-gray-200 mb-0 shadow-md">
            <img
              src={edital.imagens && edital.imagens.length > 0 ? edital.imagens[0] : 'https://via.placeholder.com/1152x250?text=Imagem+do+Edital'}
              alt={`Banner do ${edital.nome}`}
              className="w-full h-full object-cover"
            />
        </div>

        {/* Caixa com o Título do Edital */}
        <div className="w-full bg-white border-x border-b border-gray-300 p-4 text-center mb-8 shadow-sm">
            <Tipografia tipo="subtitulo" className="text-gray-800 font-semibold">
                {edital.nome}
            </Tipografia>
        </div>

        {/* Container principal com layout de 2 colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Coluna da esquerda (Conteúdo do edital) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Seção de Inscrição e Validação */}
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="border border-gray-300 p-4 flex-grow">
                <p className="text-sm font-semibold text-gray-800">Inscrições de:</p>
                <p className="text-sm text-gray-600">
                  {new Date(edital.periodoInscricao.inicio).toLocaleDateString()} {new Date(edital.periodoInscricao.inicio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} até {new Date(edital.periodoInscricao.fim).toLocaleDateString()} {new Date(edital.periodoInscricao.fim).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-gray-500">Horário de Brasília</p> {/* Ajustar fuso horário se necessário */}
              </div>
              <Botao
                variante="azul-medio"
                className="!w-48 h-full cursor-pointer"
                onClick={handleInscrever}
                disabled={!edital.link} // Desabilita se não houver link
              >
                Inscreva-se
              </Botao>

              <div className="flex items-center gap-4">
                  <p className="font-semibold text-sm">Este edital é confiável? ({edital.validacoesCount || 0} votos)</p>
                  <div className="flex gap-2">
                    <Botao className='cursor-pointer' variante="sim" onClick={() => handleValidarEdital(true)} disabled={!usuarioLogado || !podeValidar}>Sim</Botao>
                    <Botao className='cursor-pointer' variante="nao" onClick={() => handleValidarEdital(false)} disabled={!usuarioLogado || !podeValidar}>Não</Botao>
                  </div>
              </div>
            </div>

            {/* Seção Sobre */}
            <section>
              <Tipografia tipo="subtitulo" className="border-b-2 border-blue-600 pb-2 mb-4">
                Sobre
              </Tipografia>
              <Tipografia tipo="texto" className="text-gray-700 whitespace-pre-line">
                {edital.descricao}
              </Tipografia>
            </section>
          </div>

          {/* Coluna da direita (Ações e Anexos) */}
          <div className="space-y-6">
            {/* Ações de Favoritar e Notificar */}
            <div className="flex items-center justify-around bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <button
                  onClick={handleToggleFavorito}
                  className="flex flex-col items-center gap-2 text-gray-700 hover:text-red-500 transition-colors cursor-pointer"
                  disabled={!usuarioLogado} // Desabilita se não logado
                >
                  <Heart className={`w-7 h-7 ${favorito ? 'text-red-500 fill-current' : ''}`} />
                  <span className="text-sm font-medium">{favorito ? 'Favorito' : 'Favoritar'}</span>
                </button>
                <button
                  onClick={() => setNotificacao(!notificacao)} // Implementar lógica de notificação
                  className="flex flex-col items-center gap-2 text-gray-700 hover:text-blue-500 transition-colors cursor-pointer"
                  disabled={!usuarioLogado} // Desabilita se não logado
                >
                  <Bell className={`w-7 h-7 ${notificacao ? 'text-blue-500 fill-current' : ''}`} />
                  <span className="text-sm font-medium">{notificacao ? 'Notificações Ativas' : 'Notificar'}</span>
                </button>
            </div>

            {/* Box da Instituição */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm text-center">
              <Tipografia tipo="texto" className="font-semibold">{edital.organizacao}</Tipografia> {/* Usar organizacao do backend */}
            </div>

            {/* Box de Anexos */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
              <Tipografia tipo="texto" className="font-bold mb-3">Anexos</Tipografia>
              <ul className="space-y-2">
                {edital.anexos && edital.anexos.length > 0 ? (
                  edital.anexos.map((anexoUrl, index) => ( // Anexos são URLs
                    <li key={index}>
                      <a href={anexoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-sm text-blue-700 hover:bg-gray-100 rounded-md">
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        <span>{`Anexo ${index + 1}`}</span> {/* Ou parse o nome do arquivo da URL */}
                      </a>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Nenhum anexo disponível.</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EditalEspecifico