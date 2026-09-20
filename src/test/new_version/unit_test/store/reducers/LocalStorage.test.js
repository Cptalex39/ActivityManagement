import { loadFromLocalStorage, saveToLocalStorage } from "../../../../../react_redux/store/reducers/LocalStorage";

describe('Vari test su "LoadFromLocalStorage"', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  /** UT_LS_LdFrmLS_01 **/
  test('Carica e deserializza un oggetto precedentemente salvato', () => {
    localStorage.setItem('utente', JSON.stringify({ nome: 'Mario', eta: 30 }));

    const result = loadFromLocalStorage('utente');

    expect(result).toEqual({ nome: 'Mario', eta: 30 });
  });

  /** UT_LS_LdFrmLS_02 **/
  test('Carica e deserializza un array', () => {
    localStorage.setItem('numeri', '[1,2,3]');

    const result = loadFromLocalStorage('numeri');

    expect(result).toEqual([1, 2, 3]);
  });

  /** UT_LS_LdFrmLS_03 **/
  test('Restituisce undefined se la chiave non esiste', () => {
    const result = loadFromLocalStorage('chiaveInesistente');

    expect(result).toBeUndefined();
  });

  /** UT_LS_LdFrmLS_04 **/
  test('Restituisce undefined se il valore salvato è una stringa vuota', () => {
    localStorage.setItem('chiaveVuota', '');

    const result = loadFromLocalStorage('chiaveVuota');

    expect(result).toBeUndefined();
  });

  /** UT_LS_LdFrmLS_05 **/
  test('Non lancia eccezioni e logga un warning se il valore salvato non è JSON valido', () => {
    localStorage.setItem('chiaveCorrotta', 'questo-non-e-json{{{');

    const result = loadFromLocalStorage('chiaveCorrotta');

    expect(result).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(
      'Errore nel caricamento dello stato dal local storage:',
      expect.any(Error)
    );
  });

  /** UT_LS_LdFrmLS_06 **/
  test('Non lancia eccezioni e logga un warning se localStorage.getItem fallisce', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Accesso negato al local storage');
    });

    const result = loadFromLocalStorage('chiave');

    expect(result).toBeUndefined();
    expect(console.warn).toHaveBeenCalledWith(
      'Errore nel caricamento dello stato dal local storage:',
      expect.any(Error)
    );

    getItemSpy.mockRestore();
  });

  /** UT_LS_LdFrmLS_07 **/
  test('Gestisce correttamente un valore numerico salvato come JSON (0)', () => {
    localStorage.setItem('zero', '0');

    const result = loadFromLocalStorage('zero');

    // "0" è una stringa non vuota (truthy), quindi il ramo JSON.parse viene eseguito
    expect(result).toBe(0);
  });

  /** UT_LS_LdFrmLS_08 **/
  test('Gestisce correttamente il valore booleano false salvato come JSON', () => {
    localStorage.setItem('booleanoFalse', 'false');

    const result = loadFromLocalStorage('booleanoFalse');

    expect(result).toBe(false);
  });
});

describe('Vari test su "saveToLocalStorage"', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    console.warn.mockRestore();
  });

  /** UT_LS_SvToLS_01 **/
  test('Salva un oggetto serializzandolo in JSON', () => {
    const state = { nome: 'Mario', eta: 30 };

    saveToLocalStorage(state, 'utente');

    expect(localStorage.getItem('utente')).toBe(JSON.stringify(state));
  });

  /** UT_LS_SvToLS_02 **/
  test('Salva un array correttamente', () => {
    const state = [1, 2, 3];

    saveToLocalStorage(state, 'numeri');

    expect(localStorage.getItem('numeri')).toBe('[1,2,3]');
  });

  /** UT_LS_SvToLS_03 **/
  test('Salva valori primitivi (stringa, numero, booleano)', () => {
    saveToLocalStorage('ciao', 'chiaveStringa');
    saveToLocalStorage(42, 'chiaveNumero');
    saveToLocalStorage(true, 'chiaveBooleano');

    expect(localStorage.getItem('chiaveStringa')).toBe('"ciao"');
    expect(localStorage.getItem('chiaveNumero')).toBe('42');
    expect(localStorage.getItem('chiaveBooleano')).toBe('true');
  });

  /** UT_LS_SvToLS_04 **/
  test('Sovrascrive un valore già presente con la stessa chiave', () => {
    saveToLocalStorage({ a: 1 }, 'chiave');
    saveToLocalStorage({ a: 2 }, 'chiave');

    expect(localStorage.getItem('chiave')).toBe(JSON.stringify({ a: 2 }));
  });

  /** UT_LS_SvToLS_05 **/
  test('Non lancia eccezioni e logga un warning se lo stato non è serializzabile (riferimento circolare)', () => {
    const circolare = {};
    circolare.self = circolare; // riferimento circolare: JSON.stringify lancia TypeError

    expect(() => saveToLocalStorage(circolare, 'chiave')).not.toThrow();
    expect(console.warn).toHaveBeenCalledWith(
      'Errore nel salvataggio dello stato nel local storage:',
      expect.any(Error)
    );
  });

  /** UT_LS_SvToLS_06 **/
  test('Non lancia eccezioni e logga un warning se localStorage.setItem fallisce (es. quota superata)', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });

    expect(() => saveToLocalStorage({ a: 1 }, 'chiave')).not.toThrow();
    expect(console.warn).toHaveBeenCalledWith(
      'Errore nel salvataggio dello stato nel local storage:',
      expect.any(DOMException)
    );

    setItemSpy.mockRestore();
  });
});

describe('"saveToLocalStorage" + "loadFromLocalStorage" (integrazione round-trip)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /** UT_LS_IRT_01 **/
  test('Un oggetto salvato e poi caricato è identico all\'originale', () => {
    const stateOriginale = { utente: 'Mario', preferenze: { tema: 'scuro', lingua: 'it' }, tags: ['a', 'b'] };

    saveToLocalStorage(stateOriginale, 'appState');
    const stateCaricato = loadFromLocalStorage('appState');

    expect(stateCaricato).toEqual(stateOriginale);
  });
});








