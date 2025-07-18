const Edital = require('../models/edital');
const { construirFiltroEditais } = require('../utils/filtroEditais');
const { configurarPaginacaoOrdenacao } = require('../utils/paginacao');

async function listarEditaisComFiltro(query) {
  const filtro = construirFiltroEditais(query);
  const { parsedPage, parsedLimit, skip, ordenacao } = configurarPaginacaoOrdenacao(query);

  const [editais, total] = await Promise.all([
    Edital.find(filtro).sort(ordenacao).skip(skip).limit(parsedLimit).select('-__v'),
    Edital.countDocuments(filtro),
  ]);

  return {
    editais,
    total,
    page: parsedPage,
    totalPages: Math.ceil(total / parsedLimit),
  };
}

module.exports = {
  listarEditaisComFiltro,
};
