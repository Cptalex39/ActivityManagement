import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Login from '../react_redux/views/autenticazione_view/Login';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { encryptPassword, PEPPER_HEX } from '../utils/Sicurezza';

// ============================================================
// STRATEGIA C - azioni REALI + MSW.
// L'hash è calcolato con encryptPassword REALE: il confronto
// passwordIsCorrect nel flusso di login passa davvero (nei test
// precedenti hash fittizi => confronto sempre fallito, quindi
// gli "happy path" non testavano mai il login).
// Rotte e messaggi verificati su AutenticazioneOperazioni.handleLogin:
// successo => navigate("/"); credenziali errate => nessuna navigazione.
// ============================================================

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// CardLogin/RowLogin mockate per VERIFICARE quale vista viene scelta;
// FormLogin e gli altri export restano REALI (requireActual)
jest.mock('@gianlucascisciolo/riutilizzoreact', () => {
  const actual = jest.requireActual('@gianlucascisciolo/riutilizzoreact');
  return {
    ...actual,
    CardLogin: () => <div data-testid="vista-card-login">CardLogin</div>,
    RowLogin: () => <div data-testid="vista-row-login">RowLogin</div>,
  };
});

// Credenziali conformi a controlloLogin: username <= 10, password 8+ con
// maiuscola, minuscola, numero e speciale
const SALT = 'aabbccddeeff00112233445566778899';
const PASSWORD_VALIDA = 'Password123!';
const HASH_VALIDO = encryptPassword(PASSWORD_VALIDA, SALT, PEPPER_HEX);

const utenteCliente = (overrides = {}) => ({
  username: 'mario',
  password: HASH_VALIDO,
  salt_hex: SALT,
  ruolo: 'cliente',
  is_active: 1,
  id: 1,
  nome: 'Mario',
  cognome: 'Rossi',
  email: 'mario@example.com',
  contatto: '3331234567',
  indirizzo: 'Via Roma 1',
  ...overrides,
});

const preloadedState = {
  stile: { value: { vistaForm: 'form' } },
  attivita: { value: {} },
};

describe('Login - Test Funzionali (MSW, azioni reali)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  const compilaEInvia = async (username, password) => {
    const { container } = renderWithProviders(<Login />, { preloadedState });
    const inputUsername = container.querySelector('#username_login');
    const inputPassword = container.querySelector('#password_login');
    const btnLogin = container.querySelector('.loginButton');
    // Nessuna guard: se un selettore non trova l'elemento, il test DEVE fallire
    await user.type(inputUsername, username);
    await user.type(inputPassword, password);
    await user.click(btnLogin);
    return { inputUsername, inputPassword };
  };

  test('TC_LOG_001 - Login cliente con credenziali valide: navigazione alla home', async () => {
    server.use(
      http.post('/LOGIN', () => HttpResponse.json({ utente: utenteCliente() }))
    );

    await compilaEInvia('mario', PASSWORD_VALIDA);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('TC_LOG_002 - Errore HTTP 401: login bloccato, dati mantenuti', async () => {
    server.use(
      http.post('/LOGIN', () =>
        new HttpResponse(JSON.stringify({ messaggio: 'Credenziali non valide' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }))
    );

    const { inputUsername } = await compilaEInvia('sbagliato', 'WrongPass1!');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    expect(inputUsername.value).toBe('sbagliato');
  });

  test('TC_LOG_003 - Username inesistente (utente null): login bloccato', async () => {
    server.use(
      http.post('/LOGIN', () => HttpResponse.json({ utente: null }))
    );

    const { inputUsername } = await compilaEInvia('nonesiste', PASSWORD_VALIDA);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    expect(inputUsername.value).toBe('nonesiste');
  });

  test('TC_LOG_004 - Password errata (hash non corrispondente): login bloccato', async () => {
    // il server restituisce l'hash di UN'ALTRA password: passwordIsCorrect fallisce
    const ALTRO_SALT = 'ffffffffeeeeeeee0011223344556677';
    server.use(
      http.post('/LOGIN', () => HttpResponse.json({
        utente: utenteCliente({
          password: encryptPassword('AltraPassword1!', ALTRO_SALT, PEPPER_HEX),
          salt_hex: ALTRO_SALT,
        }),
      }))
    );

    const { inputUsername } = await compilaEInvia('mario', 'PasswordSbagliata1!');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    expect(inputUsername.value).toBe('mario');
  });

  test('TC_LOG_008 - Account non attivo: login bloccato, nessuna navigazione', async () => {
    server.use(
      http.post('/LOGIN', () => HttpResponse.json({ utente: utenteCliente({ is_active: 0 }) }))
    );

    await compilaEInvia('mario', PASSWORD_VALIDA);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test('TC_LOG_007 - Pulsante "Sono un amministratore": navigazione a /login-admin', async () => {
    renderWithProviders(<Login />, { preloadedState });
    await user.click(screen.getByRole('button', { name: /sono un amministratore/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login-admin');
  });

  test('TC_LOG_005 - Vista card: CardLogin renderizzato', () => {
    renderWithProviders(<Login />, {
      preloadedState: { ...preloadedState, stile: { value: { vistaForm: 'card' } } },
    });
    expect(screen.getByTestId('vista-card-login')).toBeInTheDocument();
    expect(screen.queryByTestId('vista-row-login')).not.toBeInTheDocument();
  });

  test('TC_LOG_006 - Vista row: RowLogin renderizzato', () => {
    renderWithProviders(<Login />, {
      preloadedState: { ...preloadedState, stile: { value: { vistaForm: 'row' } } },
    });
    expect(screen.getByTestId('vista-row-login')).toBeInTheDocument();
    expect(screen.queryByTestId('vista-card-login')).not.toBeInTheDocument();
  });
});