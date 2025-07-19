const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'superjamessecreto2077punk';

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Gerar token para teste - payload pode ser ajustado conforme seu schema de usuário
  token = jwt.sign(
    {
      id: 'idFakeDeTeste1234567890', // Pode ser qualquer string
      email: 'teste@exemplo.com'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}, 20000);

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
}, 20000);

describe('POST /editais', () => {
  it('deve criar um novo edital com sucesso', async () => {
    const novoEdital = {
      nome: 'Edital de Cultura 2025',
      organizacao: 'Fundarpe',
      periodoInscricao: {
        inicio: '2025-08-01T00:00:00Z',
        fim: '2025-08-31T23:59:59Z'
      },
      descricao: 'Apoio a projetos culturais.',
      link: 'https://example.com/edital'
    };

    const response = await request(app)
      .post('/editais')
      .set('Authorization', `Bearer ${token}`)
      .send(novoEdital)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201); // ou 200 dependendo do controller
    expect(response.body).toHaveProperty('_id');
    expect(response.body.nome).toBe(novoEdital.nome);
  });

  it('deve falhar ao criar edital sem nome', async () => {
    const editalInvalido = {
      organizacao: 'Org X',
      periodoInscricao: {
        inicio: '2025-08-01T00:00:00Z',
        fim: '2025-08-31T23:59:59Z'
      }
    };

    const response = await request(app)
      .post('/editais')
      .set('Authorization', `Bearer ${token}`)
      .send(editalInvalido)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400); // ou 422 dependendo do tratamento
    expect(response.body).toHaveProperty('error');
  });
});