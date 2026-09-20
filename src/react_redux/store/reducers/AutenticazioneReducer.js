// React e Redux
import { createSlice } from "@reduxjs/toolkit";
import { saveToLocalStorage } from "./LocalStorage";
import { getInitialStateWithStorage } from "./State";

const name = "Autenticazione";
const nameItem = "autenticazioneSession";
const value = {
  username: null,
  ruolo: "guest",
  note: "",
  isLogged: false 
};

const initialState = getInitialStateWithStorage(value, nameItem);

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
    state.value.primo_intervallo = action.payload.primo_intervallo;
    state.value.secondo_intervallo = action.payload.secondo_intervallo;
    state.value.numero_clienti = action.payload.numero_clienti;
    saveToLocalStorage(state, nameItem);
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
    state.value.primo_intervallo = null;
    state.value.secondo_intervallo = null;
    state.value.numero_clienti = null;
    state.value.username = null;
    state.value.ruolo = "guest";
    state.value.isLogged = false;
    saveToLocalStorage(state, nameItem);
  },
  aggiornaIndirizzo: (state, action) => {
    state.value.indirizzo = action.payload.indirizzo;
    saveToLocalStorage(state, nameItem);
  }, 
  aggiornaProfiloCliente: (state, action) => {
    state.value.email = action.payload.email;
    state.value.contatto = action.payload.contatto;
    state.value.indirizzo = action.payload.indirizzo;
    state.value.username = action.payload.username;
    saveToLocalStorage(state, nameItem);
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
  aggiornaProfiloCliente: autenticazioneSlice.actions.aggiornaProfiloCliente,
};

export const autenticazioneReducer = autenticazioneSlice.reducer;









