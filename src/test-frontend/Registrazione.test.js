import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import RegistrazioneCliente from '../react_redux/views/cliente_view/RegistrazioneCliente';
import { http, HttpResponse } from 'msw'; // Aggiunto
import { server } from '../mocks/server'; // Aggiunto

// Mock di useNavigate da react-router-dom
const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}));

describe('RegistrazioneCliente Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn(); // Mock di alert per evitare errori in ambiente JSDOM
  });

  test('TC_FRONT_REG_001 - Successo: Registrazione con dati validi', async () => {
    // Configurazione MSW per intercettare la rotta di registrazione
    server.use(
      http.post('/INSERISCI_ITEM', () => {
        return HttpResponse.json({ id: 1, isOK: true }, { status: 200 });
      })
    );

    const user = userEvent.setup();
    renderWithProviders(<RegistrazioneCliente />);

    // Inserimento dati
    await user.type(screen.getByPlaceholderText("Nome"), 'Mario');
    await user.type(screen.getByPlaceholderText("Cognome"), 'Rossi');
    await user.type(screen.getByPlaceholderText("Username"), 'mario.rossi');
    await user.type(screen.getByPlaceholderText("Email"), 'mario@example.com');
    await user.type(screen.getByPlaceholderText("Password"), 'Password123!');
    await user.type(screen.getByPlaceholderText("Conferma Password"), 'Password123!');
    await user.type(screen.getByPlaceholderText("Contatto"), '3331234567');

    // Clic sul pulsante di registrazione
    const submitBtn = screen.getByRole('button', { name: "Registrati" });
    await user.click(submitBtn);

    // Verifica che l'alert di successo sia stato chiamato utilizzando waitFor per l'asincronia
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registrazione completata con successo'));
    });
    
    // Verifica il redirect alla pagina di login
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });

  test('Errore: Registrazione con campi obbligatori vuoti', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrazioneCliente />);

    const submitBtn = screen.getByRole('button', { name: "Registrati" });
    await user.click(submitBtn);

    // Verifica che non avvenga il redirect e che non appaia l'alert di successo
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    
    // Corretto selettore con stringa esatta del messaggio di errore
    const erroreNome = screen.getByText("Errore, il nome non è stato inserito."); 
    expect(erroreNome).toBeInTheDocument();
  });
});
