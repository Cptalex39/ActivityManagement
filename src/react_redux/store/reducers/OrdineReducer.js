// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const name = "Ordine";

const initialState = {
  value: {
    ordini: [], 
    entrateOrdini: [], 
  } 
};

const reducers = {
  aggiornaOrdini: (state, action) => {
    state.value.ordini = action.payload.ordini 
  },
}

const ordineSlice = createSlice ({
  name: name, 
  initialState: initialState,
  reducers: reducers, 
});

export const ordineSliceActions = {
  aggiornaOrdini: ordineSlice.actions.aggiornaOrdini,
};
export const ordineReducer = ordineSlice.reducer;








