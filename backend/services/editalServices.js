const Edital = require('../models/edital');
const { construirFiltroEditais } = require('../utils/filtrosEditais');
const { configurarPaginacaoOrdenacao } = require('../utils/paginacao');
const logger = require('../config/logger');
const defaultImages = require('../utils/defaultImages');

const REPORT_THRESHOLD = 2;

async function listarEditaisService(query) {
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

async function buscarEditalByIdService(idEdital, usuarioId) { // Adicionado 'usuarioId' novamente aqui
  try {
      // Inclui os .populate() e busca o usuário que fez a requisição
      const edital = await Edital.findById(idEdital)
          .populate('sugeridoPor', 'email')
          .populate('validadoPor', 'email')
          .populate('denunciadoPor', 'email')
          .populate('favoritadoPor', 'email');

      if (!edital) {
          return null; // Retorna null se não encontrar
      }

      const editalObj = edital.toObject();

      // Lógica para verificar se o usuário logado já validou ou favoritou
      const userLoggedIdStr = usuarioId ? usuarioId.toString() : null;

      editalObj.usuarioJaValidou = userLoggedIdStr && edital.validadoPor.some(val => val && val._id?.toString() === userLoggedIdStr) || false;
      editalObj.usuarioJaFavoritou = userLoggedIdStr && edital.favoritadoPor.some(fav => fav && fav._id?.toString() === userLoggedIdStr) || false;

      // Lógica para ocultar link se não validado e usuário não validou
      if (!edital.validado && !editalObj.usuarioJaValidou) {
          editalObj.link = null;
      }

      // Adiciona contagens
      editalObj.validacoesCount = edital.validadoPor.length;
      editalObj.denunciasCount = edital.denunciadoPor.length;

      return editalObj; // Retorna o objeto edital processado
  } catch (error) {
      logger.error(`Erro no serviço ao buscar edital por ID ${idEdital}:`, error.message, error);
      throw error;
  }
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

  if ((!dados.imagem || dados.imagem.length === 0) && dados.categoria) {
    const fileName = defaultImages[dados.categoria] || defaultImages['Outros'];
    const imagePath = `http://localhost:3000/assets/default_covers/${fileName}`;
    dados.imagem = [imagePath];
  } else if (!dados.imagem || dados.imagem.length === 0) {
    // Se o usuário não forneceu categoria, mas a imagem está vazia
    const imagePath = `http://localhost:3000/assets/default_covers/${defaultImages['Outros']}`;
    dados.imagem = [imagePath];
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

async function listarDestaquesService(limit = 6) {
  try {
    const editaisDestaque = await Edital.aggregate([
      {
        $project: {
          nome: 1, categoria: 1, organizacao: 1, periodoInscricao: 1, descricao: 1,
          anexos: 1, imagem: 1, validado: 1, link: 1,
          sugeridoPor: 1, validadoPor: 1, denunciadoPor: 1, favoritadoPor: 1,
          createdAt: 1,
          favoritosCount: { $size: "$favoritadoPor" }
        }
      },
      {
        $sort: { favoritosCount: -1, createdAt: -1 }
      },
      {
        $limit: limit
      }
      // Se houver $lookup, $unwind, $project para populamento, mantenha-os aqui
    ]);

    return editaisDestaque;
  } catch (error) {
    logger.error('Erro ao buscar editais em destaque (mais favoritos/recentes):', error.message, error);
    throw error;
  }
}

async function denunciarEditalService(editalId, userId) {
  try {
      const edital = await Edital.findById(editalId);

      if (!edital) {
          logger.warn(`Edital com ID ${editalId} não encontrado para denúncia.`);
          const error = new Error('Edital não encontrado');
          error.status = 404;
          throw error;
      }

      // Garante que denunciadoPor é um array
      if (!edital.denunciadoPor) {
          edital.denunciadoPor = [];
      }

      // Verifica se o usuário já denunciou este edital
      const jaDenunciado = edital.denunciadoPor.some(reporterId => reporterId.toString() === userId.toString());

      if (jaDenunciado) {
          logger.info(`Usuário ${userId} já denunciou o edital ${editalId}. Nenhuma ação tomada.`);
          const error = new Error('Você já denunciou este edital.');
          error.status = 409; // Conflict
          throw error;
      }

      // Adiciona o ID do usuário à lista de denunciantes
      edital.denunciadoPor.push(userId);
      await edital.save();

      logger.info(`Edital ${editalId} denunciado por ${userId}. Total de denúncias: ${edital.denunciadoPor.length}`);

      // Verifica se o número de denúncias atingiu o limite para exclusão
      if (edital.denunciadoPor.length >= REPORT_THRESHOLD) {
          await Edital.deleteOne({ _id: editalId }); // Exclui o edital
          logger.info(`Edital ${editalId} excluído automaticamente após atingir ${REPORT_THRESHOLD} denúncias.`);
          return { mensagem: `Edital denunciado e excluído automaticamente por atingir ${REPORT_THRESHOLD} denúncias.`, editalDeletado: true };
      }

      return { mensagem: 'Edital denunciado com sucesso.', editalDeletado: false, totalDenuncias: edital.denunciadoPor.length };

  } catch (error) {
      logger.error(`Erro no serviço ao denunciar edital ${editalId} pelo usuário ${userId}:`, error.message, error);
      throw error;
  }
}

module.exports = {
  listarEditaisService,
  validarEditalService,
  buscarEditalByIdService,
  criarEditalService,
  atualizarEditalService,
  removerEditalService,
  listarDestaquesService,
  denunciarEditalService
};
