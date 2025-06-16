import React from "react";
import Logo from '../assets/logo.svg'

const Footer = () => {
  return (
    <footer className="bg-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between gap-8">
        {/* Logo e descrição */}
        <div className="flex flex-col items-start gap-y-0">
          <div className="w-30 h-20 flex items-center justify-center">
            {/* Espaço da logo */}
            <img src={Logo} className="w-full h-full object-contain" />
          </div>
          <p className="text-sm text-gray-800 max-w-[130px] text-justify">
            Facilitando o acesso a oportunidades que mudam realidades.
          </p>
        </div>

        {/* Coluna Portal */}
        <div>
          <h4 className="font-bold mb-2">Portal</h4>
          <ul className="space-y-1 text-sm text-gray-800">
            <li><a href="#">Editais</a></li>
            <li><a href="#">Criar editais</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        {/* Coluna Suporte */}
        <div>
          <h4 className="font-bold mb-2">Suporte</h4>
          <ul className="space-y-1 text-sm text-gray-800">
            <li><a href="#">Contato</a></li>
            <li><a href="#">Termos de Uso e</a></li>
            <li><a href="#">Privacidade</a></li>
          </ul>
        </div>
      </div>

      {/* Texto final */}
      <div className="bg-white text-center py-4 text-sm text-gray-700">
        Construído por pessoas que acreditam no impacto do seu projeto.
      </div>
    </footer>
  );
};

export default Footer;
