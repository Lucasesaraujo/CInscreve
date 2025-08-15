import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';
import { MemoryRouter } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach } from 'vitest';
// Mock do useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

// Mock da API de editais
vi.mock('../services/apiEditais', () => ({
    getEditaisValidados: () =>
        Promise.resolve({
            editais: [
                {
                    nome: 'Edital Simulado 1',
                    organizacao: 'ONG Exemplo',
                    descricao: 'Descrição teste'
                },
                {
                    nome: 'Edital Simulado 2',
                    organizacao: 'Instituto Modelo',
                    descricao: 'Outro edital relevante'
                }
            ]
        })
}));

describe('Página: Home', () => {
    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );
    });

    test('1️ - deve exibir o cabeçalho com menu de navegação', async () => {
        const [menuEditais] = await screen.findAllByText((_, el) =>
            el?.textContent?.toLowerCase().includes('editais')
        );
        expect(menuEditais).toBeInTheDocument();
    });

    test('2️ - deve exibir o bloco de destaque com título, subtítulo, botões e imagem', async () => {
        const [destaque] = screen.getAllByText((_, el) =>
            el?.textContent?.includes('Sua ponte entre oportunidades')
        );
        expect(destaque).toBeInTheDocument();

        const [botaoDestaque] = screen.getAllByText(/ver editais/i);
        expect(botaoDestaque).toBeInTheDocument();
        const [botaoSugerir] = screen.getAllByText(/sugerir editais/i);
        expect(botaoSugerir).toBeInTheDocument();

        const imagem = screen.getByAltText(/imagem de login/i);
        expect(imagem).toBeInTheDocument();
    });

    test('3️ - deve exibir o carrossel com título e cards detalhados', async () => {
        const [tituloCarrossel] = screen.getAllByText((_, el) =>
            el?.textContent?.includes('Juntos, construímos uma base confiável')
        );
        expect(tituloCarrossel).toBeInTheDocument();

        const [card1] = await screen.findAllByText(/edital simulado 1/i);
        const [card2] = await screen.findAllByText(/edital simulado 2/i);

        expect(card1).toBeInTheDocument();
        expect(card2).toBeInTheDocument();
    });

    test('4️ - deve exibir a seção de funcionalidades com os 5 componentes', async () => {
        const [tituloFuncionalidades] = screen.getAllByText((_, el) =>
            el?.textContent?.includes('Recursos que simplificam seu dia a dia')
        );
        expect(tituloFuncionalidades).toBeInTheDocument();

        expect(screen.getByText(/busque/i)).toBeInTheDocument();
        expect(screen.getByText(/inscreva-se/i)).toBeInTheDocument();
        expect(screen.getByText(/valide/i)).toBeInTheDocument();
        expect(screen.getByText(/favorite/i)).toBeInTheDocument();
        expect(screen.getByText(/notifique-se/i)).toBeInTheDocument();
    });

    test('5️ - deve exibir o bloco final e o rodapé da página', async () => {
        const [blocoFinal] = screen.getAllByText((_, el) =>
            el?.textContent?.includes('Conecte-se às oportunidades certas')
        );
        expect(blocoFinal).toBeInTheDocument();

        const [mensagemFinal] = screen.getAllByText((_, el) =>
            el?.textContent?.includes('Descubra editais alinhados com sua ONG')
        );
        expect(mensagemFinal).toBeInTheDocument();

    });

    test('6️ - ao clicar em "Ver editais", deve redirecionar para a página de Editais', async () => {
        const [botao] = screen.getAllByRole('button', { name: /ver editais/i });
        expect(botao).toBeEnabled();
        fireEvent.click(botao);
        expect(botao).toBeInTheDocument();
    });
});