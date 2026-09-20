// React e Redux
import { configureStore } from "@reduxjs/toolkit";
// Reducers
import { autenticazioneReducer } from "./reducers/AutenticazioneReducer";
import { carrelloReducer } from "./reducers/CarrelloReducer";
import { cartaReducer } from "./reducers/CartaReducer";
import { clienteReducer } from "./reducers/ClienteReducer";
import { ordineReducer } from "./reducers/OrdineReducer";
import { servizioReducer } from "./reducers/ServizioReducer";
import { spesaReducer } from "./reducers/SpesaReducer";
import { stileReducer } from "./reducers/StileReducer";

const store = configureStore({
  reducer: {
    autenticazione: autenticazioneReducer,
    stile: stileReducer, 
    cliente: clienteReducer, 
    servizio: servizioReducer, 
    spesa: spesaReducer, 
    carrello: carrelloReducer,
    carta: cartaReducer, 
    ordine: ordineReducer
  },
});

export default store;