// backend/tests/edital.post.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app'); // O seu arquivo principal Express
const User = require('../models/user'); // Importar o modelo de usuário
const Token = require('../models/token'); // Importar o modelo de token
const Edital = require('../models/edital'); // Importar o modelo de edital para limpar depois
require('dotenv').config();

// Variáveis para armazenar o token e o usuário de teste
let accessToken;
let testUser;

// Chaves secretas do JWT para o ambiente de teste
// NOTA: Estas chaves devem estar presentes no seu arquivo .env para o ambiente de teste
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Garante que o banco de dados de teste esteja limpo e o usuário/token sejam configurados antes de cada teste
beforeAll(async () => {
    // Conecta ao banco de dados de teste
    // Aumentei o timeout para 30 segundos, pois a conexão pode demorar.
    await mongoose.connect(process.env.MONGO_URI);

    // 1. Limpa coleções de teste para garantir um estado limpo
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({}); // Limpar também editais para garantir testes isolados

    // 2. Cria um usuário de teste no banco de dados
    testUser = await User.create({
        email: 'testuser@example.com',
        // Adicione outros campos se o seu modelo User os exigir (por exemplo, nome)
    });

    // 3. Gera um accessToken e refreshToken para este usuário.
    // O payload deve corresponder ao que 'gerarToken.js' e 'authMiddleware.js' esperam
    const payload = {
        id: testUser._id.toString(), // ID do usuário do MongoDB convertido para string
        email: testUser.email
    };

    // Verifica se as chaves secretas estão definidas
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET ou JWT_REFRESH_SECRET não estão definidos nas variáveis de ambiente de teste. Verifique seu arquivo .env');
    }

    accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    // 4. Salva o accessToken e refreshToken no banco de dados de teste
    // Isso é crucial porque seu 'authMiddleware' verifica se o token existe no DB
    await Token.create({
        userId: testUser._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        dispositivo: 'jest-test-agent',
        ip: '127.0.0.1',
        expiraEm: new Date(Date.now() + 1000 * 60 * 60) // Token expira em 1 hora a partir de agora
    });

}, 30020); // Timeout para beforeAll

// Limpa os dados APÓS CADA TESTE, mas mantém a conexão ativa
afterEach(async () => {
    // Limpa apenas os editais criados no teste atual para isolamento
    await Edital.deleteMany({});
});

// Desconecta do banco de dados após TODOS os testes
afterAll(async () => {
    // Limpa o usuário de teste e os tokens de teste após todos os testes
    await User.deleteMany({});
    await Token.deleteMany({});
    await mongoose.disconnect();
}, 30020); // Timeout para afterAll

describe('POST /editais', () => {
    it('should create a new edital successfully when authenticated', async () => {
        const newEdital = {
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
            .set('Cookie', [`accessToken=${accessToken}`]) // Envia o token como cookie HTTP-only
            .send(newEdital)
            .set('Accept', 'application/json');

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.nome).toBe(newEdital.nome);
        // Verifica se o edital foi sugerido pelo usuário de teste (ID convertido para string)
        expect(response.body.sugeridoPor.toString()).toBe(testUser._id.toString());
    });

    it('should fail to create edital without authentication', async () => {
        const newEdital = {
            nome: 'Edital de Teste Sem Auth',
            organizacao: 'Org Sem Auth',
            periodoInscricao: {
                inicio: '2025-08-01T00:00:00Z',
                fim: '2025-08-31T23:59:59Z'
            }
        };

        const response = await request(app)
            .post('/editais')
            .send(newEdital)
            .set('Accept', 'application/json');

        expect(response.status).toBe(401); // Ou 403 dependendo do seu middleware
        expect(response.body).toHaveProperty('erro', 'Token não fornecido');
    });

    it('should fail to create edital with missing required fields (e.g., nome)', async () => {
        const invalidEdital = {
            organizacao: 'Org X',
            periodoInscricao: {
                inicio: '2025-08-01T00:00:00Z',
                fim: '2025-08-31T23:59:59Z'
            }
        };

        const response = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`]) // Envia o token como cookie HTTP-only
            .send(invalidEdital)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400); // Erro de validação
        // A mensagem de erro exata depende de como o seu middleware de erro lida com ValidationError
        // Se você implementou o middleware de erro global que sugeri, a mensagem pode ser diferente.
        expect(response.body).toHaveProperty('erro');
        expect(response.body.erro).toContain('nome: O nome é obrigatório');
    });

    it('should fail to create edital if end date is before start date', async () => {
        const invalidDateEdital = {
            nome: 'Edital Datas Invalidas',
            organizacao: 'Org Datas',
            periodoInscricao: {
                inicio: '2025-08-31T00:00:00Z',
                fim: '2025-08-01T23:59:59Z' // Fim antes do início
            }
        };

        const response = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(invalidDateEdital)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro');
        expect(response.body.erro).toContain('A data de fim deve ser posterior à data de início');
    });
});