import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import Logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import Perfil from "./Perfil";
import { getUserData } from "../services/apiAuth";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [active, setActive] = useState("home");
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [usuario, setUsuario] = useState(null); // usuário logado

  // Sincroniza aba ativa com a URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/editais") setActive("editais");
    else if (path === "/meu-perfil") setActive("menu");
    else if (path === "/login") setActive("login");
    else setActive("home");
  }, [location.pathname]);

  // Busca dados reais do usuário logado
  useEffect(() => {
    async function fetchUsuario() {
      const dados = await getUserData();
      setUsuario(dados?.usuario || null);
    }
    fetchUsuario();
  }, []);

  const handleNavigate = (path, precisaLogin = false) => {
    // se precisa estar logado e não tem usuario, vai pro login
    if (precisaLogin && !usuario) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <header className="relative w-full bg-white shadow py-2 overflow-visible">
      {/* Logo + nome */}
      <div
        onClick={() => handleNavigate("/")}
        className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center space-x-2 pl-6 cursor-pointer"
      >
        <img src={Logo} alt="Logo" className="w-10 h-10 sm:w-14 sm:h-14" />
        <span className="text-blue-800 text-base sm:text-lg md:text-xl font-semibold whitespace-nowrap">
          Cinscreve
        </span>
      </div>

      {/* Ícone de usuário */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={() => {
            if (usuario) setMostrarPerfil((prev) => !prev);
            else navigate("/login");
          }}
          className="focus:outline-none cursor-pointer p-2 rounded-full hover:bg-gray-100"
          aria-label="Login"
        >
          <User
            className={`w-8 h-8 ${mostrarPerfil ? "text-blue-800" : "text-gray-700"}`}
          />
        </button>

        {/* Perfil */}
        {usuario && (
          <div className="relative">
            <Perfil
              visivel={mostrarPerfil}
              fechar={() => setMostrarPerfil(false)}
              dados={usuario}
              setUsuario={setUsuario} // para logout atualizar estado
            />
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="max-w-screen-lg mx-auto flex items-center justify-center relative">
        <nav className="bg-blue-950 rounded-md px-2 py-1 flex gap-x-2 text-white">
          {[
            { id: "home", path: "/", label: "Home", precisaLogin: false },
            { id: "editais", path: "/editais", label: "Editais", precisaLogin: false },
            { id: "menu", path: "/meu-perfil", label: "Menu", precisaLogin: true },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.path, item.precisaLogin)}
              className="focus:outline-none cursor-pointer pb-1 px-4 py-0.5 text-sm sm:text-base"
            >
              <span
                className={`block mx-auto border-b-2 ${
                  active === item.id ? "border-white" : "border-transparent"
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
}
