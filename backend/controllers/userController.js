// backend/controllers/userController.js

const { listarFavoritosService, toggleFavoritoService, listarSugeridosService } = require('../services/userServices'); // Importe as funções de serviço com o sufixo 'Service'
const logger = require('../config/logger');

// GET - Controller para listar os editais favoritos do usuário logado
async function listarFavoritos(req, res, next) {
  try {
    const favoritos = await listarFavoritosService(req.usuario.id); // Chama a função de serviço com o sufixo
    res.json({ favoritos });
  } catch (error) {
    next(error);
  }
}

// PATCH - Controller para favoritar ou desfavoritar o edital do usuário
async function toggleFavorito(req, res, next) {
  try {
    const { mensagem, favoritos } = await toggleFavoritoService(req.usuario.id, req.params.id); // Chama a função de serviço com o sufixo
    res.json({ mensagem, favoritos });
  } catch (error) {
    next(error);
  }
}

// GET - Controller para listar editais sugeridos pelo usuário logado
async function listarSugeridos(req, res, next) {
  try {
    const editaisSugeridos = await listarSugeridosService(req.usuario.id); // Chama a função de serviço com o sufixo
    res.status(200).json({ sugeridos: editaisSugeridos });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    listarFavoritos,
    toggleFavorito,
    listarSugeridos
};