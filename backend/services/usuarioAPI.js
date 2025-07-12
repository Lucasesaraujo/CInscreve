const axios = require('axios');

const API_URL = 'https://bora-impactar-dev.setd.rdmapps.com.br/api/login';

const buscarUsuariosExternos = async () => {
  const resposta = await axios.get(API_URL);
  return resposta.data;
};

module.exports = { buscarUsuariosExternos };
