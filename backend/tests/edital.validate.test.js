const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis para armazenar tokens e usuários de teste
let accessTokenUser1, accessTokenUser2, accessTokenUser3, accessTokenSugeridor;
let user1, user2, user3, sugeridorUser;
let testEdital; // O edital que será validado

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e token
async function createUserAndToken(emailPrefix, device = 'jest-agent') {
    // CORREÇÃO: Adicionando os campos obrigatórios 'name' e 'ngo'
    const user = await User.create({ 
        email: `${emailPrefix}@example.com`,
        name: `Name ${emailPrefix}`,
        // CORREÇÃO: Passando um objeto para 'ngo' em vez de uma string
        ngo: {
            name: `NGO ${emailPrefix}`
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

    return { user, accessToken };
}

// --- Configuração Global dos Testes ---
beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    // Limpa todas as coleções para um ambiente limpo antes de todos os testes
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});

    // Crie múltiplos usuários e seus tokens
    const result1 = await createUserAndToken('validator1');
    user1 = result1.user;
    accessTokenUser1 = result1.accessToken;

    const result2 = await createUserAndToken('validator2');
    user2 = result2.user;
    accessTokenUser2 = result2.accessToken;

    const result3 = await createUserAndToken('validator3');
    user3 = result3.user;
    accessTokenUser3 = result3.accessToken;

    const resultSugeridor = await createUserAndToken('sugeridor');
    sugeridorUser = resultSugeridor.user;
    accessTokenSugeridor = resultSugeridor.accessToken;

}, 30000); // Aumenta o timeout para a conexão e criação de usuários/tokens

beforeEach(async () => {
    // Limpa apenas os editais antes de CADA TESTE para garantir um estado fresco
    await Edital.deleteMany({});

    // Cria um edital de teste (inicialmente não validado, sugerido pelo 'sugeridorUser')
    testEdital = await Edital.create({
        nome: 'Edital para Validacao',
        organizacao: 'Org Validacao',
        periodoInscricao: {
            inicio: new Date('2025-04-01T00:00:00Z'),
            fim: new Date('2025-04-30T23:59:59Z')
        },
        descricao: 'Edital de teste para validação.',
        link: 'https://validar.com',
        sugeridoPor: sugeridorUser._id, // Este usuário sugeriu o edital
        validado: false, // Inicialmente não validado
        validacoes: [], // Nenhuma validação ainda
        // CORREÇÃO: Adicionando o campo obrigatório 'categoria'
        categoria: 'Tecnologia'
    });
});

afterAll(async () => {
    // Limpa todas as coleções após TODOS os testes serem executados
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30000);

// =========================================================================
// TESTES DA ROTA POST /editais/:id/validar
// =========================================================================
describe('POST /editais/:id/validar', () => {
    it('should allow a user to validate an edital for the first time', async () => {
        const response = await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser1}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('mensagem', 'Edital validado com sucesso!');
        expect(response.body.edital.validacoes).toHaveLength(1); // 1 validação
        expect(response.body.edital.validacoes[0].toString()).toBe(user1._id.toString());
        expect(response.body.edital.validado).toBe(false); // Ainda não atingiu 3 validações

        // Verifique no DB
        const updatedEdital = await Edital.findById(testEdital._id);
        expect(updatedEdital.validacoes).toHaveLength(1);
        expect(updatedEdital.validado).toBe(false);
    });

    it('should allow multiple users to validate an edital and set it to valid after 3 validations', async () => {
        // Validação pelo User1
        await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser1}`]);

        // Validação pelo User2
        await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser2}`]);

        // Validação pelo User3 - Esta deve validar o edital
        const response = await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser3}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('mensagem', 'Edital validado com sucesso!');
        expect(response.body.edital.validacoes).toHaveLength(3); // Deve ter 3 validações
        expect(response.body.edital.validado).toBe(true); // AGORA DEVE SER TRUE

        // Verifique no DB
        const updatedEdital = await Edital.findById(testEdital._id);
        expect(updatedEdital.validacoes).toHaveLength(3);
        expect(updatedEdital.validado).toBe(true);
    });

    it('should return 400 if user tries to validate an edital they already validated', async () => {
        // Primeiro, User1 valida o edital
        await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser1}`]);

        // Tente validar novamente com o mesmo User1
        const response = await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser1}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'Você já validou esse edital');

        // Verifique se o número de validações não aumentou no DB
        const currentEdital = await Edital.findById(testEdital._id);
        expect(currentEdital.validacoes).toHaveLength(1);
    });

    it('should return 400 if the suggester tries to validate their own edital', async () => {
        const response = await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Cookie', [`accessToken=${accessTokenSugeridor}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(400); // Esperamos 400 no status da resposta
        expect(response.body).toHaveProperty('erro', 'Você não pode validar o edital que sugeriu');

        const currentEdital = await Edital.findById(testEdital._id);
        expect(currentEdital.validacoes).toHaveLength(0);
    });

    it('should return 404 if edital to validate is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // ID que não existe

        const response = await request(app)
            .post(`/editais/${nonExistentId}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser1}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('erro', 'Edital não encontrado'); // De acordo com editalServices.js
    });

    it('should return 400 if ID is invalid format', async () => {
        const invalidId = 'invalid_edital_id'; // ID com formato inválido

        const response = await request(app)
            .post(`/editais/${invalidId}/validar`)
            .set('Cookie', [`accessToken=${accessTokenUser1}`])
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'ID inválido');
    });

    it('should return 401 if not authenticated', async () => {
        const response = await request(app)
            .post(`/editais/${testEdital._id}/validar`)
            .set('Accept', 'application/json');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('erro', 'Token não fornecido');
    });
});
