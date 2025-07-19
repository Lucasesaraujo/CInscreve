const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Edital = require('../models/edital');
require('dotenv').config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}, 20000);

afterEach(async () => {
  await Edital.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
}, 20000);

describe('GET /editais', () => {
  it('deve retornar status 200 e um array de editais', async () => {
    // Criar edital de teste
    await Edital.create({
      nome: 'Edital Teste',
      organizacao: 'Org de Teste',
      periodoInscricao: {
        inicio: new Date(),
        fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      descricao: 'Teste de listagem de editais',
      link: 'https://teste.com'
    });

    const response = await request(app).get('/editais');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.editais)).toBe(true);
    expect(response.body.editais.length).toBeGreaterThan(0);
    expect(response.body.editais[0]).toHaveProperty('nome', 'Edital Teste');
  });
});
