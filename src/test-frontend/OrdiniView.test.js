import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import Ordini from '../react_redux/views/ordine_view/Ordini';

// ============================================================
// STRATEGIA B - unit test della VIEW con OrdineActions mockate.
// Il bug dei filtri data (sovrascrittura sentinelle) vive NELLE
// ACTION: testato in ordini-actions.test.js (TC_ORD_011, MSW).
// ============================================================

const mockOrdineActionsInstance = {
  ottieniOrdiniUltime48Ore: jest.fn(),
  ottieniPagamentiDaConfermare: jest.fn(),
  ricercaOrdini: jest.fn(),
  confermaPagamento: jest.fn(),
  eliminaPagamentoDaConfermare: jest.fn(),
  ottieniFileOrdini: jest.fn(),
};

jest.mock('../react_redux/actions/OrdineActions', () => ({
  OrdineActions: jest.fn().mockImplementation(() => mockOrdineActionsInstance),
}));

// Il mock replica il CONTRATTO di controlloRicercaOrdini (Controlli.js):
// ritorna l'oggetto con num_errori e i campi errore_*
jest.mock('../utils/Controlli', () => ({
  controlloRicercaOrdini: jest.fn().mockImplementation((filtri) => {
    return { ...filtri, num_errori: 0 };
  }),
}));

import { controlloRicercaOrdini } from '../utils/Controlli';

const mockOrdine = {
  codice: "ORD123",
  nome_cliente: "Mario",
  cognome_cliente: "Rossi",
  data_creazione: new Date().toISOString(),
  totale: 50.00,
  metodo_pagamento: "Struttura",
  is_pagato: 0,
  data_prenotazione: "2030-10-28",
  ora_prenotazione: "10:00",
  items: JSON.stringify([
    { id: 1, nome: "Servizio Test", prezzo: 50.00, quantita: 1, tipo: "Servizio", descrizione: "Desc", note: "Note" }
  ])
};

const preloadedState = {
  autenticazione: {
    value: { id_utente: 1, ruolo: 'Amministratore', isLogged: true },
  },
};

