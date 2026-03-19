// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const name = "Lavoro";

const initialState = {
  value: {
    lavori: [], 
    entrateLavori: [], 
  } 
};

const reducers = {
  aggiornaLavori: (state, action) => {
    state.value.lavori = action.payload.lavori 
  },
  aggiornaTipoSelezione: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].codice === action.payload.codice_lavoro) {
          state.value.lavori[i].tipo_selezione = action.payload.nuova_selezione;
          break;
        }
      }
    }
  }, 
  aggiornaLavoro: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].codice === action.payload.codice_lavoro) {
          state.value.lavori[i][action.payload.nome_attributo] = action.payload.nuovo_valore;
          break;
        }
      }
    }
  }, 
  getLavoroPrimaDellaModifica: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].codice === action.payload.codice_lavoro) {
          state.value.lavori[i]["descrizione"] = state.value.lavori[i]["descrizione_attuale"];
          state.value.lavori[i]["data_lavoro"] = state.value.lavori[i]["data_lavoro_attuale"];
          state.value.lavori[i]["data_inizio"] = state.value.lavori[i]["data_inizio_attuale"];
          state.value.lavori[i]["data_fine"] = state.value.lavori[i]["data_fine_attuale"];
          state.value.lavori[i]["data_spedizione"] = state.value.lavori[i]["data_spedizione_attuale"];
          state.value.lavori[i]["data_consegna"] = state.value.lavori[i]["data_consegna_attuale"];
          state.value.lavori[i]["stato"] = state.value.lavori[i]["stato_attuale"];
          state.value.lavori[i]["totale"] = state.value.lavori[i]["totale_attuale"];
          state.value.lavori[i]["metodo_pagamento"] = state.value.lavori[i]["metodo_pagamento_attuale"];
          state.value.lavori[i]["indirizzo_spedizione"] = state.value.lavori[i]["indirizzo_spedizione_attuale"];
          state.value.lavori[i]["note"] = state.value.lavori[i]["note_attuale"];
          break;
        }
      }
    }
  },
  getLavoroDopoLaModifica: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].codice === action.payload.codice_lavoro) {
          state.value.lavori[i]["descrizione_attuale"] = state.value.lavori[i]["descrizione"];
          state.value.lavori[i]["data_lavoro_attuale"] = state.value.lavori[i]["data_lavoro"];
          state.value.lavori[i]["data_inizio_attuale"] = state.value.lavori[i]["data_inizio"];
          state.value.lavori[i]["data_fine_attuale"] = state.value.lavori[i]["data_fine"];
          state.value.lavori[i]["data_spedizione_attuale"] = state.value.lavori[i]["data_spedizione"];
          state.value.lavori[i]["data_consegna_attuale"] = state.value.lavori[i]["data_consegna"];
          state.value.lavori[i]["stato_attuale"] = state.value.lavori[i]["stato"];
          state.value.lavori[i]["totale_attuale"] = state.value.lavori[i]["totale"];
          state.value.lavori[i]["metodo_pagamento_attuale"] = state.value.lavori[i]["metodo_pagamento"];
          state.value.lavori[i]["indirizzo_spedizione_attuale"] = state.value.lavori[i]["indirizzo_spedizione"];
          state.value.lavori[i]["note_attuale"] = state.value.lavori[i]["note"];
          break;
        }
      }
    }
  },
  aggiornaEntrateLavori: (state, action) => {
    state.value.entrateLavori = action.payload.entrateLavori
  }
}

const lavoroSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers, 
})

export const lavoroSliceActions = {
  aggiornaLavori: lavoroSlice.actions.aggiornaLavori,
  aggiornaTipoSelezione: lavoroSlice.actions.aggiornaTipoSelezione,
  aggiornaLavoro: lavoroSlice.actions.aggiornaLavoro,
  getLavoroPrimaDellaModifica: lavoroSlice.actions.getLavoroPrimaDellaModifica,
  getLavoroDopoLaModifica: lavoroSlice.actions.getLavoroDopoLaModifica,
  aggiornaEntrateLavori: lavoroSlice.actions.aggiornaEntrateLavori, 
};
export const lavoroReducer = lavoroSlice.reducer;