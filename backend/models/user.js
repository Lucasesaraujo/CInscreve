const mongoose = require('mongoose')

//Schema do usuário
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital' }],
  sugeridos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital' }],
});

module.exports = mongoose.model('User', UsuarioSchema)