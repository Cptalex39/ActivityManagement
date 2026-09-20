// React e Redux
import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage } from "./LocalStorage";
import { getInitialStateWithStorage } from "./State";

const name = "Stile";
const nameItem = "sfondo";
const value = {
  pathImg: "../img/immagine_sfondo1.jpg",
  coloreRGB: null,
  vistaItem: "row",
  vistaForm: "form"
};

const initialState = getInitialStateWithStorage(value, nameItem);

const reducers = {
  cambioImmagineSfondo: (state, action) => {
    state.value.pathImg = action.payload.pathImg;
    state.value.coloreRGB = null;
    saveToLocalStorage(state, "sfondo");
  },
  cambioColoreSfondo: (state, action) => {
    state.value.pathImg = null;
    state.value.coloreRGB = action.payload.coloreRGB;
    saveToLocalStorage(state, "sfondo");
  },
  cambioVistaItem: (state, action) => {
    state.value.vistaItem = action.payload.vistaItem;
    saveToLocalStorage(state, "sfondo");
  },
  cambioVistaForm: (state, action) => {
    state.value.vistaForm = action.payload.vistaForm;
    saveToLocalStorage(state, "sfondo");
  }
}

const stileSlice = createSlice({
  name: name, 
  initialState: initialState,
  reducers: reducers, 
});

export const stileSliceActions = {
  cambioImmagineSfondo: stileSlice.actions.cambioImmagineSfondo,
  cambioColoreSfondo: stileSlice.actions.cambioColoreSfondo,
  cambioVistaItem: stileSlice.actions.cambioVistaItem, 
  cambioVistaForm: stileSlice.actions.cambioVistaForm
};

export const stileReducer = stileSlice.reducer;










