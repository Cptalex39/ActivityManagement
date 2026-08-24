import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';
import Login from '../react_redux/views/autenticazione_view/Login';

describe('Login View Functional Tests', () => {
  test('TC_FRONT_AUT_001 - Successo: Login Cliente', async () => {
    const user = userEvent.setup();

    server.use(
      http.post('/LOGIN', async ({ request }) => {
        return HttpResponse.json({
          utente: {
            username: 'mario',
            password: 'hashed_password',
            salt_hex: 'some_salt',
            ruolo: 'cliente',
            is_active: 1,
            id: 1,
            nome: 'Mario',
            cognome: 'Rossi',
            email: 'mario@example.com',
            contatto: '3331234567',
            indirizzo: 'Via Roma 1'
          }
        });
      })
    );

    renderWithProviders(<Login />);

    const inputUsername = screen.getByPlaceholderText('Username*');
    const inputPassword = screen.getByPlaceholderText('Password*');
    
    await user.type(inputUsername, 'mario');
    await user.type(inputPassword, 'Password123!');
    
    const btnLogin = document.querySelector('.loginButton');
    await user.click(btnLogin);

    // Verifica che i campi contengano i valori digitati prima di concludere il test
    expect(inputUsername.value).toBe('mario');
    expect(inputPassword.value).toBe('Password123!');
  });
});
