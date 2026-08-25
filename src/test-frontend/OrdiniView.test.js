import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Ordini from '../react_redux/views/ordine_view/Ordini';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const preloadedState = {
  autenticazione: {
    value: { 
      id_utente: 1, 
      ruolo: 'cliente', 
      isLogged: true 
    },
  },
  ordine: {
    value: { ordini: [] },
  },
};

describe('Test Funzionali: OrdiniView', () => {
  
  test('TC_Ordini_001: Visualizzazione Storico Ordini - Caso di Successo (Happy Path)', async () => {
    const mockOrdini = [
      {
        codice: "2023-10-27_10:00:00:123",
        nome_cliente: "Mario",
        cognome_cliente: "Rossi",
        data_creazione: new Date().toISOString(),
        totale: 50.00,
        metodo_pagamento: "Struttura",
        is_pagato: 0,
        data_prenotazione: "2023-10-28",
        ora_prenotazione: "10:00",
        items: JSON.stringify([
          { id: 1, nome: "Servizio Test", prezzo: 50.00, quantita: 1, tipo: "Servizio", descrizione: "Desc", note: "Note" }
        ])
      }
    ];

    server.use(
      http.post('/OTTIENI_ORDINI_ULTIME_48_ORE', async () => {
        return HttpResponse.json({ items: mockOrdini });
      })
    );

    renderWithProviders(<Ordini />, { preloadedState });

    // Clicca sul bottone per caricare gli ordini delle ultime 48 ore
    const btn48Ore = screen.getByText('Ordini ultime 48 ore');
    fireEvent.click(btn48Ore);

    await waitFor(() => {
      expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
      expect(screen.getByText(/Totale: € 50.00/i)).toBeInTheDocument();
      expect(screen.getByText('Servizio Test')).toBeInTheDocument();
    });
  });

  test('TC_Ordini_002: Storico Ordini Vuoto - Caso Alternativo (Sad Path)', async () => {
    server.use(
      http.post('/OTTIENI_ORDINI_ULTIME_48_ORE', async () => {
        return HttpResponse.json({ items: [] });
      })
    );

    renderWithProviders(<Ordini />, { preloadedState });

    const btn48Ore = screen.getByText('Ordini ultime 48 ore');
    fireEvent.click(btn48Ore);

    await waitFor(() => {
      expect(screen.getByText('Nessun ordine trovato.')).toBeInTheDocument();
    });
  });
});
