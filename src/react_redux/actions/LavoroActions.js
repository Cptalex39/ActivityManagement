// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { lavoroSliceActions } from '../store/reducers/LavoroReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloLavoro } from "../../utils/Controlli";
import { generaFileLavoriPDF, generaFileLavoriExcel } from "../../utils/File";
import { getGiornoOrarioAttuale } from '../../utils/Tempo';

export class LavoroActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che azzera la lista dei lavori.
   */
  azzeraLista() {
    this.dispatch(lavoroSliceActions.aggiornaLavori({
      lavori: -1,
    }));
  }
  
  /**
   * Azione per l'inserimento di un nuovo lavoro nel sistema.
   * 
   * @param {Object} nuovoLavoro - dati del nuovo lavoro.
   * @param {Array<Object>} servizi - servizi con la loro quantità.
   * 
   * @returns {Object} risultato response operazione.
   */
  async inserimentoLavoro(nuovoLavoro, servizi) {
    /*
    let descrizione = "", totale = 0;
    for(let i = 0; i < servizi.length; i++) {
      if(parseInt(servizi[i].quantita) > 0) {
        descrizione += (i+1) + ": " + servizi[i].nome + " X " + servizi[i].quantita + "\n";
        totale += parseFloat(servizi[i].prezzo) * parseInt(servizi[i].quantita);
      }
    }

    nuovoLavoro = {
      ...nuovoLavoro, 
      codice: getGiornoOrarioAttuale() + "_" + nuovoLavoro.id_cliente, 
      data_lavoro: new Date(), 
      data_spedizione: null, 
      data_consegna: null, 
      stato: "CREATO",
      descrizione: descrizione, 
      totale: totale, 
    };

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoLavoroAggiornato);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
    */
    console.log("Nuovo lavoro:")
    console.log(nuovoLavoro);
  }

  /**
   * Azione per eseguire la ricerca dei lavori.
   * 
   * @param {Object} datiRicerca - dati della ricerca. 
   * 
   * @returns {Object} risultato response operazione.
   */
  async ricercaLavori(datiRicerca) {    
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(lavoroSliceActions.aggiornaLavori({
        lavori: result.items,
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
  
  /**
   * Azione per ottenere un file con i lavori.
   * 
   * @param {String} tipoFile - tipo del file (.pdf o .xlsx)
   * @param {Function} setTipoFile - setter del tipo di file.
   * @param {Object} datiRicerca - dati della ricerca.
   * @param {Function} setLavori - setter dei lavori.
   * @param {String} lingua - lingua attuale del sistema.
   * 
   * @returns {Object} risultato response operazione.
   */
  async handleSearchLavoriRangeFile(tipoFile, setTipoFile, datiRicerca, setLavori, lingua) {
    setTipoFile(tipoFile);

    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      setLavori(result.items);

      if (tipoFile === "pdf") {
        generaFileLavoriPDF(result.items, lingua);
      }
      else {
        generaFileLavoriExcel(result.items, lingua);
      }
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  /**
   * Azione per la ricerca delle entrate dei lavori.
   * 
   * @param {Function} setEntrateLavori - setter delle entrate dei lavori.
   * @param {Object} datiRicerca - dati della ricerca.
   * @returns {Object} risultato response operazione.
   */
  async handleSearchEntrateLavori(setEntrateLavori, datiRicerca) {
    const dati = {
      tipo_item: "lavoro", 
      primo_anno: datiRicerca.primo_anno, 
      ultimo_anno: datiRicerca.ultimo_anno
    };
    
    const response = await super.getResponse("/VISUALIZZA_ENTRATE_ITEMS", dati);

    if(response.ok) {
      const result = await response.json();
      setEntrateLavori(result.items);
    }
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  /**
   * Azione per selezionare un'operazione sul lavoro.
   * 
   * @param {String} icon - icona dell'operazione selezionata.
   * @param {Object} item - item selezionato.
   * @param {Array<number>} selectedCodiciModifica - codici dei lavori selezionati per la modifica.
   * @param {Function} setSelectedCodiciModifica - setter dei codici dei lavori selezionati per la modifica.
   * @param {Array<number>} selectedCodiciEliminazione - codici dei lavori selezionati per l'eliminazione.
   * @param {Function} setSelectedCodiciEliminazione - setter dei codici dei lavori selezionati per l'eliminazione.
   * @param {Function} setSelectedPencilCount - setter per il conteggio del numero di lavori selezionati per la modifica.
   * @param {Function} setSelectedTrashCount - setter per il conteggio del numero di lavori selezionati per l'eliminazione.
   */
  selezioneOperazioneLavoro(
    icon, item, selectedCodiciModifica, setSelectedCodiciModifica, selectedCodiciEliminazione, setSelectedCodiciEliminazione, 
    setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedCodiciEliminazione.includes(item.codice)) {
        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          codice_lavoro: item.codice, 
          nuova_selezione: 0
        }))

        setSelectedCodiciEliminazione(prevCodici => prevCodici.filter(itemCodice => itemCodice !== item.codice));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(lavoroSliceActions.getLavoroPrimaDellaModifica({
          codice_lavoro: item.codice,
        }));

        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          codice_lavoro: item.codice, 
          nuova_selezione: 2
        }));

        setSelectedCodiciEliminazione(prevCodici => [...prevCodici, item.codice]);
        setSelectedTrashCount(prevCount => prevCount + 1);
        setSelectedCodiciModifica(prevCodiciModifica => prevCodiciModifica.filter(itemCodice => itemCodice !== item.codice));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
    else if(icon === "pencil") {
      if(selectedCodiciModifica.includes(item.codice)) {
        this.dispatch(lavoroSliceActions.getLavoroPrimaDellaModifica({
          codice_lavoro: item.codice,
        }));

        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          codice_lavoro: item.codice, 
          nuova_selezione: 0
        }));

        setSelectedCodiciModifica(prevCodiciModifica => prevCodiciModifica.filter(itemCodice => itemCodice !== item.codice));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          codice_lavoro: item.codice, 
          nuova_selezione: 1
        }))

        setSelectedCodiciModifica(prevCodiciModifica => [...prevCodiciModifica, item.codice]);
        setSelectedPencilCount(prevCount => prevCount + 1);
        setSelectedCodiciEliminazione(prevCodici => prevCodici.filter(itemCodice => itemCodice !== item.codice));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  /**
   * Azione per eseguire la modifica dei lavori.
   * 
   * @param {Array<Object>} lavori - collezione dei lavori.
   * @param {Array<String>} selectedCodiciModifica - codici dei lavori selezionati per la modifica.
   * @param {Array<String>} setSelectedCodiciModifica - setter dei codici dei lavori selezionati per la modifica.
   * 
   * @returns {Array<[Boolean, number]>} esiti delle modifiche (modifiche riuscite e fallite).
   */
  async modificaLavori(lavori, selectedCodiciModifica, setSelectedCodiciModifica) {
    let lavoriDaModificare = lavori.filter(lavoro => selectedCodiciModifica.includes(lavoro.codice));
    let codiciLavoriNonModificati = [];
    let codiciLavoriModificati = [];
    let esitiModifiche = [];

    for(let i = 0; i < lavoriDaModificare.length; i++) {
      const dati = {
        tipo_item: "lavoro", 
        item: lavoriDaModificare[i] 
      }

      const response = await super.getResponse("/MODIFICA_ITEM", dati);

      if(response.ok) {
        esitiModifiche[i] = [true, response.status];
        codiciLavoriModificati.push(lavoriDaModificare[i].codice);
      }
      else {
        esitiModifiche[i] = [false, response.status];
        codiciLavoriNonModificati.push(lavoriDaModificare[i].codice);
      }
    }

    let lavoriAggiornati = [];

    for (let i = 0; i < lavori.length; i++) {
      let lavoroAggiornato = { ...lavori[i] };
      if(lavoroAggiornato.tipo_selezione === 1) {
        lavoroAggiornato.tipo_selezione = 0;
      }
      lavoriAggiornati.push(lavoroAggiornato);
    }
    
    this.dispatch(lavoroSliceActions.aggiornaLavori({
      lavori: lavoriAggiornati,
    }));

    for(let codice of codiciLavoriNonModificati) {
      this.dispatch(lavoroSliceActions.getLavoroPrimaDellaModifica({
        codice_lavoro: codice
      }));
    }

    for(let codice of codiciLavoriModificati) {
      this.dispatch(lavoroSliceActions.getLavoroDopoLaModifica({
        codice_lavoro: codice
      }))
    }

    setSelectedCodiciModifica([]);

    return {
      esitiModifiche: esitiModifiche, 
    };
  }

  /**
   * Azione per aggiornare un attributo di un lavoro.
   * 
   * @param {String} codice_lavoro - codice del lavoro da aggiornare. 
   * @param {String} nome_attributo - nome dell'attributo da aggiornare.
   * @param {*} nuovo_valore - nuovo valore dell'attributo da aggiornare.
   */
  aggiornaLavoro(codice_lavoro, nome_attributo, nuovo_valore) {
    this.dispatch(lavoroSliceActions.aggiornaLavoro({
      codice_lavoro: codice_lavoro, 
      nome_attributo: nome_attributo, 
      nuovo_valore: nuovo_valore
    }))
  }

  /**
   * Azione per eseguire l'eliminazione dei lavori selezionati.
   * 
   * @param {Array<String} selectedCodiciEliminazione - codici dei lavori selezionati per la modifica.
   * @param {Function} setSelectedCodiciEliminazione - setter dei lavori selezionati per la modifica.
   * @param {Array<Object>} lavori - ollezione dei lavori.
   * 
   * @returns {Object} risultato response operazione.
   */
  async eliminaLavori(selectedCodiciEliminazione, setSelectedCodiciEliminazione, lavori) {
    const dati = {
      tipo_item: "lavoro", 
      codici: selectedCodiciEliminazione
    }
    
    const itemsRestanti = (lavori && lavori !== -1) ? lavori.filter(lavoro => !dati.codici.includes(lavoro.codice)) : -1;
    const response = await super.getResponse("/ELIMINA_ITEMS", dati);
    
    if(!response.ok) {
      return {
        isOK: response.ok, 
        responseStatus: response.status, 
      };
    }
              
    this.dispatch(lavoroSliceActions.aggiornaLavori({
      lavori: itemsRestanti
    }))

    setSelectedCodiciEliminazione([]);
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  /**
   * Azione per eliminare i lavori compreso in un range di due date estremi inclusi.
   * 
   * @param {Object} datiRicerca - dati della ricerca.
   * @returns {Object} risultato response operazione.
   */
  async handleDeleteLavoriRangeFile(datiRicerca) {
    const dati = {
      tipo_item: "lavoro", 
      "primo_giorno": datiRicerca.primo_giorno, 
      "ultimo_giorno": datiRicerca.ultimo_giorno 
    }

    const response = await super.getResponse("/ELIMINA_ITEMS_RANGE_GIORNI", dati);
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
}









