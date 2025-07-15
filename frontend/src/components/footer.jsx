import React from "react";
import Logo from '../assets/logo.png';
import Fundo from '../assets/base.png';


const Footer = () => {
  return (
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between gap-8">
        {/* Logo e descrição */}
        <div className="flex flex-col items-start gap-y-0">
          <div className="w-30 h-20 flex items-center justify-center">
            <img src={Logo} className="w-full h-full object-contain" />
          </div>
          <p className="text-sm text-gray-900 font-medium max-w-[135px] text-justify">
            Facilitando o acesso a oportunidades que mudam realidades.
          </p>
        </div>

        {/* Coluna Portal */}
        <div>
          <h4 className="font-bold mb-2 text-blue-900">Portal</h4>
          <ul className="space-y-1 text-sm text-gray-900 font-medium">
            <li><a href="#">Ver editais</a></li>
            <li><a href="#">Sugerir editais</a></li>
          </ul>
        </div>

        {/* Coluna Suporte */}
        <div>
          <h4 className="font-bold mb-2 text-blue-900">Suporte</h4>
          <ul className="space-y-1 text-sm text-gray-900 font-medium">
            <li><a href="#">Contato</a></li>
            <li><a href="#">Termos de Uso e</a></li>
            <li><a href="#">Privacidade</a></li>
          </ul>
        </div>
      </div>

      {/* Texto final */}
      <div className=" text-center py-4 text-sm text-white"
      style={{ backgroundColor: Fundo }}>
        Construído por pessoas que acreditam no impacto do seu projeto.
      </div>
    </footer>
  );
};

export default Footer;
