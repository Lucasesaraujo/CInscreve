const mongoose = require('mongoose')

// Schema do edital para configurar seus parâmetros
const EditalSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    minlength: [3, 'O nome deve ter pelo menos 3 caracteres']
  },
  organizacao: {
    type: String,
    required: [true, 'A organização é obrigatória'],
    minlength: [3, 'A organização deve ter pelo menos 3 caracteres']
  },
  periodoInscricao: {
    inicio: {
      type: Date,
      required: true
    },
    fim: {
      type: Date,
      required: true,
      validate: {
        validator: function (valor) {
          return this.periodoInscricao.inicio <= valor;
        },
        message: 'A data de fim deve ser posterior à data de início'
      }
    }
  },
  descricao: String,
  anexos: [String],
  imagens: [String],
  validado: {
    type: Boolean,
    default: false
  },
  sugeridoPor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false
  },
  validacoes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  link: {
    type: String,
    required: false // só será usado quando validado
  },
  favoritos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

});

module.exports = mongoose.model('Edital', EditalSchema, 'editais')