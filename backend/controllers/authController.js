const axios = require('axios');
const jwt = require('jsonwebtoken');


const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const resposta = await axios.post(
      'https://bora-impactar-dev.setd.rdmapps.com.br/api/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const dadosUsuario = resposta.data;

    console.log('Dados da API externa:', resposta.data);

    const token = jwt.sign(
      {id: dadosUsuario.ngo.id, email: dadosUsuario.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h'} // o token expira em 1 hora, ou seja, sessão de 1 hora
    );

    res.json({ usuario: dadosUsuario, token });

  } catch (error) {
    console.error("❌ Erro na autenticação:", error.response?.data || error.message);
    res.status(401).json({
      erro: 'Credenciais inválidas ou erro na API externa', detalhes: error.response?.data || null
    });
  }
};

const getUsuarioLogado = (req, res) => {
  res.json({ usuario: req.usuario });
};

module.exports = { loginUsuario, getUsuarioLogado };