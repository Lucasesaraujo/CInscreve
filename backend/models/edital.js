const mongoose = require('mongoose')

const EditalSchema = new mongoose.Schema({
  nome: String,
  organizacao: String,
  periodoInscricao: {
    inicio: Date,
    fim: Date
  },
  descricao: String,
  anexos: [String],
  imagens: [String],
  validado: Boolean,
})

module.exports = mongoose.model('Edital', EditalSchema, 'editais')