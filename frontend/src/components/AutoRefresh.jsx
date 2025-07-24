// src/components/AutoRefresh.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { refreshToken } from '../services/apiEditais';

const AutoRefresh = () => {
  const location = useLocation();

  useEffect(() => {
    // Evita tentar renovar se já estiver na página de login
    if (location.pathname === '/login') return;

    const tentarRenovar = async () => {
      try {
        await refreshToken();
      } catch (err) {
        // O refreshToken já trata o redirecionamento, não precisa fazer nada aqui
      }
    };

    tentarRenovar();

    const interval = setInterval(() => {
      tentarRenovar();
    }, 1000 * 60 * 59); // a cada 59 minutos

    return () => clearInterval(interval);
  }, [location.pathname]);

  return null;
};

export default AutoRefresh;
