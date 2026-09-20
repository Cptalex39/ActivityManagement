import { cartaReducer, cartaSliceActions } from "../../../../../react_redux/store/reducers/CartaReducer";

describe('Vari test su "aggiornaCarte"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_CrtR_AgnCrt_01 **/
  test('Carte aggiornate', () => {
    const actualState = {
      value: {
        carte: [
          {id: 1, numero: "02468"}, 
          {id: 2, numero: "13579"},
        ],
      }
    }

    const action = cartaSliceActions.aggiornaCarte({
      carte: [
        {id: 3, numero: "86420"}, 
        {id: 4, numero: "97531"},
      ],
    });

    const valueExpected = {
      value: {
        carte: [
          {id: 3, numero: "86420"}, 
          {id: 4, numero: "97531"},
        ],
      }
    };

    const result = cartaReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiungiCarta"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_CrtR_AggCrt_01 **/
  test('Carta aggiunta', () => {
    const actualState = {
      value: {
        carte: [
          {id: 1, numero: "02468"}, 
          {id: 2, numero: "13579"},
        ],
      }
    }

    const action = cartaSliceActions.aggiungiCarta({
      carta: {id: 3, numero: "86420"},
    });

    const valueExpected = {
      value: {
        carte: [
          {id: 1, numero: "02468"}, 
          {id: 2, numero: "13579"},
          {id: 3, numero: "86420"},
        ],
      }
    };

    const result = cartaReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "rimuoviCarta"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  /** UT_CrtR_RimCrt_01 **/
  test('Carta aggiunta', () => {
    const actualState = {
      value: {
        carte: [
          {id: 1, numero: "02468"}, 
          {id: 2, numero: "13579"},
        ],
      }
    }

    const action = cartaSliceActions.rimuoviCarta({
      id: 2,
    });

    const valueExpected = {
      value: {
        carte: [
          {id: 1, numero: "02468"},
        ],
      }
    };

    const result = cartaReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});







