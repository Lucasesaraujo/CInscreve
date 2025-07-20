// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('./config/logger');
require('dotenv').config();

const editalRoutes = require('./routes/editalRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/editais', editalRoutes);
app.use('/user', userRoutes);
app.use('/api/auth', authRoutes);

// Middleware de tratamento de erros global (SEMPRE POR ÚLTIMO)
app.use((err, req, res, next) => {
  logger.error(`Erro inesperado: ${err.message}`, {
      stack: err.stack,
      requestUrl: req.originalUrl,
      requestMethod: req.method,
      requestBody: req.body, 
      // Adicione req.ip se necessário, mas já deve estar no token
  }); // Loga o erro completo com detalhes adicionais

  if (err.name === 'ValidationError') {
    return res.status(400).json({ erro: err.message, detalhes: err.errors });
  }
  if (err.status) { // Para erros customizados com status (como os de services e validarObjectID)
    return res.status(err.status).json({ erro: err.message });
  }
  if (err.code === 11000) { // Erro de duplicidade do MongoDB (ex: unique: true)
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ erro: `O ${field} já está em uso.`, campo: field });
  }

  // Erro interno do servidor (genérico)
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;
