const express = require('express');
const router = express.Router();
const { listarEditais, criarEdital, removerEdital } = require('../controllers/controller');
const { buscarEdital } = require('../controllers/buscaID');

// GET /editais
router.get('/', listarEditais);
router.get('/:id', buscarEdital);

// POST /editais
router.post('/', criarEdital);

// DELETE /editais
router.delete('/:id', removerEdital);

module.exports = router;
