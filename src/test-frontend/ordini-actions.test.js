import React, { useEffect } from 'react';
import { waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { OrdineActions } from '../react_redux/actions/OrdineActions';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// ============================================================
// STRATEGIA C - test ACTION-LEVEL: OrdineActions REALE + MSW.
// Nessun jest.mock: verifichiamo cosa viene davvero spedito al server.
// Copre il bug dei filtri data (storia TDD #2): il fail su codice
// pre-fix è l'evidenza del bug per il report.
// ============================================================

let corpoCatturato = null;

// Harness: le azioni usano useDispatch, quindi vanno invocate dentro un componente
function HarnessRicercaOrdini({ filtri }) {
  const ordineActions = new OrdineActions();
  useEffect(() => {
    ordineActions.ricercaOrdini(filtri);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

describe('OrdineActions - Test action-level (MSW)', () => {
  afterEach(() => {
    server.resetHandlers();
    corpoCatturato = null;
  });

  test('TC_ORD_011 - ricercaOrdini: le date inserite dall\'utente NON vengono sovrascritte', async () => {
    server.use(
      http.post('/VISUALIZZA_ITEMS', async ({ request }) => {
        corpoCatturato = await request.json();
        return HttpResponse.json({ items: [] });
      })
    );

    const filtri = {
      tipo_item: 'ordine',
      metodo_pagamento: 'Struttura',
      data_creazione_min: '2023-01-01',
      data_creazione_max: '2023-12-31',
      data_prenotazione_min: '',
      data_prenotazione_max: '',
    };

    renderWithProviders(<HarnessRicercaOrdini filtri={filtri} />);

    await waitFor(() => expect(corpoCatturato).not.toBeNull());

    // le date dell'utente arrivano al server...
    expect(corpoCatturato.data_creazione_min).toBe('2023-01-01');
    expect(corpoCatturato.data_creazione_max).toBe('2023-12-31');
    // ...quelle non compilate ricevono le sentinelle di default...
    expect(corpoCatturato.data_prenotazione_min).toBe('1111-11-11');
    expect(corpoCatturato.data_prenotazione_max).toBe('9999-01-01');
    // ...e il flag d'azione è corretto
    expect(corpoCatturato.azione).toBe('Ricerca');
  });
});