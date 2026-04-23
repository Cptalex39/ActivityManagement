// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const name = "Servizio";

const initialState = {
  value: {
    servizi: [], 
    catalogo: [],  // CR: catalogo per la vista cliente
  } 
}

const reducers = {
  aggiornaServizi: (state, action) => {
    state.value.servizi = action.payload.servizi
  },
  // CR: aggiorna catalogo per vista cliente
  aggiornaCatalogo: (state, action) => {
    state.value.catalogo = action.payload.catalogo
  },
  aggiornaTipoSelezione: (state, action) => {
    if(state.value.servizi && state.value.servizi !== -1) {
      for(let i = 0; i < state.value.servizi.length; i++) {
        if(state.value.servizi[i].id === action.payload.id_servizio) {
          state.value.servizi[i].tipo_selezione = action.payload.nuova_selezione;
          break;
        }
      }
    }
  }, 
  aggiornaServizio: (state, action) => {
    if(state.value.servizi && state.value.servizi !== -1) {
      for(let i = 0; i < state.value.servizi.length; i++) {
        if(state.value.servizi[i].id === action.payload.id_servizio) {
          state.value.servizi[i][action.payload.nome_attributo] = action.payload.nuovo_valore;
          break;
        }
      }
    }
  }, 
  getServizioPrimaDellaModifica: (state, action) => {
    if(state.value.servizi && state.value.servizi !== -1) {
      for(let i = 0; i < state.value.servizi.length; i++) {
        if(state.value.servizi[i].id === action.payload.id_servizio) {
          state.value.servizi[i]["nome"] = state.value.servizi[i]["nome_attuale"];
          state.value.servizi[i]["prezzo"] = state.value.servizi[i]["prezzo_attuale"]; 
          state.value.servizi[i]["tipo"] = state.value.servizi[i]["tipo_attuale"];  // CR
          state.value.servizi[i]["note"] = state.value.servizi[i]["note_attuale"]; 
          state.value.servizi[i]["in_uso"] = state.value.servizi[i]["in_uso_attuale"]; 
          break;
        }
      }
    }
  },
  getServizioDopoLaModifica: (state, action) => {
    if(state.value.servizi && state.value.servizi !== -1) {
      for(let i = 0; i < state.value.servizi.length; i++) {
        if(state.value.servizi[i].id === action.payload.id_servizio) {
          state.value.servizi[i]["nome_attuale"] = state.value.servizi[i]["nome"];
          state.value.servizi[i]["prezzo_attuale"] = state.value.servizi[i]["prezzo"]; 
          state.value.servizi[i]["tipo_attuale"] = state.value.servizi[i]["tipo"];  // CR
          state.value.servizi[i]["note_attuale"] = state.value.servizi[i]["note"]; 
          state.value.servizi[i]["in_uso_attuale"] = state.value.servizi[i]["in_uso"];
          break;
        }
      }
    }
  },
  inserimentoServizio: (state, action) => {
    if(state.value.servizi === -1) {
      state.value.servizi = [];
    }
    state.value.servizi.push(action.payload.nuovoServizio);
  },
}

const servizioSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers,
})

export const servizioSliceActions = {
  aggiornaServizi: servizioSlice.actions.aggiornaServizi,
  aggiornaCatalogo: servizioSlice.actions.aggiornaCatalogo,
  aggiornaTipoSelezione: servizioSlice.actions.aggiornaTipoSelezione,
  aggiornaServizio: servizioSlice.actions.aggiornaServizio,
  getServizioPrimaDellaModifica: servizioSlice.actions.getServizioPrimaDellaModifica,
  getServizioDopoLaModifica: servizioSlice.actions.getServizioDopoLaModifica,
  inserimentoServizio: servizioSlice.actions.inserimentoServizio
};
export const servizioReducer = servizioSlice.reducer;