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

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: false, //DEPOIS QUE FOR PRO AR, TIRA E COLOCA TRUE
      sameSite: 'Lax', //DEPOIS QUE FOR PRO AR, TIRA E COLOCA Strict
      maxAge: 1000 * 60 * 60  //1 Hora
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, //DEPOIS QUE FOR PRO AR, TIRA E COLOCA true
      sameSite: 'Lax', //DEPOIS QUE FOR PRO AR, TIRA E COLOCA Strict
      maxAge: 1000 * 60 * 60 * 24 * 30  //30 Dias
    });

    res.json({ usuario: dadosUsuario});

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

//POST - Controller para deslogar usuário
const logoutUsuario = async (req, res) => {
  const accessToken = req.cookies.accessToken;

  if(!accessToken) return res.status(400).json({ erro: 'Token não fornecido' });

  try{
    const resultado = await Token.deleteOne({ accessToken: accessToken});

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict'
    });

    if(resultado.deletedCount === 0) return res.status(404).json({ erro: 'Token não encontrado ou já removido' });

    res.json({ mensagem: 'Logout realizado com sucesso'})

  } catch(error) {
    console.error('Erro ao fazer logout:', error);
    res.status(500).json({ erro: 'Erro interno ao realizar logout' });
  }
}

module.exports = { loginUsuario, getUsuarioLogado, logoutUsuario };