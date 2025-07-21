import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../components/Card';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const editalExemplo = {
    titulo: 'Programa Jovens Talentos',
    instituicao: 'Universidade Federal de Recife',
    area: 'Educação',
    descricao: 'Uma oportunidade para jovens pesquisadores.',
    imagem: '/imagens/edital.jpg',
    _id: '12345',
};

describe('Componente: Card', () => {
    // Teste 0: Variante simples
    test('deve renderizar o card simples com os dados principais', () => {
        render(
            <MemoryRouter>
                <Card
                    variante="simples"
                    titulo="Programa Jovens Talentos"
                    instituicao="Universidade Federal de Recife"
                    area="Educação"
                    imagem="/imagens/edital.jpg"
                    _id="12345"
                />
            </MemoryRouter>
        );

        expect(screen.getByText(/programa jovens talentos/i)).toBeInTheDocument();
        expect(screen.getByText(/universidade federal de recife/i)).toBeInTheDocument();
        expect(screen.getByText(/educação/i)).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveAttribute('src', '/imagens/edital.jpg');
    });

    // Teste 1: Variante detalhado
    test('deve renderizar o card detalhado com descrição e botões', () => {
        render(
            <MemoryRouter>
                <Card
                    variante="detalhado"
                    titulo="Programa Jovens Talentos"
                    descricao="Uma oportunidade para jovens pesquisadores."
                />
            </MemoryRouter>
        );

        expect(screen.getByText(/programa jovens talentos/i)).toBeInTheDocument();
        expect(screen.getByText(/uma oportunidade para jovens/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /conhecer/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/favoritar/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/notificar/i)).toBeInTheDocument();
    });

    // Teste 2: Clique no botão Favoritar
    test('deve chamar a função onToggleFavorito ao clicar em "Favoritar"', () => {
        const toggleFavorito = vi.fn();
        render(
            <MemoryRouter>
                <Card variante="detalhado" edital={editalExemplo} onToggleFavorito={toggleFavorito} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText(/favoritar/i));
        expect(toggleFavorito).toHaveBeenCalledTimes(1);
    });

    // Teste 3: Clique no botão Notificar
    test('deve chamar a função onToggleNotificacao ao clicar em "Notificar"', () => {
        const toggleNotificar = vi.fn();
        render(
            <MemoryRouter>
                <Card variante="detalhado" edital={editalExemplo} onToggleNotificacao={toggleNotificar} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByLabelText(/notificar/i));
        expect(toggleNotificar).toHaveBeenCalledTimes(1);
    });

    // Teste 4: Renderizar card favorito inicialmente
    test('deve exibir ícone de coração preenchido quando o edital está favoritado', () => {
        render(
            <MemoryRouter>
                <Card
                    variante="detalhado"
                    edital={editalExemplo}
                    favoritoInicial={true}
                />
            </MemoryRouter>
        );
        const iconeFavorito = screen.getByLabelText(/favoritar/i).querySelector('svg');
        expect(iconeFavorito).toHaveClass('text-red-500');
        expect(iconeFavorito).toHaveAttribute('fill', 'currentColor');
    });
});