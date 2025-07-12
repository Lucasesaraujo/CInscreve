const express = require('express');
const { listarEditais, criarEdital, removerEdital, atualizarEdital, buscarEdital, validarEdital, listarNaoValidados } = require('../controllers/editalController');
const autenticarToken = require('../middlewares/authMiddleware');
const router = express.Router();

// ########## ROTAS COM USUÁRIO DESLOGADO OU LOGADO ##########
// GET /editais
router.get('/', listarEditais);

// GET /editais/nao-validados
router.get('/nao-validados', listarNaoValidados);

// GET /editais/id
router.get('/:id', buscarEdital);


// ###########################################################


// ########### ROTAS COM USUÁRIO LOGADO ##########
// POST /editais
router.post('/', autenticarToken, criarEdital);

// PUT /editais/id
router.put('/:id', autenticarToken, atualizarEdital)

// DELETE /editais
router.delete('/:id', autenticarToken, removerEdital);

// POST /editais/id/validar
router.post('/:id/validar', autenticarToken, validarEdital);

// ###############################################

// Exportando as rotas
module.exports = router;
