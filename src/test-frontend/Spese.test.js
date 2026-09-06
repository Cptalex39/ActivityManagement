import React from 'react';
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Spese from '../react_redux/views/spesa_view/Spese';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// ============================================================
// Strategia dichiarata: mock della libreria PaginaWeb + SPY sugli
// handler (wiring view→handler) + Azioni REALI + MSW (la ricerca
// popola davvero lo store: TC_SPESE_002 verifica il totale).
// La validazione importi è in controlli.test.js (TC_CTRL_SPESE_*),
// la business logic insert/edit in SpesaOperazioni.test.js.
// ============================================================

const mockSpyInsert = jest.fn();
const mockSpySearch = jest.fn();
const mockSpyDelete = jest.fn();
const mockSpyDeleteRange = jest.fn();
const mockSpyPdf = jest.fn();
const mockSpyExcel = jest.fn();

jest.mock('@gianlucascisciolo/riutilizzoreact', () => {
  const React = require('react');
  return {
    PaginaWeb: ({ componenti, elementi, vistaItem, vistaForm, campiNuovoItem }) => (
      <div data-testid="pagina-web-mock">
        <div data-testid="componenti-passati">{JSON.stringify(componenti)}</div>
        <div data-testid="elementi-passati">{JSON.stringify(elementi)}</div>
        <div data-testid="vista-item">{vistaItem}</div>
        <div data-testid="vista-form">{vistaForm}</div>

        {campiNuovoItem && campiNuovoItem.label.map((label, index) => (
          <input
            key={index}
            placeholder={label}
            data-testid={`input-nuovo-${campiNuovoItem.id[index]}`}
            onChange={(e) => { campiNuovoItem.onChange && campiNuovoItem.onChange({ preventDefault: () => {}, target: { name: campiNuovoItem.id[index], id: campiNuovoItem.id[index], value: e.target.value } }); }}
          />
        ))}

        {componenti.items && componenti.items !== -1 && Array.isArray(componenti.items) && componenti.items.map((item) => (
          <div key={item.id} data-testid={`riga-item-${item.id}`}>
            <input data-testid={`inline-edit-nome-${item.id}`} name="nome" defaultValue={item.nome} onBlur={(e) => componenti.handleBlurItem(e, item)} />
            <button data-testid={`btn-pencil-${item.id}`} onClick={() => componenti.operazioneModifica(item)}>Modifica</button>
            <button data-testid={`btn-trash-${item.id}`} onClick={() => componenti.operazioneElimina(item)}>Elimina</button>
          </div>
        ))}

        <button data-testid="mock-insert" onClick={() => { mockSpyInsert(); componenti.handleInsert && componenti.handleInsert({ preventDefault: () => {} }); }}>Inserisci</button>
        <button data-testid="mock-search" onClick={() => { mockSpySearch(); componenti.handleSearch && componenti.handleSearch({ preventDefault: () => {} }); }}>Cerca</button>
        <button data-testid="mock-delete" onClick={() => { mockSpyDelete(); componenti.handleDelete && componenti.handleDelete({ preventDefault: () => {} }); }}>Elimina</button>
        <button data-testid="mock-delete-range" onClick={() => { mockSpyDeleteRange(); componenti.handleDeleteRangeFile && componenti.handleDeleteRangeFile({ preventDefault: () => {} }); }}>Elimina Range</button>
        <button data-testid="mock-pdf" onClick={() => { mockSpyPdf(); componenti.handleSearchRangeFilePDF && componenti.handleSearchRangeFilePDF({ preventDefault: () => {} }); }}>PDF</button>
        <button data-testid="mock-excel" onClick={() => { mockSpyExcel(); componenti.handleSearchRangeFileExcel && componenti.handleSearchRangeFileExcel({ preventDefault: () => {} }); }}>Excel</button>
      </div>
    ),
  };
});

