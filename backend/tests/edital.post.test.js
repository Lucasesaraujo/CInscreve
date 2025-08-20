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
let testEditalId; // Para armazenar o ID do edital criado

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e token
async function createUserAndToken(email, device = 'jest-post-agent') {
    // 2. Cria um usuário de teste no banco de dados
    const user = await User.create({
        email: email,
        // CORREÇÃO: Adicionando os campos obrigatórios 'name' e 'ngo' como um objeto com 'id'
        name: 'Test User Post',
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

afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30000);

// =========================================================================
// TESTES DA ROTA POST /editais
// =========================================================================
describe('POST /editais', () => {

    it('should create a new edital successfully when authenticated', async () => {
        const novoEdital = {
            nome: 'Edital de Teste',
            organizacao: 'Org de Teste',
            link: 'https://teste.com',
            categoria: 'Arte',
            periodoInscricao: {
                inicio: '2025-05-01T00:00:00Z',
                fim: '2025-05-31T23:59:59Z',
            },
            descricao: 'Um edital para testar a rota POST.',
        };

        const response = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`])
            .set('Accept', 'application/json')
            .send(novoEdital);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('mensagem', 'Edital criado com sucesso!');
        expect(response.body.edital).toHaveProperty('_id');
        expect(response.body.edital.nome).toBe(novoEdital.nome);
        expect(response.body.edital.organizacao).toBe(novoEdital.organizacao);
        expect(response.body.edital.sugeridoPor.toString()).toBe(testUser._id.toString());
        
        // Armazena o ID do edital para o próximo teste
        testEditalId = response.body.edital._id;
    });

    it('should fail to create edital without authentication', async () => {
        const novoEdital = {
            nome: 'Edital Sem Auth',
            organizacao: 'Org Sem Auth',
            link: 'https://teste-noauth.com',
            categoria: 'Música',
            periodoInscricao: {
                inicio: '2025-06-01T00:00:00Z',
                fim: '2025-06-30T23:59:59Z',
            },
        };

        const response = await request(app)
            .post('/editais')
            .send(novoEdital);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('erro', 'Token não fornecido');
    });

    it('should fail to create edital with missing required fields (e.g., nome)', async () => {
        const editalInvalido = {
            organizacao: 'Org Invalida',
            link: 'https://invalido.com',
            categoria: 'Outros',
            periodoInscricao: {
                inicio: '2025-07-01T00:00:00Z',
                fim: '2025-07-31T23:59:59Z',
            },
        };

        const response = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(editalInvalido);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro');
        expect(response.body.erro).toContain('nome');
    });
    
    it('should fail to create edital if end date is before start date', async () => {
        const editalDatasInvertidas = {
            nome: 'Edital Datas Invertidas',
            organizacao: 'Org Invalida',
            link: 'https://invalido.com',
            categoria: 'Outros',
            periodoInscricao: {
                inicio: '2025-08-31T23:59:59Z',
                fim: '2025-08-01T00:00:00Z',
            },
        };

        const response = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(editalDatasInvertidas);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'A data de fim deve ser posterior à data de início');
    });
});
