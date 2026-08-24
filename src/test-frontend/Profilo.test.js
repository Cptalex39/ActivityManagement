import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import { renderWithProviders } from '../test-utils';
import Profilo from '../react_redux/views/autenticazione_view/Profilo';

describe('Profilo View Functional Tests', () => {
  beforeEach(() => {
    window.alert = jest.fn();
  });

  test('TC_FRONT_AUT_003 - Successo: Modifica Profilo', async () => {
    const user = userEvent.setup();

    const preloadedState = {
      autenticazione: {
        value: {
          isLogged: true,
          username: 'mario',
          ruolo: 'cliente',
          primo_intervallo: "",
          secondo_intervallo: "",
          numero_clienti: 0
        }
      },
      stile: {
        value: { vistaForm: 'form' }
      }
    };

    server.use(
      http.post('/OTTIENI_PASSWORD_UTENTE', () => {
        return HttpResponse.json({
          result: [{ password: 'hashed_password', salt_hex: 'some_salt' }]
        });
      }),
      http.post('/MODIFICA_PROFILO_UTENTE', () => {
        return HttpResponse.json({ ok: true });
      })
    );

    renderWithProviders(<Profilo />, { preloadedState });

    const inputPasswordAttuale = screen.getByPlaceholderText("Password attuale*");
    const inputNuovoUsername = screen.getByPlaceholderText("Nuovo username*");

    await user.type(inputPasswordAttuale, 'Password123!');
    await user.clear(inputNuovoUsername);
    await user.type(inputNuovoUsername, 'mario_nuovo');
    
    const btnModifica = document.querySelector('.profiloButton');
    await user.click(btnModifica);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.any(String));
    });
  });
});
