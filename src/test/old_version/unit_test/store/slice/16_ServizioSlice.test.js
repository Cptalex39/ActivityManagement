import { servizioSliceReducer, servizioSliceActions } from "../../../../store/slice/ServizioSlice.js";

describe("servizioSlice reducer", () => {
  const serviziEmpty = []
  const serviziNotEmpty = [
    {
      id: 1, 
      tipo_selezione: 0, 
      nome: "Taglio capelli", 
      nome_attuale: "TAGLIO CAPELLI", 
      prezzo: 12.34, 
      prezzo_attuale: 43.21, 
      note: "Note sul primo servizio.",
      note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
      in_uso: 1, 
      in_uso_attuale: 0
    }, 
    {
      id: 2, 
      tipo_selezione: 0, 
      nome: "Rasatura barba",
      nome_attuale: "RASATURA BARBA",  
      prezzo: 56.78, 
      prezzo_attuale: 87.65, 
      note: "Note sul secondo servizio.",
      note_attuale: "NOTE SUL SECONDO SERVIZIO.",  
      in_uso: 1, 
      in_uso_attuale: 0
    },
    {
      id: 3, 
      tipo_selezione: 0, 
      nome: "Taglio capelli", 
      nome_attuale: "TAGLIO CAPELLI", 
      prezzo: 90.12, 
      prezzo_attuale: 21.09, 
      note: "Note sul primo servizio.",
      note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
      in_uso: 0,
      in_uso_attuale: 1
    }
  ];

  test("test su 'aggiornaServizi'", () => {
    const initialState = {
      value: { 
        servizi: serviziEmpty, 
      } 
    };

    const action = servizioSliceActions.aggiornaServizi({ 
      servizi: serviziNotEmpty
    });
    const newState = servizioSliceReducer(initialState, action);
  
    expect(newState.value.servizi).toEqual(serviziNotEmpty);
  });

  test("test su 'aggiornaTipoSelezione'", () => {
    const initialState = {
      value: { 
        servizi: serviziNotEmpty  
      } 
    };

    const action = servizioSliceActions.aggiornaTipoSelezione({ 
      id_servizio: 2, 
      nuova_selezione: 1
    });

    const newState = servizioSliceReducer(initialState, action);
  
    expect(newState.value.servizi).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 12.34, 
        prezzo_attuale: 43.21, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      }, 
      {
        id: 2, 
        tipo_selezione: 1, 
        nome: "Rasatura barba",
        nome_attuale: "RASATURA BARBA",  
        prezzo: 56.78, 
        prezzo_attuale: 87.65, 
        note: "Note sul secondo servizio.",
        note_attuale: "NOTE SUL SECONDO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      },
      {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 90.12, 
        prezzo_attuale: 21.09, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 0,
        in_uso_attuale: 1
      }
    ]);
  });

  test("test su 'aggiornaServizio'", () => {
    const initialState = {
      value: { 
        servizi: serviziNotEmpty  
      } 
    };

    const action = servizioSliceActions.aggiornaServizio({ 
      id_servizio: 2, 
      nome_attributo: "prezzo", 
      nuovo_valore: 10.38
    });

    const newState = servizioSliceReducer(initialState, action);
  
    expect(newState.value.servizi).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 12.34, 
        prezzo_attuale: 43.21, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Rasatura barba",
        nome_attuale: "RASATURA BARBA",  
        prezzo: 10.38, 
        prezzo_attuale: 87.65, 
        note: "Note sul secondo servizio.",
        note_attuale: "NOTE SUL SECONDO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      },
      {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 90.12, 
        prezzo_attuale: 21.09, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 0,
        in_uso_attuale: 1
      } 
    ]);
  });

  test("test su 'getServizioPrimaDellaModifica'", () => {
    const initialState = {
      value: { 
        servizi: serviziNotEmpty
      } 
    };

    const action = servizioSliceActions.getServizioPrimaDellaModifica({ 
      id_servizio: 2, 
    });

    const newState = servizioSliceReducer(initialState, action);
  
    expect(newState.value.servizi).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 12.34, 
        prezzo_attuale: 43.21, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "RASATURA BARBA",
        nome_attuale: "RASATURA BARBA",  
        prezzo: 87.65, 
        prezzo_attuale: 87.65, 
        note: "NOTE SUL SECONDO SERVIZIO.",
        note_attuale: "NOTE SUL SECONDO SERVIZIO.",  
        in_uso: 0, 
        in_uso_attuale: 0
      },
      {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 90.12, 
        prezzo_attuale: 21.09, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 0,
        in_uso_attuale: 1
      }
    ]);
  });

  test("test su 'getServizioDopoLaModifica'", () => {
    const initialState = {
      value: { 
        servizi: serviziNotEmpty
      } 
    };

    const action = servizioSliceActions.getServizioDopoLaModifica({ 
      id_servizio: 2, 
    });

    const newState = servizioSliceReducer(initialState, action);
  
    expect(newState.value.servizi).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 12.34, 
        prezzo_attuale: 43.21, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      },  
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Rasatura barba",
        nome_attuale: "Rasatura barba",  
        prezzo: 56.78, 
        prezzo_attuale: 56.78, 
        note: "Note sul secondo servizio.",
        note_attuale: "Note sul secondo servizio.",  
        in_uso: 1, 
        in_uso_attuale: 1
      },
      {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 90.12, 
        prezzo_attuale: 21.09, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 0,
        in_uso_attuale: 1
      } 
    ]);
  });

  test("test su 'inserimentoServizio'", () => {
    const initialState = {
      value: { 
        servizi: serviziNotEmpty  
      } 
    };

    const action = servizioSliceActions.inserimentoServizio({ 
      nuovoServizio: {
        id: 4, 
        tipo_selezione: 0, 
        nome: "Colorazione capelli", 
        nome_attuale: "Colorazione capelli", 
        prezzo: 34.56, 
        prezzo_attuale: 34.56, 
        note: "Note sul nuovo servizio.",
        note_attuale: "Note sul nuovo servizio.",  
        in_uso: 1,
        in_uso_attuale: 1
      }
    });

    const newState = servizioSliceReducer(initialState, action);
  
    expect(newState.value.servizi).toEqual([
      {
        id: 1, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 12.34, 
        prezzo_attuale: 43.21, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      }, 
      {
        id: 2, 
        tipo_selezione: 0, 
        nome: "Rasatura barba",
        nome_attuale: "RASATURA BARBA",  
        prezzo: 56.78, 
        prezzo_attuale: 87.65, 
        note: "Note sul secondo servizio.",
        note_attuale: "NOTE SUL SECONDO SERVIZIO.",  
        in_uso: 1, 
        in_uso_attuale: 0
      },
      {
        id: 3, 
        tipo_selezione: 0, 
        nome: "Taglio capelli", 
        nome_attuale: "TAGLIO CAPELLI", 
        prezzo: 90.12, 
        prezzo_attuale: 21.09, 
        note: "Note sul primo servizio.",
        note_attuale: "NOTE SUL PRIMO SERVIZIO.",  
        in_uso: 0,
        in_uso_attuale: 1
      }, 
      {
        id: 4, 
        tipo_selezione: 0, 
        nome: "Colorazione capelli", 
        nome_attuale: "Colorazione capelli", 
        prezzo: 34.56, 
        prezzo_attuale: 34.56, 
        note: "Note sul nuovo servizio.",
        note_attuale: "Note sul nuovo servizio.",  
        in_uso: 1,
        in_uso_attuale: 1
      }
    ]);
  });
});










