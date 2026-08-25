import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CarrelloView from '../react_redux/views/ordine_view/CarrelloView';

// Mock della classe CarrelloActions per isolare la vista dalla logica di dispatch
jest.mock('../react_redux/actions/CarrelloActions', () => {
  return {
    CarrelloActions: jest.fn().mockImplementation(() => {
      return {
        aggiungiAlCarrello: jest.fn(),
        decrementaQuantita: jest.fn(),
        rimuoviDalCarrello: jest.fn()
      };
    })
  };
});

describe('TC_FRONT_ORD_001: Visualizzazione Carrello - Caso di Successo', () => {
  test('Deve renderizzare correttamente gli articoli e il totale calcolato', () => {
    const preloadedState = {
      carrello: {
        value: {
          items: [
            { 
              id: 101, 
              nome: "Taglio Capelli", 
              prezzo: 25.00, 
              quantita: 2, 
              tipo: "Servizio" 
            }
          ]
        }
      }
    };

    renderWithProviders(<CarrelloView />, { preloadedState });

    // 1. Verifica che il titolo 'CARRELLO' sia visibile
    expect(screen.getByText(/CARRELLO/i)).toBeInTheDocument();

    // 2. Verifica che il nome dell'articolo 'Taglio Capelli' sia a schermo
    expect(screen.getByText('Taglio Capelli')).toBeInTheDocument();

    // 3. Verifica che il totale calcolato (25.00 * 2 = 50.00) appaia correttamente
    // Il componente usa .toFixed(2), quindi cerchiamo la stringa esatta
    expect(screen.getByText('€50.00')).toBeInTheDocument();

    // 4. Verifica la presenza del pulsante 'VAI AL CHECKOUT'
    // Usiamo una regex case-insensitive per sicurezza dato che il CSS applica textTransform: "uppercase"
    expect(screen.getByRole('button', { name: /vai al checkout/i })).toBeInTheDocument();
  });
});
