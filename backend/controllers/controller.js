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

const removerEdital = async (req, res) => {
  try {
    const { id } = req.params;

    const editalRemovido = await Edital.findByIdAndDelete(id);

    if (!editalRemovido) {
      return res.status(404).json({ erro: 'Edital não encontrado!' });
    }

    res.json({ mensagem: 'Edital removido com sucesso!' });
    
  } catch (error) {
    res.status(500).json({ erro: 'ERRO ao remover edital!' });
  }
};

module.exports = {
  listarEditais,
  criarEdital,
  removerEdital
};
