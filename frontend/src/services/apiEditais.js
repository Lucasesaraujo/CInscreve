const BASE_URL = "http://localhost:3000/editais";

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