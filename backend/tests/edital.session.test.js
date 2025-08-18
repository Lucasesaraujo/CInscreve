// backend/tests/user.session.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app'); // Sua aplicação Express
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis para armazenar o token e dados do usuário/edital durante a sessão
let accessToken;
let testUser;
let createdEditalId; // ID do edital que criaremos no teste

// Chaves secretas do JWT (lidas do .env)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e token (reutilizada de testes anteriores)
async function createUserAndToken(emailPrefix, device = 'jest-session-agent') {
    const user = await User.create({ email: `${emailPrefix}@example.com` });

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
        expiraEm: new Date(Date.now() + 1000 * 60 * 60) // Expira em 1 hora
    });

    return { user, accessToken };
}

// --- Configuração Global dos Testes para a Sessão ---
beforeAll(async () => {
    // Conecta ao banco de dados de teste
    await mongoose.connect(process.env.MONGO_URI_TEST);

    // Garante que as chaves JWT estão definidas
    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET ou JWT_REFRESH_SECRET não estão definidos. Verifique seu arquivo .env');
    }
}, 30020); // Aumenta o timeout para a conexão inicial do DB

// Limpa e configura o ambiente ANTES DE CADA TESTE (para isolar os testes de sessão)
beforeEach(async () => {
    // Limpa todas as coleções relevantes
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});

    // Cria um novo usuário e token para cada sessão de teste
    const userResult = await createUserAndToken('session_user_' + Date.now()); // Email único
    testUser = userResult.user;
    accessToken = userResult.accessToken;
});

// Nenhuma ação específica no afterEach (beforeEach já limpa)
afterEach(async () => {
    // Limpeza de variáveis de controle para o próximo teste
    createdEditalId = null;
});

// Desconecta do banco de dados UMA VEZ no final de TODOS os testes desta suíte
afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30020);

// =========================================================================
// TESTE DE SESSÃO DO USUÁRIO
// Simula um fluxo de login, criação, interação e logout
// =========================================================================
describe('User Session Flow', () => {

    it('should allow a user to login, create, favorite, view favorites/suggested, and logout', async () => {
        // --- 1. Criar um Edital (POST /editais) ---
        // O usuário já está "logado" via beforeEach
        const newEditalData = {
            nome: 'Edital da Sessão de Teste',
            organizacao: 'Org da Sessão',
            periodoInscricao: {
                inicio: '2025-07-01T00:00:00Z',
                fim: '2025-07-31T23:59:59Z'
            },
            descricao: 'Este é um edital criado dentro de um fluxo de sessão.',
            link: 'https://sessao.com/edital'
        };

        const createEditalResponse = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(newEditalData)
            .set('Accept', 'application/json');

        expect(createEditalResponse.status).toBe(201);
        expect(createEditalResponse.body).toHaveProperty('_id');
        expect(createEditalResponse.body.nome).toBe(newEditalData.nome);
        expect(createEditalResponse.body.sugeridoPor.toString()).toBe(testUser._id.toString());
        createdEditalId = createEditalResponse.body._id;


        // --- 2. Favoritar o Edital Criado (PATCH /user/favoritar/:id) ---
        const favoriteEditalResponse = await request(app)
            .patch(`/user/favoritar/${createdEditalId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .set('Accept', 'application/json');

        expect(favoriteEditalResponse.status).toBe(200);
        expect(favoriteEditalResponse.body).toHaveProperty('mensagem', 'Edital adicionado aos favoritos');
        expect(favoriteEditalResponse.body.favoritos).toHaveLength(1);
        expect(favoriteEditalResponse.body.favoritos[0]._id.toString()).toBe(createdEditalId.toString());


        // --- 3. Verificar Editais Favoritados (GET /user/favoritos) ---
        const getFavoritesResponse = await request(app)
            .get('/user/favoritos')
            .set('Cookie', [`accessToken=${accessToken}`])
            .set('Accept', 'application/json');

        expect(getFavoritesResponse.status).toBe(200);
        expect(getFavoritesResponse.body).toHaveProperty('favoritos');
        expect(getFavoritesResponse.body.favoritos).toHaveLength(1);
        expect(getFavoritesResponse.body.favoritos[0]._id.toString()).toBe(createdEditalId.toString());


        // --- 4. Verificar Editais Sugeridos (GET /user/sugeridos) ---
        // (Assumindo que o edital criado foi marcado como sugerido por este usuário)
        const getSuggestedResponse = await request(app)
            .get('/user/sugeridos')
            .set('Cookie', [`accessToken=${accessToken}`])
            .set('Accept', 'application/json');

        expect(getSuggestedResponse.status).toBe(200);
        expect(getSuggestedResponse.body).toHaveProperty('sugeridos');
        expect(getSuggestedResponse.body.sugeridos).toHaveLength(1);
        expect(getSuggestedResponse.body.sugeridos[0]._id.toString()).toBe(createdEditalId.toString());


        // --- 5. Logout do Usuário (POST /api/auth/logout) ---
        const logoutResponse = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', [`accessToken=${accessToken}`]) // Envie o token para o logout
            .set('Accept', 'application/json');

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body).toHaveProperty('mensagem', 'Logout realizado com sucesso');

        // Verificar se o token foi realmente removido do banco de dados
        const tokenInDb = await Token.findOne({ accessToken: accessToken });
        expect(tokenInDb).toBeNull();

        // --- 6. Tentar acessar uma rota protegida após o logout (deve falhar) ---
        const tryAccessProtectedResponse = await request(app)
            .get('/user/favoritos') // Tenta acessar favoritos novamente
            .set('Accept', 'application/json'); // Sem cookies

        expect(tryAccessProtectedResponse.status).toBe(401); // Espera 401 (Token não fornecido)
        expect(tryAccessProtectedResponse.body).toHaveProperty('erro', 'Token não fornecido');
    });

    it('should handle multiple favorites toggles correctly', async () => {
        const newEditalData = {
            nome: 'Edital para Toggle Múltiplo',
            organizacao: 'Org de Toggle',
            periodoInscricao: { inicio: '2025-01-01T00:00:00Z', fim: '2025-01-31T23:59:59Z' },
            descricao: 'Teste de toggle múltiplo.',
            link: 'https://toggle.com'
        };

        const createEditalResponse = await request(app)
            .post('/editais')
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(newEditalData)
            .set('Accept', 'application/json');
        const editalIdToToggle = createEditalResponse.body._id;

        // 1. Favoritar
        let response = await request(app)
            .patch(`/user/favoritar/${editalIdToToggle}`)
            .set('Cookie', [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
        expect(response.body.favoritos).toHaveLength(1);

        // 2. Desfavoritar
        response = await request(app)
            .patch(`/user/favoritar/${editalIdToToggle}`)
            .set('Cookie', [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
        expect(response.body.favoritos).toHaveLength(0); // Lista deve estar vazia

        // 3. Favoritar novamente
        response = await request(app)
            .patch(`/user/favoritar/${editalIdToToggle}`)
            .set('Cookie', [`accessToken=${accessToken}`]);
        expect(response.status).toBe(200);
        expect(response.body.favoritos).toHaveLength(1);
    });
});