const jwt = require('jsonwebtoken');

const gerarTokens = (dadosUsuario) => {
  const payload = {
    id: dadosUsuario.id,     
    email: dadosUsuario.email 
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken };
};

module.exports = { gerarTokens };