import React from "react";
import Logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="w-full bg-blue-100"> {/* Azul claro usando Tailwind */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between gap-8">
        {/* Logo e descrição */}
        <div className="flex flex-col items-start gap-y-0">
          <div className="w-30 h-20 flex items-center justify-center">
            <img src={Logo} className="w-full h-full object-contain" alt="Logo" />
          </div>
          <p className="text-sm text-gray-900 font-medium max-w-[135px] text-justify">
            Facilitando o acesso a oportunidades que mudam realidades.
          </p>
        </div>

        {/* Coluna Portal */}
        <div>
          <h4 className="font-bold mb-2 text-blue-900">Portal</h4>
          <ul className="space-y-1 text-sm text-gray-900 font-medium">
            <li>
              <button 
                onClick={() => navigate('/editais')} 
                className="hover:underline cursor-pointer text-left"
              >
                Ver editais
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/sugerir')} 
                className="hover:underline cursor-pointer text-left"
              >
                Sugerir editais
              </button>
            </li>
          </ul>
        </div>

        {/* Coluna Suporte */}
        <div>
          <h4 className="font-bold mb-2 text-blue-900">Suporte</h4>
          <ul className="space-y-1 text-sm text-gray-900 font-medium">
            <li><button className="hover:underline cursor-pointer text-left">Contato</button></li>
            <li><button className="hover:underline cursor-pointer text-left">Termos de Uso</button></li>
            <li><button className="hover:underline cursor-pointer text-left">Privacidade</button></li>
          </ul>
        </div>
      </div>

      {/* Texto final */}
      <div className="text-center py-4 text-sm text-gray-700">
        Construído por pessoas que acreditam no impacto do seu projeto.
      </div>
    </footer>
  );
};

export default Footer;