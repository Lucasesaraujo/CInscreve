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
let editalPublico1, editalPublico2, editalSugeridoPeloUser, editalFavoritadoPeloUser;
let agent = request.agent(app);

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e tokens
async function createUserAndToken(emailPrefix, device = 'jest-get-agent') {
    const user = await User.create({
        email: `${emailPrefix}@example.com`,
        name: `User ${emailPrefix}`,
        ngo: {
            name: `NGO ${emailPrefix}`,
            id: Math.floor(Math.random() * 100000)
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

    // Cria um usuário e seus tokens
    const result = await createUserAndToken('get_test_user');
    user = result.user;
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;

    // Simular login para manter a sessão
    await agent.get('/test-login').set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);

    // Cria editais de teste para diferentes cenários
    editalPublico1 = await Edital.create({
        nome: 'Edital Público 1',
        organizacao: 'Org Pública',
        categoria: 'Cultura',
        descricao: 'Descrição do edital público 1.',
        periodoInscricao: {
            inicio: new Date('2025-01-01T00:00:00Z'),
            fim: new Date('2025-02-01T23:59:59Z'),
        },
        link: 'https://link-publico1.com',
        sugeridoPor: new mongoose.Types.ObjectId() // Sugerido por outro usuário
    });

    editalPublico2 = await Edital.create({
        nome: 'Edital Público 2',
        organizacao: 'Org Pública',
        categoria: 'Música',
        descricao: 'Descrição do edital público 2.',
        periodoInscricao: {
            inicio: new Date('2025-03-01T00:00:00Z'),
            fim: new Date('2025-04-01T23:59:59Z'),
        },
        link: 'https://link-publico2.com',
        sugeridoPor: new mongoose.Types.ObjectId() // Sugerido por outro usuário
    });

    editalSugeridoPeloUser = await Edital.create({
        nome: 'Edital Sugerido',
        organizacao: 'Org Teste',
        categoria: 'Tecnologia',
        descricao: 'Descrição do edital sugerido pelo usuário de teste.',
        periodoInscricao: {
            inicio: new Date('2025-05-01T00:00:00Z'),
            fim: new Date('2025-06-01T23:59:59Z'),
        },
        link: 'https://link-sugerido.com',
        sugeridoPor: user._id
    });

    // Atualiza o usuário para ter um edital favoritado
    editalFavoritadoPeloUser = await Edital.create({
        nome: 'Edital Favoritado',
        organizacao: 'Org Favoritos',
        categoria: 'Arte',
        descricao: 'Descrição do edital favoritado pelo usuário de teste.',
        periodoInscricao: {
            inicio: new Date('2025-07-01T00:00:00Z'),
            fim: new Date('2025-08-01T23:59:59Z'),
        },
        link: 'https://link-favoritado.com',
        sugeridoPor: new mongoose.Types.ObjectId()
    });

    await User.findByIdAndUpdate(user._id, { $push: { favoritos: editalFavoritadoPeloUser._id } });
}, 30000);

afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30000);

// =========================================================================
// TESTES GET /EDITAIS
// =========================================================================
describe('GET /editais', () => {

    it('should return all public editais', async () => {
        const response = await request(app).get('/editais');

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThanOrEqual(2); // Pode haver mais de 2 editais públicos
        expect(response.body.some(e => e.nome === editalPublico1.nome)).toBe(true);
        expect(response.body.some(e => e.nome === editalPublico2.nome)).toBe(true);
    });

    it('should return a single edital by ID', async () => {
        const response = await request(app).get(`/editais/${editalPublico1._id}`);

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe(editalPublico1.nome);
        expect(response.body.link).toBe(editalPublico1.link);
    });

    it('should return 404 for a non-existent edital ID', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/editais/${nonExistentId}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('erro', 'Edital não encontrado');
    });

    it('should return 400 for an invalid edital ID format', async () => {
        const response = await request(app).get('/editais/invalid-id');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'ID do edital inválido');
    });
});

// =========================================================================
// TESTES GET EDITais do USUARIO
// =========================================================================
describe('GET Editais do Usuário', () => {

    it('should return only favorited editais for the authenticated user', async () => {
        const response = await agent.get('/meus-editais/favoritos');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('editais');
        expect(response.body.editais.length).toBe(1);
        expect(response.body.editais[0].nome).toBe(editalFavoritadoPeloUser.nome);
    });
    
    it('should return only suggested editais for the authenticated user', async () => {
        const response = await agent.get('/meus-editais/sugeridos');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('editais');
        expect(response.body.editais.length).toBe(1);
        expect(response.body.editais[0].nome).toBe(editalSugeridoPeloUser.nome);
    });

    it('should return 401 for /meus-editais/favoritos if user is not authenticated', async () => {
        const nonAuthResponse = await request(app).get('/meus-editais/favoritos');
        
        expect(nonAuthResponse.status).toBe(401);
        expect(nonAuthResponse.body).toHaveProperty('erro', 'Autenticação necessária.');
    });

    it('should return 401 for /meus-editais/sugeridos if user is not authenticated', async () => {
        const nonAuthResponse = await request(app).get('/meus-editais/sugeridos');
        
        expect(nonAuthResponse.status).toBe(401);
        expect(nonAuthResponse.body).toHaveProperty('erro', 'Autenticação necessária.');
    });
});
