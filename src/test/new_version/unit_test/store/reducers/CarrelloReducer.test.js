import { carrelloReducer, carrelloSliceActions } from "../../../../../react_redux/store/reducers/CarrelloReducer";

describe('Vari test su "aggiungiAlCarrello"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_CarR_AggCar_01 **/
  test('item non presente nel carrello', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }
        ],
      }
    }

    const action = carrelloSliceActions.aggiungiAlCarrello({
      item: {
        id: 5,
        nome: "Forbici",
        prezzo: 10.12,
        tipo: "Prodotto",
        descrizione: "Forbici dalla punta arrotondata", 
        note: "Forbici nere",
        quantita: 10,
      },
      quantita: 10,
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_AggCar_02 **/
  test('item presente nel carrello', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 5,
          }
        ],
      }
    }

    const action = carrelloSliceActions.aggiungiAlCarrello({
      item: {
        id: 5,
        nome: "Forbici",
        prezzo: 10.12,
        tipo: "Prodotto",
        descrizione: "Forbici dalla punta arrotondata", 
        note: "Forbici nere",
        quantita: 10,
      },
      quantita: 10,
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 15,
          }
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "rimuoviDalCarrello"', () => {
  /** UT_CarR_RimCar_01 **/
  test('Elemento non presente nel carrello e quindi non rimosso', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    }

    const action = carrelloSliceActions.rimuoviDalCarrello({
      id: 8
    });

    const valueExpected = actualState;

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_RimCar_02 **/
  test('Elemento presente nel carrello e rimosso', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    }

    const action = carrelloSliceActions.rimuoviDalCarrello({
      id: 5
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaQuantita"', () => {
  /** UT_CarR_AgnQnt_01 **/
  test('Elemento non presente nel carrello', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    }

    const action = carrelloSliceActions.aggiornaQuantita({
      id: 8, 
      quantita: 5
    });

    const valueExpected = actualState;

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_AgnQnt_02 **/
  test('Elemento presente nel carrello ed eliminato', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    }

    const action = carrelloSliceActions.aggiornaQuantita({
      id: 5, 
      quantita: -1
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_AgnQnt_03 **/
  test('Elemento presente nel carrello ed aggiornato', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    }

    const action = carrelloSliceActions.aggiornaQuantita({
      id: 5, 
      quantita: 25
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          },
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 25,
          }, 
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "incrementaQuantita"', () => {
  /** UT_CarR_IncQnt_01 **/
  test('Elemento non presente nel carrello', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    };

    const action = carrelloSliceActions.incrementaQuantita({
      id: 8
    });

    const valueExpected = actualState;

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_IncQnt_02 **/
  test('Elemento presente nel carrello', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    };

    const action = carrelloSliceActions.incrementaQuantita({
      id: 5
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 11,
          },
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "decrementaQuantita"', () => {
  /** UT_CarR_DecQnt_01 **/
  test('Elemento non presente nel carrello', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    };

    const action = carrelloSliceActions.decrementaQuantita({
      id: 8
    });

    const valueExpected = actualState;

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_DecQnt_02 **/
  test('Elemento presente nel carrello e viene decrementato', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    };

    const action = carrelloSliceActions.decrementaQuantita({
      id: 5
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 9,
          },
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CarR_DecQnt_03 **/
  test('Elemento presente nel carrello e viene eliminato', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 1,
          },
        ],
      }
    };

    const action = carrelloSliceActions.decrementaQuantita({
      id: 5
    });

    const valueExpected = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          },
        ],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "svuotaCarrello"', () => {
  /** UT_CarR_SvtCar_01 **/
  test('Il carrello viene svuotatao', () => {
    const actualState = {
      value: {
        items: [
          {
            id: 4,
            nome: "Gomma",
            prezzo: 5.06,
            tipo: "Prodotto",
            descrizione: "Gomma da cancellare", 
            note: "Gobba di colore bianco",
            quantita: 6,
          }, 
          {
            id: 5,
            nome: "Forbici",
            prezzo: 10.12,
            tipo: "Prodotto",
            descrizione: "Forbici dalla punta arrotondata", 
            note: "Forbici nere",
            quantita: 10,
          },
        ],
      }
    };

    const action = carrelloSliceActions.svuotaCarrello();

    const valueExpected = {
      value: {
        items: [],
      }
    };

    const result = carrelloReducer(actualState, action);

    expect(result).toEqual(valueExpected);
  });
});









