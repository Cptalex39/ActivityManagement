// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const BC_NOT_SELECTED = "rgba(0, 0, 0, 0.5)";
const BC_SELECTED = "#0050EF";
const BC_VIEW = "rgba(0, 0, 0, 0.5)";

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("attivitaSession");
    return serializedState ? JSON.parse(serializedState) : undefined;
  } 
  catch (e) {
    console.warn("Errore nel caricamento dello stato dal local storage:", e);
    return undefined;
  }
};

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("attivitaSession", serializedState);
  } 
  catch (e) {
    console.warn("Errore nel salvataggio dello stato nel local storage:", e);
  }
};

const name = "Attivita";

const initialState = loadFromLocalStorage() || {
  value: {
  },
};

const getColor = (tipoVisualizzazione) => {
  if(tipoVisualizzazione === 0) {
    return BC_NOT_SELECTED;
  }
  else if(tipoVisualizzazione === 1) {
    return BC_SELECTED;
  }
  else if(tipoVisualizzazione === 2) {
    return BC_VIEW;
  }
  else(
    console.log(tipoVisualizzazione)
  )
}

const reducers = {
};

const attivitaSlice = createSlice({
  name: name, 
  initialState: initialState,
  reducers: reducers,
});

export const attivitaSliceActions = {
};

export const attivitaReducer = attivitaSlice.reducer;









