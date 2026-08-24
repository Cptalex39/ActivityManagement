import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import ProfiloCliente from '../react_redux/views/cliente_view/ProfiloCliente';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('ProfiloCliente Component', () => {
  const mockUser = {
    id_utente: 1,
    username: 'mario',
    nome: 'Mario',
    cognome: 'Rossi',
    email: 'mario@example.com',
    contatto: '3331234567',
    indirizzo: 'Via Roma 1',
  };

  const preloadedState = {
    autenticazione: {
      value: {
        ...mockUser,
        isLogged: true,
        ruolo: 'cliente',
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('TC_FRONT_PROF_001 - Successo: Modifica dati con password corretta', async () => {
    server.use(
      http.post('/OTTIENI_PASSWORD', () => {
        return HttpResponse.json({ 
          result: [{ password: 'PasswordValida123!', salt_hex: '' }] 
        }, { status: 200 });
      }),
      http.post('/MODIFICA_PROFILO_CLIENTE', () => {
        return HttpResponse.json({ isOK: true }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    // Inserimento password attuale e modifica indirizzo
    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordValida123!');
    await user.clear(screen.getByPlaceholderText("indirizzo"));
    await user.type(screen.getByPlaceholderText("indirizzo"), 'Via Nuova 10');

    // Processo di conferma modifica
    await user.click(screen.getByText("Modifica Profilo"));
    await user.click(screen.getByText("Sì, modifica"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Modifica profilo eseguita correttamente.");
    });
  });

  test('TC_FRONT_PROF_002 - Errore: Password attuale errata', async () => {
    server.use(
      http.post('/OTTIENI_PASSWORD', () => {
        // Simuliamo che l'utente non esista o la password non corrisponda
        return HttpResponse.json({ result: [] }, { status: 404 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordErrata123!');
    await user.click(screen.getByText("Modifica Profilo"));
    await user.click(screen.getByText("Sì, modifica"));

    await waitFor(() => {
      expect(screen.getByText("La password attuale inserita non è corretta.")).toBeInTheDocument();
    });
  });
});
