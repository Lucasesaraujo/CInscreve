import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';  // Importando Link para navegação
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { Search, Users } from 'lucide-react';

const BASE_URL = 'http://localhost:3000/editais';

async function fetchEditaisValidados(offset = 0, limit = 6, searchTerm = '') {
  try {
    const params = new URLSearchParams({
      page: Math.floor(offset / limit) + 1,
      limit,
      validado: true,
    });

    // Adicionando o termo de pesquisa na URL
    if (searchTerm) {
      params.append('search', searchTerm); // Passando a pesquisa
    }

    const res = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!res.ok) {
      throw new Error(`Erro ao buscar editais: ${res.status}`);
    }

    const data = await res.json();
    return data.editais || [];
  } catch (err) {
    console.error('Erro ao buscar editais:', err);
    throw err;
  }
}

const EditaisValidados = () => {
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de pesquisa
  const limit = 6;

  const carregarEditais = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const novosEditais = await fetchEditaisValidados(offset, limit, searchTerm); // Passando o termo de pesquisa

      if (novosEditais.length === 0) {
        setHasMore(false);
        return;
      }

      setEditais((prev) => [...prev, ...novosEditais]);
      setOffset((prev) => prev + limit);
    } catch (err) {
      setError(err.message || 'Erro ao carregar editais.');
    } finally {
      setLoading(false);
    }
  }, [offset, limit, loading, hasMore, searchTerm]); // Adicionando searchTerm como dependência

  useEffect(() => {
    carregarEditais();
  }, [carregarEditais]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value); // Atualizando o termo de pesquisa
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col items-center px-4 md:px-12 py-8">
        <div className="w-full max-w-6xl mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Editais validados pela comunidade
            <Users className="w-7 h-7 text-gray-700" />
          </h1>
        </div>

        <div className="w-full max-w-6xl flex gap-4 mb-10 items-center">
          <div className="flex items-center gap-2">
            <div className="flex">
              <input
                type="text"
                placeholder="Pesquisar"
                value={searchTerm} // Vinculando o estado ao campo de input
                onChange={handleSearchChange} // Atualizando o termo de busca
                className="w-80 px-4 py-2 rounded-l border border-gray-300 focus:outline-none"
              />
              <button
                className="px-4 bg-gray-200 rounded-r cursor-pointer focus:outline-none active:bg-gray-400"
                onClick={() => carregarEditais()} // Recarrega os editais ao clicar no botão
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="relative">
              <select className="appearance-none px-4 py-2 pr-10 rounded border border-gray-300 bg-white text-sm text-gray-700 cursor-pointer">
                <option>Filtrar</option>
              </select>
              <div
                className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 bg-gray-200 rounded px-1 flex items-center justify-center"
                style={{ width: '1.5rem', height: '1.5rem' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#666"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* GRID COM OS CARDS */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-22 gap-y-10 mb-10">
          {editais.map((edital) => (
            <Link to={`/editais/${edital._id}`} key={edital._id}>  {/* Link para a página de detalhes */}
              <Card
                variante={edital.instituicao ? 'detalhado' : 'simples'}
                titulo={edital.nome}
                instituicao={edital.instituicao || 'Instituição não informada'}
                descricao={edital.descricao}
                imagem={null}
                area={edital.area || 'Sem área'}
              />
            </Link>
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {hasMore ? (
          <button
            className="mb-16 px-6 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition cursor-pointer"
            onClick={carregarEditais}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        ) : (
          <p className="mb-16 text-gray-500">Todos os editais foram carregados</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditaisValidados;
