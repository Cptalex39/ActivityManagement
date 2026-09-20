import { getInitialStateWithStorage, getInitialStateWithoutStorage } from "../../../../../react_redux/store/reducers/State";
import { loadFromLocalStorage } from "../../../../../react_redux/store/reducers/LocalStorage";

jest.mock('../../../../../react_redux/store/reducers/LocalStorage', () => ({
  loadFromLocalStorage: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Vari test su "getInitialStateWithStorage"', () => {
  /** UT_Sta_GetIniStaWithSto_01 **/
  test('Chiama loadFromLocalStorage con il nameItem passato', () => {
    loadFromLocalStorage.mockReturnValue(undefined);

    getInitialStateWithStorage('default', 'chiaveTest');

    expect(loadFromLocalStorage).toHaveBeenCalledWith('chiaveTest');
  });

  /** UT_Sta_GetIniStaWithSto_02 **/
  test('Restituisce il valore caricato dal local storage se presente', () => {
    const statoSalvato = { value: 'valoreSalvato', extra: 123 };
    loadFromLocalStorage.mockReturnValue(statoSalvato);

    const result = getInitialStateWithStorage('default', 'chiaveTest');

    expect(result).toBe(statoSalvato); // stessa referenza, nessuna copia
  });

  /** UT_Sta_GetIniStaWithSto_03 **/
  test('Restituisce { value } di default se loadFromLocalStorage restituisce undefined', () => {
    loadFromLocalStorage.mockReturnValue(undefined);

    const result = getInitialStateWithStorage('default', 'chiaveTest');

    expect(result).toEqual({ value: 'default' });
  });

  /** UT_Sta_GetIniStaWithSto_04 **/
  test('Restituisce { value } di default se loadFromLocalStorage restituisce null', () => {
    loadFromLocalStorage.mockReturnValue(null);

    const result = getInitialStateWithStorage('default', 'chiaveTest');

    expect(result).toEqual({ value: 'default' });
  });

  /** UT_Sta_GetIniStaWithSto_05 **/
  test('Il default può essere un oggetto complesso, non solo un primitivo', () => {
    loadFromLocalStorage.mockReturnValue(undefined);
    const defaultComplesso = { nome: 'Mario', eta: 30 };

    const result = getInitialStateWithStorage(defaultComplesso, 'chiaveTest');

    expect(result).toEqual({ value: defaultComplesso });
  });
});

describe('Vari test su "getInitialStateWithoutStorage"', () => {
  /** UT_Sta_GetIniStaWithoutSto_01 **/
  test('Restituisce { value } con il valore passato', () => {
    const result = getInitialStateWithoutStorage('ciao', 'chiaveIgnorata');

    expect(result).toEqual({ value: 'ciao' });
  });

  /** UT_Sta_GetIniStaWithoutSto_02 **/
  test('Non chiama loadFromLocalStorage in nessun caso', () => {
    getInitialStateWithoutStorage('ciao', 'chiaveIgnorata');

    expect(loadFromLocalStorage).not.toHaveBeenCalled();
  });

  /** UT_Sta_GetIniStaWithoutSto_03 **/
  test('Ignora completamente il parametro nameItem', () => {
    const resultA = getInitialStateWithoutStorage('x', 'chiaveA');
    const resultB = getInitialStateWithoutStorage('x', 'chiaveB');

    expect(resultA).toEqual(resultB);
  });

  /** UT_Sta_GetIniStaWithoutSto_04 **/
  test('Funziona anche con value complesso (oggetto/array)', () => {
    const valoreComplesso = { a: 1, b: [1, 2, 3] };

    const result = getInitialStateWithoutStorage(valoreComplesso, 'chiave');

    expect(result).toEqual({ value: valoreComplesso });
  });

  /** UT_Sta_GetIniStaWithoutSto_05 **/
  test('Funziona con value undefined', () => {
    const result = getInitialStateWithoutStorage(undefined, 'chiave');

    expect(result).toEqual({ value: undefined });
  });
});






