// React e Redux 
import { createSlice } from "@reduxjs/toolkit";

const name = "Spesa";

const initialState = {
  value: {
    spese: [], 
    usciteSpese: [], 
  } 
}

const reducers = {
  aggiornaSpese: (state, action) => {
    state.value.spese = action.payload.spese 
  },
  aggiornaTipoSelezione: (state, action) => {
    if(state.value.spese && state.value.spese !== -1) {
      for(let i = 0; i < state.value.spese.length; i++) {
        if(state.value.spese[i].id === action.payload.id_spesa) {
          state.value.spese[i].tipo_selezione = action.payload.nuova_selezione;
          break;
        }
      }
    }
  }, 
  aggiornaSpesa: (state, action) => {
    if(state.value.spese && state.value.spese !== -1) {
      for(let i = 0; i < state.value.spese.length; i++) {
        if(state.value.spese[i].id === action.payload.id_spesa) {
          state.value.spese[i][action.payload.nome_attributo] = action.payload.nuovo_valore;
          break;
        }
      }
    }
  },
  getSpesaPrimaDellaModifica: (state, action) => {
    if(state.value.spese && state.value.spese !== -1) {
      for(let i = 0; i < state.value.spese.length; i++) {
        if(state.value.spese[i].id === action.payload.id_spesa) {
          state.value.spese[i]["giorno"] = state.value.spese[i]["giorno_attuale"]; 
          state.value.spese[i]["descrizione"] = state.value.spese[i]["descrizione_attuale"];
          state.value.spese[i]["totale"] = state.value.spese[i]["totale_attuale"]; 
          state.value.spese[i]["note"] = state.value.spese[i]["note_attuale"]; 
          break;
        }
      }
    }
  },
  getSpesaDopoLaModifica: (state, action) => {
    if(state.value.spese && state.value.spese !== -1) {
      for(let i = 0; i < state.value.spese.length; i++) {
        if(state.value.spese[i].id === action.payload.id_spesa) {
          state.value.spese[i]["giorno_attuale"] = state.value.spese[i]["giorno"];
          state.value.spese[i]["descrizione_attuale"] = state.value.spese[i]["descrizione"];
          state.value.spese[i]["totale_attuale"] = state.value.spese[i]["totale"]; 
          state.value.spese[i]["note_attuale"] = state.value.spese[i]["note"];  
          break;
        }
      }
    }
  },
  inserimentoSpesa: (state, action) => {
    if(state.value.spese === -1) {
      state.value.spese = [];
    }
    state.value.spese.push(action.payload.nuovaSpesa);
  },
  aggiornaUsciteSpese: (state, action) => {
    state.value.usciteSpese = action.payload.usciteSpese
  }
};

const spesaSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers,
})

export const spesaSliceActions = {
  aggiornaSpese: spesaSlice.actions.aggiornaSpese,
  aggiornaTipoSelezione: spesaSlice.actions.aggiornaTipoSelezione,
  aggiornaSpesa: spesaSlice.actions.aggiornaSpesa,
  getSpesaPrimaDellaModifica: spesaSlice.actions.getSpesaPrimaDellaModifica,
  getSpesaDopoLaModifica: spesaSlice.actions.getSpesaDopoLaModifica,
  inserimentoSpesa: spesaSlice.actions.inserimentoSpesa,
  aggiornaUsciteSpese: spesaSlice.actions.aggiornaUsciteSpese, 
};

export const spesaReducer = spesaSlice.reducer;