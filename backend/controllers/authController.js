// backend/controllers/authController.js

const { loginService, getUserService, logoutService, renewTokenService } = require('../services/authServices'); // Importe a nova função
const logger = require('../config/logger');
const { accessTokenCookieOptions, refreshTokenOptions, clearCookieOptions } = require('../utils/cookieConfig'); // Importe as opções de cookie

// POST - Controller para logar usuário e retorna seus dados, token de acesso e de refresh
async function loginUsuario(req, res, next) {
    const { email, password } = req.body;

    try {
        const { usuario, accessToken, refreshToken } = await loginService(email, password, req.headers['user-agent'], req.ip);

        // Use as opções de cookie centralizadas
        res.cookie('accessToken', accessToken, accessTokenCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshTokenOptions);

        res.json({ usuario: usuario, accessToken });

    } catch (error) {
        // Lógica de tratamento de erro para a resposta HTTP
        let errorMessage = 'Erro desconhecido na autenticação.';
        let status = 500;

        if (error.response) { // Erro vindo da API externa (Axios)
            errorMessage = error.response.data?.message || error.response.data?.erro || 'Credenciais inválidas ou erro na API externa.';
            status = error.response.status || 401;
        } else if (error.request) { // Requisição feita, mas sem resposta recebida
            errorMessage = 'Nenhuma resposta da API de autenticação. Verifique a conexão.';
            status = 503; // Service Unavailable
        } else if (error.message) { // Outros erros internos ou customizados lançados pelo serviço
            errorMessage = error.message;
            status = error.status || 401; // Usa o status do erro customizado do serviço, senão 401
        }

        if (error.status) status = error.status;

        res.status(status).json({ erro: errorMessage, detalhes: error.response?.data || null });
    }
}

// GET - Controller para confirmar que o usuário está logado
async function getUsuarioLogado(req, res, next) {
    try {
        const usuarioData = await getUserService(req.usuario);
        res.json({ usuario: usuarioData });
    } catch (error) {
        next(error);
    }
}

// POST - Controller para deslogar usuário
async function logoutUsuario(req, res, next) {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(400).json({ erro: 'Token não fornecido' });
    }

    try {
        await logoutService(accessToken);

        // Limpa os cookies do navegador usando as opções centralizadas
        res.clearCookie('accessToken', clearCookieOptions);
        res.clearCookie('refreshToken', clearCookieOptions);

        res.json({ mensagem: 'Logout realizado com sucesso' });

    } catch (error) {
        next(error);
    }
}

// NOVA FUNÇÃO: Renovar Access Token
async function renovarAccessToken(req, res, next) {
    const refreshToken = req.cookies.refreshToken;

    try {
        const newAccessToken = await renewTokenService(refreshToken);

        // Define o novo access token no cookie
        res.cookie('accessToken', newAccessToken, accessTokenCookieOptions);

        return res.json({ mensagem: 'Novo access token gerado' });

    } catch (error) {
        // Lógica de tratamento de erro para a resposta HTTP
        let errorMessage = 'Erro interno no servidor ao renovar token.';
        let status = 500;

        if (error.message) {
            errorMessage = error.message;
            status = error.status || 403; // Usa o status do erro customizado do serviço, senão 403
        }

        if (error.status) status = error.status;

        return res.status(status).json({ erro: errorMessage });
    }
}

module.exports = {
    loginUsuario,
    getUsuarioLogado,
    logoutUsuario,
    renovarAccessToken 
};