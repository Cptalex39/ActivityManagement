import { ordineReducer, ordineSliceActions } from "../../../../../react_redux/store/reducers/OrdineReducer";

describe('Vari test su "aggiornaOrdini"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_OrdR_AgnOrd_01 **/
  test('Ordini aggiornati', () => {
    const actualState = {
      value: {
        ordini: [
          {codice: "02468", nome: "Ordine 1"}, 
          {codice: "13579", nome: "Ordine 2"},
        ],
      }
    }

    const action = ordineSliceActions.aggiornaOrdini({
      ordini: [
        {codice: "86420", nome: "Ordine 3"}, 
        {codice: "97531", nome: "Ordine 4"},
      ],
    });

    const valueExpected = {
      value: {
        ordini: [
          {codice: "86420", nome: "Ordine 3"}, 
          {codice: "97531", nome: "Ordine 4"},
        ],
      }
    };

    const result = ordineReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});









