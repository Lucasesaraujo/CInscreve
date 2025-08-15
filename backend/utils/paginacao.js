function configurarPaginacaoOrdenacao(query) {
  const { page = 1, limit = 6, sortBy, order } = query;

  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.max(1, parseInt(limit));
  const skip = (parsedPage - 1) * parsedLimit;

  const camposPermitidos = ['nome', 'organizacao', 'ODS', 'validado', 'periodoInscricao.inicio'];
  const ordenacao = {};

  if (sortBy && camposPermitidos.includes(sortBy)) {
    ordenacao[sortBy] = order === 'desc' ? -1 : 1;
  }

  return { parsedPage, parsedLimit, skip, ordenacao };
}

module.exports = { configurarPaginacaoOrdenacao };
