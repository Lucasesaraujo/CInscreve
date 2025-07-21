const Usuario = require('../models/user');
const Edital = require('../models/edital');
const logger = require('../config/logger');

// GET - Controller para listar os editais favoritos do usuário logado
const listarFavoritos = async (req, res) => {
  const userId = req.usuario.id;

  try {
    const usuario = await Usuario.findById(userId).populate('favoritos');

    if (!usuario) {
      logger.warn(`Usuário com ID ${userId} não encontrado ao listar favoritos.`);
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    } 

    res.json({ favoritos: usuario.favoritos });
  } catch (error) {
    logger.error('Erro ao buscar favoritos para o usuário:', userId, error);
    res.status(500).json({ erro: 'Erro ao buscar favoritos.' });
  }
};

// PATCH - Controller para favoritar ou desfavoritar o edital do usuário
const toggleFavorito = async (req, res) => {
  const userId = req.usuario.id;
  const editalId = req.params.id;

  try {
    const usuario = await Usuario.findById(userId);
    const edital = await Edital.findById(editalId);

    if (!usuario) {
      logger.warn(`Usuário com ID ${userId} não encontrado ao alternar favorito.`);
      return res.status(404).json({ erro: 'Usuário não encontrado' });
    }

    if (!edital) {
      logger.warn(`Edital com ID ${editalId} não encontrado ao alternar favorito.`);
      return res.status(404).json({ erro: 'Edital não encontrado' });
    }

    if (!usuario.favoritos) usuario.favoritos = [];
    if (!edital.favoritos) edital.favoritos = [];

    const jaFavoritado = usuario.favoritos.some(favId => favId.toString() === editalId);
    let mensagem = '';

    if (jaFavoritado) {
      usuario.favoritos = usuario.favoritos.filter(favId => favId.toString() !== editalId);
      edital.favoritos = edital.favoritos.filter(userId => userId.toString() !== usuario._id.toString());
      mensagem = 'Edital removido dos favoritos';
    } else {
      usuario.favoritos.push(edital._id);
      edital.favoritos.push(usuario._id);
      mensagem = 'Edital adicionado aos favoritos';
    }

    await usuario.save();
    await edital.save();

    const favoritosPopulados = await Usuario.findById(usuario._id).populate('favoritos');

    res.json({ mensagem, favoritos: favoritosPopulados.favoritos });
  } catch (error) {
    logger.error('Erro ao alternar favorito:', error);
    res.status(500).json({ erro: 'Erro ao alternar favorito' });
  }
};

const listarSugeridos = async (req, res, next) => { 
  try {
    const userId = req.usuario.id;

    if (!userId) {
      logger.warn('Tentativa de buscar editais sugeridos sem userId na requisição.');
      const error = new Error('ID do usuário não encontrado na requisição.');
      error.status = 400;
      return next(error);
    }

    // Busca editais onde o campo 'sugeridoPor' corresponde ao ID do usuário logado
    const editaisSugeridos = await Edital.find({ sugeridoPor: userId });

    logger.info(`Editais sugeridos encontrados para o usuário ${userId}: ${editaisSugeridos.length}`);
    res.status(200).json({ sugeridos: editaisSugeridos });
  } catch (error) {
    logger.error('Erro ao buscar editais sugeridos pelo usuário:', error.message, error); 
    next(error); // Passa o erro para o middleware de tratamento de erros global
  }
};

module.exports = {
  listarFavoritos,
  toggleFavorito,
  listarSugeridos
};