const express = require('express');
const { listarEditais, criarEdital, removerEdital, atualizarEdital, buscarEdital } = require('../controllers/editalController');
const autenticarToken = require('../middlewares/authMiddleware');
const router = express.Router();

// GET /editais
router.get('/', listarEditais);

// GET /editais/id
router.get('/:id', buscarEdital);

// POST /editais
router.post('/', criarEdital);

// PUT /editais/id
router.put('/:id', atualizarEdital)

// DELETE /editais
router.delete('/:id', removerEdital);

// GET Token
router.get('/', autenticarToken, listarEditais);

// Exportando as rotas
module.exports = router;
