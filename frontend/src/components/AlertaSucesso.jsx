import React, { useEffect } from 'react';
import Tipografia from './Tipografia';
import { CheckCircle2 } from 'lucide-react';

export default function AlertaSucesso({
  mensagem = 'Ação realizada com sucesso!',
  onClose = () => {},
  className = ''
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-4 px-6 py-4 bg-white border-l-4 border-green-500 shadow-lg rounded-md text-green-700 animate-slide-in ${className}`}
    >
      {/* Ícone de sucesso */}
      <CheckCircle2 className="w-6 h-6 text-green-600" />

      {/* Mensagem */}
      <Tipografia tipo="texto" className="flex-1 text-green-700">
        {mensagem}
      </Tipografia>

      {/* Botão de fechar */}
      <button
        onClick={onClose}
        className="ml-auto text-green-500 text-xl font-bold hover:text-green-700"
      >
        ×
      </button>
    </div>
  );
}
