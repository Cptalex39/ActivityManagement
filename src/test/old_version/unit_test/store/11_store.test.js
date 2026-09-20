// Mock del localStorage
beforeAll(() => {
  // Configura il mock globale di localStorage
  global.localStorage = {
    getItem: jest.fn(() => null), // Simula uno stato vuoto nel localStorage.
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
});

import store from "../../../store/store.js";

describe('Test sullo store', () => {
  it('dovrebbe avere i reducers corretti', () => {
    const state = store.getState();

    // Verifica che ogni reducer sia definito nello stato
    expect(state).toHaveProperty('stileSliceReducer');
    expect(state).toHaveProperty('attivitaSliceReducer');
    expect(state).toHaveProperty('autenticazioneSliceReducer');
    expect(state).toHaveProperty('clienteSliceReducer');
    expect(state).toHaveProperty('servizioSliceReducer');
    expect(state).toHaveProperty('lavoroSliceReducer');
    expect(state).toHaveProperty('spesaSliceReducer');
  });
});
