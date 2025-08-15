import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { refreshToken } from '../services/apiAuth';

const AutoRefresh = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') return;

    const tentarRenovar = async () => {
      try {
        await refreshToken();
      } catch (err) {

      }
    };

    tentarRenovar();

    const interval = setInterval(() => {
      tentarRenovar();
    }, 1000 * 60 * 59);

    return () => clearInterval(interval);
 
  }, []); 

  return null;
};

export default AutoRefresh;
