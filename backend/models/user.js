const mongoose = require('mongoose')

const UsuarioSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    minlength: [3, 'O nome deve ter pelo menos 3 caracteres']
  },
  cnpj: {
    type: String,
    required: [true, 'O CNPJ é obrigatório'],
    match: [/^\d{14}$/, 'CNPJ deve conter exatamente 14 dígitos numéricos']
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    match: [/.+\@.+\..+/, 'E-mail inválido']
  },
  telefone: {
    type: String,
    required: [true, 'O telefone é obrigatório'],
    match: [/^\d{10,11}$/, 'Telefone deve conter 10 ou 11 dígitos']
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema)

