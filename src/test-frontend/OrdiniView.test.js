import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Ordini from '../react_redux/views/ordine_view/Ordini';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const mockOrdine = {
  codice: "ORD123",
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
};

const preloadedState = {
  autenticazione: {
    value: { 
      id_utente: 1, 
      ruolo: 'Amministratore', // Impostato a Amministratore per coprire i bottoni Conferma/Elimina
      isLogged: true 
    },
  },
  ordine: {
    value: { ordini: [mockOrdine] },
  },
};

describe('Test Funzionali: OrdiniView - Massima Copertura', () => {
  
  beforeEach(() => {
    server.use(
      http.post('/OTTIENI_ORDINI_ULTIME_48_ORE', async () => {
        return HttpResponse.json({ items: [mockOrdine] });
      }),
      http.post('/OTTIENI_PAGAMENTI_DA_CONFERMARE', async () => {
        return HttpResponse.json({ items: [mockOrdine] });
      }),
      http.post('/VISUALIZZA_ITEMS', async () => {
        return HttpResponse.json({ items: [mockOrdine] });
      }),
      http.post('/CONFERMA_PAGAMENTO', async () => {
        return HttpResponse.json({ isOK: true });
      }),
      http.post('/ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE', async () => {
        return HttpResponse.json({ isOK: true });
      })
    );
  });

  test('TC_Ordini_001: Copertura Flussi Operativi e Filtri', async () => {
    renderWithProviders(<Ordini />, { preloadedState });

    // 1. Copertura selezionaBottone e renderOrdiniTag (Ultime 48 ore)
    const btn48Ore = screen.getByText('Ordini ultime 48 ore');
    fireEvent.click(btn48Ore);
    await waitFor(() => expect(screen.getByText(/Mario/i)).toBeInTheDocument());

    // 2. Copertura righe 360 e 366 (Bottoni Conferma ed Elimina - visibili solo ad Admin)
    const btnConferma = screen.getByText('Conferma');
    fireEvent.click(btnConferma);
    window.confirm = jest.fn(() => true); // Simula conferma alert
    fireEvent.click(btnConferma);

    const btnElimina = screen.getByText('Elimina');
    fireEvent.click(btnElimina);
    fireEvent.click(btnElimina);

    // 3. Copertura Pagamenti da Confermare
    const btnPagamenti = screen.getByText('Pagamenti da confermare');
    fireEvent.click(btnPagamenti);
    await waitFor(() => expect(screen.getByText('PAGAMENTI DA CONFERMARE')).toBeInTheDocument());
  });

  test('TC_Ordini_002: Copertura Ricerca e Form', async () => {
    renderWithProviders(<Ordini />, { preloadedState });

    // Attiva sezione ricerca
    const btnRicerca = screen.getByText('Ricerca ordini / Ottieni file');
    fireEvent.click(btnRicerca);

    // Copertura filtriRicerca e eseguiRicerca
    const selectMetodo = screen.getByRole('combobox');
    fireEvent.change(selectMetodo, { target: { value: 'Struttura' } });

    const btnEsegui = screen.getByText('Esegui ricerca');
    fireEvent.click(btnEsegui);

    await waitFor(() => {
      expect(screen.getByText('RICERCA ORDINI / OTTIENI FILE')).toBeInTheDocument();
    });
  });

  test('TC_Ordini_003: Caso Storico Vuoto', async () => {
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
