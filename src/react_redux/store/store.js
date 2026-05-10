// React e Redux
import { configureStore } from "@reduxjs/toolkit";
// Reducers
import { stileReducer } from "./reducers/StileReducer";
import { attivitaReducer } from "./reducers/AttivitaReducer";
import { autenticazioneReducer } from "./reducers/AutenticazioneReducer";
import { clienteReducer } from "./reducers/ClienteReducer";
import { servizioReducer } from "./reducers/ServizioReducer";
import { spesaReducer } from "./reducers/SpesaReducer";
import { carrelloReducer } from "./reducers/CarrelloReducer";  // CR: Carrello
import { cartaReducer } from "./reducers/CartaReducer";
import { ordineReducer } from "./reducers/OrdineReducer";

const store = configureStore({
  reducer: {
    autenticazione: autenticazioneReducer,
    stile: stileReducer, 
    attivita: attivitaReducer, 
    cliente: clienteReducer, 
    servizio: servizioReducer, 
    spesa: spesaReducer, 
    carrello: carrelloReducer,  // CR: Carrello
    carta: cartaReducer, 
    ordine: ordineReducer
  },
});

export default store;