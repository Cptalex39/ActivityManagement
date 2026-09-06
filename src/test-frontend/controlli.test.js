import { controlloCarta, controlloOrdine, controlloSpesa } from '../utils/Controlli';
// ============================================================
// UNIT TEST PURI - nessun render, nessun mock, nessun MSW.
// Funzioni pure di validazione: si asseriscono i valori di
// ritorno (num_errori e messaggi ESATTI di Controlli.js).
// TC_CTRL_CARTA_008 copre la storia TDD #4 (CVV alfabetico).
// ============================================================

describe('Controlli.js - Unit test', () => {
  let alertSpy;
  beforeEach(() => { alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {}); });
  afterEach(() => jest.restoreAllMocks());

  const cartaValida = () => ({
    numero: '4111111111111111', mese_scadenza: '12', anno_scadenza: '2030',
    cvv_cvs: '123', nome_titolare: 'Mario Rossi', is_visa: true, is_mastercard: false,
  });

  // ---------- controlloCarta ----------
  test('TC_CTRL_CARTA_001 - Carta VISA valida: nessun errore', () => {
    const r = controlloCarta(cartaValida());
    expect(r.num_errori).toBe(0);
    expect(r.errore_data_scadenza).toBeNull();
    expect(r.errore_circuito).toBeNull();
    expect(r.errore_numero).toBeNull();
    expect(r.errore_cvv_cvs).toBeNull();
    expect(r.errore_nome_titolare).toBeNull();
  });

  test('TC_CTRL_CARTA_002 - Carta MASTERCARD valida: nessun errore', () => {
    const r = controlloCarta({ ...cartaValida(), numero: '5555555555554444', is_visa: false, is_mastercard: true });
    expect(r.num_errori).toBe(0);
  });

  test('TC_CTRL_CARTA_003 - Scadenza mancante', () => {
    const r = controlloCarta({ ...cartaValida(), mese_scadenza: '', anno_scadenza: '' });
    expect(r.errore_data_scadenza).toBe('Inserire la data di scadenza.');
  });

  test('TC_CTRL_CARTA_004 - Anno di scadenza passato', () => {
    const r = controlloCarta({ ...cartaValida(), anno_scadenza: '2020' });
    expect(r.errore_data_scadenza).toBe('Inserire una data di scadenza valida.');
  });

  test('TC_CTRL_CARTA_005 - Carta scaduta (mese precedente)', () => {
    // Caso deterministico in ogni mese dell'anno (in gennaio il messaggio
    // differisce per via del check sull'anno: documentato come quirk)
    const now = new Date();
    const gennaio = now.getMonth() === 0;
    const anno = gennaio ? String(now.getFullYear() - 1) : String(now.getFullYear());
    const mese = gennaio ? '12' : String(now.getMonth()).padStart(2, '0'); // mese precedente (1-based)

    const r = controlloCarta({ ...cartaValida(), anno_scadenza: anno, mese_scadenza: mese });
    expect(r.errore_data_scadenza).toBe(
      gennaio ? 'Inserire una data di scadenza valida.' : 'Errore, la carta è scaduta. Inserire una carta non scaduta.'
    );
  });

  test('TC_CTRL_CARTA_006 - Circuito non selezionato', () => {
    const r = controlloCarta({ ...cartaValida(), is_visa: false, is_mastercard: false });
    expect(r.errore_circuito).toBe('Errore, selezionare un pulsante tra Visa e Mastercard.');
  });

  test('TC_CTRL_CARTA_007 - Numero non conforme al circuito', () => {
    const r = controlloCarta({ ...cartaValida(), numero: '5555555555554444' }); // numero MC su VISA
    expect(r.errore_numero).toBe('Errore, il numero della carta inserita non è valido. Controllare meglio.');
  });

  test('TC_CTRL_CARTA_008 - CVV con lettere: bloccato', () => {
    const r = controlloCarta({ ...cartaValida(), cvv_cvs: 'abc' });
    expect(r.num_errori).toBeGreaterThan(0);
    expect(r.errore_cvv_cvs).toBe('Errore, il numero inserito non è valido, deve essere di 3 cifre.');
  });

  test('TC_CTRL_CARTA_009 - CVV di 4 cifre', () => {
    const r = controlloCarta({ ...cartaValida(), cvv_cvs: '1234' });
    expect(r.errore_cvv_cvs).toBe('Errore, il numero inserito non è valido, deve essere di 3 cifre.');
  });

  test('TC_CTRL_CARTA_010 - Nome titolare mancante', () => {
    const r = controlloCarta({ ...cartaValida(), nome_titolare: '' });
    expect(r.errore_nome_titolare).toBe('Inserire il nome del titolare.');
  });

  // ---------- controlloOrdine ----------
  const DATA_FUTURA = `${new Date().getFullYear() + 1}-06-15`;

  test('TC_CTRL_ORD_001 - Nessun metodo di pagamento', () => {
    expect(controlloOrdine({ metodo_pagamento: '' })).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Seleziona un metodo di pagamento!');
  });

  test('TC_CTRL_ORD_002 - Struttura senza data/orario', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Struttura' })).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Seleziona data e orario per la prenotazione.');
  });

  test('TC_CTRL_ORD_003 - Struttura con data passata', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Struttura', data_prenotazione: '2020-01-15', ora_prenotazione: '10:00' })).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Inserire un giorno successore a quello attuale.');
  });

  test('TC_CTRL_ORD_004 - Struttura valida', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Struttura', data_prenotazione: DATA_FUTURA, ora_prenotazione: '10:00' })).toBe(true);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('TC_CTRL_ORD_005 - Spedizione senza carta', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Spedizione', indirizzo: 'Via Roma 10', numero_carta: null })).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Seleziona una carta.');
  });

  test('TC_CTRL_ORD_006 - Spedizione con indirizzo "Via Roma 10, Milano" (formato del placeholder): RIFIUTATO', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Spedizione', indirizzo: 'Via Roma 10, Milano', numero_carta: '1111' })).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining("l'indirizzo inserito non è valido"));
  });

  test('TC_CTRL_ORD_007 - Spedizione completa valida', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Spedizione', indirizzo: 'Via Roma 10', numero_carta: '1111' })).toBe(true);
    expect(alertSpy).not.toHaveBeenCalled();
  });

  test('TC_CTRL_ORD_008 - Corriere: indirizzo mancante e indirizzo valido', () => {
    expect(controlloOrdine({ metodo_pagamento: 'Corriere', indirizzo: '' })).toBe(false);
    expect(alertSpy).toHaveBeenCalledWith('Inserire l\'indirizzo per la consegna.');
    expect(controlloOrdine({ metodo_pagamento: 'Corriere', indirizzo: 'Via Roma 10' })).toBe(true);
  });

  // ---------- controlloSpesa (sostituiscono i TC_SPESE_010/011/012 di vista, che erano placebo) ----------
