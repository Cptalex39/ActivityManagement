import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CatalogoServiziView from '../react_redux/views/ordine_view/CatalogoServiziView';
import { server } from '../mocks/server';
import { rest } from 'msw';

// Mock delle Actions per verificare le chiamate
jest.mock('../react_redux/actions/CarrelloActions', () => {
  return {
    CarrelloActions: jest.fn().mockImplementation(() => ({
      aggiungiAlCarrello: jest.fn(),
      decrementaQuantita: jest.fn(),
      rimuoviDalCarrello: jest.fn(),
    })),
  };
});

jest.mock('../react_redux/actions/ServizioActions', () => {
  return {
    ServizioActions: jest.fn().mockImplementation(() => ({
      ricercaServizi: jest.fn(),
    })),
  };
});

describe('Test di Flusso: CatalogoServiziView', () => {
  const preloadedState = {
    autenticazione: {
      value: { id_utente: 1 },
    },
    stile: {
      value: { vistaForm: 'form' },
    },
    servizio: {
      value: { servizi: [] },
    },
    carrello: {
      value: { items: [] },
    },
  };

  test('TC_FRONT_CAT_001: Rendering iniziale e ricerca servizi - Caso di Successo', async () => {
    const mockServizi = [
      { 
        id: 1, 
        nome: 'Taglio Capelli', 
        prezzo: 20.00, 
        tipo: 'Servizio', 
        descrizione: 'Taglio classico', 
        note: 'Nessuna' 
      },
      { 
        id: 2, 
        nome: 'Shampoo', 
        prezzo: 10.00, 
        tipo: 'Prodotto', 
        descrizione: 'Shampoo biologico', 
        note: 'Confezione 250ml' 
      },
    ];

    // Mock dell'implementazione di ricercaServizi per questo test
    const { ServizioActions } = require('../react_redux/actions/ServizioActions');
    ServizioActions.prototype.ricercaServizi.mockResolvedValue({
      isOK: true,
      servizi: mockServizi,
    });

    renderWithProviders(<CatalogoServiziView />, { preloadedState });

    // Simuliamo il click sul pulsante di ricerca (il componente usa RicercaItemsTag)
    const searchButton = screen.getByRole('button', { name: /ricerca/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Taglio Capelli')).toBeInTheDocument();
      expect(screen.getByText('Shampoo')).toBeInTheDocument();
    });

    expect(screen.getByText('Servizio in struttura')).toBeInTheDocument();
    expect(screen.getByText('Prodotto spedibile')).toBeInTheDocument();
  });

  test('TC_FRONT_CAT_002: Interazione con i pulsanti di quantità (Aggiunta al Carrello)', async () => {
    const mockServizi = [
      { 
        id: 1, 
        nome: 'Taglio Capelli', 
        prezzo: 20.00, 
        tipo: 'Servizio', 
        descrizione: 'Taglio classico', 
        note: 'Nessuna' 
      },
    ];

    const { ServizioActions } = require('../react_redux/actions/ServizioActions');
    ServizioActions.prototype.ricercaServizi.mockResolvedValue({
      isOK: true,
      servizi: mockServizi,
    });

    renderWithProviders(<CatalogoServiziView />, { preloadedState });

    const searchButton = screen.getByRole('button', { name: /ricerca/i });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Taglio Capelli')).toBeInTheDocument();
    });

    // Trova l'icona Plus (FaPlusCircle) - in questo caso cerchiamo l'elemento che triggera l'azione
    const plusButtons = screen.getAllByRole('img', { hidden: true }); 
    // Nota: react-icons a volte non hanno role 'button', usiamo l'indice o un selettore più specifico se necessario
    // In un ambiente reale useremmo data-testid
    
    // Simuliamo l'incremento
    const plusIcon = plusButtons.find(btn => btn.getAttribute('class').includes('fa-plus-circle'));
    if (plusIcon) {
      fireEvent.click(plusIcon);
    }

    const { CarrelloActions } = require('../react_redux/actions/CarrelloActions');
    const carrelloInstance = CarrelloActions.mock.results[0].value;
    
    expect(carrelloInstance.aggiungiAlCarrello).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1 }), 
      1
    );
  });
});
