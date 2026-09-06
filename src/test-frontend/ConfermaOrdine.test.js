import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import ConfermaOrdine from '../react_redux/views/ordine_view/ConfermaOrdine';

// Mock di useNavigate per verificare la navigazione
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('ConfermaOrdine - Test Funzionali', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('TC_CONFERMA_001: Rendering corretto della pagina di conferma', () => {
    renderWithProviders(<ConfermaOrdine />);

    // Verifica titolo
    expect(screen.getByText('Ordine confermato! 🎉')).toBeInTheDocument();

    // Verifica messaggio
    expect(screen.getByText('Il tuo ordine è in fase di elaborazione.')).toBeInTheDocument();

    // Verifica pulsante "Torna allo Shop"
    const btnTorna = screen.getByRole('button', { name: 'Torna allo Shop' });
    expect(btnTorna).toBeInTheDocument();
  });

  test('TC_CONFERMA_002: Navigazione al click sul pulsante Torna allo Shop', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ConfermaOrdine />);

    const btnTorna = screen.getByRole('button', { name: 'Torna allo Shop' });
    await user.click(btnTorna);

    // Verifica che navigate sia stato chiamato con "/nuovo-ordine"
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/nuovo-ordine');
  });
});