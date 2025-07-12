const express = require('express');
const router = express.Router();
const { listarFavoritos, toggleFavorito } = require('../controllers/userController');
const autenticarToken = require('../middlewares/authMiddleware');

// GET Listar editais favoritados /user/favoritos
router.get('/favoritos', autenticarToken, listarFavoritos);

// PATCH Toggle para o botão de favoritar serir pra favoritar e desfavoritar /user/favoritar/xxxxxxxxxxx(id)
router.patch('/favoritar/:id', autenticarToken, toggleFavorito);

module.exports = router;