import React, { useState } from "react";
import Logo from '../assets/logo.svg';

const Header = () => {
  const [active, setActive] = useState("home");

  const handleClick = (buttonName) => {
    setActive(buttonName);
  };

  return (
    <header className="relative w-full bg-white shadow py-2 overflow-visible">
      
      {/* Logo + texto na extrema esquerda */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center space-x-2 pl-2">
        <img src={Logo} alt="Logo" className="w-14 h-14 sm:w-18 sm:h-18" />
        <div className="font-bold text-sm sm:text-base text-gray-800 hidden sm:block">
          ConectaRecife
        </div>
      </div>

      {/* Login na extrema direita */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-400 rounded-md text-white">
        <button
          type="button"
          onClick={() => handleClick("login")}
          className="focus:outline-none cursor-pointer px-4 sm:px-6 pt-1 pb-2 text-sm sm:text-base"
        >
          <span
            className={`block mx-auto border-b-2 ${
              active === "login" ? "border-white" : "border-transparent"
            }`}
          >
            Login
          </span>
        </button>
      </div>

      {/* Container centralizado */}
      <div className="max-w-screen-lg mx-auto flex items-center justify-center relative">
        
        {/* Menu centralizado */}
        <nav className="bg-gray-400 rounded-md px-2 py-1 flex gap-x-2 text-white">
          {["home", "editais", "menu"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handleClick(item)}
              className="focus:outline-none cursor-pointer pb-1 px-4 py-0.5 text-sm sm:text-base"
            >
              <span
                className={`block mx-auto border-b-2 ${
                  active === item ? "border-white" : "border-transparent"
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
};

export default Header;
