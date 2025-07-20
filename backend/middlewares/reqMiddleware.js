const rateLimit = require('express-rate-limit');

const visitanteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 300, // visitantes só podem fazer 30 requisições
  message: 'Limite de requisições atingido. Tente novamente em alguns minutos.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Só aplica o rate limit se o usuário NÃO estiver logado
const conditionalRateLimit = (req, res, next) => {
  if (!req.usuario) {
    return visitanteLimiter(req, res, next);
  }
  next();
};

module.exports = conditionalRateLimit;
