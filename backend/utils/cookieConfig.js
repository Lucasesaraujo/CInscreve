// backend/utils/cookieConfig.js
const isProduction = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true, // Impede acesso via JavaScript do lado do cliente
  secure: isProduction, // Envia cookie apenas em HTTPS em produção
  sameSite: isProduction ? 'Strict' : 'Lax', // Mais seguro em produção
};

const accessTokenCookieOptions = {
  ...baseCookieOptions,
  maxAge: 1000 * 60 * 60 // 1 Hora para accessToken
};

const refreshTokenOptions = {
  ...baseCookieOptions,
  maxAge: 1000 * 60 * 60 * 24 * 30 // 30 Dias para refreshToken
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'Strict' : 'Lax',
};

module.exports = {
  accessTokenCookieOptions,
  refreshTokenOptions,
  clearCookieOptions
};