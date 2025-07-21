import React from 'react';
import { render, screen } from '@testing-library/react';
import Carrossel from '../components/Carrossel';
import { describe, test, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

const listaEditais = [
    {
        _id: '1',
        titulo: 'Edital A',
        instituicao: 'UFPE',
        area: 'Saúde',
        descricao: 'Descrição A',
        imagem: '/img1.jpg'
    },
    {
        _id: '2',
        titulo: 'Edital B',
        instituicao: 'UFPE',
        area: 'Tecnologia',
        descricao: 'Descrição B',
        imagem: '/img2.jpg'
    }
];

describe('Componente: Carrossel', () => {
    // Teste 0: Título + lista de Cards
    test('deve renderizar o título e o número correto de Cards', () => {
        render(
            <MemoryRouter>
                <Carrossel titulo="Meus Editais" cards={listaEditais} />
            </MemoryRouter>
        );

        expect(screen.getByText(/meus editais/i)).toBeInTheDocument();

        const cardA = screen.getByText(/edital a/i);
        const cardB = screen.getByText(/edital b/i);
        expect(cardA).toBeInTheDocument();
        expect(cardB).toBeInTheDocument();
    });

    // Teste 1: Lista de cards vazia
    test('deve exibir apenas o título quando a lista está vazia', () => {
        render(
            <MemoryRouter>
                <Carrossel titulo="Nenhum edital disponível" editais={[]} />
            </MemoryRouter>
        );

        expect(screen.getByText(/nenhum edital disponível/i)).toBeInTheDocument();

        const cards = screen.queryAllByTestId('card-item');
        expect(cards).toHaveLength(0);
    });

    // Teste 2: Botões de navegação
    test('deve renderizar os botões "Anterior" e "Próximo"', () => {
        render(
            <MemoryRouter>
                <Carrossel titulo="Carrossel de Teste" editais={listaEditais} />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/anterior/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/próximo/i)).toBeInTheDocument();
    });
});