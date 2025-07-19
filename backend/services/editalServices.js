const Edital = require('../models/edital');
const { construirFiltroEditais } = require('../utils/filtrosEditais');
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

async function validarEditalService(idEdital, userId) {
  const edital = await Edital.findById(idEdital);
  if (!edital) throw new Error('Edital não encontrado');

  if (edital.sugeridoPor?.toString() === userId)
    throw new Error('Você não pode validar o edital que sugeriu');

  if (edital.validacoes.includes(userId))
    throw new Error('Você já validou esse edital');

  edital.validacoes.push(userId);
  if (edital.validacoes.length >= 3) {
    edital.validado = true;
  }

  await edital.save();
  return edital;
}

module.exports = {
  listarEditaisComFiltro,
  validarEditalService,
};
