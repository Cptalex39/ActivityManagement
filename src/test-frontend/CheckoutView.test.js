import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import CheckoutView from '../react_redux/views/ordine_view/CheckoutView';

// ============================================================
// STRATEGIA B - unit test della VIEW con actions mockate.
// I mock replicano il contratto reale di OrdineActions:
// { problema, isOK, responseStatus } (verificato sul codice).
// La validazione è testata a parte in controlli.test.js (unit puri).
// ============================================================

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockOrdineActions = {
  inserimentoOrdine: jest.fn().mockResolvedValue({ isOK: true, problema: false }),
  ottieniNumeroOrdiniDataPerOrario: jest.fn().mockResolvedValue({ numero_ordini: {} }),
};
jest.mock('../react_redux/actions/OrdineActions', () => ({
  OrdineActions: jest.fn().mockImplementation(() => mockOrdineActions),
}));

const mockCarrelloActions = {
  svuotaCarrello: jest.fn().mockResolvedValue({ isOK: true }),
};
jest.mock('../react_redux/actions/CarrelloActions', () => ({
  CarrelloActions: jest.fn().mockImplementation(() => mockCarrelloActions),
}));

// Hoistato: necessario per asserire aggiornaIndirizzo in TC_CHECKOUT_012
const mockAutenticazioneActions = {
  aggiornaIndirizzo: jest.fn().mockResolvedValue({ isOK: true }),
};
jest.mock('../react_redux/actions/AutenticazioneActions', () => ({
  AutenticazioneActions: jest.fn().mockImplementation(() => mockAutenticazioneActions),
}));

jest.mock('../react_redux/actions/CartaActions', () => ({
  CartaActions: jest.fn().mockImplementation(() => ({
    ottenimentoCarteCliente: jest.fn().mockResolvedValue({ isOK: true, items: [] }),
  })),
}));

jest.mock('../react_redux/actions/AttivitaActions', () => ({
  AttivitaActions: jest.fn().mockImplementation(() => ({
    ottieniDatiAttivita: jest.fn().mockResolvedValue({
      primo_intervallo: '08:00-12:00',
      secondo_intervallo: '14:00-18:00',
      numero_clienti: 5,
    }),
  })),
}));

jest.mock('../utils/Controlli', () => ({
  controlloOrdine: jest.fn().mockReturnValue(true),
  controlloCarta: jest.fn().mockImplementation((data) => {
    const errors = {};
    let num_errori = 0;
    if (!data.numero) { errors.errore_numero = 'Inserire il numero'; num_errori++; }
    if (!data.mese_scadenza || !data.anno_scadenza) { errors.errore_data_scadenza = 'Inserire la data di scadenza'; num_errori++; }
    if (!data.cvv_cvs) { errors.errore_cvv_cvs = 'Inserire il CVV'; num_errori++; }
    if (!data.nome_titolare) { errors.errore_nome_titolare = 'Inserire il nome'; num_errori++; }
    if (!data.is_visa && !data.is_mastercard) { errors.errore_circuito = 'Selezionare un circuito'; num_errori++; }
    return { ...data, ...errors, num_errori };
  }),
}));

// Header mockato: isolamento dichiarato del componente sotto test (sezione trasparenza)
jest.mock('../react_redux/views/components/Header', () => {
  return function MockHeader() {
    return <div data-testid="mock-header">Header Mock</div>;
  };
});

import { controlloOrdine } from '../utils/Controlli';

// Data futura dinamica: non si bypassa la regola "giorno successivo a quello attuale"
const DATA_FUTURA = `${new Date().getFullYear() + 1}-06-15`;

const listaCarteMock = [
  { id: 1, numero: '1234567812345678', mese_scadenza: '12', anno_scadenza: '2030', cvv_cvs: '123', nome_titolare: 'Mario Rossi', is_visa: true, is_mastercard: false },
];

const preloadedStateBase = {
  autenticazione: {
    value: { id_utente: 1, isLogged: true, ruolo: 'cliente', indirizzo: 'Via Roma 10' },
  },
  stile: { value: { vistaForm: 'form' } },
  carrello: {
    value: {
      items: [
        { id: 101, nome: 'Servizio Test Checkout', prezzo: 25.00, quantita: 2, tipo: 'Servizio' },
      ],
    },
  },
  carta: { value: { carte: listaCarteMock } },
  servizio: { value: { servizi: [] } },
};

