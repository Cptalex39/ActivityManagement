import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Clienti from '../react_redux/views/cliente_view/Clienti';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// ============================================================
// STRATEGIA C - actions REALI + MSW. Nessun jest.mock.
// I test 006 e 009 coprono il ramo else introdotto con il fix
// (fallimenti silenziosi in elimina/riattiva): storia TDD #5.
// ============================================================

const clienteEliminabile = (id, username, nome, cognome) => ({
  id, username, nome, cognome,
  email: `${username}@example.com`,
  contatto: '3331234567',
  is_eliminabile: 0,
});

const basePreloadedState = {
  // clienteState vuoto: i clienti compaiono SOLO se la ricerca funziona
  cliente: { value: { clienti: [] } },
  stile: { value: { vistaItem: 'tabella', vistaForm: 'standard' } },
  attivita: { value: { primo_intervallo: 1, secondo_intervallo: 10, numero_clienti: 5 } },
};

describe('Clienti - Test Funzionali (MSW)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  test('TC_CLIENTI_001 - Ricerca cliente: il risultato compare SOLO dopo la ricerca', async () => {
    const luigi = { ...clienteEliminabile(5, 'luigi', 'Luigi', 'Verdi'), tipo_selezione: '' };

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => HttpResponse.json({ items: [] })),
      http.post('/VISUALIZZA_ITEMS', () => HttpResponse.json({ items: [luigi] })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    // Luigi NON è nello store: può comparire solo tramite la ricerca (nessun placebo)
    expect(screen.queryByText(/Luigi/)).not.toBeInTheDocument();

    const inputNome = screen.getByPlaceholderText('Nome');
    await user.type(inputNome, 'Luigi');

    // niente guard silenziose: se il selettore fallisce, il test DEVE fallire
    const btnRicerca = document.querySelector('.lucide-search');
    expect(btnRicerca).not.toBeNull();
    await user.click(btnRicerca);

    await waitFor(() => {
      expect(screen.getAllByText(/Luigi/).length).toBeGreaterThan(0);
    });
  });

  test('TC_CLIENTI_002 - Controllo pagamenti: sblocco eliminazione (0 pagamenti)', async () => {
    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () =>
        HttpResponse.json({ items: [clienteEliminabile(2, 'luigi', 'Luigi', 'Verdi')] })),
      http.post('/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE', () =>
        HttpResponse.json({ result: [{ numero_pagamenti_non_confermati: 0 }] })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    const btnControllo = await screen.findByRole('button', { name: /Controllo pagamenti/i });
    await user.click(btnControllo);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Elimina cliente/i })).toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('0 pagamento/i da confermare')
    );
  });

  test('TC_CLIENTI_003 - Controllo pagamenti: blocco (2 pagamenti pendenti)', async () => {
    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () =>
        HttpResponse.json({ items: [clienteEliminabile(3, 'paolo', 'Paolo', 'Neri')] })),
      http.post('/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE', () =>
        HttpResponse.json({ result: [{ numero_pagamenti_non_confermati: 2 }] })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    const btnControllo = await screen.findByRole('button', { name: /Controllo pagamenti/i });
    await user.click(btnControllo);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("non puo' essere eliminato")
    );
    expect(screen.queryByRole('button', { name: /Elimina cliente/i })).not.toBeInTheDocument();
  });

  test('TC_CLIENTI_004 - Eliminazione confermata: cliente rimosso', async () => {
    const mario = { ...clienteEliminabile(1, 'mario', 'Mario', 'Rossi'), is_eliminabile: 1 };

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => HttpResponse.json({ items: [mario] })),
      http.post('/ELIMINA_ITEM', () => HttpResponse.json({}, { status: 200 })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    await waitFor(() => {
      expect(screen.getByText(/Mario Rossi/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Elimina cliente/i }));

    expect(window.confirm).toHaveBeenCalledWith('Sei sicuro di voler eliminare il cliente mario?');

    await waitFor(() => {
      expect(screen.queryByText(/Mario Rossi/i)).not.toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith("L'eliminazione del cliente è avvenuta con successo.");
  });

  test('TC_CLIENTI_005 - Eliminazione annullata', async () => {
    window.confirm.mockImplementationOnce(() => false);

    const mario = { ...clienteEliminabile(1, 'mario', 'Mario', 'Rossi'), is_eliminabile: 1 };

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => HttpResponse.json({ items: [mario] })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    await waitFor(() => {
      expect(screen.getByText(/Mario Rossi/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Elimina cliente/i }));

    expect(screen.getByText(/Mario Rossi/i)).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('Eliminazione annullata.');
  });

  test('TC_CLIENTI_006 - Eliminazione: errore server (500), alert di fallimento', async () => {
    const mario = { ...clienteEliminabile(1, 'mario', 'Mario', 'Rossi'), is_eliminabile: 1 };

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () => HttpResponse.json({ items: [mario] })),
      http.post('/ELIMINA_ITEM', () => new HttpResponse(null, { status: 500 })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    await waitFor(() => {
      expect(screen.getByText(/Mario Rossi/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Elimina cliente/i }));

    await waitFor(() => {
      expect(screen.getByText(/Mario Rossi/i)).toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith('Operazione fallita.');
    expect(window.alert).not.toHaveBeenCalledWith("L'eliminazione del cliente è avvenuta con successo.");
  });

  test('TC_CLIENTI_007 - Riattivazione confermata: alert e rimozione dalla lista', async () => {
    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () =>
        HttpResponse.json({ items: [clienteEliminabile(10, 'maria', 'Maria', 'Bianchi')] })),
      http.post('/RIATTIVA_CLIENTE', () => HttpResponse.json({}, { status: 200 })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    await user.click(await screen.findByRole('button', { name: /Riattiva cliente/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Maria Bianchi/i)).not.toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith('La riattivazione del cliente è avvenuta con successo.');
  });

  test('TC_CLIENTI_008 - Riattivazione annullata', async () => {
    window.confirm.mockImplementationOnce(() => false);

    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () =>
        HttpResponse.json({ items: [clienteEliminabile(10, 'maria', 'Maria', 'Bianchi')] })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    await user.click(await screen.findByRole('button', { name: /Riattiva cliente/i }));

    expect(screen.getByText(/Maria Bianchi/i)).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('Riattivazione annullata.');
  });

  test('TC_CLIENTI_009 - Riattivazione: errore server (500), alert di fallimento', async () => {
    server.use(
      http.post('/OTTIENI_CLIENTI_DA_ELIMINARE', () =>
        HttpResponse.json({ items: [clienteEliminabile(10, 'maria', 'Maria', 'Bianchi')] })),
      http.post('/RIATTIVA_CLIENTE', () => new HttpResponse(null, { status: 500 })),
    );

    renderWithProviders(<Clienti />, { preloadedState: basePreloadedState });

    await user.click(await screen.findByRole('button', { name: /Riattiva cliente/i }));

    await waitFor(() => {
      expect(screen.getByText(/Maria Bianchi/i)).toBeInTheDocument();
    });
    expect(window.alert).toHaveBeenCalledWith('Operazione fallita.');
  });
});