import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import Logo from "../assets/logo.png";
// 1. Importe useLocation junto com useNavigate
import { useNavigate, useLocation } from "react-router-dom";
import CaixaLogin from "./CaixaLogin"; // importa seu componente de perfil
import Tipografia from "./Tipografia";
import Botao from "./Botao";

export default function Header() {
  const navigate = useNavigate();
  // 2. Obtenha o objeto de localização, que contém a URL atual
  const location = useLocation();
  const [active, setActive] = useState("home");
  const [mostrarLogin, setMostrarLogin] = useState(false);

  const ongLogada = {
    nome: "Instituto Esperança",
    email: "contato@instituto.org",
    cnpj: "12.345.678/0001-90",
    telefone: "(81) 99999-8888",
    ods: "Educação de qualidade"
  };

  // 3. Use useEffect para sincronizar o estado 'active' com a URL
  useEffect(() => {
    const path = location.pathname; // Ex: "/", "/editais", "/meu-perfil"
    if (path === '/editais') {
      setActive('editais');
    } else if (path === '/meu-perfil') {
      setActive('menu');
    } else if (path === '/login') {
      setActive('login');
    } else {
      setActive('home'); // Define 'home' como padrão para a rota "/" e outras
    }
  }, [location.pathname]); // O efeito roda toda vez que a URL muda

  // A função de clique agora apenas precisa navegar. O useEffect cuidará do resto.
  const handleNavigate = (path) => {
    navigate(path);
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
          onClick={() => handleNavigate("/login")} // Navega para a página de login
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
      
        {/* Menu centralizado */}
        <nav className="bg-blue-950 rounded-md px-2 py-1 flex gap-x-2 text-white">
          {/* Mapeando um array mais estruturado para clareza */}
          {[
            { id: 'home', path: '/', label: 'Home' },
            { id: 'editais', path: '/editais', label: 'Editais' },
            { id: 'menu', path: '/meu-perfil', label: 'Menu' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.path)}
              className="focus:outline-none cursor-pointer pb-1 px-4 py-0.5 text-sm sm:text-base"
            >
              <span
                className={`block mx-auto border-b-2 ${active === item ? "border-white" : "border-transparent"
                  }`}
              >
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};