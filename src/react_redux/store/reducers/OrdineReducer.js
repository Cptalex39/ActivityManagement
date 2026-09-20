// React e Redux
import { createSlice } from "@reduxjs/toolkit";
import { getInitialStateWithoutStorage } from "./State";

const name = "Ordine";
const value = {
  ordini: [], 
  entrateOrdini: [], 
}

const initialState = getInitialStateWithoutStorage(value);

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








