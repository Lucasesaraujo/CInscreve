const express = require('express');
const router = express.Router();
const { listarEditais, criarEdital, removerEdital } = require('../controllers/controller');

// GET /editais
router.get('/', listarEditais);

// POST /editais
router.post('/', criarEdital);

// DELETE /editais
router.delete('/:id', removerEdital);

module.exports = router;
