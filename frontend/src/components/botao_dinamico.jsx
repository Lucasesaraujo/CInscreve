// nao vai ser mais usado

import React, { useState } from 'react';
import clsx from 'clsx';

const FavoritarButton = ({
  className = '',
  tipo = 'corpo',
  tamanho = 16,
  peso = 'medium',
  ...props
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

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

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <button
      className={clsx(baseStyles, 'bg-white text-black hover:bg-zinc-100 flex items-center gap-2 flex-col', className)}
      onClick={toggleFavorite}
      style={{ fontSize: `${tamanho}px` }}
      {...props}
    >
      {isFavorited ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 015.656 0c1.563 1.563 1.563 4.095 0 5.657l-6.828 6.829a1 1 0 01-1.414 0l-6.828-6.829a4 4 0 010-5.657z"
              clipRule="evenodd"
            />
          </svg>
          Favorito
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          Favoritar
        </>
      )}
    </button>
  );
};

export default FavoritarButton;