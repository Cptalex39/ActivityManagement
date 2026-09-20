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

const stateWithSpese2 = {
  value: {
    spese: [
      { 
        id:1, 
        nome:"Spesa 1", 
        giorno_attuale:"2021-10-05",
        descrizione_attuale:"Descrizione spesa 1",
        totale_attuale:124.14,
        note_attuale:"Note spesa 1",
        tipo_selezione:2 
      }, 
      { 
        id:2, 
        nome:"Spesa 2", 
        giorno_attuale:"2022-10-05",
        descrizione_attuale:"Descrizione spesa 2",
        totale_attuale:224.24,
        note_attuale:"Note spesa 2",
        tipo_selezione:1
      }
    ], 
    usciteSpese: [123.45, 678.90],
  }
};

const stateWithSpese3 = {
  value: {
    spese: [
      { 
        id:1, 
        nome:"Spesa 1", 
        giorno_attuale:"2021-10-05",
        descrizione_attuale:"Descrizione spesa 1",
        totale_attuale:124.14,
        note_attuale:"Note spesa 1",
        tipo_selezione:2 
      }, 
      { 
        id:2, 
        nome:"Spesa 2", 
        giorno:"2022-10-05",
        giorno_attuale:"2022-10-05",
        descrizione:"Descrizione spesa 2",
        descrizione_attuale:"Descrizione spesa 2",
        totale:224.24,
        totale_attuale:224.24,
        note:"Note spesa 2",
        note_attuale:"Note spesa 2",
        tipo_selezione:1
      }
    ], 
    usciteSpese: [123.45, 678.90],
  }
};

