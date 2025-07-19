const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/editais_test');
}, 20000); // timeout de 20 segundos

afterAll(async () => {
  await mongoose.disconnect();
}, 20000);


describe('GET /editais', () => {
  it('deve retornar status 200 e um array de editais', async () => {
    const response = await request(app).get('/editais');
    console.log('Resposta /editais:', response.body);  // para debug, pode remover depois
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.editais)).toBe(true);
  });
});

