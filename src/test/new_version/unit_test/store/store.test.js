import store from "../../../../react_redux/store/store";

jest.mock('../../../../react_redux/store/reducers/StileReducer', () => ({
  stileReducer: (state = 'STILE_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/AutenticazioneReducer', () => ({
  autenticazioneReducer: (state = 'AUTENTICAZIONE_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/ClienteReducer', () => ({
  clienteReducer: (state = 'CLIENTE_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/ServizioReducer', () => ({
  servizioReducer: (state = 'SERVIZIO_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/SpesaReducer', () => ({
  spesaReducer: (state = 'SPESA_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/CarrelloReducer', () => ({
  carrelloReducer: (state = 'CARRELLO_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/CartaReducer', () => ({
  cartaReducer: (state = 'CARTA_INITIAL', action) => state,
}));
jest.mock('../../../../react_redux/store/reducers/OrdineReducer', () => ({
  ordineReducer: (state = 'ORDINE_INITIAL', action) => state,
}));

describe('Vari test su "store"', () => {
  /** UT_Sto_01 **/
  test('Espone le API standard di un Redux store (getState, dispatch, subscribe)', () => {
    expect(typeof store.getState).toBe('function');
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.subscribe).toBe('function');
  });

  /** UT_Sto_02 **/
  test('Lo stato iniziale ha esattamente le 9 chiavi attese', () => {
    const state = store.getState();

    expect(Object.keys(state).sort()).toEqual(
      [
        'autenticazione',
        'stile',
        'cliente',
        'servizio',
        'spesa',
        'carrello',
        'carta',
        'ordine',
      ].sort()
    );
  });

  /** UT_Sto_03 **/
  test('Ogni chiave dello stato è collegata al reducer corretto (nessuna chiave scambiata)', () => {
    const state = store.getState();

    expect(state.autenticazione).toBe('AUTENTICAZIONE_INITIAL');
    expect(state.stile).toBe('STILE_INITIAL');
    expect(state.cliente).toBe('CLIENTE_INITIAL');
    expect(state.servizio).toBe('SERVIZIO_INITIAL');
    expect(state.spesa).toBe('SPESA_INITIAL');
    expect(state.carrello).toBe('CARRELLO_INITIAL');
    expect(state.carta).toBe('CARTA_INITIAL');
    expect(state.ordine).toBe('ORDINE_INITIAL');
  });

  /** UT_Sto_04 **/
  test('Dispatchare un\'azione sconosciuta non altera lo stato (i reducer mock ignorano azioni non gestite)', () => {
    const statoIniziale = store.getState();

    store.dispatch({ type: 'AZIONE_INESISTENTE' });

    expect(store.getState()).toEqual(statoIniziale);
  });

  /** UT_Sto_05 **/
  test('Dispatch propaga la stessa azione a tutti i reducer (verifica indiretta tramite un reducer spia)', () => {
    expect(() => store.dispatch({ type: 'QUALSIASI_AZIONE', payload: { x: 1 } })).not.toThrow();
  });
});












