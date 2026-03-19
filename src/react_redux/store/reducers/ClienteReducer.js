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
};

export const clienteReducer = clienteSlice.reducer;