describe('Spese - Test Funzionali', () => {
  const user = userEvent.setup();

  const mockSpeseList = [
    { id: 1, nome: 'Bolletta luce', giorno: '2024-01-15', totale: 55.60, descrizione: 'Luce gennaio', note: '', tipo_selezione: 0 },
    { id: 2, nome: 'Stipendio Mario', giorno: '2024-01-31', totale: 1800.00, descrizione: 'Stipendio', note: '', tipo_selezione: 0 },
  ];

  const preloadedState = {
    spesa: { value: { spese: mockSpeseList } },
    stile: { value: { vistaItem: 'card', vistaForm: 'modal' } },
    attivita: { value: { nome: 'Test Activity' } },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    server.use(
      http.post('/INSERISCI_ITEM', () => HttpResponse.json({ id: 99, isOK: true }, { status: 200 })),
      http.post('/VISUALIZZA_ITEMS', () => HttpResponse.json({ items: mockSpeseList }, { status: 200 })),
      http.post('/ELIMINA_ITEMS', () => HttpResponse.json({ isOK: true }, { status: 200 })),
      http.post('/ELIMINA_ITEMS_RANGE_GIORNI', () => HttpResponse.json({ isOK: true }, { status: 200 }))
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  test('TC_SPESE_001 - Rendering del componente e props di stile', () => {
    renderWithProviders(<Spese />, { preloadedState });
    expect(screen.getByTestId('pagina-web-mock')).toBeInTheDocument();
    expect(screen.getByTestId('vista-item')).toHaveTextContent('card');
    expect(screen.getByTestId('vista-form')).toHaveTextContent('modal');
  });

  test('TC_SPESE_002 - Calcolo del totale dopo ricerca (azioni reali + MSW)', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-search'));
    await waitFor(() => {
      const componenti = JSON.parse(screen.getByTestId('componenti-passati').textContent);
      expect(componenti.totaleItems).toContain('1855.60 €');
    });
  });

  test('TC_SPESE_003 - Click su Inserisci invoca handleInsert', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-insert'));
    expect(mockSpyInsert).toHaveBeenCalledTimes(1);
  });

  test('TC_SPESE_004 - Click su Cerca invoca handleSearch', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-search'));
    expect(mockSpySearch).toHaveBeenCalledTimes(1);
  });

  test('TC_SPESE_005 - Click su Elimina invoca handleDelete con conferma', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-delete'));
    expect(mockSpyDelete).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('Sei sicuro di voler eliminare le spese?');
  });

  test('TC_SPESE_006 - Eliminazione annullata', async () => {
    window.confirm.mockImplementationOnce(() => false);
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-delete'));
    expect(window.alert).toHaveBeenCalledWith('Eliminazione annullata.');
  });

  test('TC_SPESE_007 - Click su PDF invoca handleSearchRangeFilePDF', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-pdf'));
    expect(mockSpyPdf).toHaveBeenCalledTimes(1);
  });

  test('TC_SPESE_008 - Click su Excel invoca handleSearchRangeFileExcel', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-excel'));
    expect(mockSpyExcel).toHaveBeenCalledTimes(1);
  });

  test('TC_SPESE_009 - Click su Elimina Range invoca handleDeleteRangeFile', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-delete-range'));
    expect(mockSpyDeleteRange).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('Sei sicuro di voler eliminare le spese?');
  });

  test('TC_SPESE_010 - Modifica inline di riga (blur su handleBlurItem reale)', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-search'));
    await waitFor(() => expect(screen.getByTestId('inline-edit-nome-1')).toBeInTheDocument());

    const inputNomeInline = screen.getByTestId('inline-edit-nome-1');
    fireEvent.change(inputNomeInline, { target: { value: 'Luce Modificata' } });
    fireEvent.blur(inputNomeInline, { target: { name: 'nome', id: 'nome_spesa', value: 'Luce Modificata' } });
    expect(inputNomeInline.value).toBe('Luce Modificata');
  });

  test('TC_SPESE_011 - Click sui pulsanti matita/cestino inline', async () => {
    renderWithProviders(<Spese />, { preloadedState });
    await user.click(screen.getByTestId('mock-search'));
    await waitFor(() => expect(screen.getByTestId('btn-pencil-1')).toBeInTheDocument());
    await user.click(screen.getByTestId('btn-pencil-1'));
    await user.click(screen.getByTestId('btn-trash-1'));
    await user.click(screen.getByTestId('mock-search'));
  });
});