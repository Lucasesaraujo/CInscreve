const express = require('express');
const { loginUsuario, getUsuarioLogado } = require('../controllers/authController');
const autenticarToken = require('../middlewares/authMiddleware');
const router = express.Router();


// POST /api/auth/login
router.post('/login', loginUsuario);

// POST /api/auth/login/me
router.get('/me', autenticarToken, getUsuarioLogado);

module.exports = router;