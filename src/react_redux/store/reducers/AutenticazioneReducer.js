// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("autenticazioneSession");
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
    localStorage.setItem("autenticazioneSession", serializedState);
  } 
  catch (e) {
    console.warn("Errore nel salvataggio dello stato nel local storage:", e);
  }
};

const name = "Autenticazione";

const initialState = loadFromLocalStorage() || {
  value: {
    username: null,
    ruolo: "guest",
    note: "",
    isLogged: false 
  },
};

const reducers = {
  login: (state, action) => {
    state.value.username = action.payload.username;
    state.value.ruolo = action.payload.ruolo;
    state.value.isLogged = true;
    if(action.payload.ruolo === "cliente") {
      state.value.id_utente = action.payload.id;
      state.value.nome = action.payload.nome;
      state.value.cognome = action.payload.cognome;
      state.value.email = action.payload.email;
      state.value.contatto = action.payload.contatto;
      state.value.indirizzo = action.payload.indirizzo;
    }
    saveToLocalStorage(state);
  },
  logout: (state) => {
    if(state.value.ruolo === "cliente") {
      state.value.id_utente = null;
      state.value.nome = null;
      state.value.cognome = null;
      state.value.email = null;
      state.value.contatto = null;
      state.value.indirizzo = null;
    }
    state.value.username = null;
    state.value.ruolo = "guest";
    state.value.isLogged = false;
    saveToLocalStorage(state);
  },
  aggiornaIndirizzo: (state, action) => {
    state.value.indirizzo = action.payload.indirizzo;
    saveToLocalStorage(state);
  }, 
  aggiornaProfiloCliente: (state, action) => {
    state.value.email = action.payload.email;
    state.value.contatto = action.payload.contatto;
    state.value.indirizzo = action.payload.indirizzo;
    state.value.username = action.payload.username;
    saveToLocalStorage(state);
  },
}

const autenticazioneSlice = createSlice({
  name: name, 
  initialState: initialState,
  reducers: reducers,
});

export const autenticazioneSliceActions = {
  login: autenticazioneSlice.actions.login,
  logout: autenticazioneSlice.actions.logout, 
  aggiornaIndirizzo: autenticazioneSlice.actions.aggiornaIndirizzo, 
  //aggiornaProfiloCliente: autenticazioneSlice.aggiornaProfiloCliente, 
  aggiornaProfiloCliente: autenticazioneSlice.actions.aggiornaProfiloCliente,
};

export const autenticazioneReducer = autenticazioneSlice.reducer;









