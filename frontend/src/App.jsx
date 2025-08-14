import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Editais from './pages/Editais';
import PaginaUsuario from './pages/PaginaUsuario';
import EditalEspecifico from './pages/EditalEspecifico';
import SugerirEdital from './pages/SugerirEditais';
import Header from './components/Header';
import Perfil from './components/Perfil';
import AutoRefresh from './components/AutoRefresh';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function AppContent() {
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const { usuario } = useAuth();

  return (
    <>
      <AutoRefresh />
      <Header mostrarPerfil={mostrarPerfil} setMostrarPerfil={setMostrarPerfil} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/editais" element={<Editais />} />
        <Route path="/sugerir" element={<SugerirEdital />} />
        <Route path="/meu-perfil" element={<PaginaUsuario />} />
        <Route path="/editais/:id" element={<EditalEspecifico />} />
        <Route path="*" element={<h1>Página Não Encontrada</h1>} />
      </Routes>

      {usuario && mostrarPerfil && createPortal(
        <Perfil
          visivel={mostrarPerfil}
          fechar={() => setMostrarPerfil(false)}
          dados={usuario}
        />,
        document.body
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
