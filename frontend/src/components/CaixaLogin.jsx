import React, { useEffect, useRef } from 'react';
import Tipografia from './Tipografia';
import Botao from './Botao';

export default function CaixaLogin({ visivel, fechar, dados }) {
    const ref = useRef();

    useEffect(() => {
        const aoClicarFora = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                fechar();
            }
        };
        document.addEventListener('mousedown', aoClicarFora);
        return () => document.removeEventListener('mousedown', aoClicarFora);
    }, [fechar]);

    if (!visivel) return null;

    return (
        <div
            ref={ref}
            className="!fixed top-20 right-6 w-[320px] !z-[9999] bg-white rounded-md shadow-xl p-5 border border-gray-200"
        >

            <Tipografia tipo="subtitulo" className="mb-3 text-blue-800">
                Perfil da ONG
            </Tipografia>

            <div className="text-sm space-y-1 text-gray-700">
                <p><strong>Nome:</strong> {dados.nome || '---'}</p>
                <p><strong>Email:</strong> {dados.email || '---'}</p>
                <p><strong>CNPJ:</strong> {dados.cnpj || '---'}</p>
                <p><strong>Telefone:</strong> {dados.telefone || '---'}</p>
                <p><strong>ODS:</strong> {dados.ods || '---'}</p>
            </div>

            <Botao
                variante="vermelho"
                onClick={fechar}
                className="mt-4 w-full"
            >
                Sair
            </Botao>
        </div>
    );
}