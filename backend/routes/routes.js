const express = require('express');
const router = express.Router();
const { listarEditais, criarEdital } = require('../controllers/editalController');

// GET /editais
router.get('/', listarEditais);

// POST /editais
router.post('/', criarEdital);

module.exports = router;
