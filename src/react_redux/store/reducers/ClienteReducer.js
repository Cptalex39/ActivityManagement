// React e Redux 
import { createSlice } from "@reduxjs/toolkit";

const name = "Cliente";

const initialState = {
  value: {
    clienti: [], 
  } 
}

const reducers = {
  aggiornaClienti: (state, action) => {
    state.value.clienti = action.payload.clienti;
  },
  aggiornaTipoSelezione: (state, action) => {
    if(state.value.clienti && state.value.clienti !== -1) {
      for(let i = 0; i < state.value.clienti.length; i++) {
        if(state.value.clienti[i].id === action.payload.id_cliente) {
          state.value.clienti[i].tipo_selezione = action.payload.nuova_selezione;
          break;
        }
      }
    }
  }, 
  aggiornaCliente: (state, action) => {
    if(state.value.clienti && state.value.clienti !== -1) {
      for(let i = 0; i < state.value.clienti.length; i++) {
        if(state.value.clienti[i].id === action.payload.id_cliente) {
          state.value.clienti[i][action.payload.nome_attributo] = action.payload.nuovo_valore;
          break;
        }
      }
    }
  },
  getClientePrimaDellaModifica: (state, action) => {
    if(state.value.clienti && state.value.clienti !== -1) {
      for(let i = 0; i < state.value.clienti.length; i++) {
        if(state.value.clienti[i].id === action.payload.id_cliente) {
          state.value.clienti[i]["contatto"] = state.value.clienti[i]["contatto_attuale"];
          state.value.clienti[i]["email"] = state.value.clienti[i]["email_attuale"]; 
          state.value.clienti[i]["note"] = state.value.clienti[i]["note_attuale"]; 
          break;
        }
      }
    }
  },
  getClienteDopoLaModifica: (state, action) => {
    if(state.value.clienti && state.value.clienti !== -1) {
      for(let i = 0; i < state.value.clienti.length; i++) {
        if(state.value.clienti[i].id === action.payload.id_cliente) {
          state.value.clienti[i]["contatto_attuale"] = state.value.clienti[i]["contatto"];
          state.value.clienti[i]["email_attuale"] = state.value.clienti[i]["email"]; 
          state.value.clienti[i]["note_attuale"] = state.value.clienti[i]["note"]; 
          break;
        }
      }
    }
  }
};

const clienteSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers,
})

export const clienteSliceActions = {
  aggiornaClienti: clienteSlice.actions.aggiornaClienti,
  aggiornaTipoSelezione: clienteSlice.actions.aggiornaTipoSelezione,
  aggiornaCliente: clienteSlice.actions.aggiornaCliente,
  getClientePrimaDellaModifica: clienteSlice.actions.getClientePrimaDellaModifica,
  getClienteDopoLaModifica: clienteSlice.actions.getClienteDopoLaModifica,
};

export const clienteReducer = clienteSlice.reducer;









