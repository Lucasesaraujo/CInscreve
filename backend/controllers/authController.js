const axios = require('axios');
const { gerarTokens } = require('../utils/gerarToken');
const Usuario = require('../models/user');

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const resposta = await axios.post(
      'https://bora-impactar-dev.setd.rdmapps.com.br/api/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const dadosUsuario = resposta.data;

    await Usuario.findOneAndUpdate(
      { email: dadosUsuario.user.email },
      {},
      { upsert: true, new: true }
    );

    const { accessToken, refreshToken } = gerarTokens(dadosUsuario);

    res.json({ usuario: dadosUsuario, accessToken: accessToken, refreshToken: refreshToken });

  } catch (error) {
    console.error("❌ Erro na autenticação:", error.response?.data || error.message);
    res.status(401).json({
      erro: 'Credenciais inválidas ou erro na API externa', detalhes: error.response?.data || null
    });
  }
};

const getUsuarioLogado = (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { loginUsuario, getUsuarioLogado };