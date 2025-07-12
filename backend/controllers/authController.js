const axios = require('axios');
const { gerarTokens } = require('../utils/gerarToken');
const Usuario = require('../models/user');
const Token = require('../models/token');
const jwt = require('jsonwebtoken');

// POST - Controller para logar usuário e retorna seus dados, token de acesso e de refresh
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const resposta = await axios.post(
      'https://bora-impactar-dev.setd.rdmapps.com.br/api/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const dadosUsuario = resposta.data;

    const usuarioLocal = await Usuario.findOneAndUpdate(
      { email: dadosUsuario.user.email },
      {},
      { upsert: true, new: true }
    );

    const { accessToken, refreshToken } = gerarTokens(dadosUsuario);

    const expiracao = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await Token.deleteMany({ userId: usuarioLocal._id });
    
    // CRIANDO TOKEN NO BANCO DE DADOS
    await Token.create({
      userId: usuarioLocal._id,
      accessToken: accessToken,
      refreshToken: refreshToken,
      dispositivo: req.headers['user-agent'],
      ip: req.ip,
      expiraEm: expiracao
    });

    res.json({ usuario: dadosUsuario, accessToken: accessToken, refreshToken: refreshToken });

  } catch (error) {
    console.error("❌ Erro na autenticação:", error.response?.data || error.message);
    res.status(401).json({
      erro: 'Credenciais inválidas ou erro na API externa', detalhes: error.response?.data || null
    });
  }
};

// GET - Controller para confirmar que o usuário está logado
const getUsuarioLogado = (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { loginUsuario, getUsuarioLogado };