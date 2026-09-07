import React from 'react';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import Carte from '../react_redux/views/carta_view/Carte';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// ============================================================
// STRATEGIA C - CartaActions REALE + Controlli REALE + MSW.
// Nessun jest.mock: validazione e flusso HTTP sono veri.
// L'endpoint /INSERISCI_ITEM è conteggiato con insertHandler:
// quando la validazione fallisce, NESSUNA richiesta deve partire.
// Copre le storie TDD #3 (falsa conferma salvataggio) e
// #4 (CVV alfabetico non validato).
// ============================================================

const insertHandler = jest.fn();

const carteValide = [
  { id: 1, numero: '4111111111111111', mese_scadenza: '11', anno_scadenza: '2028', cvv_cvs: '123', nome_titolare: 'Mario Rossi', is_visa: true, is_mastercard: false },
  { id: 2, numero: '5555555555554444', mese_scadenza: '06', anno_scadenza: '2027', cvv_cvs: '456', nome_titolare: 'Lucia Verdi', is_visa: false, is_mastercard: true },
];

const preloadedState = {
  autenticazione: { value: { id_utente: 1, isLogged: true, ruolo: 'cliente' } },
  carta: { value: { carte: carteValide } },
};

// Compila la form con una carta VISA valida (regole di Controlli.js)
const compilaCartaValida = async (user, override = {}) => {
  const d = { numero: '4111111111111999', mese: '12', anno: '2028', cvv: '123', nome: 'Paolo Neri', ...override };
  await user.type(screen.getByPlaceholderText('Numero carta (13/16 cifre)'), d.numero);
  await user.selectOptions(screen.getByRole('combobox'), d.mese);
  await user.type(screen.getByPlaceholderText('AAAA'), d.anno);
  await user.type(screen.getByPlaceholderText('CVV / CVS'), d.cvv);
  await user.type(screen.getByPlaceholderText('Nome titolare'), d.nome);
  await user.click(screen.getByText('VISA'));
};

