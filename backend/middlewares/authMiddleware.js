// backend/middlewares/authMiddleware.js

const Token = require('../models/token');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const autenticarToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        logger.warn('Tentativa de acesso sem Access Token fornecido.');
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    try {
        const token = await Token.findOne({ accessToken }).populate('userId'); // Popula o userId

        if (!token) {
            logger.warn('Tentativa de acesso com Access Token não encontrado no DB ou revogado.');
            return res.status(403).json({ erro: 'Token inválido, expirado ou revogado' });
        }

        if (token.expiraEm < new Date()) {
            logger.warn('Tentativa de acesso com Access Token expirado.');
            return res.status(403).json({ erro: 'Token expirado' });
        }

        // Adição de segurança: Verifica se o userId foi populado corretamente e não é null
        if (!token.userId) {
            logger.error('Token encontrado, mas o usuário associado (userId) é nulo ou não existe no DB. Token ID:', token._id);
            // Poderíamos lançar um erro aqui para ser pego pelo catch abaixo,
            // mas retornar diretamente com 403 já resolve.
            return res.status(403).json({ erro: 'Usuário associado ao token não encontrado ou inválido' });
        }

        req.usuario = {
            id: token.userId._id.toString(), // <--- Recomendado: .toString() para garantir que seja string
            email: token.userId.email,
            nome: token.userId.nome || token.userId.name // <--- Opcional: Se o campo for 'name' no modelo User
        };

        next();

    } catch (error) {
        // Isso captura erros durante a verificação do JWT (ex: token corrompido, assinatura inválida)
        // ou outros erros inesperados no processo de autenticação.
        logger.error('Erro ao autenticar token: ', error.message, error);

        // Se o erro tem um status definido (de algum throw anterior), usa-o.
        // Caso contrário, um JWT inválido/corrompido geralmente resulta em 403 (Forbidden).
        const statusCode = error.status || (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' ? 403 : 500);

        return res.status(statusCode).json({ erro: 'Falha na autenticação do token.' });
    }
};

module.exports = autenticarToken;