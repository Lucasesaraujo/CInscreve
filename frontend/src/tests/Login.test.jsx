import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, expect } from 'vitest';

// Mock do useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

// Mock da API de login
// eslint-disable-next-line no-undef
global.fetch = vi.fn();

describe('Página: Login', () => {
    // eslint-disable-next-line no-undef
    beforeEach(() => {
        fetch.mockReset();
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Login />
            </MemoryRouter>
        );
    });

    test('1️ - impede envio com campos vazios', async () => {
        const botao = screen.getByRole('button', { name: /entrar/i });
        fireEvent.click(botao);

        await waitFor(() =>
            expect(
                screen.getByText(/erro ao fazer login, verifique email e senha!/i)
            ).toBeInTheDocument()
        );
    });

    test('2️ - preenche campos com credenciais incorretas', () => {
        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: 'usuario@incorreto.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/senha/i), {
            target: { value: 'senhaerrada' }
        });

        expect(screen.getByDisplayValue('usuario@incorreto.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('senhaerrada')).toBeInTheDocument();
    });

    test('3️ - mostra alerta após falha no login', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        expect(screen.getByRole('button', { name: /entrando.../i })).toBeInTheDocument();

        await waitFor(() =>
            expect(
                screen.getByText(/erro ao fazer login, verifique email e senha!/i)
            ).toBeInTheDocument()
        );

        expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    });

    test('4️ - remove alerta ao clicar no "x"', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        render(
            <MemoryRouter initialEntries={['/login']}>
                <Login />
            </MemoryRouter>
        );

        // Clica no botão "Entrar"
        const [botaoEntrar] = screen.getAllByRole('button', { name: /entrar/i });
        fireEvent.click(botaoEntrar);

        // Aguarda o alerta aparecer
        await waitFor(() =>
            expect(
                screen.getByText(/erro ao fazer login, verifique email e senha!/i)
            ).toBeInTheDocument()
        );

        // Encontra o botão de fechar por posição
        const botoes = screen.getAllByRole('button');
        const fechar = botoes.find(btn =>
            btn.textContent.trim() === 'x' || btn.textContent.trim() === '×'
        );

        expect(fechar).toBeDefined();
        fireEvent.click(fechar);

        // Aguarda alerta desaparecer
        await waitFor(() =>
            expect(
                screen.queryByText(/erro ao fazer login, verifique email e senha!/i)
            ).not.toBeInTheDocument()
        );
    });

    test('5️- preenche campos com credenciais válidas', () => {
        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: 'usuario@valido.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/senha/i), {
            target: { value: 'senhacorreta' }
        });

        expect(screen.getByDisplayValue('usuario@valido.com')).toBeInTheDocument();
        expect(screen.getByDisplayValue('senhacorreta')).toBeInTheDocument();
    });

    test('6️ - marca checkbox "Lembrar se de mim"', () => {
        const checkbox = screen.getByRole('checkbox', { name: /lembrar se de mim/i });
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(checkbox).toBeChecked();
    });

    test('7️ - realiza login com sucesso e redireciona', async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: 'abc123' })
        });

        fireEvent.change(screen.getByPlaceholderText(/email/i), {
            target: { value: 'usuario@valido.com' }
        });
        fireEvent.change(screen.getByPlaceholderText(/senha/i), {
            target: { value: 'senhacorreta' }
        });

        fireEvent.click(screen.getByRole('checkbox', { name: /lembrar se de mim/i }));
        fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

        expect(screen.getByRole('button', { name: /entrando.../i })).toBeInTheDocument();

        await waitFor(() =>
            expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
        );
    });
});