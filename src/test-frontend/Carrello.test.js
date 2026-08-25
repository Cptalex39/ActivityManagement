import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CarrelloView from '../react_redux/views/ordine_view/CarrelloView';

describe('Debug Preliminare CarrelloView', () => {
  test('Renderizzazione base con stato precaricato', () => {
    const preloadedState = {
      autenticazione: {
        value: {
          isLogged: true,
          ruolo: 'cliente',
          username: 'cliente_test',
        },
      },
      carrello: {
        value: {
          items: [
            {
              id: 1,
              nome: 'Servizio di Test',
              quantita: 2,
              prezzo: 25.00,
              tipo: 'Servizio',
            },
          ],
        },
      },
    };

    renderWithProviders(<CarrelloView />, { preloadedState });

    // Stampa l'URL per l'analisi della struttura DOM tramite Testing Playground
    //screen.logTestingPlaygroundURL();
    screen.debug(); 
  });
});
