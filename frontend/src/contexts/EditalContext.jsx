import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toggleFavoritoEdital } from "../services/apiEditais";
import { getUserData } from "../services/apiUser";

const EditalContext = createContext();

export function EditalProvider({ children }) {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState([]); // IDs de editais favoritados

  // 1. Inicializa favoritos ao carregar usuário
  useEffect(() => {
    if (!usuario) {
      setFavoritos([]);
      return;
    }

    async function carregarFavoritos() {
      try {
        const data = await getUserData(); // retorna usuário com lista de favoritos
        setFavoritos(data.usuario.favoritos?.map(f => f._id) || []);
      } catch (err) {
        console.error("Erro ao carregar favoritos do usuário:", err);
      }
    }

    carregarFavoritos();
  }, [usuario]);

  // 2. Alterna favorito de um edital
  const toggleFavorito = async (editalId) => {
    if (!usuario) {
      alert("Você precisa estar logado para favoritar um edital!");
      return;
    }

    try {
      await toggleFavoritoEdital(editalId); // chama a API
      setFavoritos(prev => {
        if (prev.includes(editalId)) {
          return prev.filter(id => id !== editalId);
        } else {
          return [...prev, editalId];
        }
      });
    } catch (err) {
      console.error("Erro ao alternar favorito:", err);
      alert(err.message || "Erro ao favoritar/desfavoritar edital.");
    }
  };

  // 3. Verifica se um edital está favoritado
  const isFavorito = (editalId) => {
    return favoritos.includes(editalId);
  };

  return (
    <EditalContext.Provider value={{ favoritos, toggleFavorito, isFavorito }}>
      {children}
    </EditalContext.Provider>
  );
}

// Hook para usar EditalContext
// eslint-disable-next-line react-refresh/only-export-components
export function useEdital() {
  const context = useContext(EditalContext);
  if (!context) {
    throw new Error("useEdital deve ser usado dentro de um EditalProvider");
  }
  return context;
}
