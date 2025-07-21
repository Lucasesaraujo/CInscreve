const BASE_URL = "http://localhost:3000/editais";
const URL = "http://localhost:3000";

// utilitário para fazer requisição com filtros e percorrer todas as páginas
async function fetchEditais(filtros = {}) {
  let pagina = 1; 
  let todosEditais = []; // aqui vamos acumular todos os editais encontrados
  let totalPaginas = 1; // isso será atualizado com o valor real após a primeira requisição

  try {
    do {
      // monta os parâmetros da URL, incluindo a página atual e qualquer filtro (ex: validado: true)
      const params = new URLSearchParams({ page: pagina, ...filtros });
      const url = `${BASE_URL}?${params.toString()}`; 

      const res = await fetch(url); // faz a requisição para o backend
      const data = await res.json(); // transforma a resposta em JSON

      todosEditais.push(...(data.editais || [])); // adiciona os editais dessa página ao array acumulador
      totalPaginas = data.totalPages; // atualiza o total de páginas baseado na resposta do backend
      pagina++; // passa para a próxima página

    } while (pagina <= totalPaginas); // continua até percorrer todas as páginas disponíveis

    // retorna os dados consolidados
    return {
      editais: todosEditais,
      total: todosEditais.length,
      paginaAtual: 1, 
      totalPaginas
    };
  } catch (err) {
    // se algo der errado (API fora do ar, erro de conexão...), retorna valores vazios
    console.error("Erro ao buscar editais:", err);
    return { editais: [], total: 0, paginaAtual: 1, totalPaginas: 1 };
  }
}

// não validados
export async function getEditaisNaoValidados() {
  return await fetchEditais({ validado: false });
}

// validados
export async function getEditaisValidados() {
  return await fetchEditais({ validado: true });
}

// destaques (baseado em favoritos, acessos...)
export async function getEditaisDestaque() {
  const { editais, total, paginaAtual, totalPaginas } = await fetchEditais();

  const destaque = editais.filter(e =>
    (e.favoritos?.length || 0) >= 5 // podemos ajustar esse critério
  );

  return {
    editais: destaque,
    total,
    paginaAtual,
    totalPaginas
  };
}
export async function getEditalById(editalId) {
  try {
    const res = await fetch(`${BASE_URL}/${editalId}`, {
      method: 'GET',
      credentials: 'include', // Para enviar cookies de autenticação (necessário se o link é protegido)
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login'; // Redireciona se não autenticado/autorizado
        return null;
      }
      if (res.status === 404) {
        throw new Error('Edital não encontrado.');
      }
      throw new Error(`Erro ao buscar edital: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data; // Deve retornar o objeto edital
  } catch (err) {
    console.error("Erro ao buscar edital específico:", err);
    throw err; // Rejoga o erro para o componente lidar
  }
}

export async function validarEdital(editalId) {
  try {
    const res = await fetch(`${BASE_URL}/${editalId}/validar`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        window.location.href = '/login';
        return null;
      }
      const errorData = await res.json();
      throw new Error(errorData.erro || `Erro ao validar edital: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data; // Deve retornar { mensagem: '...', edital: { ... } }
  } catch (err) {
    console.error("Erro ao validar edital:", err);
    throw err;
  }
}

// Função para alternar o estado de favorito de um edital para o usuário logado
export async function toggleFavoritoEdital(editalId) {
  try {
    const res = await fetch(`${URL}/user/favoritar/${editalId}`, {
      method: 'PATCH', 
      credentials: 'include', // Para enviar os cookies de autenticação
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Redireciona para login se não autenticado/autorizado
        // Em um projeto real, você usaria `useNavigate` do React Router DOM aqui
        window.location.href = '/login';
        return null;
      }
      const errorData = await res.json();
      throw new Error(errorData.erro || `Erro ao alternar favorito: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    // O backend deve retornar a lista atualizada de favoritos do usuário
    return res.status || []; // Assumindo que o backend retorna { mensagem: '...', favoritos: [...] }
  } catch (err) {
    console.error("Erro em toggleFavoritoEdital:", err);
    throw err; // Rejoga o erro para o componente lidar
  }
}