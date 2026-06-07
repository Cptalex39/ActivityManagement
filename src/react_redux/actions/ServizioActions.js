// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { servizioSliceActions } from '../store/reducers/ServizioReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloServizio, controlloRicercaServizi } from "../../utils/Controlli";

export class ServizioActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che azzera la lista sei servizi.
   */
  azzeraLista() {
    this.dispatch(servizioSliceActions.aggiornaServizi({
      servizi: -1, 
    }));
  }

  async getCatalogo(filtroTipo) {
    const dati = {
      filtro_tipo: filtroTipo
    }
    const response = await super.getResponse("/VISUALIZZA_CATALOGO", dati);

    if(response.ok) {
      const result = await response.json();
      this.dispatch(servizioSliceActions.aggiornaCatalogo({
        catalogo: result.items, 
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  /**
   * Azione per inserire un nuovo servizio nel sistema.
   * 
   * @param {Object} nuovoServizio - dati del nuovo servizio.
   * @param {Function} setNuovoServizio - setter dei dati del nuovo servizio.
   * 
   * @returns {Object} risultato response operazione.
   */
  async inserisciServizio(nuovoServizio, setNuovoServizio) {
    const risultatoControllo = controlloServizio(nuovoServizio, true);
    
    let nuovoServizioAggiornato = risultatoControllo; 
    setNuovoServizio(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return null;
    };

    nuovoServizioAggiornato = {
      ...nuovoServizioAggiornato, 
      nome_attuale: nuovoServizioAggiornato.nome,
      tipo_attuale: nuovoServizioAggiornato.tipo,
      prezzo_attuale: nuovoServizioAggiornato.prezzo,
      descrizione_attuale: nuovoServizioAggiornato.descrizione,
      note_attuale: nuovoServizioAggiornato.note,
      in_uso: "Si",
      in_uso_attuale: "Si",
    };

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoServizioAggiornato);

    if(response.ok) {
      const result = await response.json();

      nuovoServizioAggiornato = {
        ...nuovoServizioAggiornato, 
        id: result.id, 
      };

      this.dispatch(servizioSliceActions.inserimentoServizio({
        nuovoServizio: nuovoServizioAggiornato, 
      }));
      
      setNuovoServizio(nuovoServizioAggiornato);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  async ricercaServizi(datiRicerca, setDatiRicerca) {
    const risultatoControllo = controlloRicercaServizi(datiRicerca);
    setDatiRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    const result = await response.json();

    if(response.ok) {      
      this.dispatch(servizioSliceActions.aggiornaServizi({
        servizi: result.items, 
      }));
    }

    return {
      servizi: response.ok ? result.items : [],  
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
  
  /**
   * Azione per selezionare un'operazione sul servizio.
   * 
   * @param {String} icon - icona dell'operazione selezionata.
   * @param {Object} item - item selezionato.
   * @param {Array<number>} selectedIdsModifica - id dei servizi selezionati per la modifica.
   * @param {Function} setSelectedIdsModifica - setter degli id dei servizi selezionati per la modifica.
   * @param {Array<number>} selectedIdsEliminazione - id dei servizi selezionati per l'eliminazione.
   * @param {Function} setSelectedIdsEliminazione - setter degli id dei servizi selezionati per l'eliminazione.
   * @param {Function} setSelectedPencilCount - setter per il conteggio del numero dei servizi selezionati per la modifica.
   * @param {Function} setSelectedTrashCount - setter per il conteggio del numero dei servizi selezionati per l'eliminazione.
   */
  selezioneOperazioneServizio(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
    setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        
        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
          nuova_selezione: 0
        }));
        
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        
        this.dispatch(servizioSliceActions.getServizioPrimaDellaModifica({
          id_servizio: item.id
        }));

        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
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
                
        this.dispatch(servizioSliceActions.getServizioPrimaDellaModifica({
          id_servizio: item.id
        }));

        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
          nuova_selezione: 0
        }))

        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
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
   * Azione per eseguire la modifica dei servizi selezionati.
   * 
   * @param {Array<Object>} servizi - collezione dei servizi. 
   * @param {Array<number>} selectedIdsModifica - id dei servizi selezionati per la modifica.
   * @param {Function} setSelectedIdsModifica - setter degli id selezionati per la modifica.
   * 
   * @returns {Array<[Boolean, number]>} esiti delle modifiche (modifiche riuscite e fallite).
   */
  async modificaServizi(servizi, selectedIdsModifica, setSelectedIdsModifica) {
    let serviziDaModificare = servizi.filter(servizio => selectedIdsModifica.includes(servizio.id)); 
    let idServiziNonModificati = [];
    let idServiziModificati = [];
    let esitiModifiche = [];

    for(let i = 0; i < serviziDaModificare.length; i++) {
      const risultatoControllo = controlloServizio(serviziDaModificare[i], false);

      if(risultatoControllo.num_errori > 0) {
        alert(
          "Errore servizio numero " + (i+1) + ":\n" +
          (risultatoControllo.errore_nome ? "- " + risultatoControllo.errore_nome + "\n" : "") +
          (risultatoControllo.errore_tipo ? "- " + risultatoControllo.errore_tipo + "\n" : "") +
          (risultatoControllo.errore_prezzo ? "- " + risultatoControllo.errore_prezzo + "\n" : "") + 
          (risultatoControllo.errore_descrizione ? "- " + risultatoControllo.errore_descrizione + "\n" : "") + 
          (risultatoControllo.errore_note ? "- " + risultatoControllo.errore_note : "")
        );
        return null;
      }
    }

    for(let i = 0; i < serviziDaModificare.length; i++) {
      const dati = {
        tipo_item: "servizio", 
        item: serviziDaModificare[i] 
      }

      const response = await super.getResponse("/MODIFICA_ITEM", dati);

      if(response.ok) {
        esitiModifiche[i] = [true, response.status];
        idServiziModificati.push(serviziDaModificare[i].id);
      }
      else {
        esitiModifiche[i] = [false, response.status];
        idServiziNonModificati.push(serviziDaModificare[i].id);
      }
    }
    
    let serviziAggiornati = [];

    for (let i = 0; i < servizi.length; i++) {
      let servizioAggiornato = { ...servizi[i] };
      if(servizioAggiornato.tipo_selezione === 1) {
        servizioAggiornato.tipo_selezione = 0;
      }
      serviziAggiornati.push(servizioAggiornato);
    }
    
    this.dispatch(servizioSliceActions.aggiornaServizi({
      servizi: serviziAggiornati, 
    }))

    for(let id of idServiziNonModificati) {
      this.dispatch(servizioSliceActions.getServizioPrimaDellaModifica({
        id_servizio: id
      }))
    }

    for(let id of idServiziModificati) {
      this.dispatch(servizioSliceActions.getServizioDopoLaModifica({
        id_servizio: id
      }))
    }
    
    setSelectedIdsModifica([]);

    return {
      esitiModifiche: esitiModifiche, 
    };
  }

  aggiornaServizio(id_servizio, nome_attributo, nuovo_valore) {
    this.dispatch(servizioSliceActions.aggiornaServizio({
      id_servizio: id_servizio,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore
    }));
  }

  /**
   * Azione per eliminare i servizi selezionati.
   * 
   * @param {Array<number>} selectedIdsEliminazione - id dei servizi selezionati per l'eliminazione.
   * @param {Function} setSelectedIdsEliminazione - setter degli id dei servizi selezionati per l'eliminazione.
   * @param {Array<Object>} servizi - collezione dei servizi.
   * 
   * @returns {Object} risultato response operazione.
   */
  async eliminaServizi(selectedIdsEliminazione, setSelectedIdsEliminazione, servizi) {
    const dati = {
      tipo_item: "servizio", 
      ids: selectedIdsEliminazione
    }
    
    const itemsRestanti = (servizi && servizi !== -1) ? servizi.filter(servizio => !dati.ids.includes(servizio.id)) : -1;
    const response = await super.getResponse("/ELIMINA_ITEMS", dati);

    if(response.ok) {
      this.dispatch(servizioSliceActions.aggiornaServizi({
        servizi: itemsRestanti, 
      }));
      setSelectedIdsEliminazione([]);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
}









