const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/user');
const Token = require('../models/token');
const Edital = require('../models/edital');
require('dotenv').config();

let accessToken;
let testUser;
let testEdital;

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);

    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});

    testUser = await User.create({
        email: 'put_test_user@example.com',
    });

    const payload = {
        id: testUser._id.toString(),
        email: testUser.email
    };

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
        throw new Error('JWT_SECRET ou JWT_REFRESH_SECRET não estão definidos. Verifique seu arquivo .env');
    }

    accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    await Token.create({
        userId: testUser._id,
        accessToken: accessToken,
        refreshToken: refreshToken,
        dispositivo: 'jest-put-test-agent',
        ip: '127.0.0.1',
        expiraEm: new Date(Date.now() + 1000 * 60 * 60)
    });

}, 30020);

beforeEach(async () => {
    await Edital.deleteMany({});

    testEdital = await Edital.create({
        nome: 'Edital para Atualizacao',
        organizacao: 'Org de Atualizacao',
        periodoInscricao: {
            inicio: new Date('2025-02-01T00:00:00Z'),
            fim: new Date('2025-02-28T23:59:59Z')
        },
        descricao: 'Descrição original do edital para teste de atualização.',
        link: 'https://original-put.com',
        sugeridoPor: testUser._id,
        validado: false
    });
});

afterAll(async () => {
    await User.deleteMany({});
    await Token.deleteMany({});
    await Edital.deleteMany({});
    await mongoose.disconnect();
}, 30020);

describe('PUT /editais/:id', () => {
    it('should update an edital successfully when authenticated', async () => {
        const updatedData = {
            nome: 'Edital Atualizado com Sucesso',
            descricao: 'Nova descrição do edital.',
            link: 'https://updated-put.com'
        };

        const response = await request(app)
            .put(`/editais/${testEdital._id}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(updatedData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome', updatedData.nome);
        expect(response.body).toHaveProperty('descricao', updatedData.descricao);
        expect(response.body).toHaveProperty('link', updatedData.link);
        expect(response.body._id.toString()).toBe(testEdital._id.toString());

        const foundEdital = await Edital.findById(testEdital._id);
        expect(foundEdital.nome).toBe(updatedData.nome);
        expect(foundEdital.descricao).toBe(updatedData.descricao);
    });

    it('should return 404 if edital to update is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const updatedData = { nome: 'Nome Falso' };

        const response = await request(app)
            .put(`/editais/${nonExistentId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(updatedData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('erro', 'Edital não encontrado!');
    });

    it('should return 400 if ID is invalid format', async () => {
        const invalidId = 'abc123invalid';

        const response = await request(app)
            .put(`/editais/${invalidId}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send({ nome: 'Teste' })
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro', 'ID inválido');
    });

    it('should return 401 if not authenticated', async () => {
        const updatedData = { nome: 'Atualizar sem auth' };

        const response = await request(app)
            .put(`/editais/${testEdital._id}`)
            .send(updatedData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('erro', 'Token não fornecido');
    });

    it('should return 400 if validation fails during update (e.g., nome very short)', async () => {
        const invalidData = {
            nome: 'ab'
        };

        const response = await request(app)
            .put(`/editais/${testEdital._id}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(invalidData)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro');
        expect(response.body.erro).toContain('nome: O nome deve ter pelo menos 3 caracteres');
    });

    it('should return 400 if end date is before start date during update', async () => {
        const invalidDateUpdate = {
            periodoInscricao: {
                inicio: '2025-08-31T00:00:00Z',
                fim: '2025-08-01T23:59:59Z'
            }
        };

        const response = await request(app)
            .put(`/editais/${testEdital._id}`)
            .set('Cookie', [`accessToken=${accessToken}`])
            .send(invalidDateUpdate)
            .set('Accept', 'application/json');

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('erro');
        expect(response.body.erro).toContain('A data de fim deve ser posterior à data de início');
    });
});