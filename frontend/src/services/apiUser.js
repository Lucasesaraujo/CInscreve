const URL = "http://localhost:3000";
const BASE_URL = `${URL}/api/auth`;

// Função para buscar os dados do usuário logado
export async function getUserData() {
    try {
        const res = await fetch(`${BASE_URL}/me`, {
            method: 'GET',
            credentials: 'include', // Para enviar os cookies de autenticação
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            // Se o status for 401 (Não Autorizado) ou 403 (Proibido),
            // significa que o usuário não está logado ou o token é inválido/expirado.
            // Não precisamos lançar um erro aqui, apenas retornar null.
            // O componente chamador pode então redirecionar para o login.
            if (res.status === 401 || res.status === 403) {
                console.warn("Usuário não autenticado ou sessão expirada. Retornando null para getUserData.");
                return null;
            }
            throw new Error(`Erro ao buscar dados do usuário: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data; // Seu backend retorna { usuario: { id, email, nome } }
    } catch (err) {
        console.error("Erro em getUserData:", err);
        // Em caso de erro de rede ou outro, retorne null
        return null;
    }
}

export async function getUserFavoritos() {
    try {
        const res = await fetch(`${URL}/user/favoritos`, {
            method: 'GET',
            credentials: 'include', // Para enviar os cookies de autenticação
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            // Se o status for 401 (Não Autorizado) ou 403 (Proibido),
            // significa que o usuário não está logado ou o token é inválido/expirado.
            // Não precisamos lançar um erro aqui, apenas retornar null.
            // O componente chamador pode então redirecionar para o login.
            if (res.status === 401 || res.status === 403) {
                console.warn("Usuário não autenticado ou sessão expirada. Retornando null para getUserData.");
                return null;
            }
            throw new Error(`Erro ao buscar dados do usuário: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        return data; // Seu backend retorna { usuario: { id, email, nome } }
    } catch (err) {
        console.error("Erro em getUserData:", err);
        // Em caso de erro de rede ou outro, retorne null
        return null;
    }
}