// React e Redux
import { createSlice } from "@reduxjs/toolkit";

const name = "Carrello";

const initialState = {
  value: {
    items: [],        // Array di { id, nome, prezzo, tipo, note, quantita }
    tipoLavoro: null, // 'ordine' | 'prenotazione' (scelto al checkout)
  }
}

const reducers = {
  // Aggiunge un item al carrello o incrementa la quantità se già presente
  aggiungiAlCarrello: (state, action) => {
    const { item, quantita } = action.payload;
    const index = state.value.items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      state.value.items[index].quantita += quantita;
    } else {
      state.value.items.push({
        id: item.id,
        nome: item.nome,
        prezzo: item.prezzo,
        tipo: item.tipo,
        note: item.note || "",
        quantita: quantita,
      });
    }
  },

  // Rimuove un item dal carrello
  rimuoviDalCarrello: (state, action) => {
    const { id } = action.payload;
    state.value.items = state.value.items.filter(i => i.id !== id);
  },

  // Aggiorna la quantità di un item specifico
  aggiornaQuantita: (state, action) => {
    const { id, quantita } = action.payload;
    const index = state.value.items.findIndex(i => i.id === id);
    if (index >= 0) {
      if (quantita <= 0) {
        state.value.items.splice(index, 1);
      } else {
        state.value.items[index].quantita = quantita;
      }
    }
  },

  // Incrementa quantità di 1
  incrementaQuantita: (state, action) => {
    const { id } = action.payload;
    const index = state.value.items.findIndex(i => i.id === id);
    if (index >= 0) {
      state.value.items[index].quantita += 1;
    }
  },

  // Decrementa quantità di 1 (rimuove se arriva a 0)
  decrementaQuantita: (state, action) => {
    const { id } = action.payload;
    const index = state.value.items.findIndex(i => i.id === id);
    if (index >= 0) {
      state.value.items[index].quantita -= 1;
      if (state.value.items[index].quantita <= 0) {
        state.value.items.splice(index, 1);
      }
    }
  },

  // Imposta il tipo di lavoro (ordine o prenotazione)
  impostaTipoLavoro: (state, action) => {
    state.value.tipoLavoro = action.payload.tipoLavoro;
  },

  // Svuota il carrello (dopo checkout completato)
  svuotaCarrello: (state) => {
    state.value.items = [];
    state.value.tipoLavoro = null;
  },
}

const carrelloSlice = createSlice({
  name: name,
  initialState: initialState,
  reducers: reducers,
});

export const carrelloSliceActions = {
  aggiungiAlCarrello: carrelloSlice.actions.aggiungiAlCarrello,
  rimuoviDalCarrello: carrelloSlice.actions.rimuoviDalCarrello,
  aggiornaQuantita: carrelloSlice.actions.aggiornaQuantita,
  incrementaQuantita: carrelloSlice.actions.incrementaQuantita,
  decrementaQuantita: carrelloSlice.actions.decrementaQuantita,
  impostaTipoLavoro: carrelloSlice.actions.impostaTipoLavoro,
  svuotaCarrello: carrelloSlice.actions.svuotaCarrello,
};

export const carrelloReducer = carrelloSlice.reducer;