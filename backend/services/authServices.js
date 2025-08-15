// backend/services/authServices.js

const axios = require('axios');
const User = require('../models/user');
const Token = require('../models/token');
const { gerarTokens } = require('../utils/gerarToken');
const logger = require('../config/logger');
const jwt = require('jsonwebtoken'); // Certifique-se de que jwt está importado aqui

async function loginService(email, password, userAgent, ip) {
    try {
        const resposta = await axios.post(
            process.env.EXTERNAL_AUTH_API_URL,
            { email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        const dadosUsuarioExterno = resposta.data;

        const updateFields = { email: dadosUsuarioExterno.user.email };

        const usuarioLocal = await User.findOneAndUpdate(
            { email: dadosUsuarioExterno.user.email },
            { 
                $set: {
                    name: dadosUsuarioExterno.user.name,
                    email: dadosUsuarioExterno.user.email,
                    // qualquer outro campo que você queira salvar diretamente no usuário
                    ngo: {
                        id: dadosUsuarioExterno.ngo.id,
                        name: dadosUsuarioExterno.ngo.name,
                        description: dadosUsuarioExterno.ngo.description,
                        pix: dadosUsuarioExterno.ngo.pix,
                        is_formalized: dadosUsuarioExterno.ngo.is_formalized,
                        start_year: dadosUsuarioExterno.ngo.start_year,
                        contact_phone: dadosUsuarioExterno.ngo.contact_phone,
                        instagram_link: dadosUsuarioExterno.ngo.instagram_link,
                        x_link: dadosUsuarioExterno.ngo.x_link,
                        facebook_link: dadosUsuarioExterno.ngo.facebook_link,
                        pix_qr_code_link: dadosUsuarioExterno.ngo.pix_qr_code_link,
                        site: dadosUsuarioExterno.ngo.site,
                        gallery_images_url: dadosUsuarioExterno.ngo.gallery_images_url,
                        cover_photo_url: dadosUsuarioExterno.ngo.cover_photo_url,
                        logo_photo_url: dadosUsuarioExterno.ngo.logo_photo_url,
                        skills: dadosUsuarioExterno.ngo.skills,
                        causes: dadosUsuarioExterno.ngo.causes,
                        sustainable_development_goals: dadosUsuarioExterno.ngo.sustainable_development_goals
                    }
                }
            },
            { upsert: true, new: true }
        );

        const { accessToken, refreshToken } = gerarTokens({
            id: usuarioLocal._id.toString(),
            email: usuarioLocal.email
        });

        await Token.deleteMany({
            userId: usuarioLocal._id,
            dispositivo: userAgent,
            ip: ip
        });

        const expiracao = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await Token.create({
            userId: usuarioLocal._id,
            accessToken: accessToken,
            refreshToken: refreshToken,
            dispositivo: userAgent,
            ip: ip,
            expiraEm: expiracao
        });

        logger.info(`Login bem-sucedido para o email: ${email}`);
        return { usuario: dadosUsuarioExterno, accessToken, refreshToken };

    } catch (error) {
        logger.error(`Erro no serviço de login para ${email}:`, error.response?.data || error.message, error);
        throw error;
    }
}

async function getUserService(userPayload) {
  try {
    logger.info(`Buscando dados completos do usuário logado: ID ${userPayload.id}`);

    // Busca o usuário pelo email (ou id se você preferir)
    const usuario = await User.findOne({ email: userPayload.email });

    if (!usuario) {
      throw new Error('Usuário não encontrado no banco de dados');
    }

    // Retorna todos os dados do usuário
    return usuario;
  } catch (err) {
    logger.error(`Erro ao buscar usuário: ${err.message}`);
    throw err;
  }
}

module.exports = getUserService;

async function logoutService(accessToken) {
    try {
        const resultado = await Token.deleteOne({ accessToken: accessToken });
        if (resultado.deletedCount === 0) {
            logger.warn('Tentativa de logout de token não encontrado ou já removido.');
            const error = new Error('Token não encontrado ou já removido');
            error.status = 404;
            throw error;
        }
        logger.info('Logout realizado com sucesso.');
        return true;
    } catch (error) {
        logger.error('Erro no serviço de logout:', error.message, error);
        throw error;
    }
}

// NOVA FUNÇÃO: Renovar Access Token
async function renewTokenService(refreshToken) {
    if (!refreshToken) {
        const error = new Error('Refresh Token ausente');
        error.status = 401;
        throw error;
    }

    const tokenDB = await Token.findOne({ refreshToken });
    if (!tokenDB) {
        const error = new Error('Refresh Token inválido ou expirado no banco de dados');
        error.status = 403;
        throw error;
    }

    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
            if (err) {
                logger.warn('Refresh Token inválido ou expirado ao verificar JWT:', err.message);
                const error = new Error('Refresh Token inválido');
                error.status = 403;
                return reject(error);
            }

            // Opcional: Verificar se o usuário ainda existe no DB
            const usuario = await User.findById(decoded.id);
            if (!usuario) {
                logger.warn(`Usuário com ID ${decoded.id} não encontrado para renovação de token.`);
                const error = new Error('Usuário associado ao Refresh Token não encontrado');
                error.status = 403;
                return reject(error);
            }

            const payload = {
                id: decoded.id,
                email: decoded.email
            };

            const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            tokenDB.accessToken = newAccessToken;
            await tokenDB.save();

            logger.info(`Access Token renovado para o usuário ID: ${decoded.id}`);
            resolve(newAccessToken);
        });
    });
}


module.exports = {
    loginService,
    getUserService,
    logoutService,
    renewTokenService
};