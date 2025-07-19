// config/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Inclui a stack trace para erros
    logFormat
  ),
  transports: [
    new transports.File({ filename: 'logs/error.log', level: 'error' }), // Logs de erro para um arquivo
    new transports.File({ filename: 'logs/combined.log' }), // Todos os logs para outro arquivo
  ],
});

// Se não estiver em produção, adicione o console transport
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: combine(
      colorize(),
      logFormat
    )
  }));
}

module.exports = logger;