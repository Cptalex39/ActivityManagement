import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import ProfiloCliente from '../react_redux/views/cliente_view/ProfiloCliente';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// Mock di useNavigate da react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

// Mock di passwordIsCorrect per bypassare il calcolo crittografico nei test UI
jest.mock('../../utils/Sicurezza', () => ({
  ...jest.requireActual('../../utils/Sicurezza'),
  passwordIsCorrect: jest.fn(),
}));

import { passwordIsCorrect } from '../../utils/Sicurezza';

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
    // Forziamo la validazione della password a true per questo test
    passwordIsCorrect.mockReturnValue(true);

    server.use(
      http.post('/OTTIENI_PASSWORD', () => {
        return HttpResponse.json({ 
          result: [{ 
            password: 'hash_valido_mock', 
            salt_hex: 'salt_valido_mock' 
          }] 
        }, { status: 200 });
      }),
      http.post('/MODIFICA_PROFILO_CLIENTE', () => {
        return HttpResponse.json({ isOK: true }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    // Inserimento password attuale (senza spazi per superare eventuali regex frontend) e modifica indirizzo
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
    // Forziamo la validazione della password a false per questo test
    passwordIsCorrect.mockReturnValue(false);

    server.use(
      http.post('/OTTIENI_PASSWORD', () => {
        return HttpResponse.json({ 
          result: [{ 
            password: 'hash_valido_mock', 
            salt_hex: 'salt_valido_mock' 
          }] 
        }, { status: 200 });
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
