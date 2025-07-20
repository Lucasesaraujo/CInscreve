const Token = require('../models/token');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger'); 

const autenticarToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if(!accessToken) return res.status(401).json({ erro: 'Token não fornecido' });

    try {
        const token = await Token.findOne({ accessToken }).populate('userId');

        if(!token) {
            logger.warn('Tentativa de acesso com token não encontrado/inválido:', accessToken); 
            return res.status(403).json({ erro: 'Token inválido, expirado ou revogado' });
        }

        if(token.expiraEm < new Date()) {
            logger.warn('Tentativa de acesso com token expirado:', accessToken); 
            return res.status(403).json({ erro: 'Token expirado' });
        }

        // Verificação extra para garantir que userId foi populado e não é null
        if (!token.userId) {
            logger.error('Token encontrado, mas userId associado é null/não encontrado. Token ID:', token._id);
            return res.status(403).json({ erro: 'Usuário associado ao token não encontrado' });
        }


        req.usuario = {
            id: token.userId._id,
            email: token.userId.email,
            nome: token.userId.nome
        };

        next();

    } catch(error) {
        logger.error('Erro ao autenticar token: ', error.message, error); // Usar logger.error
        res.status(500).json({ erro: 'Erro interno ao validar o token' });
    }
};

module.exports = autenticarToken;