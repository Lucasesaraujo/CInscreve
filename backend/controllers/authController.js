const axios = require('axios');

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const resposta = await axios.post(
      'https://bora-impactar-dev.setd.rdmapps.com.br/api/login',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const dadosUsuario = resposta.data;

    res.json({ usuario: dadosUsuario });

  } catch (error) {
    console.error("❌ Erro na autenticação:", error.response?.data || error.message);
    res.status(401).json({
      erro: 'Credenciais inválidas ou erro na API externa',
      detalhes: error.response?.data || null
    });
  }
};

module.exports = { loginUsuario };
