const express = require('express');
const {
  listarEditais, criarEdital, removerEdital, atualizarEdital,
  buscarEdital, validarEdital, listarNaoValidados
} = require('../controllers/editalController');

const autenticarToken = require('../middlewares/authMiddleware');
const rateLimit = require('../middlewares/rateLimit'); // 👈 aqui

const router = express.Router();

// ########## ROTAS COM USUÁRIO DESLOGADO OU LOGADO ##########
// Aplica rate limit APENAS nas rotas públicas
router.get('/', rateLimit, listarEditais);
router.get('/nao-validados', rateLimit, listarNaoValidados);
router.get('/:id', rateLimit, buscarEdital);

// ########### ROTAS COM USUÁRIO LOGADO ##########
router.post('/', autenticarToken, criarEdital);
router.put('/:id', autenticarToken, atualizarEdital);
router.delete('/:id', autenticarToken, removerEdital);
router.post('/:id/validar', autenticarToken, validarEdital);

module.exports = router;
