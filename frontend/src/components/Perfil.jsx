import React from 'react';
import Tipografia from './Tipografia';
import Botao from './Botao';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Perfil({ visivel, fechar }) {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  if (!visivel) return null;

  return (
    <div
      className="fixed top-16 right-6 w-[320px] z-[9999] bg-white rounded-md shadow-xl p-5 border border-gray-200 pointer-events-auto"
    >

      <Tipografia tipo="subtitulo" className="mb-3 text-blue-800 text-3xl text-center font-bold">
        Perfil da ONG
      </Tipografia>

      <div className="text-sm space-y-1 text-gray-700 mb-4">
        <p><strong>Nome:</strong> {usuario?.name || '---'}</p>
        <p><strong>Email:</strong> {usuario?.email || '---'}</p>
        <p><strong>ONG:</strong> {usuario?.ngo.name || '---'}</p>
        <p><strong>Telefone:</strong> {usuario?.ngo.contact_phone || '---'}</p>
        <p><strong>ODS:</strong> {usuario?.ngo.causes[0].name || '---'}</p>
      </div>

      <Botao
        variante="vermelho"
        className="w-full py-2 rounded-md mb-2 cursor-pointer"
        onClick={async () => {
          await logout();
          navigate('/login');
          fechar();
        }}
      >
        Sair
      </Botao>

      <Botao
        variante="cinza"
        className="w-full py-2 rounded-md cursor-pointer"
        onClick={fechar}
      >
        Fechar
      </Botao>
    </div>
  );
}
