const Edital = require('../models/edital');
const logger = require('../config/logger');
const { listarEditaisService, validarEditalService, buscarEditalByIdService, criarEditalService, atualizarEditalService, listarDestaquesService, removerEditalService, denunciarEditalService } = require('../services/editalServices');

// GET Controller para listar os editais
const listarEditais = async (req, res) => {
  try {
    const resultado = await listarEditaisService(req.query);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

// GET Controller para buscar edital por ID (AGORA MAIS SIMPLES)
async function buscarEdital(req, res, next) {
  try {
    // Passa req.usuario?.id para o serviço, que agora fará a lógica de cálculo
    const edital = await buscarEditalByIdService(req.params.id, req.usuario?.id);

    if (!edital) {
      const error = new Error('Edital não encontrado.');
      error.status = 404;
      return next(error);
    }

    res.json(edital); // Retorna o objeto edital já processado pelo serviço
  } catch (error) {
    next(error); // Passa o erro para o middleware global
  }
}

// POST Controller para criar um novo edital
const criarEdital = async (req, res, next) => { 
  try {
    const novoEdital = await criarEditalService(req.body, req.usuario.id);
    res.status(201).json(novoEdital);
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros global
  }
};

// PUT Controller para editar um parâmetro do edital
const atualizarEdital = async (req, res, next) => { 
  try {
    const editalAtualizado = await atualizarEditalService(req.params.id, req.body);
    if (!editalAtualizado) {
      const error = new Error('Edital não encontrado!');
      error.status = 404; // Define o status para o middleware de erro
      return next(error);
    }
    res.json(editalAtualizado);
  } catch (error) {
    next(error); // Passa o erro
  }
};

// DELETE Controller para deletar um edital
const removerEdital = async (req, res, next) => { 
  try {
    const editalRemovido = await removerEditalService(req.params.id);
    if (!editalRemovido) {
      const error = new Error('Edital não encontrado!');
      error.status = 404;
      return next(error);
    }
    res.json({ mensagem: 'Edital removido com sucesso!' });
  } catch (error) {
    next(error);
  }
};

// POST Controller para validar um edital
const validarEdital = async (req, res, next) => { // Adicione 'next'
  try {
    const edital = await validarEditalService(req.params.id, req.usuario.id);
    res.json({ mensagem: 'Edital validado com sucesso!', edital });
  } catch (error) {
    next(error);
  }
};

const listarNaoValidados = async (req, res) => {
  try {
    const editais = await Edital.find({ validado: false });
    res.json(editais);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar editais não validados' });
  }
};

// NOVO CONTROLLER: Para listar editais em destaque
async function listarDestaques(req, res, next) {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const editais = await listarDestaquesService(limit); // <--- CHAMA O SERVIÇO RENOMEADO
    res.status(200).json({ editais });
  } catch (error) {
    logger.error('Erro no controller ao listar editais em destaque:', error.message, error);
    next(error);
  }
}

// PATCH - Controller para denunciar um edital
async function denunciarEdital(req, res, next) {
  const editalId = req.params.id;
  const userId = req.usuario.id; // ID do usuário logado do authMiddleware

  try {
      const resultado = await denunciarEditalService(editalId, userId);
      res.status(200).json(resultado);
  } catch (error) {
      // O middleware de erro global (`app.js`) tratará o status do erro (404, 409, 500)
      next(error);
  }
}

// Exportando os Controllers
module.exports = {
  listarEditais,
  criarEdital,
  atualizarEdital,
  removerEdital,
  buscarEdital,
  validarEdital,
  listarNaoValidados,
  listarDestaques,
  denunciarEdital
};
