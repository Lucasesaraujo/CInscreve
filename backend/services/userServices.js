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
    if (!edital.favoritos) edital.favoritos = [];

    const jaFavoritado = usuario.favoritos.some(favId => favId.toString() === editalId.toString());
    let mensagem = '';

    if (jaFavoritado) {
      usuario.favoritos = usuario.favoritos.filter(favId => favId.toString() !== editalId.toString());
      edital.favoritos = edital.favoritos.filter(uid => uid.toString() !== usuario._id.toString());
      mensagem = 'Edital removido dos favoritos';
    } else {
      usuario.favoritos.push(edital._id);
      edital.favoritos.push(usuario._id);
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
    listarSugeridosService
};