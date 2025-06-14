const express = require('express');
const router = express.Router();
const { listarEditais, criarEdital, removerEdital, atualizarEdital } = require('../controllers/controller');
const { buscarEdital } = require('../controllers/buscaID');

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

// Exportando as rotas
module.exports = router;