describe('CheckoutView - Test Funzionali', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    mockOrdineActions.inserimentoOrdine.mockResolvedValue({ isOK: true, problema: false });
    mockOrdineActions.ottieniNumeroOrdiniDataPerOrario.mockResolvedValue({ numero_ordini: {} });
    mockCarrelloActions.svuotaCarrello.mockResolvedValue({ isOK: true });
    controlloOrdine.mockReturnValue(true);
  });

  afterEach(() => jest.restoreAllMocks());

  test('TC_CHECKOUT_001 - Rendering base e cambio metodo pagamento', async () => {
    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    expect(screen.getByText('Checkout')).toBeInTheDocument();
    expect(screen.getByText('Riepilogo ordine')).toBeInTheDocument();
    expect(screen.getByText('Servizio Test Checkout')).toBeInTheDocument();
    expect(screen.getAllByText('€50.00').length).toBe(2);

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');

    expect(screen.getByPlaceholderText('Via, n°, Città, CAP')).toBeInTheDocument();
    expect(screen.getByText('Seleziona una carta')).toBeInTheDocument();
    expect(screen.getByText('💳 **** **** **** 5678')).toBeInTheDocument();
  });

  test('TC_CHECKOUT_002 - Pagamento con Corriere: campo indirizzo', async () => {
    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Corriere');

    expect(screen.getByText('Indirizzo Corriere')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Via, n°, Città, CAP')).toBeInTheDocument();
  });

  test('TC_CHECKOUT_003 - Pagamento in Struttura: data e orari', async () => {
    mockOrdineActions.ottieniNumeroOrdiniDataPerOrario.mockResolvedValue({
      numero_ordini: { '10:00': 2, '11:00': 3, '12:00': 1, '15:00': 0 },
    });

    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Struttura');
    expect(screen.getByText('Appuntamento')).toBeInTheDocument();

    const inputData = screen.getByDisplayValue('');
    fireEvent.change(inputData, { target: { value: DATA_FUTURA } });
    fireEvent.blur(inputData);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /10:00|11:00|12:00|15:00/ }).length).toBeGreaterThan(0);
    });
  });

  test('TC_CHECKOUT_004 - Inserimento carta valida: compilazione e selezione', async () => {
    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');

    await user.type(screen.getByPlaceholderText('Numero carta (13/16 cifre)'), '4111111111111111');
    await user.selectOptions(screen.getByDisplayValue('MM'), '12');
    await user.type(screen.getByPlaceholderText('AAAA'), '2028');
    await user.type(screen.getByPlaceholderText('CVV / CVS'), '123');
    await user.type(screen.getByPlaceholderText('Nome titolare'), 'Mario Rossi');
    await user.click(screen.getByText('VISA'));

    const selezionaButtons = screen.getAllByRole('button', { name: 'Seleziona' });
    expect(selezionaButtons.length).toBe(2);
    await user.click(selezionaButtons[1]);

    expect(screen.getByText('Deseleziona')).toBeInTheDocument();
  });

  test('TC_CHECKOUT_005 - Validazione campi obbligatori: blocco invio', async () => {
    controlloOrdine.mockReturnValueOnce(false);

    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');
    await user.click(screen.getByRole('button', { name: 'Conferma e Concludi' }));

    expect(controlloOrdine).toHaveBeenCalled();
    expect(mockOrdineActions.inserimentoOrdine).not.toHaveBeenCalled();
    expect(mockCarrelloActions.svuotaCarrello).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('TC_CHECKOUT_006 - Errore API in conferma: alert, carrello NON svuotato, nessuna navigazione', async () => {
    mockOrdineActions.inserimentoOrdine.mockResolvedValueOnce({ isOK: false, problema: false });

    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');
    await user.click(screen.getByRole('button', { name: 'Conferma e Concludi' }));

    expect(mockOrdineActions.inserimentoOrdine).toHaveBeenCalled();
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Errore durante la conferma dell'ordine.");
    });
    expect(mockCarrelloActions.svuotaCarrello).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('TC_CHECKOUT_007 - Conferma con successo (Spedizione): payload, svuotamento, navigazione', async () => {
    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');
    await user.click(screen.getByRole('button', { name: 'Conferma e Concludi' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/conferma-ordine');
    });

    const chiamata = mockOrdineActions.inserimentoOrdine.mock.calls[0][0];
    expect(chiamata).toMatchObject({
      metodo_pagamento: 'Spedizione',
      totale: 50.00,
      id_cliente: 1,
    });
    const itemsParsed = JSON.parse(chiamata.items);
    expect(itemsParsed).toHaveLength(1);
    expect(itemsParsed[0]).toMatchObject({ id: 101, nome: 'Servizio Test Checkout', prezzo: 25.00, quantita: 2, tipo: 'Servizio' });

    expect(mockCarrelloActions.svuotaCarrello).toHaveBeenCalledTimes(1);
    // indirizzo invariato: nessun aggiornamento profilo
    expect(mockAutenticazioneActions.aggiornaIndirizzo).not.toHaveBeenCalled();
  });

  test('TC_CHECKOUT_008 - Orario saturo NON visualizzato (slot pieno)', async () => {
    // numero_clienti = 5: 10:00 è pieno (5), 11:00 disponibile (2)
    mockOrdineActions.ottieniNumeroOrdiniDataPerOrario.mockResolvedValue({
      numero_ordini: { '10:00': 5, '11:00': 2 },
    });

    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Struttura');

    const inputData = screen.getByDisplayValue('');
    fireEvent.change(inputData, { target: { value: DATA_FUTURA } });
    fireEvent.blur(inputData);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '10:00' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: '11:00' })).toBeInTheDocument();
    });
  });

  test('TC_CHECKOUT_009 - Orario non più disponibile: alert e blocco', async () => {
    mockOrdineActions.inserimentoOrdine.mockResolvedValueOnce({ isOK: true, problema: true });
    mockOrdineActions.ottieniNumeroOrdiniDataPerOrario.mockResolvedValue({
      numero_ordini: { '10:00': 0, '11:00': 1 },
    });

    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Struttura');

    const inputData = screen.getByDisplayValue('');
    fireEvent.change(inputData, { target: { value: DATA_FUTURA } });
    fireEvent.blur(inputData);

    await waitFor(() => {
      const orarioButtons = screen.getAllByRole('button', { name: /10:00|11:00/ });
      expect(orarioButtons.length).toBeGreaterThan(0);
      fireEvent.click(orarioButtons[0]);
    });

    await user.click(screen.getByRole('button', { name: 'Conferma e Concludi' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Errore, l'orario selezionato non è più disponibile. Selezionare un altro orario."
      );
    });
    expect(mockCarrelloActions.svuotaCarrello).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('TC_CHECKOUT_010 - Carta scaduta evidenziata e non selezionabile', async () => {
    const carte = [
      { id: 1, numero: '4111111111111111', mese_scadenza: '01', anno_scadenza: '2020', cvv_cvs: '123', nome_titolare: 'Mario Rossi', is_visa: true, is_mastercard: false }, // scaduta
      { id: 2, numero: '5555555555554444', mese_scadenza: '12', anno_scadenza: '2030', cvv_cvs: '456', nome_titolare: 'Lucia Verdi', is_visa: false, is_mastercard: true }, // valida, dicembre
    ];
    const preloadedState = { ...preloadedStateBase, carta: { value: { carte } } };

    renderWithProviders(<CheckoutView />, { preloadedState });

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');

    // carta scaduta: testo, colore rosso, NESSUN bottone Seleziona
    const scaduta = screen.getByText(/CARTA SCADUTA IL GIORNO: 1\/2\/2020/i);
    expect(scaduta.closest('span')).toHaveStyle({ color: '#FF0000' });
    const containerScaduta = scaduta.closest('div[style*="padding: 25px"]');
    expect(within(containerScaduta).queryByRole('button', { name: /Seleziona|Deseleziona/i })).not.toBeInTheDocument();

    // carta valida (dicembre 2030): post-fix la label rolla correttamente su 1/1/2031
    const valida = screen.getByText(/LA CARTA SCADE IL GIORNO: 1\/1\/2031/i);
    expect(valida.closest('span')).toHaveStyle({ color: '#FFFFFF' });
  });

  test('TC_CHECKOUT_011 - Conferma con successo (Struttura): payload con data e orario', async () => {
    mockOrdineActions.ottieniNumeroOrdiniDataPerOrario.mockResolvedValue({
      numero_ordini: { '10:00': 0, '11:00': 1 },
    });

    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Struttura');

    const inputData = screen.getByDisplayValue('');
    fireEvent.change(inputData, { target: { value: DATA_FUTURA } });
    fireEvent.blur(inputData);

    await waitFor(() => {
      const orarioButtons = screen.getAllByRole('button', { name: /10:00|11:00/ });
      expect(orarioButtons.length).toBeGreaterThan(0);
      fireEvent.click(orarioButtons[0]);
    });

    await user.click(screen.getByRole('button', { name: 'Conferma e Concludi' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/conferma-ordine');
    });

    const chiamata = mockOrdineActions.inserimentoOrdine.mock.calls[0][0];
    expect(chiamata).toMatchObject({
      metodo_pagamento: 'Struttura',
      data_prenotazione: DATA_FUTURA,
      ora_prenotazione: '10:00',
      totale: 50.00,
      id_cliente: 1,
    });
    expect(mockCarrelloActions.svuotaCarrello).toHaveBeenCalledTimes(1);
  });

  test('TC_CHECKOUT_012 - Indirizzo modificato: aggiornamento profilo', async () => {
    renderWithProviders(<CheckoutView />, { preloadedState: preloadedStateBase });

    await user.selectOptions(screen.getByRole('combobox'), 'Spedizione');

    const inputIndirizzo = screen.getByPlaceholderText('Via, n°, Città, CAP');
    await user.clear(inputIndirizzo);
    await user.type(inputIndirizzo, 'Via Verdi 5');

    await user.click(screen.getByRole('button', { name: 'Conferma e Concludi' }));

    await waitFor(() => {
      expect(mockAutenticazioneActions.aggiornaIndirizzo).toHaveBeenCalledWith('Via Verdi 5');
    });
    expect(mockNavigate).toHaveBeenCalledWith('/conferma-ordine');
  });
});