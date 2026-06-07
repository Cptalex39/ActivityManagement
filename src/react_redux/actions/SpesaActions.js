// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { spesaSliceActions } from '../store/reducers/SpesaReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloRicercaSpese, controlloSpesa } from "../../utils/Controlli";
import { generaFileSpesePDF, generaFileSpeseExcel } from "../../utils/File"

export class SpesaActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che azzera la lista delle spese.
   */
  azzeraLista() {
    this.dispatch(spesaSliceActions.aggiornaSpese({
      spese: -1,
    }));
  }

  /**
   * Azione per inserire una nuova spesa nel sistema.
   * 
   * @param {Object} nuovaSpesa - dati della nuova spesa.
   * @param {Function} setNuovaSpesa - setter dei dati della nuova spesa.
   * 
   * @returns {Object} risultato response operazione.
   */
  async inserimentoSpesa(nuovaSpesa, setNuovaSpesa) {
    const risultatoControllo = controlloSpesa(nuovaSpesa);

    let nuovaSpesaAggiornata = risultatoControllo;
    setNuovaSpesa(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return null;
    }

    nuovaSpesaAggiornata = {
      ...nuovaSpesaAggiornata, 
      nome_attuale: nuovaSpesaAggiornata.nome,
      descrizione_attuale: nuovaSpesaAggiornata.descrizione,
      totale_attuale: nuovaSpesaAggiornata.totale,
      giorno_attuale: nuovaSpesaAggiornata.giorno,
      note_attuale: nuovaSpesaAggiornata.note,
    };

    const response = await super.getResponse("/INSERISCI_ITEM", nuovaSpesaAggiornata);

    if(response.ok) {
      const result = await response.json();

      nuovaSpesaAggiornata = {
        ...nuovaSpesaAggiornata, 
        id: result.id, 
      };

      this.dispatch(spesaSliceActions.inserimentoSpesa({
        nuovaSpesa: nuovaSpesaAggiornata,  
      }));

      setNuovaSpesa(nuovaSpesaAggiornata);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  async ricercaSpese(datiRicerca, setDatiRicerca) {       
    const risultatoControllo = controlloRicercaSpese(datiRicerca);
    setDatiRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }
    
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();

      this.dispatch(spesaSliceActions.aggiornaSpese({
        spese: result.items,
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
  
  async handleSearchSpeseRangeFile(tipoFile, setTipoFile, datiRicerca, setDatiRicerca, setSpese) {
    const risultatoControllo = controlloRicercaSpese(datiRicerca);
    setDatiRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    setTipoFile(tipoFile);

    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      setSpese(result.items);

      if (tipoFile === "pdf") {
        generaFileSpesePDF(result.items);
      }
      else {
        generaFileSpeseExcel(result.items);
      }
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  /**
   * Azione per selezionare un'operazione sulla spesa.
   * 
   * @param {String} icon - icona dell'operazione selezionata. 
   * @param {Object} item - item selezionato.
   * @param {Array<number>} selectedIdsModifica - id delle spese selezionate per la modifica.
   * @param {Function} setSelectedIdsModifica - setter degli id delle spese selezionate per la modifica.
   * @param {Array<number>} selectedIdsEliminazione - id delle spese selezionate per l'eliminazione.
   * @param {Function} setSelectedIdsEliminazione - setter degli id delle spese selezionate per l'eliminazione.
   * @param {Function} setSelectedPencilCount - setter per il conteggio del numero delle spese selezionate per la modifica.
   * @param {Function} setSelectedTrashCount - setter per il conteggio del numero delle spese selezionate per l'eliminazione.
   */
  selezioneOperazioneSpesa(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
    setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        
        this.dispatch(spesaSliceActions.aggiornaTipoSelezione({
          id_spesa: item.id, 
          nuova_selezione: 0
        }));

        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        
        this.dispatch(spesaSliceActions.getSpesaPrimaDellaModifica({
          id_spesa: item.id,
        }))
        this.dispatch(spesaSliceActions.aggiornaTipoSelezione({
          id_spesa: item.id, 
          nuova_selezione: 2
        }))
        setSelectedIdsEliminazione(prevIds => [...prevIds, item.id]);
        setSelectedTrashCount(prevCount => prevCount + 1);
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
    else if(icon === "pencil") {
      if(selectedIdsModifica.includes(item.id)) {
        
        this.dispatch(spesaSliceActions.getSpesaPrimaDellaModifica({
          id_spesa: item.id,
        }));
        
        this.dispatch(spesaSliceActions.aggiornaTipoSelezione({
          id_spesa: item.id, 
          nuova_selezione: 0
        }));
        
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        
        this.dispatch(spesaSliceActions.aggiornaTipoSelezione({
          id_spesa: item.id, 
          nuova_selezione: 1
        }));
        
        setSelectedIdsModifica(prevIdsModifica => [...prevIdsModifica, item.id]);
        setSelectedPencilCount(prevCount => prevCount + 1);
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  /**
   * Azione per eseguire la modifica delle spese selezionate.
   * 
   * @param {Array<Object>} spese - collezione delle spese.
   * @param {Array<number>} selectedIdsModifica - id delle spese selezionate per la modifica.
   * @param {Function} setSelectedIdsModifica - setter degli id selezionati per la modifica.
   * 
   * @returns {Array<[Boolean, number]>} esiti delle modifiche (modifiche riuscite e fallite).
   */
  
  async modificaSpese(spese, selectedIdsModifica, setSelectedIdsModifica) {
    let speseDaModificare = spese.filter(spesa => selectedIdsModifica.includes(spesa.id)); 
    let idSpeseNonModificate = [];
    let idSpeseModificate = [];
    let esitiModifiche = [];
    
    for(let i = 0; i < speseDaModificare.length; i++) {
      const risultatoControllo = controlloSpesa(speseDaModificare[i]);

      if(risultatoControllo.num_errori > 0) {
        alert(
          "Errore spesa numero " + (i+1) + ":\n" +
          (risultatoControllo.errore_nome ? "- " + risultatoControllo.errore_nome + "\n" : "") +
          (risultatoControllo.errore_descrizione ? "- " + risultatoControllo.errore_descrizione + "\n" : "") +
          (risultatoControllo.errore_totale ? "- " + risultatoControllo.errore_totale + "\n" : "") + 
          (risultatoControllo.errore_giorno ? "- " + risultatoControllo.errore_giorno + "\n" : "") + 
          (risultatoControllo.errore_note ? "- " + risultatoControllo.errore_note : "")
        );
        return null;
      }
    }

    for(let i = 0; i < speseDaModificare.length; i++) {
      const dati = {
        tipo_item: "spesa", 
        item: speseDaModificare[i] 
      }

      const response = await super.getResponse("/MODIFICA_ITEM", dati);

      if(response.ok) {
        esitiModifiche[i] = [true, response.status];
        idSpeseModificate.push(speseDaModificare[i].id);
      }
      else {
        esitiModifiche[i] = [false, response.status];
        idSpeseNonModificate.push(speseDaModificare[i].id);
      }
    }

    let speseAggiornate = [];

    for (let i = 0; i < spese.length; i++) {
      let spesaAggiornata = { ...spese[i] };
      if(spesaAggiornata.tipo_selezione === 1) {
        spesaAggiornata.tipo_selezione = 0;
      }
      speseAggiornate.push(spesaAggiornata);
    }
    
    this.dispatch(spesaSliceActions.aggiornaSpese({
      spese: speseAggiornate,
    }))

    for(let id of idSpeseNonModificate) {
      this.dispatch(spesaSliceActions.getSpesaPrimaDellaModifica({
        id_spesa: id,
      }))
    }

    for(let id of idSpeseModificate) {  
      this.dispatch(spesaSliceActions.getSpesaDopoLaModifica({
        id_spesa: id
      }))
    }

    setSelectedIdsModifica([]);

    return {
      esitiModifiche: esitiModifiche, 
    };
  };

  aggiornaSpesa(id_spesa, nome_attributo, nuovo_valore) {
    this.dispatch(spesaSliceActions.aggiornaSpesa({
      id_spesa: id_spesa,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore,
    }))
  }

  /**
   * Azione per eseguire l'eliminazione delle spese selezionate.
   * 
   * @param {Array<number>} selectedIdsEliminazione - id delle spese selezionate per l'eliminazione.
   * @param {Function} setSelectedIdsEliminazione - setter degli id selezionati per l'eliminazione.
   * @param {Array<Object>} spese - collezione delle spese.
   * 
   * @returns {Object} risultato response operazione.
   */
  async eliminaSpese(selectedIdsEliminazione, setSelectedIdsEliminazione, spese) {
    const dati = {
      tipo_item: "spesa", 
      ids: selectedIdsEliminazione
    }

    const itemsRestanti = (spese && spese !== -1) ? spese.filter(spesa => !dati.ids.includes(spesa.id)) : -1;
    const response = await super.getResponse("/ELIMINA_ITEMS", dati);

    if(response.ok) {
      this.dispatch(spesaSliceActions.aggiornaSpese({
        spese: itemsRestanti,
      }));
      
      setSelectedIdsEliminazione([]);
    }
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
  
  /**
   * Azione per eseguire l'eliminazione delle spese presenti in un range di due date incluse.
   * 
   * @param {Object} datiRicerca - dati della ricerca.
   * 
   * @returns {Object} risultato response operazione.
   */
  async handleDeleteSpeseRangeFile(datiRicerca) {
    const dati = {
      tipo_item: "spesa", 
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









