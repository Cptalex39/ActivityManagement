import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Servizi from '../react_redux/views/servizio_view/Servizi';

// ============================================================
// Strategia dichiarata: mock della libreria PaginaWeb (esterna)
// + SPY sugli handler passati come props: si verifica il WIRING
// view→handler. La business logic di insert/search/edit è coperta
// dai test unit in ServizioOperazioni.test.js.
// ServizioActions mockata (istanza condivisa): NESSUN MSW
// (le azioni non vengono eseguite davvero, sarebbe decorativo).
// ============================================================

const mockServizioActionsInstance = {
  inserisciServizio: jest.fn().mockResolvedValue({ isOK: true }),
  ricercaServizi: jest.fn().mockResolvedValue({ isOK: true, items: [] }),
  selezioneOperazioneServizio: jest.fn(),
  aggiornaServizio: jest.fn(),
  eliminaServizi: jest.fn().mockResolvedValue({ isOK: true }),
  azzeraLista: jest.fn(),
};
jest.mock('../react_redux/actions/ServizioActions', () => ({
  ServizioActions: jest.fn().mockImplementation(() => mockServizioActionsInstance),
}));

// Spy sui props-handler: il prefisso "mock" è richiesto da jest per l'hoisting
const mockSpyInsert = jest.fn();
const mockSpySearch = jest.fn();
const mockSpyDelete = jest.fn();

jest.mock('@gianlucascisciolo/riutilizzoreact', () => {
  const React = require('react');
  return {
    PaginaWeb: ({ componenti, elementi, vistaItem, vistaForm }) => (
      <div data-testid="pagina-web-mock">
        <div data-testid="componenti-passati">{JSON.stringify(componenti)}</div>
        <div data-testid="elementi-passati">{JSON.stringify(elementi)}</div>
        <div data-testid="vista-item">{vistaItem}</div>
        <div data-testid="vista-form">{vistaForm}</div>
        <button data-testid="mock-insert" onClick={() => { mockSpyInsert(); componenti.handleInsert && componenti.handleInsert({ preventDefault: () => {} }); }}>Inserisci</button>
        <button data-testid="mock-search" onClick={() => { mockSpySearch(); componenti.handleSearch && componenti.handleSearch({ preventDefault: () => {} }); }}>Cerca</button>
        <button data-testid="mock-delete" onClick={() => { mockSpyDelete(); componenti.handleDelete && componenti.handleDelete({ preventDefault: () => {} }); }}>Elimina</button>
      </div>
    ),
  };
});

const preloadedState = {
  servizio: { value: { servizi: [
    { id: 1, nome: 'Taglio capelli', tipo: 'Servizio', prezzo: '15.00' },
    { id: 2, nome: 'Penna nera', tipo: 'Prodotto', prezzo: '0.50' },
  ] } },
  stile: { value: { vistaItem: 'card', vistaForm: 'modal' } },
  attivita: { value: { nome: 'Test Activity' } },
};

describe('Servizi - Test Funzionali', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => jest.restoreAllMocks());

  test('TC_SERVIZI_001 - Rendering del componente e props di stile', () => {
    renderWithProviders(<Servizi />, { preloadedState });
    expect(screen.getByTestId('pagina-web-mock')).toBeInTheDocument();
    expect(screen.getByTestId('vista-item')).toHaveTextContent('card');
    expect(screen.getByTestId('vista-form')).toHaveTextContent('modal');
    expect(screen.getByTestId('elementi-passati')).toHaveTextContent('["search","insert"]');
  });

  test('TC_SERVIZI_002 - Servizi passati correttamente a PaginaWeb', () => {
    renderWithProviders(<Servizi />, { preloadedState });
    const componenti = JSON.parse(screen.getByTestId('componenti-passati').textContent);
    expect(componenti.items).toHaveLength(2);
    expect(componenti.items[0].nome).toBe('Taglio capelli');
    expect(componenti.items[1].nome).toBe('Penna nera');
    expect(componenti.tipoItem).toBe('servizio');
  });

  test('TC_SERVIZI_003 - Click su Inserisci invoca handleInsert', async () => {
    renderWithProviders(<Servizi />, { preloadedState });
    await user.click(screen.getByTestId('mock-insert'));
    expect(mockSpyInsert).toHaveBeenCalledTimes(1);
  });

  test('TC_SERVIZI_004 - Click su Cerca invoca handleSearch', async () => {
    renderWithProviders(<Servizi />, { preloadedState });
    await user.click(screen.getByTestId('mock-search'));
    expect(mockSpySearch).toHaveBeenCalledTimes(1);
  });

  test('TC_SERVIZI_005 - Click su Elimina invoca handleDelete con conferma', async () => {
    renderWithProviders(<Servizi />, { preloadedState });
    await user.click(screen.getByTestId('mock-delete'));
    expect(mockSpyDelete).toHaveBeenCalledTimes(1);
    expect(window.confirm).toHaveBeenCalledWith('Sei sicuro di voler eliminare i servizi?');
  });

  test('TC_SERVIZI_006 - Eliminazione annullata: alert e nessuna azione', async () => {
    window.confirm.mockImplementationOnce(() => false);
    renderWithProviders(<Servizi />, { preloadedState });
    await user.click(screen.getByTestId('mock-delete'));
    expect(window.alert).toHaveBeenCalledWith('Eliminazione annullata.');
    expect(mockServizioActionsInstance.eliminaServizi).not.toHaveBeenCalled();
  });
});