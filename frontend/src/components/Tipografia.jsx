import React from 'react';

export default function Tipografia({ children, tipo = "titulo", tamanho = 48, peso = "bold" }) {
  // define a fonte com base no tipo
  const fonte = tipo === "titulo" ? "font-montserrat" : "font-lato";

  // define o peso (bold, medium, regular, light)
  const pesos = {
    bold: "font-bold",
    medium: "font-medium",
    regular: "font-normal",
    light: "font-light"
  };

  // classes fixas (fonte + peso)
  const className = `${fonte} ${pesos[peso]}`;

  // estilo inline para o tamanho dinamico
  const style = { fontSize: `${tamanho}px` };

  return <p className={className} style={style}>{children}</p>;
}

/*
comandos importantes:
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
node server.js
npx prisma studio
npm run dev
*/