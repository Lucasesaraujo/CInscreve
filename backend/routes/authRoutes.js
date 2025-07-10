const express = require('express');
const { loginUsuario, getUsuarioLogado } = require('../controllers/authController');
const autenticarToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUsuario);
router.get('/me', autenticarToken, getUsuarioLogado);

module.exports = router;