describe('OrdiniView - Test Funzionali', () => {
  let confirmSpy;
  let alertSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    mockOrdineActionsInstance.ottieniOrdiniUltime48Ore.mockResolvedValue({ isOK: true, items: [mockOrdine] });
    mockOrdineActionsInstance.ottieniPagamentiDaConfermare.mockResolvedValue({ isOK: true, items: [mockOrdine] });
    mockOrdineActionsInstance.ricercaOrdini.mockResolvedValue({ isOK: true, items: [mockOrdine] });
    mockOrdineActionsInstance.confermaPagamento.mockResolvedValue({ isOK: true });
    mockOrdineActionsInstance.eliminaPagamentoDaConfermare.mockResolvedValue({ isOK: true });
    mockOrdineActionsInstance.ottieniFileOrdini.mockResolvedValue({ isOK: true });

    confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    controlloRicercaOrdini.mockImplementation((filtri) => ({ ...filtri, num_errori: 0 }));
  });

  afterEach(() => jest.restoreAllMocks());

  test('TC_ORD_001 - Pagamenti da confermare e Ordini ultime 48 ore', async () => {
    renderWithProviders(<Ordini />, { preloadedState });

    const btn48Ore = screen.getByText('Ordini ultime 48 ore');
    fireEvent.click(btn48Ore);

    await waitFor(() => {
      expect(screen.getByText('ORDINI ULTIME 48 ORE')).toBeInTheDocument();
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });

    // Conferma pagamento
    fireEvent.click(screen.getByText('Conferma'));
    await waitFor(() => {
      expect(mockOrdineActionsInstance.confermaPagamento).toHaveBeenCalledWith({ codice: 'ORD123' });
      expect(alertSpy).toHaveBeenCalledWith('Pagamento confermato.');
    });
    await waitFor(() => {
      const tagVerde = screen.getByText('Pagamento confermato');
      expect(tagVerde.closest('span')).toHaveAttribute('style', expect.stringContaining('background-color: green'));
    });

    // Passa a Pagamenti da confermare
    const btnPagamenti = screen.getByText('Pagamenti da confermare');
    fireEvent.click(btnPagamenti);
    await waitFor(() => {
      expect(screen.getByText('PAGAMENTI DA CONFERMARE')).toBeInTheDocument();
    });

    // Ricarica 48h con un ordine diverso
    mockOrdineActionsInstance.ottieniOrdiniUltime48Ore.mockResolvedValue({
      isOK: true,
      items: [{ ...mockOrdine, codice: 'ORD789' }],
    });
    fireEvent.click(btn48Ore);
    await waitFor(() => {
      expect(screen.getByText('ORDINI ULTIME 48 ORE')).toBeInTheDocument();
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });

    // Elimina ordine
    fireEvent.click(screen.getByText('Elimina'));
    await waitFor(() => {
      expect(mockOrdineActionsInstance.eliminaPagamentoDaConfermare).toHaveBeenCalledWith({ codice: 'ORD789' });
      expect(alertSpy).toHaveBeenCalledWith('Ordine eliminato.');
    });

    // Effetto reale dell'eliminazione: il cliente SPARISCE dalla sezione attiva
    // (il codice ordine non è mai renderizzato come testo)
    await waitFor(() => {
      expect(screen.queryByText('Rossi Mario')).not.toBeInTheDocument();
      expect(screen.getByText('Nessun ordine trovato.')).toBeInTheDocument();
    });

    // La sezione Pagamenti conserva il proprio ordine
    fireEvent.click(btnPagamenti);
    await waitFor(() => {
      expect(screen.getByText('PAGAMENTI DA CONFERMARE')).toBeInTheDocument();
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });
  });

  test('TC_ORD_002 - Ricerca ordini e generazione file (payload)', async () => {
    const { container } = renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Ricerca ordini / Ottieni file'));
    await waitFor(() => {
      expect(screen.getByText('RICERCA ORDINI / OTTIENI FILE')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Struttura' } });

    const dataMin = container.querySelector('input[name="data_creazione_min"]');
    const dataMax = container.querySelector('input[name="data_creazione_max"]');
    expect(dataMin).toBeInTheDocument();
    expect(dataMax).toBeInTheDocument();
    fireEvent.change(dataMin, { target: { value: '2023-01-01' } });
    fireEvent.change(dataMax, { target: { value: '2023-12-31' } });

    fireEvent.click(screen.getByText('Esegui ricerca'));
    await waitFor(() => {
      expect(mockOrdineActionsInstance.ricercaOrdini).toHaveBeenCalledWith(
        expect.objectContaining({
          metodo_pagamento: 'Struttura',
          data_creazione_min: '2023-01-01',
          data_creazione_max: '2023-12-31',
        })
      );
    });

    fireEvent.click(screen.getByText('Ottieni PDF'));
    fireEvent.click(screen.getByText('Ottieni Excel'));
    expect(mockOrdineActionsInstance.ottieniFileOrdini).toHaveBeenCalledWith(
      'pdf',
      expect.objectContaining({ metodo_pagamento: 'Struttura', data_creazione_min: '2023-01-01', data_creazione_max: '2023-12-31' })
    );
    expect(mockOrdineActionsInstance.ottieniFileOrdini).toHaveBeenCalledWith(
      'excel',
      expect.objectContaining({ metodo_pagamento: 'Struttura', data_creazione_min: '2023-01-01', data_creazione_max: '2023-12-31' })
    );

    fireEvent.click(screen.getByText('Pulisci'));
    expect(dataMin.value).toBe('');
    expect(dataMax.value).toBe('');
  });

  test('TC_ORD_003 - Lista vuota', async () => {
    mockOrdineActionsInstance.ottieniOrdiniUltime48Ore.mockResolvedValue({ isOK: true, items: [] });

    renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Ordini ultime 48 ore'));
    await waitFor(() => {
      expect(screen.getByText('Nessun ordine trovato.')).toBeInTheDocument();
    });
  });

  test('TC_ORD_004 - Validazione: intervallo date incoerente', async () => {
    // il mock produce il CONTRATTO REALE di controlloRicercaOrdini (stringa di Controlli.js)
    controlloRicercaOrdini.mockImplementation((filtri) => {
      return { ...filtri, errore_data_creazione: 'Errore, la data di creazione massima è minore della data di creazione minima.', num_errori: 1 };
    });

    const { container } = renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Ricerca ordini / Ottieni file'));
    await waitFor(() => {
      expect(screen.getByText('RICERCA ORDINI / OTTIENI FILE')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Tutte' } });

    const dataMin = container.querySelector('input[name="data_creazione_min"]');
    const dataMax = container.querySelector('input[name="data_creazione_max"]');
    fireEvent.change(dataMin, { target: { value: '2023-12-31' } });
    fireEvent.change(dataMax, { target: { value: '2023-01-01' } });

    fireEvent.click(screen.getByText('Esegui ricerca'));

    await waitFor(() => {
      expect(screen.getByText('Errore, la data di creazione massima è minore della data di creazione minima.')).toBeInTheDocument();
    });
    expect(mockOrdineActionsInstance.ricercaOrdini).not.toHaveBeenCalled();
  });

  test('TC_ORD_005 - Conferma pagamento fallita', async () => {
    mockOrdineActionsInstance.confermaPagamento.mockResolvedValue({ isOK: false });

    renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Pagamenti da confermare'));
    await waitFor(() => {
      expect(screen.getByText('PAGAMENTI DA CONFERMARE')).toBeInTheDocument();
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Conferma'));

    await waitFor(() => {
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });
    expect(alertSpy).toHaveBeenCalledWith('Operazione fallita.');
  });

  test('TC_ORD_006 - Eliminazione ordine fallita', async () => {
    mockOrdineActionsInstance.eliminaPagamentoDaConfermare.mockResolvedValue({ isOK: false });

    renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Ordini ultime 48 ore'));
    await waitFor(() => {
      expect(screen.getByText('ORDINI ULTIME 48 ORE')).toBeInTheDocument();
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Elimina'));

    await waitFor(() => {
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });
    expect(alertSpy).toHaveBeenCalledWith('Operazione fallita.');
  });

  test('TC_ORD_007 - Eliminazione annullata', async () => {
    confirmSpy.mockImplementationOnce(() => false);

    renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Ordini ultime 48 ore'));
    await waitFor(() => {
      expect(screen.getByText('ORDINI ULTIME 48 ORE')).toBeInTheDocument();
      expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Elimina'));

    expect(screen.getByText('Rossi Mario')).toBeInTheDocument();
    expect(alertSpy).toHaveBeenCalledWith('Operazione annullata.');
  });

  test('TC_ORD_008 - Filtro metodo pagamento', async () => {
    renderWithProviders(<Ordini />, { preloadedState });

    fireEvent.click(screen.getByText('Ricerca ordini / Ottieni file'));

    const selectMetodo = screen.getByRole('combobox');
    fireEvent.change(selectMetodo, { target: { value: 'Spedizione' } });
    expect(selectMetodo.value).toBe('Spedizione');
    fireEvent.change(selectMetodo, { target: { value: 'Corriere' } });
    expect(selectMetodo.value).toBe('Corriere');
    fireEvent.change(selectMetodo, { target: { value: '' } });
    expect(selectMetodo.value).toBe('');
  });

  test('TC_ORD_009 - Ruolo cliente: nessun bottone Conferma/Elimina, nessun filtro cliente', async () => {
    const preloadedStateCliente = {
      autenticazione: { value: { id_utente: 2, ruolo: 'cliente', isLogged: true } },
    };

    renderWithProviders(<Ordini />, { preloadedState: preloadedStateCliente });

    fireEvent.click(screen.getByText('Pagamenti da confermare'));
    await waitFor(() => {
      expect(screen.getByText('PAGAMENTI DA CONFERMARE')).toBeInTheDocument();
    });

    expect(screen.queryByText('Conferma')).not.toBeInTheDocument();
    expect(screen.queryByText('Elimina')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Cerca...')).not.toBeInTheDocument();
  });

  test('TC_ORD_010 - Ruolo cliente: payload con id_cliente dell\'utente', async () => {
    const preloadedStateCliente = {
      autenticazione: { value: { id_utente: 2, ruolo: 'cliente', isLogged: true } },
    };

    renderWithProviders(<Ordini />, { preloadedState: preloadedStateCliente });

    fireEvent.click(screen.getByText('Pagamenti da confermare'));
    await waitFor(() => {
      expect(mockOrdineActionsInstance.ottieniPagamentiDaConfermare).toHaveBeenCalledWith({ id_cliente: 2 });
    });

    fireEvent.click(screen.getByText('Ordini ultime 48 ore'));
    await waitFor(() => {
      expect(mockOrdineActionsInstance.ottieniOrdiniUltime48Ore).toHaveBeenCalledWith({ id_cliente: 2 });
    });
  });
});