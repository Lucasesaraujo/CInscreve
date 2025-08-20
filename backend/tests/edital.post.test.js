const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis de teste
let user, accessToken, refreshToken;
let agent = request.agent(app);

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e tokens
async function createUserAndToken(emailPrefix, device = 'jest-post-agent') {
    // CORREÇÃO: Usando um valor numérico para ngo.id para corresponder ao esquema do User
    const user = await User.create({
        email: `${emailPrefix}@example.com`,
        name: `User ${emailPrefix}`,
        ngo: {
            name: `NGO ${emailPrefix}`,
            id: 12345
        }
    });

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

    return { user, accessToken, refreshToken };
}

// Configuração Global
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});

    const result = await createUserAndToken('post_test_user');
    user = result.user;
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;

    // Simular login para manter a sessão
    await agent.get('/test-login').set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);
}, 30000);

afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30000);

// =========================================================================
// TESTES POST /EDITAIS
// =========================================================================
describe('POST /editais', () => {

    it('should create a new edital successfully when authenticated', async () => {
        const novoEdital = {
            nome: 'Edital de Exemplo',
            categoria: 'Arte',
            organizacao: 'Exemplo Org',
            descricao: 'Descrição do edital de exemplo.', // CORREÇÃO: Adicionado campo 'descricao'
            periodoInscricao: {
                inicio: new Date('2025-01-01T00:00:00Z'),
                fim: new Date('2025-02-01T23:59:59Z'),
            },
            link: 'https://exemplo.com/edital1',
        };

        const response = await agent.post('/editais') // CORREÇÃO: Usando 'agent'
            .send(novoEdital);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('mensagem', 'Edital criado com sucesso!');
        expect(response.body.edital).toHaveProperty('_id');
        expect(response.body.edital.nome).toBe(novoEdital.nome);
        expect(response.body.edital.sugeridoPor.toString()).toBe(user._id.toString());
    });

    it('should fail to create edital without authentication', async () => {
        const editalSemAuth = {
            nome: 'Edital Sem Autenticação',
            categoria: 'Cultura',
            organizacao: 'Org Sem Auth',
            descricao: 'Descrição do edital sem autenticação.', // CORREÇÃO: Adicionado campo 'descricao'
            periodoInscricao: {
                inicio: new Date('2025-03-01T00:00:00Z'),
                fim: new Date('2025-04-01T23:59:59Z'),
            },
            link: 'https://exemplo.com/edital2',
        };
        const response = await request(app).post('/editais')
            .send(editalSemAuth);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('erro', 'Autenticação necessária.');
    });

    it('should fail to create edital with missing required fields (e.g., nome)', async () => {
        const editalInvalido = {
            // Nome ausente
            categoria: 'Esportes',
            organizacao: 'Org Invalida',
            descricao: 'Descrição do edital inválido.', // CORREÇÃO: Adicionado campo 'descricao'
            periodoInscricao: {
                inicio: new Date('2025-05-01T00:00:00Z'),
                fim: new Date('2025-06-01T23:59:59Z'),
            },
            link: 'https://exemplo.com/edital3',
        };

        const response = await agent.post('/editais') // CORREÇÃO: Usando 'agent'
            .send(editalInvalido);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro');
        expect(response.body.erro).toContain('nome');
    });
    
    it('should fail to create edital if end date is before start date', async () => {
        const editalDatasInvertidas = {
            nome: 'Edital com Datas Invertidas',
            categoria: 'Saúde',
            organizacao: 'Org Datas',
            descricao: 'Descrição do edital com datas invertidas.', // CORREÇÃO: Adicionado campo 'descricao'
            periodoInscricao: {
                inicio: new Date('2025-08-01T00:00:00Z'),
                fim: new Date('2025-07-01T23:59:59Z'), // Data de fim antes da de início
            },
            link: 'https://exemplo.com/edital4',
        };

        const response = await agent.post('/editais') // CORREÇÃO: Usando 'agent'
            .send(editalDatasInvertidas);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'A data de fim deve ser posterior à data de início');
    });
});
