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
}

const cartaSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers,
});

export const cartaSliceActions = {
  aggiornaCarte: cartaSlice.actions.aggiornaCarte,
};
export const cartaReducer = cartaSlice.reducer;









