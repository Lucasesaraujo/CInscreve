const Usuario = require('../models/user');
const Edital = require('../models/edital');

// GET - Controller para listar os editais favoritos do usuário logado
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

// PATCH - Controller para favoritar ou desfavoritar o edital do usuário
const toggleFavorito = async (req, res) => {
  const userEmail = req.usuario.email;
  const editalId = req.params.id;

  try {
    const usuario = await Usuario.findOne({ email: userEmail });
    const edital = await Edital.findById(editalId);

    if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });
    if (!edital) return res.status(404).json({ erro: 'Edital não encontrado' });

    const jaFavoritado = usuario.favoritos.includes(editalId);
    let mensagem = '';

    if (jaFavoritado) {
      // Remover dos favoritos do usuário
      usuario.favoritos.pull(editalId);
      // Remover o usuário da lista de favoritos do edital
      edital.favoritos.pull(usuario._id);
      mensagem = 'Edital removido dos favoritos';
    } else {
      if (!usuario.favoritos.includes(editalId)) {
        usuario.favoritos.push(editalId);
      }

      if (!edital.favoritos.includes(usuario._id)) {
        edital.favoritos.push(usuario._id);
      }
      
      mensagem = 'Edital adicionado aos favoritos';
    }

    await usuario.save();
    await edital.save();

    const favoritosPopulados = await Usuario.findById(usuario._id).populate('favoritos');

    res.json({ mensagem, favoritos: favoritosPopulados.favoritos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao alternar favorito' });
  }
};

module.exports = {
  listarFavoritos,
  toggleFavorito
};