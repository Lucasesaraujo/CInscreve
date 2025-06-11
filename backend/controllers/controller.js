const { editais } = require('../data/dadosmoggados');

const listarEditais = (req, res) => {
  res.json(editais);
};

const criarEdital = (req, res) => {
  const novoEdital = {
    id: editais.length + 1,
    ...req.body
  };

  editais.push(novoEdital);
  res.status(201).json(novoEdital);
};

module.exports = {
  listarEditais,
  criarEdital
};