describe('controlloSpesa - Unit test', () => {
  const spesaValida = () => ({
    nome: 'Bolletta luce', descrizione: 'Luce gennaio', totale: '55.60', giorno: '2024-01-15', note: '',
  });

  test('TC_CTRL_SPESE_001 - Spesa valida: nessun errore', () => {
    const r = controlloSpesa(spesaValida());
    expect(r.num_errori).toBe(0);
  });

  test('TC_CTRL_SPESE_002 - Totale negativo: bloccato', () => {
    const r = controlloSpesa({ ...spesaValida(), totale: '-50' });
    expect(r.errore_totale).toBe('Errore, il totale inserito non è maggiore di 0.');
  });

  test('TC_CTRL_SPESE_003 - Totale zero: bloccato', () => {
    const r = controlloSpesa({ ...spesaValida(), totale: '0' });
    expect(r.errore_totale).toBe('Errore, il totale inserito non è maggiore di 0.');
  });

  test('TC_CTRL_SPESE_004 - Nome mancante', () => {
    const r = controlloSpesa({ ...spesaValida(), nome: '' });
    expect(r.errore_nome).toBe('Inserire il nome.');
  });

  test('TC_CTRL_SPESE_005 - Giorno mancante', () => {
    const r = controlloSpesa({ ...spesaValida(), giorno: '' });
    expect(r.errore_giorno).toBe('Errore, inserire il giorno.');
  });
});
});