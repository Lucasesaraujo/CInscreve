const express = require('express');
const router = express.Router();
const { favoritarEdital, listarFavoritos, removerFavorito, toggleFavorito } = require('../controllers/userController');
const autenticarToken = require('../middlewares/authMiddleware');

// POST Favoritar edital
router.post('/favoritar/:id', autenticarToken, favoritarEdital);

// GET Listar editais favoritados
router.get('/favoritos', autenticarToken, listarFavoritos);

// DELETE Remover da lista de favoritos
router.delete('/favoritar/:id', autenticarToken, removerFavorito);

// PATCH Toggle para o botão de favoritar serir pra favoritar e desfavoritar
router.patch('/favoritar/:id', autenticarToken, toggleFavorito);

module.exports = router;