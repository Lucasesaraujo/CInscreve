const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
  nome: String,
  cnpj: String,
  email: String,
  telefone: String,
})

module.exports = mongoose.model('Usuario', UsuarioSchema)

