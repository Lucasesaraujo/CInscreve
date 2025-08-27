const rateLimit = require('express-rate-limit');

const visitanteLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutos
  max: 1000, // visitantes só podem fazer 1000 requisições
  message: 'Limite de requisições atingido. Tente novamente em alguns minutos.',
  standardHeaders: true,
  legacyHeaders: false,
  // CORREÇÃO: Remover trustProxy daqui ou ser mais específico
  // Opção 2: Ou configurar para ignorar a validação
  validate: {
    trustProxy: false,
  },

  // Opção 3: Ou ser mais específico sobre os proxies confiáveis
  // trustProxy: 1, // Para apenas 1 proxy (nginx)
});

// Só aplica o rate limit se o usuário NÃO estiver logado
const conditionalRateLimit = (req, res, next) => {
  if (!req.usuario) {
    return visitanteLimiter(req, res, next);
  }
  next();
};

module.exports = conditionalRateLimit;
