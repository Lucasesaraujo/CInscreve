const Usuario = require('../models/user');

const favoritarEdital = async (req, res) => {
  const userEmail = req.usuario.email;
  const { id } = req.params;

  try {
    const usuario = await Usuario.findOneAndUpdate(
      { email: userEmail },
      { $addToSet: { favoritos: id } },
      { new: true }
    );

    res.json({ mensagem: 'Edital favoritado!', favoritos: usuario.favoritos });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao favoritar edital.' });
  }
};

const listarFavoritos = async (req, res) => {
  const userEmail = req.usuario.email;

  try {
    const usuario = await Usuario.findOne({ email: userEmail }).populate('favoritos');

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    res.json({ favoritos: usuario.favoritos });
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar favoritos.' });
  }
};

const removerFavorito = async (req, res) => {
  const userEmail = req.usuario.email;
  const { id } = req.params;

  try {
    const usuario = await Usuario.findOneAndUpdate(
      { email: userEmail },
      { $pull: { favoritos: id } },
      { new: true }
    ).populate('favoritos');

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    res.json({ mensagem: 'Edital removido dos favoritos', favoritos: usuario.favoritos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao remover favorito' });
  }
};

const toggleFavorito = async (req, res) => {
  const userEmail = req.usuario.email;
  const editalId = req.params.id;

  try {
    const usuario = await Usuario.findOne({ email: userEmail });

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const jaFavoritado = usuario.favoritos.includes(editalId);

    let mensagem = '';

    if (jaFavoritado) {
      usuario.favoritos.pull(editalId);
      mensagem = 'Edital removido dos favoritos';
    } else {
      usuario.favoritos.push(editalId);
      mensagem = 'Edital adicionado aos favoritos';
    }

    await usuario.save();

    const favoritosPopulados = await Usuario.findById(usuario._id).populate('favoritos');

    res.json({ mensagem, favoritos: favoritosPopulados.favoritos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao alternar favorito' });
  }
};

module.exports = {
  favoritarEdital,
  listarFavoritos,
  removerFavorito,
  toggleFavorito,
};