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
        if(state.value.lavori[i].id === action.payload.id_lavoro) {
          state.value.lavori[i].tipo_selezione = action.payload.nuova_selezione;
          break;
        }
      }
    }
  }, 
  aggiornaLavoro: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].id === action.payload.id_lavoro) {
          state.value.lavori[i][action.payload.nome_attributo] = action.payload.nuovo_valore;
          break;
        }
      }
    }
  }, 
  getLavoroPrimaDellaModifica: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].id === action.payload.id_lavoro) {
          state.value.lavori[i]["giorno"] = state.value.lavori[i]["giorno_attuale"]; 
          state.value.lavori[i]["totale"] = state.value.lavori[i]["totale_attuale"]; 
          state.value.lavori[i]["note"] = state.value.lavori[i]["note_attuale"]; 
          state.value.lavori[i]["servizi"] = state.value.lavori[i]["servizi_attuale"];
          state.value.lavori[i]["collegamenti"] = state.value.lavori[i]["collegamenti_attuale"];
          break;
        }
      }
    }
  },
  getLavoroDopoLaModifica: (state, action) => {
    if(state.value.lavori && state.value.lavori !== -1) {
      for(let i = 0; i < state.value.lavori.length; i++) {
        if(state.value.lavori[i].id === action.payload.id_lavoro) {
          state.value.lavori[i]["giorno_attuale"] = state.value.lavori[i]["giorno"]; 
          state.value.lavori[i]["totale_attuale"] = state.value.lavori[i]["totale"]; 
          state.value.lavori[i]["note_attuale"] = state.value.lavori[i]["note"]; 
          state.value.lavori[i]["servizi_attuale"] = state.value.lavori[i]["servizi"];
          state.value.lavori[i]["collegamenti_attuale"] = state.value.lavori[i]["collegamenti"];
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