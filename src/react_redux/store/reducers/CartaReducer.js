// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const name = "Carta";

const initialState = {
  value: {
    carte: [], 
  } 
}

const reducers = {
  aggiornaCarte: (state, action) => {
    state.value.carte = action.payload.carte
  },

  aggiungiCarta: (state, action) => {
    state.value.carte.push(action.payload.carta);
  },

  rimuoviCarta: (state, action) => {
    state.value.carte = state.value.carte.filter(carta => carta.id !== action.payload.id);
  }
}

const cartaSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers,
});

export const cartaSliceActions = {
  aggiornaCarte: cartaSlice.actions.aggiornaCarte,
  aggiungiCarta: cartaSlice.actions.aggiungiCarta,
  rimuoviCarta: cartaSlice.actions.rimuoviCarta,
};
export const cartaReducer = cartaSlice.reducer;









