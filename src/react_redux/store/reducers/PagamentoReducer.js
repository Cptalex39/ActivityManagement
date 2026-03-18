// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const name = "Pagamento";

const initialState = {
  value: {
    pagamenti: [], 
  } 
}

const reducers = {
  aggiornaPagamenti: (state, action) => {
    state.value.pagamenti = action.payload.pagamenti
  },
  getPagamentoPrimaDellaModifica: (state, action) => {
    if(state.value.pagamenti && state.value.pagamenti !== -1) {
      for(let i = 0; i < state.value.pagamenti.length; i++) {
        if(state.value.pagamenti[i].id === action.payload.id_pagamento) {
          state.value.pagamenti[i]["stato"] = state.value.pagamenti[i]["stato_attuale"];
          state.value.pagamenti[i]["note"] = state.value.pagamenti[i]["note_attuale"];
          break;
        }
      }
    }
  },
  getPagamentoDopoLaModifica: (state, action) => {
    if(state.value.pagamenti && state.value.pagamenti !== -1) {
      for(let i = 0; i < state.value.pagamenti.length; i++) {
        if(state.value.pagamenti[i].id === action.payload.id_pagamento) {
          state.value.pagamenti[i]["stato_attuale"] = state.value.pagamenti[i]["stato"];
          state.value.pagamenti[i]["note_attuale"] = state.value.pagamenti[i]["note"];
          break;
        }
      }
    }
  },
}

const pagamentoSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers,
});

export const pagamentoSliceActions = {
  aggiornaPagamenti: pagamentoSlice.actions.aggiornaPagamenti,
  getPagamentoPrimaDellaModifica: pagamentoSlice.actions.getPagamentoPrimaDellaModifica,
  getPagamentoDopoLaModifica: pagamentoSlice.actions.getPagamentoDopoLaModifica,
};
export const pagamentoReducer = pagamentoSlice.reducer;









