const mongoose = require('mongoose');

// Schema para a ONG
const NgoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  pix: { type: String, default: '' },
  is_formalized: { type: Boolean, default: false },
  start_year: { type: Number },
  contact_phone: { type: String, default: '' },
  instagram_link: { type: String, default: '' },
  x_link: { type: String, default: '' },
  facebook_link: { type: String, default: '' },
  pix_qr_code_link: { type: String, default: '' },
  site: { type: String, default: '' },
  gallery_images_url: { type: [String], default: [] },
  cover_photo_url: { type: String, default: null },
  logo_photo_url: { type: String, default: null },
  skills: { type: [String], default: [] },
  causes: {
    type: [
      {
        id: Number,
        name: String,
        description: { type: String, default: null },
      },
    ],
    default: [],
  },
  sustainable_development_goals: { type: [String], default: [] },
});

// Schema do usuário
const UsuarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital', default: [] }],
  sugeridos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital', default: [] }],
  notificacoes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Edital', default: [] }],
  ngo: { type: NgoSchema, required: true },
});

module.exports = mongoose.model('User', UsuarioSchema);
