import { lavoroSliceReducer, lavoroSliceActions } from "../../../../store/slice/LavoroSlice.js";

describe("lavoroSlice reducer", () => {
  test("test su 'aggiornaLavori'", () => {
    const initialState = {
      value: { 
        lavori: [], 
        entrateLavori: []
      } 
    };

    const action = lavoroSliceActions.aggiornaLavori({ 
      lavori: [
        { 
          id: 1, 
          tipo_selezione: 0, 
          giorno: "01/02/2022", 
          giorno_attuale: "02/01/2022", 
          totale: 65.55, 
          totale_attuale: 40.40, 
          note: "Note sul primo lavoro.", 
          note_attuale: "NOTE SUL PRIMO LAVORO.", 
          servizi: [
            {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
            {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
          ], 
          servizi_attuale: [
            {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
            {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
          ], 
          collegamenti: [
            {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
            {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
          ], 
          collegamenti_attuale: [
            {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
            {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
          ]
        }, 
        { 
          id: 2, 
          tipo_selezione: 0, 
          giorno: "03/04/2024", 
          giorno_attuale: "04/03/2024", 
          totale: 100.60, 
          totale_attuale: 25.15, 
          note: "Note sulla secondo lavoro.", 
          note_attuale: "NOTE SUL SECONDO LAVORO.", 
          servizi: [
            {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
            {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
          ], 
          servizi_attuale: [
            {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
            {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
          ], 
          collegamenti: [
            {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
          ],
          collegamenti_attuale: [
            {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
          ]
        } 
      ] 
    });
    const newState = lavoroSliceReducer(initialState, action);
  
    expect(newState.value.lavori).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022", 
        totale: 65.55, 
        totale_attuale: 40.40, 
        note: "Note sul primo lavoro.", 
        note_attuale: "NOTE SUL PRIMO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024", 
        totale: 100.60, 
        totale_attuale: 25.15, 
        note: "Note sulla secondo lavoro.", 
        note_attuale: "NOTE SUL SECONDO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
        ],
        collegamenti_attuale: [
          {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
        ]
      } 
    ]);
  });

  test("test su 'aggiornaTipoSelezione'", () => {
    const initialState = {
      value: { 
        lavori: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            giorno: "01/02/2022", 
            giorno_attuale: "02/01/2022", 
            totale: 65.55, 
            totale_attuale: 40.40, 
            note: "Note sul primo lavoro.", 
            note_attuale: "NOTE SUL PRIMO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
            ], 
            collegamenti_attuale: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
            ]
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            giorno: "03/04/2024", 
            giorno_attuale: "04/03/2024", 
            totale: 100.60, 
            totale_attuale: 25.15, 
            note: "Note sulla secondo lavoro.", 
            note_attuale: "NOTE SUL SECONDO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
            ],
            collegamenti_attuale: [
              {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
            ]
          } 
        ]  
      } 
    };

    const action = lavoroSliceActions.aggiornaTipoSelezione({ 
      id_lavoro: 2, 
      nuova_selezione: 1
    });

    const newState = lavoroSliceReducer(initialState, action);
  
    expect(newState.value.lavori).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022", 
        totale: 65.55, 
        totale_attuale: 40.40, 
        note: "Note sul primo lavoro.", 
        note_attuale: "NOTE SUL PRIMO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }, 
      { 
        id: 2, 
        tipo_selezione: 1, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024", 
        totale: 100.60, 
        totale_attuale: 25.15, 
        note: "Note sulla secondo lavoro.", 
        note_attuale: "NOTE SUL SECONDO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
        ],
        collegamenti_attuale: [
          {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
        ]
      } 
    ]);
  });

  test("test su 'aggiornaLavoro'", () => {
    const initialState = {
      value: { 
        lavori: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            giorno: "01/02/2022", 
            giorno_attuale: "02/01/2022", 
            totale: 65.55, 
            totale_attuale: 40.40, 
            note: "Note sul primo lavoro.", 
            note_attuale: "NOTE SUL PRIMO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
            ], 
            collegamenti_attuale: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
            ]
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            giorno: "03/04/2024", 
            giorno_attuale: "04/03/2024", 
            totale: 100.60, 
            totale_attuale: 25.15, 
            note: "Note sulla secondo lavoro.", 
            note_attuale: "NOTE SUL SECONDO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
            ],
            collegamenti_attuale: [
              {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
            ]
          } 
        ]
      } 
    };

    const action = lavoroSliceActions.aggiornaLavoro({ 
      id_lavoro: 2, 
      nome_attributo: "note", 
      nuovo_valore: "Nuove note secondo lavoro."
    });

    const newState = lavoroSliceReducer(initialState, action);
  
    expect(newState.value.lavori).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022", 
        totale: 65.55, 
        totale_attuale: 40.40, 
        note: "Note sul primo lavoro.", 
        note_attuale: "NOTE SUL PRIMO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024", 
        totale: 100.60, 
        totale_attuale: 25.15, 
        note: "Nuove note secondo lavoro.", 
        note_attuale: "NOTE SUL SECONDO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
        ],
        collegamenti_attuale: [
          {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
        ]
      } 
    ]);
  });

  test("test su 'getLavoroPrimaDellaModifica'", () => {
    const initialState = {
      value: { 
        lavori: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            giorno: "01/02/2022", 
            giorno_attuale: "02/01/2022", 
            totale: 65.55, 
            totale_attuale: 40.40, 
            note: "Note sul primo lavoro.", 
            note_attuale: "NOTE SUL PRIMO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
            ], 
            collegamenti_attuale: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
            ]
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            giorno: "03/04/2024", 
            giorno_attuale: "04/03/2024", 
            totale: 100.60, 
            totale_attuale: 25.15, 
            note: "Note sulla secondo lavoro.", 
            note_attuale: "NOTE SUL SECONDO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
            ],
            collegamenti_attuale: [
              {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
            ]
          } 
        ]  
      } 
    };

    const action = lavoroSliceActions.getLavoroPrimaDellaModifica({ 
      id_lavoro: 2, 
    });

    const newState = lavoroSliceReducer(initialState, action);
  
    expect(newState.value.lavori).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022", 
        totale: 65.55, 
        totale_attuale: 40.40, 
        note: "Note sul primo lavoro.", 
        note_attuale: "NOTE SUL PRIMO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        giorno: "04/03/2024", 
        giorno_attuale: "04/03/2024", 
        totale: 25.15, 
        totale_attuale: 25.15, 
        note: "NOTE SUL SECONDO LAVORO.",
        note_attuale: "NOTE SUL SECONDO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 2, id_lavoro: 2, quantita: 1},
        ],
        collegamenti_attuale: [
          {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
        ]
      } 
    ]);
  });

  test("test su 'getLavoroDopoLaModifica'", () => {
    const initialState = {
      value: { 
        lavori: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            giorno: "01/02/2022", 
            giorno_attuale: "02/01/2022", 
            totale: 65.55, 
            totale_attuale: 40.40, 
            note: "Note sul primo lavoro.", 
            note_attuale: "NOTE SUL PRIMO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
            ], 
            collegamenti_attuale: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
            ]
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            giorno: "03/04/2024", 
            giorno_attuale: "04/03/2024", 
            totale: 100.60, 
            totale_attuale: 25.15, 
            note: "Note sulla secondo lavoro.", 
            note_attuale: "NOTE SUL SECONDO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
            ],
            collegamenti_attuale: [
              {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
            ]
          } 
        ]  
      } 
    };

    const action = lavoroSliceActions.getLavoroDopoLaModifica({ 
      id_lavoro: 2, 
    });

    const newState = lavoroSliceReducer(initialState, action);
  
    expect(newState.value.lavori).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022", 
        totale: 65.55, 
        totale_attuale: 40.40, 
        note: "Note sul primo lavoro.", 
        note_attuale: "NOTE SUL PRIMO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        giorno: "03/04/2024", 
        giorno_attuale: "03/04/2024", 
        totale: 100.60, 
        totale_attuale: 100.60, 
        note: "Note sulla secondo lavoro.", 
        note_attuale: "Note sulla secondo lavoro.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
        ],
        collegamenti_attuale: [
          {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
        ]
      }  
    ]);
  });

  test("test su 'inserimentoLavoro'", () => {
    const initialState = {
      value: { 
        lavori: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            giorno: "01/02/2022", 
            giorno_attuale: "02/01/2022", 
            totale: 65.55, 
            totale_attuale: 40.40, 
            note: "Note sul primo lavoro.", 
            note_attuale: "NOTE SUL PRIMO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
            ], 
            collegamenti_attuale: [
              {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
              {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
            ]
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            giorno: "03/04/2024", 
            giorno_attuale: "04/03/2024", 
            totale: 100.60, 
            totale_attuale: 25.15, 
            note: "Note sulla secondo lavoro.", 
            note_attuale: "NOTE SUL SECONDO LAVORO.", 
            servizi: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            servizi_attuale: [
              {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
              {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
            ], 
            collegamenti: [
              {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
            ],
            collegamenti_attuale: [
              {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
            ]
          } 
        ]  
      } 
    };

    const action = lavoroSliceActions.inserimentoLavoro({ 
      nuovoLavoro: { 
        id: 3, 
        tipo_selezione: 0, 
        giorno: "05/06/2026", 
        giorno_attuale: "05/06/2026", 
        totale: 55.65, 
        totale_attuale: 55.65, 
        note: "Note sul terzo lavoro.", 
        note_attuale: "Note sul terzo lavoro.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 2}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 2}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      } 
    });

    const newState = lavoroSliceReducer(initialState, action);
  
    expect(newState.value.lavori).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        giorno: "01/02/2022", 
        giorno_attuale: "02/01/2022", 
        totale: 65.55, 
        totale_attuale: 40.40, 
        note: "Note sul primo lavoro.", 
        note_attuale: "NOTE SUL PRIMO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 2}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 1}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        giorno: "03/04/2024", 
        giorno_attuale: "04/03/2024", 
        totale: 100.60, 
        totale_attuale: 25.15, 
        note: "Note sulla secondo lavoro.", 
        note_attuale: "NOTE SUL SECONDO LAVORO.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 2, id_lavoro: 2, quantita: 4}, 
        ],
        collegamenti_attuale: [
          {id_servizio: 2, id_lavoro: 2, quantita: 1}, 
        ]
      }, 
      { 
        id: 3, 
        tipo_selezione: 0, 
        giorno: "05/06/2026", 
        giorno_attuale: "05/06/2026", 
        totale: 55.65, 
        totale_attuale: 55.65, 
        note: "Note sul terzo lavoro.", 
        note_attuale: "Note sul terzo lavoro.", 
        servizi: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        servizi_attuale: [
          {id: 1, nome: "Taglio capelli", prezzo: 15.25, note: "Note sul primo servizio."}, 
          {id: 2, nome: "Rasatura barba", prezzo: 25.15, note: "Note sul secondo servizio."}
        ], 
        collegamenti: [
          {id_servizio: 1, id_lavoro: 1, quantita: 2}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ], 
        collegamenti_attuale: [
          {id_servizio: 1, id_lavoro: 1, quantita: 2}, 
          {id_servizio: 2, id_lavoro: 1, quantita: 1}, 
        ]
      }
    ]);
  });

  test("test su 'aggiornaEntrateLavori'", () => {
    const initialState = {
      value: { 
        lavori: [], 
        entrateLavori: 11.22  
      }
    };

    const action = lavoroSliceActions.aggiornaEntrateLavori({ 
      entrateLavori: 33.44
    });

    const newState = lavoroSliceReducer(initialState, action);

    expect(newState.value.entrateLavori).toEqual(33.44);
  });
});










