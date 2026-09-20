import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import ProfiloCliente from '../react_redux/views/cliente_view/ProfiloCliente';
import { ClienteActions } from '../react_redux/actions/ClienteActions';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// ✅ Mock SOLO di useNavigate (obbligatorio in ambiente JSDOM)
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('ProfiloCliente Component - Complete Native MSW Suite', () => {
  const user = userEvent.setup();

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
    stile: { value: { vistaForm: 'form' } }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsedNavigate.mockClear();
    server.resetHandlers();
    window.alert = jest.fn();

    server.use(
      http.post('/OTTIENI_PASSWORD', () => {
        return HttpResponse.json({
          result: [{ password: 'hash_mock', salt_hex: 'salt_mock' }]
        });
      }),
      http.post('/MODIFICA_PROFILO_CLIENTE', () => {
        return HttpResponse.json({ isOK: true }, { status: 200 });
      }),
      http.post('RICHIESTA_ELIMINAZIONE', () => {
        return HttpResponse.json({ isOK: true }, { status: 200 });
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  test('TC_PROFILO_CLI_001 - Successo: Modifica dati con password corretta', async () => {
    // Intercettiamo il metodo reale sulla classe per aggirare il blocco del Pepper
    const spyModifica = jest.spyOn(ClienteActions.prototype, 'modificaProfilo').mockResolvedValue({
      isPasswordCorrect: true,
      isOK: true,
      responseStatus: 200
    });

    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordValida123!');
    await user.clear(screen.getByPlaceholderText("indirizzo"));
    await user.type(screen.getByPlaceholderText("indirizzo"), 'Via Nuova 10');

    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Modifica profilo eseguita correttamente"));
    });

    spyModifica.mockRestore();
  });

  test('TC_PROFILO_CLI_002 - Errore: Password attuale errata', async () => {
    const spyModifica = jest.spyOn(ClienteActions.prototype, 'modificaProfilo').mockResolvedValue({
      isPasswordCorrect: false,
      isOK: true,
      responseStatus: 200
    });

    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordErrata123!');
    
    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(screen.getByText("La password attuale inserita non è corretta.")).toBeInTheDocument();
    });

    spyModifica.mockRestore();
  });

  test('TC_PROFILO_CLI_003 - Validazione: Email senza @', async () => {
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.clear(screen.getByPlaceholderText("Email"));
    await user.type(screen.getByPlaceholderText("Email"), 'emailSenzaAt');
    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordValida123!');

    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Sì, modifica/i })).toBeInTheDocument();
    });
  });

  test('TC_PROFILO_CLI_004 - Validazione: Contatto con lettere', async () => {
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.clear(screen.getByPlaceholderText("Contatto"));
    await user.type(screen.getByPlaceholderText("Contatto"), 'abc123');
    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordValida123!');

    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Sì, modifica/i })).toBeInTheDocument();
    });
  });

  test('TC_PROFILO_CLI_005 - Validazione: Campi obbligatori vuoti', async () => {
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.clear(screen.getByPlaceholderText("Email"));
    await user.clear(screen.getByPlaceholderText("Contatto"));
    await user.clear(screen.getByPlaceholderText("indirizzo"));
    await user.clear(screen.getByPlaceholderText("Username"));
    await user.clear(screen.getByPlaceholderText("Password attuale"));

    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Sì, modifica/i })).toBeInTheDocument();
    });
  });

  test('TC_PROFILO_CLI_006 - Validazione: Nuova password troppo corta', async () => {
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordValida123!');
    await user.type(screen.getByPlaceholderText("Nuova password"), '12345');
    await user.type(screen.getByPlaceholderText("Conferma nuova password"), '12345');

    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Sì, modifica/i })).toBeInTheDocument();
    });
  });

  test('TC_PROFILO_CLI_007 - Validazione: Password e conferma non coincidono', async () => {
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    const btnAttiva = screen.getByRole('button', { name: /Modifica Profilo/i }) || screen.getByText(/Modifica Profilo/i);
    await user.click(btnAttiva);

    await user.type(screen.getByPlaceholderText("Password attuale"), 'PasswordValida123!');
    await user.type(screen.getByPlaceholderText("Nuova password"), 'Password123!');
    await user.type(screen.getByPlaceholderText("Conferma nuova password"), 'Password456!');

    const btnConferma = screen.getByRole('button', { name: /Sì, modifica/i }) || screen.getByText(/Sì, modifica/i);
    await user.click(btnConferma);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Sì, modifica/i })).toBeInTheDocument();
    });
  });

  test('TC_PROFILO_CLI_008 - Eliminazione profilo con successo', async () => {
    const spyElimina = jest.spyOn(ClienteActions.prototype, 'richiestaEliminazioneProfilo').mockResolvedValue({
      isOK: true,
      responseStatus: 200
    });

    renderWithProviders(<ProfiloCliente />, { preloadedState });

    await user.click(screen.getByRole('button', { name: /Elimina Profilo/i }));
    const btnSiElimina = screen.queryByRole('button', { name: /Si, elimina/i }) || screen.getByText(/Si, elimina/i);
    await user.click(btnSiElimina);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining("Richiesta eliminazione profilo inviata")
      );
    });

    spyElimina.mockRestore();
  });

  test('TC_PROFILO_CLI_009 - Eliminazione profilo annullata', async () => {
    renderWithProviders(<ProfiloCliente />, { preloadedState });

    await user.click(screen.getByRole('button', { name: /Elimina Profilo/i }));
    const btnAnnulla = screen.getByRole('button', { name: /Annulla/i }) || screen.getByText(/Annulla/i);
    await user.click(btnAnnulla);

    expect(screen.getByRole('button', { name: /Elimina Profilo/i })).toBeInTheDocument();
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
  });

  test('TC_PROFILO_CLI_010 - Errore API durante eliminazione profilo', async () => {
    const spyElimina = jest.spyOn(ClienteActions.prototype, 'richiestaEliminazioneProfilo').mockResolvedValue({
      isOK: false,
      responseStatus: 500
    });

    renderWithProviders(<ProfiloCliente />, { preloadedState });

    await user.click(screen.getByRole('button', { name: /Elimina Profilo/i }));
    const btnSiElimina = screen.queryByRole('button', { name: /Si, elimina/i }) || screen.getByText(/Si, elimina/i);
    await user.click(btnSiElimina);
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Operazione fallita... Riprova più tardi.");}
    );
    spyElimina.mockRestore();}
  );
});