const jwt = require('jsonwebtoken');

// FUNÇÃO PARA GERAR OS TOKENS DE ACESSO E REFRESH
const gerarTokens = (dadosUsuario) => {
  const payload = {
    id: dadosUsuario.ngo.id,
    email: dadosUsuario.user.email,
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

module.exports = { gerarTokens };