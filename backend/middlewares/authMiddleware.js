const Token = require('../models/token');
const jwt = require('jsonwebtoken');

// Controller para verificar o token do usuário (Segurança)
const autenticarToken = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if(!accessToken) return res.status(401).json({ erro: 'Token não fornecido' });

    try {
        const token = await Token.findOne({ accessToken }).populate('userId');

        if(!token) return res.status(403).json({ erro: 'Token inválido, expirado ou revogado' });

        if(token.expiraEm < new Date()) return res.status(403).json({ erro: 'Token expirado' });

        req.usuario = {
            id: token.userId._id,
            email: token.userId.email,
            nome: token.userId.nome
        };

        next();

    } catch(error) {
        console.error('Erro ao autenticar token: ', error);
        res.status(500).json({ erro: 'Erro interno ao validar o token' });
    }
};

module.exports = autenticarToken;