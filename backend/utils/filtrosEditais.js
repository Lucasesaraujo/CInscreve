function construirFiltroEditais(query) {
  const { nome, organizacao, ODS, validado, dataInicio, dataFim, area } = query;
  const filtro = {};

  if (nome) filtro.nome = new RegExp(nome, 'i');
  if (organizacao) filtro.organizacao = new RegExp(organizacao, 'i');
  if (ODS) filtro.ODS = ODS;
  if (validado !== undefined) filtro.validado = validado === 'true';

  if (area) filtro.categoria = area;

  if (dataInicio || dataFim) {
    filtro['periodoInscricao.inicio'] = {};
    if (dataInicio) filtro['periodoInscricao.inicio'].$gte = new Date(dataInicio);
    if (dataFim) filtro['periodoInscricao.inicio'].$lte = new Date(dataFim);
  }

  return filtro;
}


module.exports = { construirFiltroEditais };
