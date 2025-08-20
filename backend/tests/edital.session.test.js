const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

// Variáveis de teste
let user, accessToken, refreshToken, edital1, edital2, edital3;
const agent = request.agent(app);

// Chaves secretas do JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Função auxiliar para criar usuário e tokens
async function createUserAndToken(emailPrefix, device = 'jest-session-agent') {
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

    // Cria um usuário e seus tokens
    const result = await createUserAndToken('session_user');
    user = result.user;
    accessToken = result.accessToken;
    refreshToken = result.refreshToken;
    
    // Cria editais de teste para favoritar e sugerir
    edital1 = await Edital.create({
        nome: 'Edital 1 para Favoritar',
        organizacao: 'Org 1',
        categoria: 'Música',
        descricao: 'Descrição do edital de teste 1.', // Adicionado para validação
        periodoInscricao: {
            inicio: new Date('2025-05-01T00:00:00Z'),
            fim: new Date('2025-05-31T23:59:59Z'),
        },
        link: 'https://edital1.com',
        sugeridoPor: new mongoose.Types.ObjectId() // Sugerido por outro usuário
    });
    
    edital2 = await Edital.create({
        nome: 'Edital 2 para Favoritar',
        organizacao: 'Org 2',
        categoria: 'Arte',
        descricao: 'Descrição do edital de teste 2.', // Adicionado para validação
        periodoInscricao: {
            inicio: new Date('2025-05-01T00:00:00Z'),
            fim: new Date('2025-05-31T23:59:59Z'),
        },
        link: 'https://edital2.com',
        sugeridoPor: new mongoose.Types.ObjectId() // Sugerido por outro usuário
    });

    // Edital sugerido pelo nosso usuário de teste
    edital3 = await Edital.create({
        nome: 'Edital 3 para Sugeridos',
        organizacao: 'Org 3',
        categoria: 'Outros',
        descricao: 'Descrição do edital de teste 3.', // Adicionado para validação
        periodoInscricao: {
            inicio: new Date('2025-05-01T00:00:00Z'),
            fim: new Date('2025-05-31T23:59:59Z'),
        },
        link: 'https://edital3.com',
        sugeridoPor: user._id
    });

}, 30000);

afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30000);

// =========================================================================
// TESTES DO FLUXO DE SESSÃO DO USUÁRIO
// =========================================================================
describe('User Session Flow', () => {

    it('should allow a user to login, create, favorite, view favorites/suggested, and logout', async () => {
        // Simula o login injetando os cookies para que o agente possa usá-los nas próximas requisições
        await agent.get('/test-login')
            .set('Cookie', [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`]);
        
        // 1. Favoritar um edital
        let resFavorite = await agent.post(`/editais/${edital1._id}/favoritar`);
        expect(resFavorite.status).toBe(200);
        expect(resFavorite.body).toHaveProperty('mensagem', 'Edital favoritado com sucesso!');

        // 2. Criar um novo edital (agora com todos os campos obrigatórios)
        const novoEdital = {
            nome: 'Edital Criado no Teste',
            organizacao: 'Org Teste',
            categoria: 'Tecnologia',
            descricao: 'Descrição do edital de teste.', 
            periodoInscricao: {
                inicio: new Date('2025-05-01T00:00:00Z'),
                fim: new Date('2025-05-31T23:59:59Z'),
            },
            link: 'https://novoedital.com'
        };

        const resCreate = await agent.post('/editais')
            .send(novoEdital);
            
        expect(resCreate.status).toBe(201);
        expect(resCreate.body.edital.sugeridoPor.toString()).toBe(user._id.toString());

        // 3. Ver os editais favoritos
        const resFavorites = await agent.get('/meus-editais/favoritos');
        expect(resFavorites.status).toBe(200);
        expect(resFavorites.body.editais).toHaveLength(1);
        expect(resFavorites.body.editais[0].nome).toBe('Edital 1 para Favoritar');
        
        // 4. Ver os editais sugeridos
        const resSuggested = await agent.get('/meus-editais/sugeridos');
        expect(resSuggested.status).toBe(200);
        expect(resSuggested.body.editais).toHaveLength(2); // edital3 e o recém-criado
        expect(resSuggested.body.editais.map(e => e.nome)).toContain('Edital 3 para Sugeridos');
        expect(resSuggested.body.editais.map(e => e.nome)).toContain('Edital Criado no Teste');

        // 5. Simula o logout
        const resLogout = await agent.post('/auth/logout');
        expect(resLogout.status).toBe(200);
        expect(resLogout.body).toHaveProperty('mensagem', 'Sessão encerrada com sucesso!');

        // 6. Tentar acessar uma rota protegida após o logout
        const resProtected = await agent.get('/meus-editais/favoritos');
        expect(resProtected.status).toBe(401);
    });
    
    it('should handle multiple favorites toggles correctly', async () => {
        const result = await createUserAndToken('session_user_multiple');
        const multipleUser = result.user;
        const multipleAccessToken = result.accessToken;

        // Limpa os favoritos para este teste
        await User.findByIdAndUpdate(multipleUser._id, { $set: { favoritos: [] } });

        // Favorita o edital 1
        await request(app).post(`/editais/${edital1._id}/favoritar`)
            .set('Cookie', [`accessToken=${multipleAccessToken}`]);

        let updatedUser = await User.findById(multipleUser._id);
        expect(updatedUser.favoritos).toHaveLength(1);
        expect(updatedUser.favoritos[0].toString()).toBe(edital1._id.toString());

        // Favorita o edital 2
        await request(app).post(`/editais/${edital2._id}/favoritar`)
            .set('Cookie', [`accessToken=${multipleAccessToken}`]);
        
        updatedUser = await User.findById(multipleUser._id);
        expect(updatedUser.favoritos).toHaveLength(2);

        // Desfavorita o edital 1
        await request(app).post(`/editais/${edital1._id}/favoritar`)
            .set('Cookie', [`accessToken=${multipleAccessToken}`]);

        updatedUser = await User.findById(multipleUser._id);
        expect(updatedUser.favoritos).toHaveLength(1);
        expect(updatedUser.favoritos[0].toString()).toBe(edital2._id.toString());
    });

});
