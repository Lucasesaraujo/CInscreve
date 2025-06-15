import React, { useState } from 'react';

const Button = ({
  children,
  variant = 'primary',
  className = '',
  tipo = 'corpo',
  tamanho = 16,
  peso = 'medium',
  favoritar = false, // prop para ativar o botao favoritar
  ...props
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  // define a fonte com base no tipo
  const fonte = tipo === 'titulo' ? 'font-montserrat' : 'font-lato';

  // mapa de pesos para as classes de fonte
  const pesos = {
    bold: 'font-bold',
    medium: 'font-medium',
    regular: 'font-normal',
    light: 'font-light',
  };

  // base dos estilos do botao, concatenando as classes
  const baseStyles = [
    'rounded-md px-4 md:px-6 py-2 md:py-3 sm:w-auto w-auto transition flex items-center gap-2',
    fonte,
    pesos[peso] || '',
  ].join(' ');

  // estilos variantes de acordo com a prop variant
  const variantStyles = {
    'azul-claro': 'bg-[#56b5fd] text-white hover:brightness-90',
    'azul-medio': 'bg-[#108cf0] text-white hover:brightness-90',
    'azul-escuro': 'bg-[#0b3e76] text-white hover:brightness-90',
    outline: 'border border-black text-black hover:bg-zinc-100',
    text: 'text-black hover:text-zinc-700 flex items-center gap-2',
    sim: 'bg-green-600 text-white hover:bg-green-700 flex flex-col items-center justify-center text-center',
    nao: 'bg-red-600 text-white hover:bg-red-700 flex flex-col items-center justify-center text-center',
    'botao-maior': 'bg-transparent text-black flex flex-col items-center justify-center text-center p-6 rounded-full w-40 h-40 hover:bg-gray-200',
    usuario: 'bg-gray-200 hover:bg-gray-300 rounded-full w-12 h-12 flex items-center justify-center',
  };

  // caso o botao seja o favoritar, retornamos o botao com estado e icones proprios
  if (favoritar) {
    const toggleFavorite = () => setIsFavorited(!isFavorited);

    // concatenando as classes para o botao favoritar
    const favoritarClasses = [
      baseStyles,
      'bg-white text-black hover:bg-zinc-100 flex items-center gap-2 flex-col',
      className,
    ].join(' ');

    return (
      <button
        className={favoritarClasses}
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
                d="m3.172 5.172a4 4 0 0 1 5.656 0l1.172 1.171 1.172-1.171a4 4 0 0 1 5.656 0c1.563 1.563 1.563 4.095 0 5.657l-6.828 6.829a1 1 0 0 1-1.414 0l-6.828-6.829a4 4 0 0 1 0-5.657z"
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
                d="m4.318 6.318a4.5 4.5 0 0 0 0 6.364l7.682 7.682 7.682-7.682a4.5 4.5 0 0 0-6.364-6.364l-1.318 1.318-1.318-1.318a4.5 4.5 0 0 0-6.364 0z"
              />
            </svg>
            Favoritar
          </>
        )}
      </button>
    );
  }

  // caso normal do botao, juntamos as classes base + variante + classes extras
  const buttonClasses = [baseStyles, variantStyles[variant] || '', className].join(' ');

  return (
    <button
      className={buttonClasses}
      style={{ fontSize: `${tamanho}px` }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
