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
  if (!edital) {
    const error = new Error('Edital não encontrado');
    error.status = 404;
    return Promise.reject(error);
  }

  if (edital.sugeridoPor?.toString() === userId.toString()) { // Compare strings para segurança
    const error = new Error('Você não pode validar o edital que sugeriu');
    error.status = 400;
    return Promise.reject(error); // <--- O RETORNO É CRÍTICO AQUI
  }

  if (edital.validacoes.includes(userId)) {
    const error = new Error('Você já validou esse edital');
    error.status = 400;
    return Promise.reject(error); // <--- O RETORNO É CRÍTICO AQUI
  }

  edital.validacoes.push(userId);
  if (edital.validacoes.length >= 3) {
    edital.validado = true;
  }

  await edital.save();
  return edital;
}

async function buscarEditalComValidacoes(idEdital, usuarioId) {
  const edital = await Edital.findById(idEdital)
    .populate('sugeridoPor', 'nome email')
    .populate('validacoes', 'nome email');

  if (!edital) return null;

  const editalObj = edital.toObject();
  const jaValidou = usuarioId && edital.validacoes.some(val => val._id.toString() === usuarioId);

  if (!edital.validado && !jaValidou) {
    editalObj.link = null;
  }

  return editalObj;
}

// Criar um novo edital
async function criarEditalService(dados, idUsuario) {
  if (dados.periodoInscricao) {
    const { inicio, fim } = dados.periodoInscricao;

    const dataInicio = inicio ? new Date(inicio) : null;
    const dataFim = fim ? new Date(fim) : null;

    if (dataInicio instanceof Date && !isNaN(dataInicio.getTime()) && dataFim instanceof Date && !isNaN(dataFim.getTime())) {
      if (dataFim < dataInicio) {
        const error = new Error('A data de fim deve ser posterior à data de início');
        error.status = 400; // Define o status para o middleware de erro
        throw error;
      }
    }
  }
  dados.sugeridoPor = idUsuario;
  const novoEdital = new Edital(dados);
  return await novoEdital.save();
}

// Atualizar edital existente
async function atualizarEditalService(id, dadosAtualizados) {
  // Se 'periodoInscricao' está sendo atualizado, faça a validação de data
  if (dadosAtualizados.periodoInscricao) {
    const { inicio, fim } = dadosAtualizados.periodoInscricao;

    // Converte para objetos Date se forem strings
    const dataInicio = inicio ? new Date(inicio) : null;
    const dataFim = fim ? new Date(fim) : null;

    // Se ambas as datas estão presentes e são válidas (não NaN), faça a comparação
    if (dataInicio instanceof Date && !isNaN(dataInicio.getTime()) && dataFim instanceof Date && !isNaN(dataFim.getTime())) {
      if (dataFim < dataInicio) {
        const error = new Error('A data de fim deve ser posterior à data de início');
        error.status = 400;
        throw error;
      }
    }
  }

  return await Edital.findByIdAndUpdate(id, dadosAtualizados, { new: true, runValidators: true });
}

// Remover edital
async function removerEditalService(id) {
  return await Edital.findByIdAndDelete(id);
}

module.exports = {
  listarEditaisComFiltro,
  validarEditalService,
  buscarEditalComValidacoes,
  criarEditalService,
  atualizarEditalService,
  removerEditalService
};
