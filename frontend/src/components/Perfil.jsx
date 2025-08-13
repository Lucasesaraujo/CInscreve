import React, { useEffect, useRef } from 'react';
import Tipografia from './Tipografia';
import Botao from './Botao';
import { logoutUser } from '../services/apiAuth'; // Função de logout

export default function Perfil({ visivel, fechar, dados }) {
  const ref = useRef();

  // Fecha a caixa se clicar fora dela
  useEffect(() => {
    const aoClicarFora = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        fechar();
      }
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [fechar]);

  // Se não estiver visível, não renderiza nada
  if (!visivel) return null;

  return (
    <div
      ref={ref}
      className="!fixed top-20 right-6 w-[320px] !z-[9999] bg-white rounded-md shadow-xl p-5 border border-gray-200"
    >
      <Tipografia tipo="subtitulo" className="mb-3 text-blue-800">
        Perfil da ONG
      </Tipografia>

      <div className="text-sm space-y-1 text-gray-700">
        <p><strong>Nome:</strong> {dados.nome || '---'}</p>
        <p><strong>Email:</strong> {dados.email || '---'}</p>
        <p><strong>CNPJ:</strong> {dados.cnpj || '---'}</p>
        <p><strong>Telefone:</strong> {dados.telefone || '---'}</p>
        <p><strong>ODS:</strong> {dados.ods || '---'}</p>
      </div>

      {/* Botão de logout */}
      <Botao
        variante="vermelho"
        onClick={async () => {
          await logoutUser(dados.accessToken); // Faz logout enviando token
          fechar(); // Fecha a caixa
          localStorage.removeItem('accessToken'); // Limpa token local
          window.location.href = "/login"; // Redireciona para login
        }}
        className="mt-4 w-full"
      >
        Sair
      </Botao>
    </div>
  );
}
