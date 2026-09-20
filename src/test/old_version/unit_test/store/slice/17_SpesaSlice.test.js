import { spesaSliceReducer, spesaSliceActions } from "../../../../store/slice/SpesaSlice.js";

describe("spesaSlice reducer", () => {
  const speseEmpty = []
  const speseNotEmpty = [
    {
      id: 1, 
      tipo_selezione: 0, 
      nome: "Bolletta luce",
      descrizione: "Descrizione sulla prima spesa", 
      descrizione_attuale: "DESCRIZIONE SULLA PRIMA SPESA", 
      totale: 123.45, 
      totale_attuale: 543.21, 
      giorno: "01/02/2022", 
      giorno_attuale: "02/01/2022",
      note: "Note sulla prima spesa.",
      note_attuale: "NOTE SULLA PRIMA SPESA.",  
    }, 
    {
      id: 2, 
      tipo_selezione: 0, 
      nome: "Bolletta acqua",
      descrizione: "Descrizione sulla seconda spesa",
      descrizione_attuale: "DESCRIZIONE SULLA SECONDA SPESA", 
      totale: 678.99, 
      totale_attuale: 998.76, 
      giorno: "03/04/2024", 
      giorno_attuale: "04/03/2024",
      note: "Note sulla seconda spesa.",
      note_attuale: "NOTE SULLA SECONDA SPESA.",
    }
  ];

  test("test su 'aggiornaSpese'", () => {
    const initialState = {
      value: { 
        spese: speseEmpty, 
        usciteSpese: []
      } 
    };

    const action = spesaSliceActions.aggiornaSpese({ 
      spese: speseNotEmpty 
    });

    const newState = spesaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual(speseNotEmpty);
  });

  test("test su 'aggiornaTipoSelezione'", () => {
    const initialState = {
      value: { 
        spese: speseNotEmpty  
      } 
    };

    const action = spesaSliceActions.aggiornaTipoSelezione({ 
      id_spesa: 2, 
      nuova_selezione: 1
    });

    const newState = spesaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Bolletta luce",
        descrizione: "Descrizione sulla prima spesa", 
        descrizione_attuale: "DESCRIZIONE SULLA PRIMA SPESA", 
        totale: 123.45, 
        totale_attuale: 543.21, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022",
        note: "Note sulla prima spesa.",
        note_attuale: "NOTE SULLA PRIMA SPESA.",  
      }, 
      {
        id: 2, 
        tipo_selezione: 1, 
        nome: "Bolletta acqua",
        descrizione: "Descrizione sulla seconda spesa",
        descrizione_attuale: "DESCRIZIONE SULLA SECONDA SPESA", 
        totale: 678.99, 
        totale_attuale: 998.76, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024",
        note: "Note sulla seconda spesa.",
        note_attuale: "NOTE SULLA SECONDA SPESA.",
      }
    ]);
  });

  test("test su 'aggiornaSpesa'", () => {
    const initialState = {
      value: { 
        spese: speseNotEmpty
      } 
    };

    const action = spesaSliceActions.aggiornaSpesa({ 
      id_spesa: 2, 
      nome_attributo: "totale", 
      nuovo_valore: 102.56
    });

    const newState = spesaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Bolletta luce",
        descrizione: "Descrizione sulla prima spesa", 
        descrizione_attuale: "DESCRIZIONE SULLA PRIMA SPESA", 
        totale: 123.45, 
        totale_attuale: 543.21, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022",
        note: "Note sulla prima spesa.",
        note_attuale: "NOTE SULLA PRIMA SPESA.",  
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Bolletta acqua",
        descrizione: "Descrizione sulla seconda spesa",
        descrizione_attuale: "DESCRIZIONE SULLA SECONDA SPESA", 
        totale: 102.56, 
        totale_attuale: 998.76, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024",
        note: "Note sulla seconda spesa.",
        note_attuale: "NOTE SULLA SECONDA SPESA.",
      }
    ]);
  });

  test("test su 'getSpesaPrimaDellaModifica'", () => {
    const initialState = {
      value: { 
        spese: speseNotEmpty
      } 
    };

    const action = spesaSliceActions.getSpesaPrimaDellaModifica({ 
      id_spesa: 2, 
    });

    const newState = spesaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Bolletta luce",
        descrizione: "Descrizione sulla prima spesa", 
        descrizione_attuale: "DESCRIZIONE SULLA PRIMA SPESA", 
        totale: 123.45, 
        totale_attuale: 543.21, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022",
        note: "Note sulla prima spesa.",
        note_attuale: "NOTE SULLA PRIMA SPESA.",  
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Bolletta acqua",
        descrizione: "DESCRIZIONE SULLA SECONDA SPESA",
        descrizione_attuale: "DESCRIZIONE SULLA SECONDA SPESA", 
        totale: 998.76, 
        totale_attuale: 998.76, 
        giorno: "04/03/2024", 
        giorno_attuale: "04/03/2024",
        note: "NOTE SULLA SECONDA SPESA.",
        note_attuale: "NOTE SULLA SECONDA SPESA.",
      }
    ]);
  });

  test("test su 'getSpesaDopoLaModifica'", () => {
    const initialState = {
      value: { 
        spese: speseNotEmpty
      } 
    };

    const action = spesaSliceActions.getSpesaDopoLaModifica({ 
      id_spesa: 2, 
    });

    const newState = spesaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Bolletta luce",
        descrizione: "Descrizione sulla prima spesa", 
        descrizione_attuale: "DESCRIZIONE SULLA PRIMA SPESA", 
        totale: 123.45, 
        totale_attuale: 543.21, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022",
        note: "Note sulla prima spesa.",
        note_attuale: "NOTE SULLA PRIMA SPESA.",  
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Bolletta acqua",
        descrizione: "Descrizione sulla seconda spesa",
        descrizione_attuale: "Descrizione sulla seconda spesa", 
        totale: 678.99, 
        totale_attuale: 678.99, 
        giorno: "03/04/2024", 
        giorno_attuale: "03/04/2024",
        note: "Note sulla seconda spesa.",
        note_attuale: "Note sulla seconda spesa.",
      }  
    ]);
  });

  test("test su 'inserimentoSpesa'", () => {
    const initialState = {
      value: { 
        spese: speseNotEmpty  
      } 
    };

    const action = spesaSliceActions.inserimentoSpesa({ 
      nuovaSpesa: {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Spese varie",
        descrizione: "Descrizione sulla terza spesa",
        descrizione_attuale: "Descrizione sulla terza spesa", 
        totale: 901.23, 
        totale_attuale: 901.23, 
        giorno: "05/06/2026", 
        giorno_attuale: "05/06/2026",
        note: "Note sulla terza spesa.",
        note_attuale: "Note sulla terza spesa.",
      }
    });

    const newState = spesaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Bolletta luce",
        descrizione: "Descrizione sulla prima spesa", 
        descrizione_attuale: "DESCRIZIONE SULLA PRIMA SPESA", 
        totale: 123.45, 
        totale_attuale: 543.21, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022",
        note: "Note sulla prima spesa.",
        note_attuale: "NOTE SULLA PRIMA SPESA.",  
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Bolletta acqua",
        descrizione: "Descrizione sulla seconda spesa",
        descrizione_attuale: "DESCRIZIONE SULLA SECONDA SPESA", 
        totale: 678.99, 
        totale_attuale: 998.76, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024",
        note: "Note sulla seconda spesa.",
        note_attuale: "NOTE SULLA SECONDA SPESA.",
      }, 
      {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Spese varie",
        descrizione: "Descrizione sulla terza spesa",
        descrizione_attuale: "Descrizione sulla terza spesa", 
        totale: 901.23, 
        totale_attuale: 901.23, 
        giorno: "05/06/2026", 
        giorno_attuale: "05/06/2026",
        note: "Note sulla terza spesa.",
        note_attuale: "Note sulla terza spesa.",
      }
    ]);
  });

  test("test su 'aggiornaUsciteSpese'", () => {
    const initialState = {
      value: { 
        spese: [], 
        usciteSpese: 258.82  
      }
    };

    const action = spesaSliceActions.aggiornaUsciteSpese({ 
      usciteSpese: 288.52
    });

    const newState = spesaSliceReducer(initialState, action);

    expect(newState.value.usciteSpese).toEqual(288.52);
  });
});










