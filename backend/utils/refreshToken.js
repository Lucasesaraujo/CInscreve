function expirandoEmBreve(token) {
  if (!token) return true;
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const expiry = payload.exp * 1000; // em ms
    const now = Date.now();

    return (expiry - now) < (5 * 60 * 1000); // menos de 5 minutos

  } catch (e) {
    return true;
  }
}

async function getNovoTokenAcesso() {
//   const token = localStorage.getItem('accessToken');
//   const refreshToken = localStorage.getItem('refreshToken');

    // OS TOKENS SERÃO SALVOS NO FRONTEND, E SERÁ RETIRADO NESSA FUNÇÃO, DEPOIS FAZEMOS

  if (!refreshToken) {
    throw new Error('Refresh token ausente. Redirecionar para login.');
  }

  // Verifica se o token está expirando
  if (expirandoEmBreve(token)) {
    try {
      const resposta = await fetch('http://localhost:3000/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken })
      });

      if (!resposta.ok) throw new Error('Falha ao renovar token');

      const data = await resposta.json();
      localStorage.setItem('accessToken', data.token);
      return data.token;

    } catch (err) {
      console.error('Erro ao renovar token:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
  }

  return token;
}

module.exports = { getNovoTokenAcesso };