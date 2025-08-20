const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis para armazenar o usuário e token de teste
let testUser, accessToken, testEdital;

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e token
async function createUserAndToken(emailPrefix, device = 'jest-delete-agent') {
    // 1. Cria um usuário de teste
    const user = await User.create({
        email: `${emailPrefix}@example.com`,
        // CORREÇÃO: Adicionando os campos obrigatórios 'name' e 'ngo' como um objeto com 'id'
        name: `Test User ${emailPrefix}`,
        ngo: {
            name: `Test NGO ${emailPrefix}`,
            id: new mongoose.Types.ObjectId()
        }
    });

    // 2. Cria tokens para o usuário
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
    
    const result = await createUserAndToken('delete_test_user');
    testUser = result.user;
    accessToken = result.accessToken;

}, 30000); // Aumenta o timeout para a conexão e criação de usuário/token

beforeEach(async () => {
    // Cria um edital de teste antes de cada teste
    await Edital.deleteMany({});
    testEdital = await Edital.create({
        nome: 'Edital para Deletar',
        organizacao: 'Org Delete',
        link: 'https://deletar.com',
        categoria: 'Cultura',
        periodoInscricao: {
            inicio: new Date('2025-05-01T00:00:00Z'),
            fim: new Date('2025-05-31T23:59:59Z'),
        },
        descricao: 'Edital de teste para a rota DELETE.',
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
// TESTES DA ROTA DELETE /editais/:id
// =========================================================================
describe('DELETE /editais/:id', () => {

    it('should delete an edital successfully when authenticated', async () => {
        const response = await request(app)
            .delete(`/editais/${testEdital._id}`)
            .set('Cookie', [`accessToken=${accessToken}`]);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('mensagem', 'Edital excluído com sucesso!');

        // Verifique se o edital foi realmente excluído do banco de dados
        const editalDeletado = await Edital.findById(testEdital._id);
        expect(editalDeletado).toBeNull();
    });

    it('should return 404 if edital to delete is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // ID que não existe

        const response = await request(app)
            .delete(`/editais/${nonExistentId}`)
            .set('Cookie', [`accessToken=${accessToken}`]);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('erro', 'Edital não encontrado');
    });

    it('should return 400 if ID is invalid format', async () => {
        const invalidId = 'invalid_id_format'; // ID com formato inválido

        const response = await request(app)
            .delete(`/editais/${invalidId}`)
            .set('Cookie', [`accessToken=${accessToken}`]);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'ID inválido');
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .delete(`/editais/${testEdital._id}`);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('erro', 'Token não fornecido');
    });
});
