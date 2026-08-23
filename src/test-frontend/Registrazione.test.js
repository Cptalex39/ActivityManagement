import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import RegistrazioneCliente from '../react_redux/views/cliente_view/RegistrazioneCliente';

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
    const user = userEvent.setup();
    renderWithProviders(<RegistrazioneCliente />);

    // Inserimento dati
    // NOTA: Poiché i campi non hanno label associate, uso getByPlaceholderText. 
    // Se desideri usare getByRole, aggiungi l'attributo aria-label o data-testid nel componente React.
    await user.type(screen.getByPlaceholderText(/Nome/i), 'Mario');
    await user.type(screen.getByPlaceholderText(/Cognome/i), 'Rossi');
    await user.type(screen.getByPlaceholderText(/Username/i), 'mario.rossi');
    await user.type(screen.getByPlaceholderText(/Email/i), 'mario@example.com');
    await user.type(screen.getByPlaceholderText(/Password/i), 'Password123!');
    await user.type(screen.getByPlaceholderText(/Conferma Password/i), 'Password123!');
    await user.type(screen.getByPlaceholderText(/Contatto/i), '3331234567');

    // Clic sul pulsante di registrazione
    // Il pulsante contiene un h2 "Registrati", cerchiamo il pulsante per ruolo
    const submitBtn = screen.getByRole('button', { name: /Registrati/i });
    await user.click(submitBtn);

    // Verifica che l'alert di successo sia stato chiamato
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('Registrazione completata con successo'));
    
    // Verifica il redirect alla pagina di login
    expect(mockedUsedNavigate).toHaveBeenCalledWith('/login');
  });

  test('Errore: Registrazione con campi obbligatori vuoti', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegistrazioneCliente />);

    const submitBtn = screen.getByRole('button', { name: /Registrati/i });
    await user.click(submitBtn);

    // Verifica che non avvenga il redirect e che non appaia l'alert di successo
    expect(mockedUsedNavigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
    
    // Verifica la presenza di almeno un messaggio di errore (es. Nome)
    // NOTA: Se i messaggi di errore non sono catturabili, inserire data-testid="errore-nome" nel componente React.
    const erroreNome = screen.getByText(/Nome/i); 
    expect(erroreNome).toBeInTheDocument();
  });
});
