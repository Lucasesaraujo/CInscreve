const express = require('express');
const router = express.Router();
const { listarFavoritos, toggleFavorito, listarSugeridos, listarNotificacoes, toggleNotificacao } = require('../controllers/userController');
const autenticarToken = require('../middlewares/authMiddleware');

// GET Listar editais favoritados /user/favoritos
router.get('/favoritos', autenticarToken, listarFavoritos);

// PATCH Toggle para o botão de favoritar serir pra favoritar e desfavoritar /user/favoritar/xxxxxxxxxxx(id)
router.patch('/favoritar/:id', autenticarToken, toggleFavorito);

// GET Listar editais para notificações /user/notificacoes
router.get('/notificacoes', autenticarToken, listarNotificacoes);

// PATCH Toggle para o botão de notificar serir pra ativar e desativar notificações /user/notificar/xxxxxxxxxxx(id)
router.patch('/notificar/:id', autenticarToken, toggleNotificacao);

// GET Buscar editais sugeridos pelo usuário logado
router.get('/sugeridos', autenticarToken, listarSugeridos);

module.exports = router;