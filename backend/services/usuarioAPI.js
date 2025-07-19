const axios = require('axios');
const API_URL = process.env.EXTERNAL_AUTH_API_URL;

const buscarUsuariosExternos = async () => {
  const resposta = await axios.get(API_URL);
  return resposta.data;
};

module.exports = { buscarUsuariosExternos };
