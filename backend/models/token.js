const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  dispositivo: {
    type: String,
    default: 'desconhecido'
  },
  ip: {
    type: String,
    default: '0.0.0.0'
  },
  criadoEm: {
    type: Date,
    default: Date.now
  },
  expiraEm: {
    type: Date,
    required: true
  }
});

// Cria um índice que remove automaticamente os tokens expirados
TokenSchema.index({ expiraEm: 1 }, { expireAfterSeconds: 0 });

// Exporta o modelo
module.exports = mongoose.model('Token', TokenSchema);
