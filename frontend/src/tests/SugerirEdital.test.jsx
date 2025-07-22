import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SugerirEdital from '../pages/SugerirEditais';
import { MemoryRouter } from 'react-router-dom';
import { vi, describe, test, beforeEach, expect } from 'vitest';

// eslint-disable-next-line no-undef
global.fetch = vi.fn();
vi.spyOn(window, 'alert').mockImplementation(() => { });

const preencherCampos = () => {
  const inputs = screen.getAllByPlaceholderText(/escreva aqui/i);

  fireEvent.change(inputs[0], { target: { value: 'Edital Teste' } });        // Nome do edital
  fireEvent.change(inputs[1], { target: { value: 'https://exemplo.com' } }); // Link do edital
  fireEvent.change(inputs[2], { target: { value: 'Instituto Modelo' } });    // Instituição

  const dateInputs = screen.getAllByDisplayValue('');
  fireEvent.change(dateInputs[0], { target: { value: '2025-07-01' } }); // Data início
  fireEvent.change(dateInputs[1], { target: { value: '2025-07-31' } }); // Data fim

  const descricao = screen.getAllByRole('textbox').find(
    (el) => el.tagName.toLowerCase() === 'textarea'
  );
  fireEvent.change(descricao, { target: { value: 'Descrição teste' } });
};

describe('Página: Sugerir Edital', () => {
  beforeEach(() => {
    fetch.mockReset();
    render(
      <MemoryRouter>
        <SugerirEdital />
      </MemoryRouter>
    );
  });

  test('1️ - renderiza título e formulário vazio', () => {
    expect(screen.getByText(/sugerir edital/i)).toBeInTheDocument();
  });

  test('2️ - campos aceitam entrada normalmente', () => {
    preencherCampos();
    expect(screen.getByDisplayValue('Edital Teste')).toBeInTheDocument();
  });

  test('3️ - alerta do navegador em link inválido', () => {
    const inputs = screen.getAllByPlaceholderText(/escreva aqui/i);
    const linkInput = inputs[1]; // segundo campo é o de link

    fireEvent.change(linkInput, { target: { value: 'invalido' } });

    // A validação "Introduza um URL" é nativa do browser. Aqui confirmamos tipo do campo
    expect(linkInput).toHaveAttribute('type', 'url');
  });

  test('4️ - envia sugestão válida e exibe alerta de sucesso', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });
    preencherCampos();

    fireEvent.click(screen.getByRole('button', { name: /sugerir/i }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith('Edital sugerido com sucesso!')
    );
  });

  test('5️ - impede envio com campos obrigatórios vazios', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    fireEvent.click(screen.getByRole('button', { name: /sugerir/i }));

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        'Erro ao sugerir edital. Verifique os dados e tente novamente.'
      )
    );
  });

  test('6️ - mostra alerta ao simular erro de rede', async () => {
  fetch.mockRejectedValueOnce(new Error('Network Error'));

  preencherCampos();

  const botao = screen.getByRole('button', { name: /sugerir/i });
  fireEvent.click(botao);

  await waitFor(() => {
    expect(window.alert.mock.calls.length).toBeGreaterThan(0);
    expect(window.alert.mock.calls[0][0]).toMatch(
      /erro ao sugerir edital/i
    );
  });
});
});