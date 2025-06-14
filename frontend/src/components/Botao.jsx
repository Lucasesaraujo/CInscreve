import React from 'react';
import clsx from 'clsx';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  tipo = 'corpo',
  tamanho = 16,
  peso = 'medium',
  ...props
}) => {
  const fonte = tipo === 'titulo' ? 'font-montserrat' : 'font-lato';
  const pesos = {
    bold: 'font-bold',
    medium: 'font-medium',
    regular: 'font-normal',
    light: 'font-light',
  };

  const baseStyles = clsx(
    'rounded-md px-4 md:px-6 py-2 md:py-3 sm:w-auto w-auto transition flex items-center gap-2',
    fonte,
    pesos[peso]
  );

  const variantStyles = {
    'azul-claro': 'bg-[#56b5fd] text-white hover:brightness-90',
    'azul-medio': 'bg-[#108cf0] text-white hover:brightness-90',
    'azul-escuro': 'bg-[#0b3e76] text-white hover:brightness-90',
    outline: 'border border-black text-black hover:bg-zinc-100',
    text: 'text-black hover:text-zinc-700 flex items-center gap-2',
    sim: 'bg-green-600 text-white hover:bg-green-700 flex flex-col items-center justify-center text-center ',
    nao: 'bg-red-600 text-white hover:bg-red-700 flex flex-col items-center justify-center text-center',
    'botao-maior':'bg-transparent text-black flex flex-col items-center justify-center text-center p-6 rounded-full w-40 h-40 hover:bg-gray-200',
    usuario: 'bg-gray-200 hover:bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], className)}
      style={{ fontSize: `${tamanho}px` }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;