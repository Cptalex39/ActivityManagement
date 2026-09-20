import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import RegistrazioneCliente from '../react_redux/views/cliente_view/RegistrazioneCliente';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// ✅ Mock SOLO di useNavigate (obbligatorio in JSDOM)
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('RegistrazioneCliente Component - Complete MSW Suite', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsedNavigate.mockClear();
    server.resetHandlers();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  // ============================================================
  // TC_REGISTRAZIONE_001 - Successo: Registrazione (Happy Path)
  // ============================================================
  test('TC_REGISTRAZIONE_001 - Successo: Registrazione con dati validi', async () => {
    server.use(
      http.post('/INSERISCI_ITEM', () => {
        return HttpResponse.json({ id: 1, isOK: true }, { status: 200 });
      })
    );

    renderWithProviders(<RegistrazioneCliente />);

    await user.type(screen.getByPlaceholderText("Nome"), 'Mario');
    await user.type(screen.getByPlaceholderText("Cognome"), 'Rossi');
    await user.type(screen.getByPlaceholderText("Username"), 'mario');
    await user.type(screen.getByPlaceholderText("Email"), 'mario@example.com');
    await user.type(screen.getByPlaceholderText("Password"), 'Password123!');
    await user.type(screen.getByPlaceholderText("Conferma Password"), 'Password123!');
    await user.type(screen.getByPlaceholderText("Contatto"), '3331234567');

    const submitBtn = screen.getByRole('button', { name: "Registrati" });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registrazione completata con successo'));
    });
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });

  // ============================================================
  // TC_REGISTRAZIONE_002 - Fallimento: Campi Obbligatori Vuoti
  // ============================================================
  test('TC_REGISTRAZIONE_002 - Fallimento: Campi obbligatori vuoti', async () => {
    renderWithProviders(<RegistrazioneCliente />);

    const submitBtn = screen.getByRole('button', { name: "Registrati" });
    await user.click(submitBtn);
    expect(screen.getByText('Errore, il nome non è stato inserito.')).toBeInTheDocument();

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  // ============================================================
  // TC_REGISTRAZIONE_003 - Edge Case: Email senza @ (Validazione)
  // ============================================================
  test('TC_REGISTRAZIONE_003 - Validazione client: Email senza @', async () => {
    renderWithProviders(<RegistrazioneCliente />);

    await user.type(screen.getByPlaceholderText('Nome'), 'Mario');
    await user.type(screen.getByPlaceholderText('Cognome'), 'Rossi');
    await user.type(screen.getByPlaceholderText('Username'), 'mario.rossi');
    await user.type(screen.getByPlaceholderText('Email'), 'marioexample.com'); // ❌ Senza @
    await user.type(screen.getByPlaceholderText('Password'), 'Password123!');
    await user.type(screen.getByPlaceholderText('Conferma Password'), 'Password123!');
    await user.type(screen.getByPlaceholderText('Contatto'), '3331234567');

    const submitBtn = screen.getByRole('button', { name: 'Registrati' });
    await user.click(submitBtn);
    expect(screen.getByText('Errore, l\'email non è valida.')).toBeInTheDocument();

    // Si ferma alla validazione interna prima di toccare la rete
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  // ============================================================
  // TC_REGISTRAZIONE_004 - Edge Case: Password troppo corta (< 6 caratteri)
  // ============================================================
  test('TC_REGISTRAZIONE_004 - Validazione client: Password troppo corta', async () => {
    renderWithProviders(<RegistrazioneCliente />);

    await user.type(screen.getByPlaceholderText('Nome'), 'Mario');
    await user.type(screen.getByPlaceholderText('Cognome'), 'Rossi');
    await user.type(screen.getByPlaceholderText('Username'), 'mario.rossi');
    await user.type(screen.getByPlaceholderText('Email'), 'mario@example.com');
    await user.type(screen.getByPlaceholderText('Password'), '12345'); // ❌ Troppo corta
    await user.type(screen.getByPlaceholderText('Conferma Password'), '12345');
    await user.type(screen.getByPlaceholderText('Contatto'), '3331234567');

    const submitBtn = screen.getByRole('button', { name: 'Registrati' });
    await user.click(submitBtn);
    expect(screen.getByText(/Password non valida/)).toBeInTheDocument();

    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  // ============================================================
  // TC_REGISTRAZIONE_005 - Edge Case: Username già esistente nel server
  // ============================================================
  test('TC_REGISTRAZIONE_005 - Mock server: Username già esistente', async () => {
    // MSW simula il rifiuto del database per collisione username
    server.use(
      http.post('/INSERISCI_ITEM', () => {
        return HttpResponse.json({ isOK: false }, { status: 400 });
      })
    );

    renderWithProviders(<RegistrazioneCliente />);

    await user.type(screen.getByPlaceholderText('Nome'), 'Mario');
    await user.type(screen.getByPlaceholderText('Cognome'), 'Rossi');
    await user.type(screen.getByPlaceholderText('Username'), 'mario_es');
    await user.type(screen.getByPlaceholderText('Email'), 'mario@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'Password123!');
    await user.type(screen.getByPlaceholderText('Conferma Password'), 'Password123!');
    await user.type(screen.getByPlaceholderText('Contatto'), '3331234567');

    const submitBtn = screen.getByRole('button', { name: 'Registrati' });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringMatching(/Errore durante la registrazione/i)
      );
    });
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  // ============================================================
  // TC_REGISTRAZIONE_006 - Branch Coverage: Toggle Visibilità Password
  // ============================================================
  test('TC_REGISTRAZIONE_006 - Toggle visibilità pulsanti password', async () => {
    renderWithProviders(<RegistrazioneCliente />);

    const inputPassword = screen.getByPlaceholderText('Password');
    expect(inputPassword.type).toBe('password');

    const btnMostra = screen.getAllByRole('button', { name: /Mostra/i });
    await user.click(btnMostra[0]);

    expect(inputPassword.type).toBe('text');
  });
});
