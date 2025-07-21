import React, { useState } from "react";
import { User } from "lucide-react";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import CaixaLogin from "./CaixaLogin"; // importa seu componente de perfil
import Tipografia from "./Tipografia";
import Botao from "./Botao";

export default function Header() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const ongLogada = {
    nome: "Instituto Esperança",
    email: "contato@instituto.org",
    cnpj: "12.345.678/0001-90",
    telefone: "(81) 99999-8888",
    ods: "Educação de qualidade"
  };

  const handleClick = (buttonName) => {
    setActive(buttonName);
    navigate(buttonName === "home" ? "/" : `/${buttonName}`);
  };

  return (
    <header className="relative w-full bg-white shadow py-2 overflow-visible">
      {/* Logo + nome */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center space-x-2 pl-6">
        <img src={Logo} alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14" />
        <span className="text-blue-800 text-base sm:text-lg md:text-xl font-semibold whitespace-nowrap">
          Cinscreve
        </span>
      </div>

      {/* Ícone de usuário no canto direito */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => setMostrarLogin(true)}
          className="focus:outline-none cursor-pointer p-2 rounded-full hover:bg-gray-100"
          aria-label="Login"
        >
          <User
            className={`w-8 h-8 ${mostrarLogin ? "text-blue-800" : "text-gray-700"
              }`}
          />
        </button>

        {/* CaixaLogin aparece ao clicar no ícone */}
        <div className="relative">
          <CaixaLogin
            visivel={mostrarLogin}
            fechar={() => setMostrarLogin(false)}
            dados={ongLogada}
          />
        </div>
      </div>

      {/* Container centralizado */}
      <div className="max-w-screen-lg mx-auto flex items-center justify-center relative">
        <nav className="bg-blue-950 rounded-md px-2 py-1 flex gap-x-2 text-white">
          {["home", "editais", "menu"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleClick(item)}
              className="focus:outline-none cursor-pointer pb-1 px-4 py-0.5 text-sm sm:text-base"
            >
              <span
                className={`block mx-auto border-b-2 ${active === item ? "border-white" : "border-transparent"
                  }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}