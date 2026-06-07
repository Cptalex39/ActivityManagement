// React e Redux
import { useDispatch } from "react-redux";
// Reducers
import { ordineReducer, ordineSliceActions } from "../store/reducers/OrdineReducer";
// Actions
import { Actions } from "./Actions";
// Utils
import { generaFileOrdiniPDF, generaFileOrdiniExcel } from "../../utils/File";

export class OrdineActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che azzera la lista degli ordini.
   */
  azzeraLista() {
    this.dispatch(ordineSliceActions.aggiornaOrdini({
      ordini: -1,
    }));
  }

  async inserimentoOrdine(nuovoOrdine) { 
    const response = await super.getResponse("/INSERISCI_ORDINE", nuovoOrdine);

    let problema = false;
    if(response.ok) {
      const result = await response.json();
      problema = result.problema;
    }

    return {
      problema: problema, 
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async ottieniPagamentiDaConfermare(dati) {
    const response = await super.getResponse("/OTTIENI_PAGAMENTI_DA_CONFERMARE", dati);
    
    return {
      items: response.ok ? (await response.json()).items : [], 
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async ricercaOrdini(datiRicerca) {
    datiRicerca.data_creazione_min = "1111-11-11";
    datiRicerca.data_creazione_max = "9999-01-01";
    datiRicerca.data_prenotazione_min = "1111-11-11";
    datiRicerca.data_prenotazione_max = "9999-01-01";
    datiRicerca.azione = "Ricerca";
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);
    return {
      items: response.ok ? (await response.json()).items : [], 
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async ottieniOrdiniUltime48Ore(dati) {    
    const response = await super.getResponse("/OTTIENI_ORDINI_ULTIME_48_ORE", dati);

    return {
      items: response.ok ? (await response.json()).items : [], 
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async eliminaPagamentoDaConfermare(dati) {
    const response = await super.getResponse("/ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE", dati);
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async confermaPagamento(dati) {
    const response = await super.getResponse("/CONFERMA_PAGAMENTO", dati);
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async ottieniNumeroPagamentiNonConfermatiCliente(dati) {
    const response = await super.getResponse("/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE", dati);
    
    return {
      numero_pagamenti_non_confermati: response.ok ? (await response.json()).result[0].numero_pagamenti_non_confermati : -1, 
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async ottieniFileOrdini(tipoFile, datiRicerca) {
    datiRicerca.data_creazione_min = "1111-11-11";
    datiRicerca.data_creazione_max = "9999-01-01";
    datiRicerca.data_prenotazione_min = "1111-11-11";
    datiRicerca.data_prenotazione_max = "9999-01-01";
    datiRicerca.azione = "File"
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      tipoFile === "pdf" ? generaFileOrdiniPDF(result.items) : generaFileOrdiniExcel(result.items);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async ottieniNumeroOrdiniDataPerOrario(dati) {
    const response = await super.getResponse("/OTTIENI_NUMERO_ORDINI_DATA_PER_ORARIO", dati);

    let numeroOrdini = null;
    
    if(response.ok) {
      const result = await response.json();
      
      numeroOrdini = result.numero_ordini;
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
      numero_ordini: numeroOrdini, 
    };
  }
}









