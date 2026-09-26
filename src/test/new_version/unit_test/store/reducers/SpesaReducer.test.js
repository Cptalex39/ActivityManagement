import { spesaReducer, spesaSliceActions } from "../../../../../react_redux/store/reducers/SpesaReducer";

const stateWithSpese1 = {
  value: {
    spese: [
      { 
        id:1, 
        nome:"Spesa 1", 
        giorno:"2021-10-05",
        descrizione:"Descrizione spesa 1",
        totale:124.14,
        note:"Note spesa 1",
        tipo_selezione:2 
      }, 
      { 
        id:2, 
        nome:"Spesa 2", 
        giorno:"2022-10-05",
        descrizione:"Descrizione spesa 2",
        totale:224.24,
        note:"Note spesa 2",
        tipo_selezione:1
      }
    ], 
    usciteSpese: [123.45, 678.90],
  }
};

const stateWithoutSpese1 = {
  value: {
    spese: [], 
    usciteSpese: [123.45, 678.90],
  }
};

const stateWithoutSpese2 = {
  value: {
    spese: -1, 
    usciteSpese: [123.45, 678.90],
  }
};

describe('Vari test su "aggiornaUsciteSpese"', () => {
  /** UT_SpeR_AgnUscSpe_01 **/
  test('Uscite spese aggiornate', () => {
    const action = spesaSliceActions.aggiornaUsciteSpese({
      usciteSpese: [135.79, 246.80]
    });

    const valueExpected = {
      value: {
        spese: [
          { 
            id:1, 
            nome:"Spesa 1", 
            giorno:"2021-10-05",
            descrizione:"Descrizione spesa 1",
            totale:124.14,
            note:"Note spesa 1",
            tipo_selezione:2 
          }, 
          { 
            id:2, 
            nome:"Spesa 2", 
            giorno:"2022-10-05",
            descrizione:"Descrizione spesa 2",
            totale:224.24,
            note:"Note spesa 2",
            tipo_selezione:1
          }
        ], 
        usciteSpese: [135.79, 246.80],
      },
    }

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });
});









