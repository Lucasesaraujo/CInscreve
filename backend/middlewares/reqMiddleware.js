const rateLimit = require('express-rate-limit');

const visitanteLimiter = rateLimit({
  windowMs: 15, // 15 minutos
  max: 9999, // visitantes só podem fazer 300 requisições
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
