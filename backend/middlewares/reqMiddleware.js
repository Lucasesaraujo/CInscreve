const rateLimit = require('express-rate-limit');

const visitanteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutos
  max: 1000, // visitantes só podem fazer 30 requisições
  message: 'Limite de requisições atingido. Tente novamente em alguns minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  // Configure how to handle requests behind a proxy
  trustProxy: true, // Trust the first proxy
  // Alternative: you can be more specific about which headers to trust
  // trustProxy: ['loopback', 'linklocal', 'uniquelocal']
});

// Só aplica o rate limit se o usuário NÃO estiver logado
const conditionalRateLimit = (req, res, next) => {
  if (!req.usuario) {
    return visitanteLimiter(req, res, next);
  }
  next();
};

module.exports = conditionalRateLimit;
