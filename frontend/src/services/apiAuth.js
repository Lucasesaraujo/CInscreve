// URL base do backend
const URL = "http://localhost:3002";
const BASE_URL = `${URL}/api/auth`;

// Permite sobrescrever a URL via variável de ambiente
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_BASE_URL || BASE_URL;

/**
 * Busca dados do usuário logado.
 * Retorna null se não estiver autenticado ou sessão expirada.
 */
export const getUserData = async () => {
    try {
        const response = await fetch(`${AUTH_BASE_URL}/me`, {
            method: 'GET',
            credentials: 'include', // envia cookies de sessão
        });

        if (!response.ok) {
            console.error('[!] Usuário não autenticado ou sessão expirada. Retornando null para getUserData.');
            return null;
        }

        const data = await response.json();
        return data; // retorna os dados do usuário (objeto user/ngo)
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        return null;
    }
};

/**
 * Faz logout do usuário.
 * Retorna true se sucesso, lança erro se falhar.
 */
export async function logoutUser() {
    try {
        const res = await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include', // envia cookies
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Erro ao fazer logout: ${res.status} ${res.statusText}`);
        }

        return true; // Logout realizado com sucesso
    } catch (err) {
        console.error("Erro em logoutUser:", err);
        throw err;
    }
}

/**
 * Renova o access token usando refresh token armazenado em cookie.
 * Lança erro se falhar.
 */
export const refreshToken = async () => {
    try {
        const res = await fetch(`${BASE_URL}/refresh`, {
            method: 'POST',
            credentials: 'include', // envia cookies
        });

        if (!res.ok) {
            throw new Error('Refresh falhou');
        }

        console.log('[✅] Token renovado com sucesso');
        const data = await res.json();
        return data.accessToken; // retorna novo accessToken
    } catch (err) {
        console.warn('[⚠️] Erro ao renovar token:', err);
        throw err;
    }
};
