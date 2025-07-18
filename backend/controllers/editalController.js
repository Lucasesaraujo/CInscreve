const Edital = require('../models/edital');

// GET Controller para listar os editais
const listarEditais = async (req, res) => {
  try {
    const {
      nome, organizacao, ODS, validado,
      dataInicio, dataFim, sortBy, order,
      page = 1, limit = 6
    } = req.query;

    const filtro = {};

    // Filtros textuais com busca aproximada
    if (nome) filtro.nome = new RegExp(nome, 'i');
    if (organizacao) filtro.organizacao = new RegExp(organizacao, 'i');
    if (ODS) filtro.ODS = ODS;

    // Filtro booleano para validado
    if (validado !== undefined) {
      filtro.validado = validado === 'true';
    }

    // Filtro de datas
    if (dataInicio || dataFim) {
      filtro['periodoInscricao.inicio'] = {};
      if (dataInicio) filtro['periodoInscricao.inicio'].$gte = new Date(dataInicio);
      if (dataFim) filtro['periodoInscricao.inicio'].$lte = new Date(dataFim);
    }

    // ✅ SEGURANÇA: garantir que page e limit sejam números válidos
    const parsedPage = Math.max(1, parseInt(page)) || 1;
    const parsedLimit = Math.max(1, parseInt(limit)) || 6;
    const skip = (parsedPage - 1) * parsedLimit;

    // ✅ SEGURANÇA: limitar os campos de ordenação permitidos
    const camposPermitidos = ['nome', 'organizacao', 'ODS', 'validado', 'periodoInscricao.inicio'];
    const ordenacao = {};
    if (sortBy && camposPermitidos.includes(sortBy)) {
      ordenacao[sortBy] = order === 'desc' ? -1 : 1;
    }

    const editais = await Edital.find(filtro)
      .sort(ordenacao)
      .skip(skip)
      .limit(parsedLimit)
      .select('-__v'); // ✅ LIMPEZA: remove campo técnico do MongoDB

    const total = await Edital.countDocuments(filtro);

    res.json({
      editais,
      total,
      page: parsedPage,
      totalPages: Math.ceil(total / parsedLimit)
    });

  } catch (error) {
    res.status(500).json({ erro: 'Erro ao filtrar e ordenar editais' });
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
