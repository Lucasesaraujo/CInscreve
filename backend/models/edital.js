// backend/models/edital.js
const mongoose = require('mongoose')

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
  descricao: {
    type: String,
    required: true
  },
  periodoInscricao: {
    inicio: {
      type: Date,
      required: true 
    },
    fim: {
      type: Date,
      required: true 
    }
  },
  validado: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    required: false
  },
  sugeridoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  favoritadoPor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  validadoPor: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  denunciadoPor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  anexos: [String],
  imagens: [String],
}, {
  timestamps: true
});


module.exports = mongoose.model('Edital', EditalSchema, 'editais')