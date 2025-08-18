import React, { useEffect } from 'react';
import Tipografia from './Tipografia';
import { AlertOctagon } from 'lucide-react';

export default function AlertaErro({
  mensagem = 'Ocorreu um erro',
  onClose = () => {},
  className = ''
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5002);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center gap-4 px-6 py-4 bg-white border-l-4 border-red-500 shadow-lg rounded-md text-red-700 animate-slide-in ${className}`}
    >
      {/* Ícone de erro */}
      <AlertOctagon className="w-6 h-6 text-red-600" />

      {/* Mensagem personalizada */}
      <Tipografia tipo="texto" className="flex-1 text-red-700">
        {mensagem}
      </Tipografia>

      {/* Botão de fechar */}
      <button
        onClick={onClose}
        className="ml-auto text-red-500 text-xl font-bold hover:text-red-700"
      >
        ×
      </button>
    </div>
  );
}