const express = require('express');
const { loginUsuario, getUsuarioLogado, logoutUsuario, renovarAccessToken } = require('../controllers/authController');
const autenticarToken = require('../middlewares/authMiddleware');
const router = express.Router();


// POST /api/auth/login
router.post('/login', loginUsuario);

// POST /api/auth/logout
router.post('/logout', autenticarToken, logoutUsuario);

// POST /api/auth/login/me
router.get('/me', autenticarToken, getUsuarioLogado);

// POST /api/auth/refresh 
router.post('/refresh', renovarAccessToken);

module.exports = router;