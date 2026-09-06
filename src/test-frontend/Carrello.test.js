import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import CarrelloView from '../react_redux/views/ordine_view/CarrelloView';

// ============================================================
// STRATEGIA A - STORE REALE: nessun mock di CarrelloActions.
// Le azioni sono dispatch puri verso Redux: si testa il flusso
// completo view -> dispatch -> reducer -> store -> re-render.
// ============================================================

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const itemBase = { id: 101, nome: 'Taglio Capelli', prezzo: 25.00, quantita: 2, tipo: 'Servizio' };
const conItem = (qta = 2) => ({ carrello: { value: { items: [{ ...itemBase, quantita: qta }] } } });
const vuoto = { carrello: { value: { items: [] } } };

const boxItem = () => screen.getByText('Taglio Capelli').closest('div[style*="padding: 30px"]');
const icone = () => boxItem().querySelectorAll('svg');

describe('CarrelloView - Test Funzionali (store reale)', () => {
  const user = userEvent.setup();

  beforeEach(() => mockNavigate.mockClear());

  test('TC_CARRELLO_001 - Visualizzazione carrello con articoli', () => {
    renderWithProviders(<CarrelloView />, { preloadedState: conItem() });

    expect(screen.getByText(/CARRELLO/i)).toBeInTheDocument();
    expect(screen.getByText('Taglio Capelli')).toBeInTheDocument();
    expect(screen.getAllByText(/€\s*50\.00/).length).toBe(2);
    expect(screen.getByRole('button', { name: /vai al checkout/i })).toBeInTheDocument();
  });

  test('TC_CARRELLO_002 - Carrello vuoto', () => {
    renderWithProviders(<CarrelloView />, { preloadedState: vuoto });

    expect(screen.getByText(/il carrello è vuoto/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /vai al checkout/i })).not.toBeInTheDocument();
  });

  test('TC_CARRELLO_003 - Incremento quantità: quantità e totale si aggiornano', async () => {
    renderWithProviders(<CarrelloView />, { preloadedState: conItem() });

    expect(icone().length).toBe(3);
    await user.click(icone()[1]); // "+"

    await waitFor(() => {
      expect(screen.getAllByText('3').length).toBeGreaterThanOrEqual(1); // Qtà 2 -> 3
      expect(screen.getAllByText(/€\s*75\.00/).length).toBeGreaterThanOrEqual(1); // totale aggiornato
    });
  });

  test('TC_CARRELLO_004 - Decremento quantità: quantità e totale si aggiornano', async () => {
    renderWithProviders(<CarrelloView />, { preloadedState: conItem() });

    expect(icone().length).toBe(3);
    await user.click(icone()[0]); // "-"

    await waitFor(() => {
      expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1); // Qtà 2 -> 1
      expect(screen.getAllByText(/€\s*25\.00/).length).toBeGreaterThanOrEqual(1); // totale aggiornato
    });
  });

  test('TC_CARRELLO_005 - Rimozione articolo: item scompare, carrello vuoto', async () => {
    renderWithProviders(<CarrelloView />, { preloadedState: conItem() });

    expect(icone().length).toBe(3);
    await user.click(icone()[2]); // cestino

    await waitFor(() => {
      expect(screen.queryByText('Taglio Capelli')).not.toBeInTheDocument();
      expect(screen.getByText(/il carrello è vuoto/i)).toBeInTheDocument();
    });
  });

  test('TC_CARRELLO_006 - Calcolo totale con più articoli', () => {
    renderWithProviders(<CarrelloView />, { preloadedState: { carrello: { value: { items: [
      { ...itemBase },
      { id: 102, nome: 'Shampoo', prezzo: 10.00, quantita: 1, tipo: 'Prodotto' },
    ] } } } });

    expect(screen.getByText(/€\s*60\.00/)).toBeInTheDocument();
    expect(screen.getAllByText(/€\s*10\.00/).length).toBe(2);
    expect(screen.getByText(/€\s*50\.00/)).toBeInTheDocument();
    expect(screen.getByText('PRODOTTO SPEDIBILE')).toBeInTheDocument();
    expect(screen.getByText('SERVIZIO IN STRUTTURA')).toBeInTheDocument();
  });

  test('TC_CARRELLO_007 - Navigazione al checkout', async () => {
    renderWithProviders(<CarrelloView />, { preloadedState: conItem(1) });

    await user.click(screen.getByRole('button', { name: /vai al checkout/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  test('TC_CARRELLO_008 - Decremento da 1: item rimosso dal carrello', async () => {
    renderWithProviders(<CarrelloView />, { preloadedState: conItem(1) });

    expect(icone().length).toBe(3);
    await user.click(icone()[0]); // "-" con quantità 1

    await waitFor(() => {
      expect(screen.queryByText('Taglio Capelli')).not.toBeInTheDocument();
      expect(screen.getByText(/il carrello è vuoto/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /vai al checkout/i })).not.toBeInTheDocument();
    });
  });
});