const stateWithSpese4 = {
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
        giorno_attuale:"2022-10-05",
        descrizione:"Descrizione spesa 2",
        descrizione_attuale:"Descrizione spesa 2",
        totale:224.24,
        totale_attuale:224.24,
        note:"Note spesa 2",
        note_attuale:"Note spesa 2",
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

describe('Vari test su "aggiornaSpese"', () => {
  /** UT_SpeR_AgnSpese_01 **/
  test('Spese aggiornate', () => {
    const action = spesaSliceActions.aggiornaSpese({
      spese: [
        { 
          id:3, 
          nome:"Spesa 3", 
          giorno:"2023-10-05",
          descrizione:"Descrizione spesa 3",
          totale:324.34,
          note:"Note spesa 3",
          tipo_selezione:0 
        }, 
        { 
          id:4, 
          nome:"Spesa 4", 
          giorno:"2024-10-05",
          descrizione:"Descrizione spesa 4",
          totale:424.44,
          note:"Note spesa 4",
          tipo_selezione:0 
        }
      ]
    });

    const valueExpected = {
      value: {
        spese: [
          { 
            id:3, 
            nome:"Spesa 3", 
            giorno:"2023-10-05",
            descrizione:"Descrizione spesa 3",
            totale:324.34,
            note:"Note spesa 3",
            tipo_selezione:0
          }, 
          { 
            id:4, 
            nome:"Spesa 4", 
            giorno:"2024-10-05",
            descrizione:"Descrizione spesa 4",
            totale:424.44,
            note:"Note spesa 4",
            tipo_selezione:0 
          }
        ], 
        usciteSpese: [123.45, 678.90],
      },
    }

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaTipoSelezione"', () => {
  /** UT_SpeR_AgnTipSel_01 **/
  test('spese = []', () => {
    const action = spesaSliceActions.aggiornaTipoSelezione({
      id_spesa: 4, 
      nuova_selezione: 0,
    });

    const valueExpected = stateWithoutSpese1;

    const result = spesaReducer(stateWithoutSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_AgnTipSel_02 **/
  test('spese = -1', () => {
    const action = spesaSliceActions.aggiornaTipoSelezione({
      id_spesa: 4, 
      nuova_selezione: 0,
    });

    const valueExpected = stateWithoutSpese2

    const result = spesaReducer(stateWithoutSpese2, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_AgnTipSel_03 **/
  test('spese non vuoto, spesa non presente', () => {
    const action = spesaSliceActions.aggiornaTipoSelezione({
      id_spesa: 4, 
      nuova_selezione: 0,
    });

    const valueExpected = stateWithSpese1

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_AgnTipSel_04 **/
  test('spese non vuoto, spesa presente', () => {
    const action = spesaSliceActions.aggiornaTipoSelezione({
      id_spesa: 2, 
      nuova_selezione: 0,
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
            tipo_selezione:0
          }
        ],
        usciteSpese: [123.45, 678.90],
      }
    };

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaSpesa"', () => {
  /** UT_SpeR_AgnSpesa_01 **/
  test('spese = []', () => {
    const action = spesaSliceActions.aggiornaSpesa({
      id_spesa: 2, 
      nome_attributo: "nome", 
      nuovo_valore: "Nome spesa 2 aggiornato"
    });

    const valueExpected = stateWithoutSpese1

    const result = spesaReducer(stateWithoutSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_AgnSpesa_02 **/
  test('spese = -1', () => {
    const action = spesaSliceActions.aggiornaSpesa({
      id_spesa: 2, 
      nome_attributo: "nome", 
      nuovo_valore: "Nome spesa 2 aggiornato"
    });

    const valueExpected = stateWithoutSpese2

    const result = spesaReducer(stateWithoutSpese2, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_AgnSpesa_03 **/
  test('spese non vuoto, spesa non presente', () => {
    const action = spesaSliceActions.aggiornaSpesa({
      id_spesa: 4, 
      nome_attributo: "nome", 
      nuovo_valore: "Nome spesa 2 aggiornato"
    });

    const valueExpected = stateWithSpese1

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_AgnSpesa_04 **/
  test('spese non vuoto, spesa presente', () => {
    const action = spesaSliceActions.aggiornaSpesa({
      id_spesa: 2, 
      nome_attributo: "nome", 
      nuovo_valore: "Nome spesa 2 aggiornato"
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
            nome:"Nome spesa 2 aggiornato", 
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

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "getSpesaPrimaDellaModifica"', () => {
  /** UT_SpeR_GetSpePriMod_01 **/
  test('spese = []', () => {
    const action = spesaSliceActions.getSpesaPrimaDellaModifica({
      id_spesa: 2, 
    });

    const valueExpected = stateWithoutSpese1;

    const result = spesaReducer(stateWithoutSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_GetSpePriMod_02 **/
  test('spese = -1', () => {
    const action = spesaSliceActions.getSpesaPrimaDellaModifica({
      id_spesa: 2, 
    });

    const valueExpected = stateWithoutSpese2;

    const result = spesaReducer(stateWithoutSpese2, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_GetSpePriMod_03 **/
  test('spese non vuoto e spesa non presente', () => {
    const action = spesaSliceActions.getSpesaPrimaDellaModifica({
      id_spesa: 4, 
    });

    const valueExpected = stateWithSpese1;

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_GetSpePriMod_04 **/
  test('spese non vuoto e spesa presente', () => {
    const action = spesaSliceActions.getSpesaPrimaDellaModifica({
      id_spesa: 2, 
    });

    const valueExpected = stateWithSpese3;


    const result = spesaReducer(stateWithSpese2, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "getSpesaDopoLaModifica"', () => {
  /** UT_SpeR_GetSpeDopMod_01 **/
  test('spese = []', () => {
    const action = spesaSliceActions.getSpesaDopoLaModifica({
      id_spesa: 2, 
    });

    const valueExpected = stateWithoutSpese1;

    const result = spesaReducer(stateWithoutSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_GetSpeDopMod_02 **/
  test('spese = -1', () => {
    const action = spesaSliceActions.getSpesaDopoLaModifica({
      id_spesa: 2, 
    });

    const valueExpected = stateWithoutSpese2;

    const result = spesaReducer(stateWithoutSpese2, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_GetSpeDopMod_03 **/
  test('spese non vuoto e spesa non presente', () => {
    const action = spesaSliceActions.getSpesaDopoLaModifica({
      id_spesa: 4, 
    });

    const valueExpected = stateWithSpese1;

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_GetSpeDopMod_04 **/
  test('spesa non vuoto e spesa presente', () => {
    const action = spesaSliceActions.getSpesaDopoLaModifica({
      id_spesa: 2, 
    });

    const valueExpected = stateWithSpese4;

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "inserimentoSpesa"', () => {
  /** UT_SpeR_InsSpe_01 **/
  test('spese = []', () => {
    const action = spesaSliceActions.inserimentoSpesa({
      nuovaSpesa: {
        id:3, 
        nome:"Spesa 3", 
        giorno:"2023-10-05",
        descrizione:"Descrizione spesa 3",
        totale:324.34,
        note:"Note spesa 3",
        tipo_selezione:0 
      }, 
    });

    const valueExpected = {
      value: {
        spese: [
          {
            id:3, 
            nome:"Spesa 3", 
            giorno:"2023-10-05",
            descrizione:"Descrizione spesa 3",
            totale:324.34,
            note:"Note spesa 3",
            tipo_selezione:0 
          }
        ], 
        usciteSpese: [123.45, 678.90],
      } 
    };

    const result = spesaReducer(stateWithoutSpese1, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_InsSpe_02 **/
  test('spese = -1', () => {
    const action = spesaSliceActions.inserimentoSpesa({
      nuovaSpesa: {
        id:3, 
        nome:"Spesa 3", 
        giorno:"2023-10-05",
        descrizione:"Descrizione spesa 3",
        totale:324.34,
        note:"Note spesa 3",
        tipo_selezione:0 
      }, 
    });

    const valueExpected = {
      value: {
        spese: [
          {
            id:3, 
            nome:"Spesa 3", 
            giorno:"2023-10-05",
            descrizione:"Descrizione spesa 3",
            totale:324.34,
            note:"Note spesa 3",
            tipo_selezione:0 
          }
        ], 
        usciteSpese: [123.45, 678.90],
      } 
    };

    const result = spesaReducer(stateWithoutSpese2, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_SpeR_InsSpe_03 **/
  test('spese non vuoto', () => {
    const action = spesaSliceActions.inserimentoSpesa({
      nuovaSpesa: {
        id:3, 
        nome:"Spesa 3", 
        giorno:"2023-10-05",
        descrizione:"Descrizione spesa 3",
        totale:324.34,
        note:"Note spesa 3",
        tipo_selezione:0 
      }, 
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
          }, 
          {
            id:3, 
            nome:"Spesa 3", 
            giorno:"2023-10-05",
            descrizione:"Descrizione spesa 3",
            totale:324.34,
            note:"Note spesa 3",
            tipo_selezione:0 
          }
        ], 
        usciteSpese: [123.45, 678.90],
      } 
    };

    const result = spesaReducer(stateWithSpese1, action);

    expect(result).toEqual(valueExpected);
  });
});

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









