const URL = "http://localhost:3000";
const BASE_URL = `${URL}/api/auth`;

// Opcional: Adicionar a função de logout aqui também para centralizar
export async function logoutUser() {
    try {
        const res = await fetch(`${BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Erro ao fazer logout: ${res.status} ${res.statusText}`);
        }

        return true; // Sucesso no logout
    } catch (err) {
        console.error("Erro em logoutUser:", err);
        throw err;
    }
}

export const refreshToken = async () => {
  try {
    const res = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error('Refresh falhou');
    }

    console.log('[✅] Token renovado com sucesso');
  } catch (err) {
    console.warn('[⚠️] Erro ao renovar token:', err);

    throw err;
  }
};