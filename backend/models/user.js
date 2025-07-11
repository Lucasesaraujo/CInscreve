const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // vindo da API
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital' }],
  sugeridos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital' }],
});

module.exports = mongoose.model('Usuario', UsuarioSchema)