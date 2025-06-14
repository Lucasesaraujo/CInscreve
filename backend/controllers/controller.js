const Edital = require('../models/edital');

// GET Controller para listar os editais
const listarEditais = async (req, res) => {
  try {
    const editais = await Edital.find();
    res.json(editais);
    
  } catch(error) {
    res.status(500).json({ erro: 'ERRO ao listar editais'})
  }
};

// POST Controller para criar um novo edital
const criarEdital = async (req, res) => {
  try {
    const novoEdital = await Edital.create(req.body);
    res.status(201).json(novoEdital);
    
  } catch(error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ erro: error.message });
    }
    res.status(500).json({ erro: 'ERRO ao criar edital!'})
  }
};

// PUT Controller para editar um parâmetro do edital
const atualizarEdital = async (req, res) => {
  try {
    const editalAtualizado = await Edital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!editalAtualizado) return res.status(404).json({ erro: 'Edital não encontrado!' });
    res.json(editalAtualizado);

  } catch (err) {
    res.status(500).json({ erro: 'ERRO ao atualizar edital!' });
  }
};

// DELETE Controller para deletar um edital
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

// Exportando os Controllers
module.exports = {
  listarEditais,
  criarEdital,
  atualizarEdital,
  removerEdital
};
