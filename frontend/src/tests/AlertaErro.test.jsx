import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AlertaErro from '../components/AlertaErro';
import { describe, test, expect, vi } from 'vitest';

describe('Componente: AlertaErro', () => {
  // Teste 0: Renderizar o alerta sem mensagem
  test('deve exibir a mensagem padrão quando nenhuma for passada', () => {
    render(<AlertaErro />);
    const mensagem = screen.getByText(/ocorreu um erro/i);
    expect(mensagem).toBeInTheDocument();
  });

  // Teste 1: Renderizar com mensagem customizada
  test('deve exibir a mensagem personalizada passada via props', () => {
    render(<AlertaErro mensagem="Erro ao salvar formulário" />);
    const mensagem = screen.getByText(/erro ao salvar formulário/i);
    expect(mensagem).toBeInTheDocument();
  });

  // Teste 2: Clicar no botão de fechar
  test('deve chamar a função onClose quando o botão "×" for clicado', () => {
    const aoFechar = vi.fn();
    render(<AlertaErro onClose={aoFechar} />);
    const botaoFechar = screen.getByRole('button', { name: /×/i });
    fireEvent.click(botaoFechar);
    expect(aoFechar).toHaveBeenCalledTimes(1);
  });
});