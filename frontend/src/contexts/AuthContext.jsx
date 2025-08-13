// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserData } from '../services/apiUser'; // Usaremos para verificar o login inicial
import { logoutUser } from '../services/apiAuth';

// 1. Cria o Contexto
const AuthContext = createContext(null);

// 2. Cria o Componente Provedor
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Para saber se ainda estamos verificando a autenticação

    // Roda uma vez quando o app carrega para verificar se já existe uma sessão (cookie)
    useEffect(() => {
        async function carregarUsuario() {
            try {
                const data = await getUserData();
                if (data?.usuario) {
                    setUsuario(data.usuario);
                }
            } catch (error) {
                console.error("Sessão não encontrada ou inválida.", error);
                setUsuario(null);
            } finally {
                setIsLoading(false);
            }
        }
        carregarUsuario();
    }, []);

    // Função para fazer login, atualizando o estado global
    const login = (dadosUsuario) => {
        setUsuario(dadosUsuario);
    };

    // Função para fazer logout
    const logout = () => {
        logoutUser();
        setUsuario(null);
    };

    // O valor que será compartilhado com todos os componentes filhos
    const value = {
        usuario,
        login,
        logout,
        isAutenticado: !!usuario, // Um booleano prático: true se o usuário existe, false se não
        isLoading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// 3. Cria um Hook customizado para facilitar o uso do contexto
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}