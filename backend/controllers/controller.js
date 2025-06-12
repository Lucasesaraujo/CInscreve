const Edital = require('../models/edital');

const listarEditais = async (req, res) => {
  try {
    const editais = await Edital.find();
    res.json(editais);
    
  } catch(error) {
    res.status(500).json({ erro: 'ERRO ao listar editais'})
  }
};

const criarEdital = async (req, res) => {
  try {
    const novoEdital = await Edital.create(req.body);
    res.status(201).json(novoEdital);
    
  } catch(error) {
    res.status(500).json({ erro: 'ERRO ao criar edital!'})
  }
};

module.exports = {
  listarEditais,
  criarEdital
};
