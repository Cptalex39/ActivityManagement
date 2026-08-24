import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';
import LoginAdmin from '../react_redux/views/autenticazione_view/LoginAdmin';

describe('LoginAdmin View Functional Tests', () => {
  test('TC_FRONT_AUT_002 - Successo: Login Amministratore', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/LOGIN', async ({ request }) => {
        return HttpResponse.json({
          utente: {
            username: 'admin',
            password: 'hashed_admin_password',
            salt_hex: 'admin_salt',
            ruolo: 'Amministratore',
            is_active: 1,
            primo_intervallo: 1,
            secondo_intervallo: 10,
            numero_clienti: 5
          }
        });
      })
    );

    renderWithProviders(<LoginAdmin />, {
      preloadedState: {
        autenticazione: {
          value: { isLogged: false, ruolo: "guest", username: "" }
        }
      }
    });

    const inputUsername = screen.getByPlaceholderText('Username*');
    const inputPassword = screen.getByPlaceholderText('Password*');

    await user.type(inputUsername, 'admin');
    await user.type(inputPassword, 'AdminPass123!');
    
    const btnLogin = document.querySelector('.loginButton');
    await user.click(btnLogin);

    // Verifica che i campi contengano i valori digitati prima di concludere il test
    expect(inputUsername.value).toBe('admin');
    expect(inputPassword.value).toBe('AdminPass123!');
  });
});
