const Edital = require('../models/edital');
const { listarEditaisComFiltro } = require('../services/editalService');

// GET Controller para listar os editais
const listarEditais = async (req, res) => {
  try {
    const resultado = await listarEditaisComFiltro(req.query);
    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao listar editais' });
  }
};

//GET Controller para buscar edital por ID
const buscarEdital = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id; // Se estiver autenticado

    const edital = await Edital.findById(id)
      .populate('sugeridoPor', 'nome email')
      .populate('validacoes', 'nome email');

    if (!edital) {
      return res.status(404).json({ erro: 'Edital não encontrado.' });
    }

    // Clona o objeto para não modificar o original
    const editalObj = edital.toObject();

    // Esconde o link se não for validado e usuário não participou da validação
    const jaValidou = usuarioId && edital.validacoes.some(val => val._id.toString() === usuarioId);
    if (!edital.validado && !jaValidou) {
      editalObj.link = null; // ou undefined
    }

    res.json(editalObj);

  } catch (error) {
    res.status(500).json({ erro: "Erro ao procurar edital." });
  }
};

// POST Controller para criar um novo edital
const criarEdital = async (req, res) => {
  try {
    const editalData = req.body;
    editalData.sugeridoPor = req.usuario.id; // pega o ID do token
    const novoEdital = await Edital.create(editalData);
    res.status(201).json(novoEdital);
    
  } catch(error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ erro: error.message });
    }
    res.status(500).json({ erro: 'ERRO ao criar edital!' })
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

const validarEdital = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.usuario.id;

    const edital = await Edital.findById(id);
    if (!edital) return res.status(404).json({ erro: 'Edital não encontrado' });

    if (edital.sugeridoPor?.toString() === userId) {
      return res.status(403).json({ erro: 'Você não pode validar o edital que sugeriu' });
    }

    if (edital.validacoes.includes(userId)) {
      return res.status(400).json({ erro: 'Você já validou esse edital' });
    }

    edital.validacoes.push(userId);

    if (edital.validacoes.length >= 3) {
      edital.validado = true;
    }

    await edital.save();
    res.json({ mensagem: 'Edital validado com sucesso!', edital });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao validar edital' });
  }
};

const listarNaoValidados = async (req, res) => {
  try {
    const editais = await Edital.find({ validado: false });
    res.json(editais);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao listar editais não validados' });
  }
};

// Exportando os Controllers
module.exports = {
  listarEditais,
  criarEdital,
  atualizarEdital,
  removerEdital,
  buscarEdital,
  validarEdital,
  listarNaoValidados
};
