const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis para armazenar o usuário e token de teste
let testUser, accessToken;

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e token
async function createUserAndToken(email, device = 'jest-get-agent') {
    // 2. Cria um usuário de teste no banco de dados
    const user = await User.create({
        email: email,
        // CORREÇÃO: Adicionando os campos obrigatórios 'name' e 'ngo' como um objeto com 'id' e 'name'
        name: 'Test User Get',
        ngo: {
            name: 'Test NGO',
            id: 123
        }
    });

    // 3. Cria tokens para o usuário
    const payload = {
        id: user._id.toString(),
        email: user.email
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    await Token.create({
        userId: user._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        dispositivo: device,
        ip: '127.0.0.1',
        expiraEm: new Date(Date.now() + 1000 * 60 * 60)
    });

    return { user, accessToken };
}

// --- Configuração Global dos Testes ---
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});

    const result = await createUserAndToken('testuser@example.com');
    testUser = result.user;
    accessToken = result.accessToken;
}, 30000); // Aumenta o timeout para a conexão e criação de usuário/token

beforeEach(async () => {
    // CORREÇÃO: Cria um edital de teste para garantir que o teste de obtenção tenha algo para retornar.
    await Edital.deleteMany({});
    await Edital.create({
        nome: 'Edital Teste',
        organizacao: 'Org Teste',
        link: 'https://teste.com',
        categoria: 'Arte',
        periodoInscricao: {
            inicio: '2025-05-01T00:00:00Z',
            fim: '2025-05-31T23:59:59Z',
        },
        descricao: 'Um edital para testar a rota GET.',
        sugeridoPor: testUser._id
    });
});

afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30000);

// =========================================================================
// TESTES DA ROTA GET /editais
// =========================================================================
describe('GET /editais', () => {

    it('deve retornar status 200 e um array de editais', async () => {
        const response = await request(app).get('/editais');
        
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body.editais)).toBe(true);
        expect(response.body.editais.length).toBeGreaterThan(0);
        expect(response.body.editais[0]).toHaveProperty('nome', 'Edital Teste');
    });

});
