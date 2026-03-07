// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { carrelloSliceActions } from '../store/reducers/CarrelloReducer';

export class CarrelloActions {
  dispatch = useDispatch();

  constructor() {

  }

  // Aggiunge item(s) selezionati dal catalogo al carrello
  aggiungiAlCarrello(item, quantita) {
    if (quantita <= 0) return;
    this.dispatch(carrelloSliceActions.aggiungiAlCarrello({
      item: item,
      quantita: quantita,
    }));
  }

  // Aggiunge più items dal catalogo al carrello (usato dal riepilogo del Catalogo)
  aggiungiMultipliAlCarrello(itemsSelezionati, quantitaMap) {
    for (const item of itemsSelezionati) {
      const qta = quantitaMap[item.id] || 0;
      if (qta > 0) {
        this.dispatch(carrelloSliceActions.aggiungiAlCarrello({
          item: item,
          quantita: qta,
        }));
      }
    }
  }

  rimuoviDalCarrello(id) {
    this.dispatch(carrelloSliceActions.rimuoviDalCarrello({ id }));
  }

  aggiornaQuantita(id, quantita) {
    this.dispatch(carrelloSliceActions.aggiornaQuantita({ id, quantita }));
  }

  incrementaQuantita(id) {
    this.dispatch(carrelloSliceActions.incrementaQuantita({ id }));
  }

  decrementaQuantita(id) {
    this.dispatch(carrelloSliceActions.decrementaQuantita({ id }));
  }

  impostaTipoLavoro(tipoLavoro) {
    this.dispatch(carrelloSliceActions.impostaTipoLavoro({ tipoLavoro }));
  }

  svuotaCarrello() {
    this.dispatch(carrelloSliceActions.svuotaCarrello());
  }

  // Checkout: crea il lavoro (ordine o prenotazione) sul backend
  async checkout(datiCheckout, lingua) {
    /*
      datiCheckout = {
        tipo_lavoro: "ordine" | "prenotazione",
        cliente: "Nome Cognome",
        id_cliente: 1,                          // se loggato
        metodo_pagamento: "online" | "in_struttura" | "al_corriere",
        tipo_ritiro: "spedizione" | "ritiro_in_struttura" | null,
        indirizzo_spedizione: "Via Roma 1..." | null,
        data_prenotazione: "2026-03-15" | null,  // solo per prenotazioni
        ora_prenotazione: "10:30" | null,         // solo per prenotazioni
        items: [ { id, nome, prezzo, tipo, quantita } ],
        totale: 25.00,
        note: "..."
      }
    */
    const body = {
      tipo_item: "lavoro",
      cliente: datiCheckout.cliente,
      id_cliente: datiCheckout.id_cliente || null,
      tipo_lavoro: datiCheckout.tipo_lavoro,
      giorno: new Date().toISOString().split('T')[0], // data odierna
      totale: datiCheckout.totale,
      stato_pagamento: datiCheckout.metodo_pagamento === "online" ? "pagato_online" : "in_sospeso",
      metodo_pagamento: datiCheckout.metodo_pagamento,
      tipo_ritiro: datiCheckout.tipo_ritiro || null,
      indirizzo_spedizione: datiCheckout.indirizzo_spedizione || null,
      data_prenotazione: datiCheckout.data_prenotazione || null,
      ora_prenotazione: datiCheckout.ora_prenotazione || null,
      note: datiCheckout.note || "",
      servizi: datiCheckout.items.map(item => ({
        id: item.id,
        quantita: item.quantita,
        prezzo: item.prezzo,
      })),
    };

    try {
      const response = await fetch('/INSERISCI_ORDINE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.status === 200) {
        const result = await response.json();
        this.svuotaCarrello();
        alert(lingua === "italiano"
          ? "Ordine/Prenotazione creata con successo! ID: " + result.id
          : "Order/Booking created successfully! ID: " + result.id
        );
        return { success: true, id: result.id };
      } else {
        alert(lingua === "italiano"
          ? "Errore durante la creazione dell'ordine/prenotazione, riprova più tardi."
          : "Error while creating the order/booking, please try again later."
        );
        return { success: false };
      }
    } catch (err) {
      console.error("Errore checkout:", err);
      alert(lingua === "italiano"
        ? "Errore di connessione, riprova più tardi."
        : "Connection error, please try again later."
      );
      return { success: false };
    }
  }
}