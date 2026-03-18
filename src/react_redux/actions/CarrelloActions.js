// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { carrelloSliceActions } from '../store/reducers/CarrelloReducer';
// Actions
import { Actions } from './Actions';

export class CarrelloActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
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
      const response = await super.getResponse("/INSERISCI_ORDINE", body);

      if (response.ok) {
        const result = await response.json();
        this.svuotaCarrello();
        return {
          isOK: response.ok, 
          responseStatus: response.status, 
          success: true, 
          id: result.id
        };
      } 
      else {
        return {
          isOK: response.ok, 
          responseStatus: response.status, 
          success: false, 
        };
      }
    } 
    catch (err) {
      console.error("Errore checkout:", err);
      return {
        success: false 
      };
    }
  }
}