describe('Carte - Test Funzionali (MSW, actions reali)', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
    insertHandler.mockClear();

    server.use(
      http.post('/OTTENIMENTO_CARTE_CLIENTE', () => HttpResponse.json({ items: carteValide })),
      http.post('/INSERISCI_ITEM', () => {
        insertHandler();
        return HttpResponse.json({ id: 99 });
      }),
      http.post('/ELIMINA_CARTA', () => HttpResponse.json({}, { status: 200 })),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    server.resetHandlers();
  });

  test('TC_CARTE_001 - Rendering iniziale', () => {
    renderWithProviders(<Carte />, { preloadedState });

    expect(screen.getByText('Nuova carta')).toBeInTheDocument();
    expect(screen.getByText('Carte salvate')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Numero carta (13/16 cifre)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CVV / CVS')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome titolare')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('VISA')).toBeInTheDocument();
    expect(screen.getByText('MASTERCARD')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Salva carta' })).toBeInTheDocument();
    expect(screen.getByText(/1111/)).toBeInTheDocument();
    expect(screen.getByText(/4444/)).toBeInTheDocument();
  });

  test('TC_CARTE_002 - Inserimento carta valida: alert, carta in lista, richiesta HTTP partita', async () => {
    renderWithProviders(<Carte />, { preloadedState });

    await compilaCartaValida(user);
    await user.click(screen.getByRole('button', { name: 'Salva carta' }));

    await waitFor(() => {
      // la nuova carta (ultime 4 cifre 1999) compare nella lista
      expect(screen.getByText(/1999/)).toBeInTheDocument();
    });
    expect(insertHandler).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Salvataggio carta avvenuto con successo.');
  });

  test('TC_CARTE_003 - Campi vuoti: 4 errori (messaggi esatti di Controlli.js), nessuna richiesta', async () => {
    renderWithProviders(<Carte />, { preloadedState });

    await user.click(screen.getByRole('button', { name: 'Salva carta' }));

    await waitFor(() => {
      expect(screen.getByText('Inserire la data di scadenza.')).toBeInTheDocument();
      expect(screen.getByText('Inserire un numero di 3 cifre.')).toBeInTheDocument();
      expect(screen.getByText('Inserire il nome del titolare.')).toBeInTheDocument();
      expect(screen.getByText('Errore, selezionare un pulsante tra Visa e Mastercard.')).toBeInTheDocument();
    });
    expect(insertHandler).not.toHaveBeenCalled();
  });

  test('TC_CARTE_004 - Rimozione confermata: carta eliminata', async () => {
    renderWithProviders(<Carte />, { preloadedState });

    const cartaElement = screen.getByText(/1111/);
    const container = cartaElement.closest('div[style*="padding: 25px"]');
    await user.click(within(container).getByText('Rimuovi'));

    await waitFor(() => {
      expect(screen.queryByText(/1111/)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/4444/)).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith("La carta e' stata eliminata.");
  });

  test('TC_CARTE_005 - Rimozione annullata', async () => {
    window.confirm.mockImplementationOnce(() => false);

    renderWithProviders(<Carte />, { preloadedState });

    const cartaElement = screen.getByText(/1111/);
    const container = cartaElement.closest('div[style*="padding: 25px"]');
    await user.click(within(container).getByText('Rimuovi'));

    expect(screen.getByText(/1111/)).toBeInTheDocument();
    expect(window.alert).toHaveBeenCalledWith('Operazione annullata.');
  });

  test('TC_CARTE_006 - CVV con lettere: bloccato, nessuna richiesta HTTP', async () => {
    renderWithProviders(<Carte />, { preloadedState });

    await compilaCartaValida(user, { cvv: 'abc' });
    await user.click(screen.getByRole('button', { name: 'Salva carta' }));

    await waitFor(() => {
      expect(screen.getByText('Errore, il numero inserito non è valido, deve essere di 3 cifre.')).toBeInTheDocument();
    });
    expect(insertHandler).not.toHaveBeenCalled();
  });

  test('TC_CARTE_007 - CVV di 4 cifre: troncato dal campo HTML (maxLength 3)', async () => {
    renderWithProviders(<Carte />, { preloadedState });

    const inputCVV = screen.getByPlaceholderText('CVV / CVS');
    await compilaCartaValida(user, { cvv: '1234' });

    // il campo tronca a 3 cifre: la UI non può produrre un CVV > 3
    expect(inputCVV).toHaveValue('123');

    await user.click(screen.getByRole('button', { name: 'Salva carta' }));

    // CVV valido dopo il troncamento: la carta viene salvata regolarmente
    await waitFor(() => {
      expect(screen.getByText(/1999/)).toBeInTheDocument();
    });
    expect(insertHandler).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith('Salvataggio carta avvenuto con successo.');
});

  test('TC_CARTE_008 - Numero carta incompleto (12 cifre): bloccato', async () => {
    renderWithProviders(<Carte />, { preloadedState });

    await compilaCartaValida(user, { numero: '411111111111' });
    await user.click(screen.getByRole('button', { name: 'Salva carta' }));

    await waitFor(() => {
      expect(screen.getByText('Errore, il numero della carta inserita non è valido. Controllare meglio.')).toBeInTheDocument();
    });
    expect(insertHandler).not.toHaveBeenCalled();
  });

  test('TC_CARTE_009 - Errore server (500) in salvataggio: alert di errore, carta NON aggiunta', async () => {
    server.use(
      http.post('/INSERISCI_ITEM', () => {
        insertHandler();
        return new HttpResponse(null, { status: 500 });
      }),
    );

    renderWithProviders(<Carte />, { preloadedState });

    await compilaCartaValida(user);
    await user.click(screen.getByRole('button', { name: 'Salva carta' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Errore durante il salvataggio della carta.');
    });
    expect(window.alert).not.toHaveBeenCalledWith('Salvataggio carta avvenuto con successo.');
    expect(screen.queryByText(/1999/)).not.toBeInTheDocument();
  });

  test('TC_CARTE_010 - Carta scaduta evidenziata, label scadenza corretta', async () => {
    const carte = [
      { id: 3, numero: '4111111111111333', mese_scadenza: '01', anno_scadenza: '2020', cvv_cvs: '123', nome_titolare: 'Anna Neri', is_visa: true, is_mastercard: false }, // scaduta
      { id: 4, numero: '5555555555554444', mese_scadenza: '12', anno_scadenza: '2030', cvv_cvs: '456', nome_titolare: 'Lucia Verdi', is_visa: false, is_mastercard: true }, // valida, dicembre
    ];

    server.use(
      http.post('/OTTENIMENTO_CARTE_CLIENTE', () => HttpResponse.json({ items: carte })),
    );

    renderWithProviders(<Carte />, {
      preloadedState: { ...preloadedState, carta: { value: { carte } } },
    });

    const scaduta = screen.getByText(/CARTA SCADUTA IL GIORNO: 1\/2\/2020/);
    expect(scaduta.closest('span')).toHaveStyle({ color: '#FF0000' });

    // post-fix: dicembre 2030 rolla correttamente su 1/1/2031
    const valida = screen.getByText(/LA CARTA SCADE IL GIORNO: 1\/1\/2031/);
    expect(valida.closest('span')).toHaveStyle({ color: '#FFFFFF' });
  });
});