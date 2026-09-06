import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import LoginAdmin from '../react_redux/views/autenticazione_view/LoginAdmin';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { encryptPassword, PEPPER_HEX } from '../utils/Sicurezza';

// ============================================================
// STRATEGIA C - azioni REALI + MSW, hash REALE (vedi Login.test.js)
// ============================================================

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@gianlucascisciolo/riutilizzoreact', () => {
  const actual = jest.requireActual('@gianlucascisciolo/riutilizzoreact');
  return {
    ...actual,
    CardLogin: () => <div data-testid="vista-card-login">CardLogin</div>,
    RowLogin: () => <div data-testid="vista-row-login">RowLogin</div>,
  };
});

const SALT = 'aabbccddeeff00112233445566778899';
const PASSWORD_ADMIN = 'AdminPass123!';
const HASH_ADMIN = encryptPassword(PASSWORD_ADMIN, SALT, PEPPER_HEX);

const utenteAdmin = (overrides = {}) => ({
  username: 'admin',
  password: HASH_ADMIN,
  salt_hex: SALT,
  ruolo: 'Amministratore',
  is_active: 1,
  id: 1,
  primo_intervallo: 1,
  secondo_intervallo: 10,
  numero_clienti: 5,
  ...overrides,
});

const preloadedState = {
  stile: { value: { vistaForm: 'form' } },
  attivita: { value: {} },
};

describe('LoginAdmin - Test Funzionali (MSW, azioni reali)', () => {
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
    const { container } = renderWithProviders(<LoginAdmin />, { preloadedState });
    const inputUsername = container.querySelector('#username_login');
    const inputPassword = container.querySelector('#password_login');
    const btnLogin = container.querySelector('.loginButton');
    await user.type(inputUsername, username);
    await user.type(inputPassword, password);
    await user.click(btnLogin);
    return { inputUsername };
  };

  test('TC_LOG_ADMIN_001 - Login amministratore con credenziali valide: navigazione alla home', async () => {
    server.use(
      http.post('/LOGIN', () => HttpResponse.json({ utente: utenteAdmin() }))
    );

    await compilaEInvia('admin', PASSWORD_ADMIN);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
    expect(window.alert).not.toHaveBeenCalled();
  });

  test('TC_LOG_ADMIN_002 - Errore HTTP 401: login bloccato, dati mantenuti', async () => {
    server.use(
      http.post('/LOGIN', () =>
        new HttpResponse(JSON.stringify({ messaggio: 'Credenziali non valide' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }))
    );

    const { inputUsername } = await compilaEInvia('admin_err', 'WrongPass1!');

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
    expect(inputUsername.value).toBe('admin_err');
  });

  test('TC_LOG_ADMIN_003 - Pulsante "Sono un cliente": navigazione a /login', async () => {
    renderWithProviders(<LoginAdmin />, { preloadedState });
    await user.click(screen.getByRole('button', { name: /sono un cliente/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('TC_LOG_ADMIN_004 - Vista card: CardLogin renderizzato', () => {
    renderWithProviders(<LoginAdmin />, {
      preloadedState: { ...preloadedState, stile: { value: { vistaForm: 'card' } } },
    });
    expect(screen.getByTestId('vista-card-login')).toBeInTheDocument();
    expect(screen.queryByTestId('vista-row-login')).not.toBeInTheDocument();
  });

  test('TC_LOG_ADMIN_005 - Vista row: RowLogin renderizzato', () => {
    renderWithProviders(<LoginAdmin />, {
      preloadedState: { ...preloadedState, stile: { value: { vistaForm: 'row' } } },
    });
    expect(screen.getByTestId('vista-row-login')).toBeInTheDocument();
    expect(screen.queryByTestId('vista-card-login')).not.toBeInTheDocument();
  });
});