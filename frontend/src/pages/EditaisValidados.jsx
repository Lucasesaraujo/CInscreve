import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { Search, Users } from 'lucide-react';

const BASE_URL = 'http://localhost:3000/editais';

async function fetchEditaisValidados(offset = 0, limit = 6, searchTerm = '', selectedArea = '') {
  try {
    const params = new URLSearchParams({
      page: Math.floor(offset / limit) + 1,
      limit,
      validado: true,
    });

    if (searchTerm) params.append('search', searchTerm);
    if (selectedArea) params.append('area', selectedArea);

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error(`Erro ao buscar editais: ${res.status}`);

    const data = await res.json();
    return data.editais.map((edital) => ({
      ...edital,
      imagem: edital.imagem?.[0] || 'https://via.assets.so/img.jpg?w=400&h=300&tc=blue&bg=#cecece&t=nome_ong',
    })) || [];
  } catch (err) {
    console.error('Erro ao buscar editais:', err);
    throw err;
  }
}

const EditaisValidados = () => {
  const [editais, setEditais] = useState([]);
  const [loading, setLoading] = useState({
    initial: true,
    more: false,
    filtering: false
  });
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const limit = 6;

  const carregarEditais = useCallback(async (isReset = false) => {
    if ((isReset && loading.filtering) || (!isReset && loading.more)) return;
    
    isReset ? setLoading(prev => ({...prev, filtering: true})) 
            : setLoading(prev => ({...prev, more: true}));
    setError(null);

    try {
      const currentOffset = isReset ? 0 : offset;
      const novosEditais = await fetchEditaisValidados(currentOffset, limit, searchTerm, selectedArea);

      setHasMore(novosEditais.length >= limit);
      setEditais(prev => isReset ? novosEditais : [...prev, ...novosEditais]);
      setOffset(isReset ? limit : offset + limit);
    } catch (err) {
      setError(err.message || 'Erro ao carregar editais.');
    } finally {
      isReset ? setLoading(prev => ({...prev, filtering: false, initial: false}))
              : setLoading(prev => ({...prev, more: false}));
    }
  }, [offset, searchTerm, selectedArea, limit, loading.filtering, loading.more]);

  // Efeito para carregar os dados iniciais
  useEffect(() => {
    carregarEditais(true);
  },);

  // Efeito para filtrar com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading.initial) return;
      carregarEditais(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedArea, carregarEditais, loading.initial]);

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    carregarEditais(true);
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
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                placeholder="Pesquisar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  
                className="w-80 px-4 py-2 rounded-l border border-gray-300 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 bg-gray-200 rounded-r cursor-pointer focus:outline-none active:bg-gray-400"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </form>

            <div className="relative">
              <select
                className="appearance-none px-4 py-2 pr-10 rounded border border-gray-300 bg-white text-sm text-gray-700 cursor-pointer"
                value={selectedArea}
                onChange={handleAreaChange}
              >
                <option value="">Todas as áreas</option>
                <option value="Outros">Outros</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Cultura">Cultura</option>
                <option value="Inovação">Inovação</option>
                <option value="Meio Ambiente">Meio Ambiente</option>
                <option value="Saúde">Saúde</option>
                <option value="Esporte">Esporte</option>
                <option value="Educação">Educação</option>
                <option value="Emprego">Emprego</option>
                <option value="Ciência">Ciência</option>
                <option value="Audiovisual">Audiovisual</option>
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

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-22 gap-y-10 mb-10">
          {editais.map((edital) => (
            <Link to={`/editais/${edital._id}`} key={edital._id}>
              <Card
                variante={edital.instituicao ? 'detalhado' : 'simples'}
                titulo={edital.nome}
                instituicao={edital.instituicao || 'Instituição não informada'}
                descricao={edital.descricao}
                imagem={edital.imagem}
                area={edital.categoria}
              />
            </Link>
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {hasMore && editais.length > 0 && (
          <button
            className="mb-16 px-6 py-2 rounded bg-gray-800 text-white hover:bg-gray-700 transition cursor-pointer disabled:opacity-50 min-w-[120px]"
            onClick={() => carregarEditais()}
            disabled={loading.more || loading.filtering}
          >
            {loading.more ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </span>
            ) : 'Carregar mais'}
          </button>
        )}

        {!hasMore && editais.length === 0 && !loading.initial && (
          <p className="mb-16 text-gray-500">Nenhum edital encontrado com esses critérios</p>
        )}

        {!hasMore && editais.length > 0 && (
          <p className="mb-16 text-gray-500">Todos os editais foram carregados</p>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditaisValidados;