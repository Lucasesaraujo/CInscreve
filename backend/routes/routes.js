const express = require('express');
const router = express.Router();
const { listarEditais, criarEdital } = require('../controllers/controller');

// GET /editais
router.get('/', listarEditais);

// POST /editais
router.post('/', criarEdital);

module.exports = router;
