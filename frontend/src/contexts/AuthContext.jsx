// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserData } from '../services/apiUser'; // Verifica se há sessão
import { logoutUser } from '../services/apiAuth';

// 1. Criação do Contexto
const AuthContext = createContext(null);

// 2. Provedor de contexto
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Indica se estamos carregando o usuário

  // 2.1 Carrega usuário ao iniciar a aplicação
  useEffect(() => {
    async function carregarUsuario() {
      try {
        const data = await getUserData();
        if (data?.usuario) setUsuario(data.usuario);
      } catch (error) {
        console.error('Sessão não encontrada ou inválida:', error);
        setUsuario(null);
      } finally {
        setIsLoading(false);
      }
    }
    carregarUsuario();
  }, []);

  // 2.2 Função de login
  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
  };

  // 2.3 Função de logout
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Erro no logout:', err);
    } finally {
      setUsuario(null);
    }
  };

  // 2.4 Valor compartilhado pelo contexto
  const value = {
    usuario,
    login,
    logout,
    isAutenticado: !!usuario, // true se usuário existe
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Hook customizado para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
