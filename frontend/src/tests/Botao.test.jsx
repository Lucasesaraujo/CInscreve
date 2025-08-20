import { render, screen, fireEvent } from '@testing-library/react';
import Botao from '../components/Botao';
import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { AuthProvider } from '../contexts/AuthContext';

describe('Componente: Botao', () => {
  // Teste 1: Renderiza com texto passado como children
  test('deve renderizar o texto corretamente via children', () => {
    render(<AuthProvider><Botao>Clique Aqui</Botao></AuthProvider>);
    const botaoElement = screen.getByRole('button', { name: /clique aqui/i });
    expect(botaoElement).toBeInTheDocument();
  });

  // Teste 2: Aplica classe customizada corretamente
  test('deve aplicar a classe TailwindCSS passada via className', () => {
    const { container } = render(<AuthProvider><Botao className="text-black">Teste</Botao></AuthProvider>);
    const botao = container.querySelector('button');
    expect(botao).toHaveClass('text-black');
  });

  // Teste 3: Chama a função onClick ao ser clicado
  test('deve chamar a função onClick quando clicado', () => {
    const onClickMock = vi.fn();
    render(<AuthProvider><Botao onClick={onClickMock}>Clique</Botao></AuthProvider>);
    const botaoElement = screen.getByRole('button', { name: /clique/i });
    fireEvent.click(botaoElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  // Teste 4: Botão não chama onClick quando desabilitado
  test('não deve chamar onClick quando estiver desabilitado', () => {
    const onClickMock = vi.fn();
    render(<AuthProvider><Botao disabled onClick={onClickMock}>Não Clique</Botao></AuthProvider>);
    const botaoElement = screen.getByRole('button', { name: /não clique/i });
    expect(botaoElement).toBeDisabled();
    fireEvent.click(botaoElement);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  // Teste 5: Botão de favoritar alterna estado corretamente
  test('botão de favoritar alterna entre Favoritar e Favorito', () => {
    render(<AuthProvider><Botao favoritar /></AuthProvider>);
    expect(screen.getByText('Favoritar')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Favoritar'));
    expect(screen.getByText('Favorito')).toBeInTheDocument();
  });
});