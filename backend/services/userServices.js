// backend/services/userServices.js

const Usuario = require('../models/user');
const Edital = require('../models/edital');
const logger = require('../config/logger');

async function listarFavoritosService(userId) {
  try {
    const usuario = await Usuario.findById(userId).populate('favoritos');

    if (!usuario) {
      logger.warn(`Usuário com ID ${userId} não encontrado no serviço de listar favoritos.`);
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    logger.info(`Editais favoritos listados para o usuário: ${userId}`);
    return usuario.favoritos;
  } catch (error) {
    logger.error('Erro no serviço ao listar favoritos:', error.message, error);
    throw error;
  }
}

async function listarNotificacoesService(userId) {
  try {
    const usuario = await Usuario.findById(userId).populate('notificacoes');

    if (!usuario) {
      logger.warn(`Usuário com ID ${userId} não encontrado no serviço de listar notificações.`);
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }

    logger.info(`Editais para notificação listados para o usuário: ${userId}`);
    return usuario.notificacoes;
  } catch (error) {
    logger.error('Erro no serviço ao listar favoritos:', error.message, error);
    throw error;
  }
}

async function toggleFavoritoService(userId, editalId) {
  try {
    const usuario = await Usuario.findById(userId);
    const edital = await Edital.findById(editalId);

    if (!usuario) {
      logger.warn(`Usuário com ID ${userId} não encontrado no serviço de toggle favorito.`);
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }
    if (!edital) {
      logger.warn(`Edital com ID ${editalId} não encontrado no serviço de toggle favorito.`);
      const error = new Error('Edital não encontrado');
      error.status = 404;
      throw error;
    }

    if (!usuario.favoritos) usuario.favoritos = [];
    if (!edital.favoritadoPor) edital.favoritadoPor = [];

    const jaFavoritado = usuario.favoritos.some(favId => favId.toString() === editalId.toString());
    let mensagem = '';

    if (jaFavoritado) {
      usuario.favoritos = usuario.favoritos.filter(favId => favId.toString() !== editalId.toString());
      edital.favoritadoPor = edital.favoritadoPor.filter(uid => uid.toString() !== usuario._id.toString());
      mensagem = 'Edital removido dos favoritos';
    } else {
      usuario.favoritos.push(edital._id);
      edital.favoritadoPor.push(usuario._id);
      mensagem = 'Edital adicionado aos favoritos';
    }

    await usuario.save();
    await edital.save();

    const favoritosAtualizados = await Usuario.findById(usuario._id).populate('favoritos');

    logger.info(`Favorito alternado para o Edital ${editalId} pelo Usuário ${userId}. Estado: ${mensagem}`);
    return { mensagem, favoritos: favoritosAtualizados.favoritos };
  } catch (error) {
    logger.error('Erro no serviço ao alternar favorito:', error.message, error);
    throw error;
  }
}

async function toggleNotificacaoService(userId, editalId) {
  try {
    const usuario = await Usuario.findById(userId);
    const edital = await Edital.findById(editalId);

    if (!usuario) {
      logger.warn(`Usuário com ID ${userId} não encontrado no serviço de toggle notificação.`);
      const error = new Error('Usuário não encontrado');
      error.status = 404;
      throw error;
    }
    if (!edital) {
      logger.warn(`Edital com ID ${editalId} não encontrado no serviço de toggle notificação.`);
      const error = new Error('Edital não encontrado');
      error.status = 404;
      throw error;
    }

    if (!usuario.notificacoes) usuario.notificacoes = [];
    if (!edital.notificadoPor) edital.notificadoPor = [];

    const jaNotificado = usuario.notificacoes.some(favId => favId.toString() === editalId.toString());
    let mensagem = '';

    if (jaNotificado) {
      usuario.notificacoes = usuario.notificacoes.filter(favId => favId.toString() !== editalId.toString());
      edital.notificadoPor = edital.notificadoPor.filter(uid => uid.toString() !== usuario._id.toString());
      mensagem = 'Edital removido das notificações';
    } else {
      usuario.notificacoes.push(edital._id);
      edital.notificadoPor.push(usuario._id);
      mensagem = 'Edital adicionado às notificações';
    }

    await usuario.save();
    await edital.save();

    const notificacoesAtualizadas = await Usuario.findById(usuario._id).populate('notificacoes');

    logger.info(`Notificação alternada para o Edital ${editalId} pelo Usuário ${userId}. Estado: ${mensagem}`);
    return { mensagem, notificacoes: notificacoesAtualizadas.notificacoes };
  } catch (error) {
    logger.error('Erro no serviço ao alternar notificação:', error.message, error);
    throw error;
  }
}

async function listarSugeridosService(userId) {
  try {
    if (!userId) {
      logger.warn('Tentativa de buscar editais sugeridos sem userId no serviço.');
      const error = new Error('ID do usuário não encontrado na requisição.');
      error.status = 400;
      throw error;
    }

    const editaisSugeridos = await Edital.find({ sugeridoPor: userId });

    logger.info(`Editais sugeridos encontrados para o usuário ${userId}: ${editaisSugeridos.length}`);
    return editaisSugeridos;
  } catch (error) {
    logger.error('Erro no serviço ao buscar editais sugeridos pelo usuário:', error.message, error);
    throw error;
  }
}

module.exports = {
    listarFavoritosService,
    toggleFavoritoService,
    listarSugeridosService,
    listarNotificacoesService,
    toggleNotificacaoService
};