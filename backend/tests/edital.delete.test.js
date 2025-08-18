// backend/tests/edital.delete.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis para armazenar o token e o usuário/edital de teste
let accessToken;
let testUser;
let testEdital; // Para armazenar o edital criado para o teste DELETE

// Chaves secretas do JWT (lidas do .env)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// --- Configuração Global dos Testes ---
beforeAll(async () => {
    // Conecta ao banco de dados de teste
    await mongoose.connect(process.env.MONGO_URI_TEST);

    // Limpa coleções de teste para garantir um estado limpo antes de todos os testes nesta suíte
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});

    // 1. Cria um usuário de teste
    testUser = await User.create({
        email: 'delete_test_user@example.com',
        // Adicione outros campos se o seu modelo User os exigir
    });

    // 2. Gera um accessToken para este usuário
    const payload = {
        id: testUser._id.toString(),
        email: testUser.email
    };

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET ou JWT_REFRESH_SECRET não estão definidos. Verifique seu arquivo .env');
    }

    accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    // 3. Salva o token no banco de dados de teste (necessário para o authMiddleware)
    await Token.create({
        userId: testUser._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        dispositivo: 'jest-delete-test-agent',
        ip: '127.0.0.1',
        expiraEm: new Date(Date.now() + 1000 * 60 * 60)
    });

}, 30020); // Aumenta o timeout para a conexão inicial do DB

beforeEach(async () => {
    // Limpa APENAS os editais antes de CADA TESTE para garantir que cada um comece com um estado fresco
    await Edital.deleteMany({});

    // Cria um edital de teste para ser deletado neste teste específico
    testEdital = await Edital.create({
        nome: 'Edital para Deletar',
        organizacao: 'Org de Deletacao',
        periodoInscricao: {
            inicio: new Date('2025-03-01T00:00:00Z'),
            fim: new Date('2025-03-31T23:59:59Z')
        },
        descricao: 'Descrição do edital para teste de exclusão.',
        link: 'https://original-delete.com',
        sugeridoPor: testUser._id, // O edital é sugerido pelo usuário de teste
        validado: false
    });
});

afterAll(async () => {
    // Limpa todas as coleções após TODOS os testes serem executados
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30020); // Aumenta o timeout para a desconexão

// =========================================================================
// TESTES DA ROTA DELETE /editais/:id (DELETAR)
// =========================================================================
describe('DELETE /editais/:id', () => {
    it('should delete an edital successfully when authenticated', async () => {
        const response = await request(app)
            .delete(`/editais/${testEdital._id}`) // Usa o ID do edital de teste
            .set('Cookie', [`accessToken=${accessToken}`]) // Envia o token como cookie HTTP-only
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('mensagem', 'Edital removido com sucesso!');

        // Verifique no banco de dados se o edital foi realmente deletado
        const foundEdital = await Edital.findById(testEdital._id);
        expect(foundEdital).toBeNull(); // Deve ser nulo, pois foi deletado
    });

    it('should return 404 if edital to delete is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Gera um ID que não existe

        const response = await request(app)
            .delete(`/editais/${nonExistentId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('erro', 'Edital não encontrado!');
    });

    it('should return 400 if ID is invalid format', async () => {
        const invalidId = 'def456invalid'; // ID com formato inválido

        const response = await request(app)
            .delete(`/editais/${invalidId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .set('Accept', 'application/json');

        // Seu middleware validarObjectID deve pegar isso
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'ID inválido');
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .delete(`/editais/${testEdital._id}`)
            .set('Accept', 'application/json'); // Sem enviar o cookie de autenticação

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('erro', 'Token não fornecido');
    });
});