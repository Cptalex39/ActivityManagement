import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import CatalogoServiziView from '../react_redux/views/ordine_view/CatalogoServiziView';
import { ServizioActions } from '../react_redux/actions/ServizioActions';
import { CarrelloActions } from '../react_redux/actions/CarrelloActions';

// Definizione della funzione di mock riutilizzabile
const mockRicercaServizi = jest.fn();

// Mock delle classi Actions per isolare la vista
jest.mock('../react_redux/actions/ServizioActions', () => ({
  ServizioActions: jest.fn().mockImplementation(() => ({
    ricercaServizi: mockRicercaServizi
  }))
}));

jest.mock('../react_redux/actions/CarrelloActions', () => ({
  CarrelloActions: jest.fn().mockImplementation(() => ({
    aggiungiAlCarrello: jest.fn(),
    decrementaQuantita: jest.fn()
  }))
}));

describe('Test Funzionali: CatalogoServiziView', () => {
  const preloadedState = {
    autenticazione: {
      value: { id_utente: 1, isLogged: true },
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

  test('TC_CatalogoServiziView_001: Ricerca Catalogo - Caso di Successo (Happy Path)', async () => {
    const mockServizi = [{ 
      id: 1, 
      nome: "Servizio Test", 
      prezzo: 10.00, 
      descrizione: "Prova", 
      tipo: "Servizio", 
      note: "Nota" 
    }];
    
    // Configurazione del mock per il successo
    mockRicercaServizi.mockResolvedValue({
      isOK: true,
      servizi: mockServizi,
    });

    renderWithProviders(<CatalogoServiziView />, { preloadedState });

    // Simulazione del clic sull'icona con classe .ricercaItemsButton
    const searchButton = document.querySelector('.ricercaItemsButton');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Servizio Test')).toBeInTheDocument();
      expect(screen.getByText('Prezzo: €10')).toBeInTheDocument();
    });
  });

  test('TC_CatalogoServiziView_002: Ricerca Catalogo - Elenco Vuoto (Sad Path)', async () => {
    // Configurazione del mock per nessun risultato
    mockRicercaServizi.mockResolvedValue({
      isOK: false,
      servizi: [],
    });

    renderWithProviders(<CatalogoServiziView />, { preloadedState });

    const searchButton = document.querySelector('.ricercaItemsButton');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.queryByText('Servizio Test')).not.toBeInTheDocument();
    });
  });
});
