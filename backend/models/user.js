const mongoose = require('mongoose')

//Schema do usuário
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital', default: [] }],
  sugeridos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital', default: [] }],
  notificacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital', default: [] }],
});

// Atualização do schema para incluir novos campos
// const UsuarioSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   nome: { type: String },
//   cnpj: { type: String },
//   telefone: { type: String },
//   ods: { type: String },
//   favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital' }],
//   sugeridos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital' }],
// });

module.exports = mongoose.model('User', UsuarioSchema)