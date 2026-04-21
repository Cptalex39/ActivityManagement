// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { servizioSliceActions } from '../store/reducers/ServizioReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloServizio } from "../../utils/Controlli";

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

  /**
   * Azione per ottenere il catalogo (servizi e prodotti in uso) per la vista cliente.
   * 
   * @param {*} filtroTipo - filtro del tipo (servizi/prodotti).
   * 
   * @returns {Object} risultato response operazione.
   */
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
   * @param {String} lingua - lingua del sistema attuale.
   * 
   * @returns {Object} risultato response operazione.
   */
  async inserisciServizio(nuovoServizio, setNuovoServizio, lingua) {
    if (controlloServizio(nuovoServizio, setNuovoServizio, lingua) > 0) {
      return null;
    }

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoServizio);

    if(response.ok) {
      const result = await response.json();

      let nuovoServizioAggiornato = {
        ...nuovoServizio, 
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

  /**
   * Azione per eseguire la ricerca dei servizi.
   * 
   * @param {Object} datiRicerca - dati della ricerca.
   * 
   * @returns {Object} risultato response operazione.
   */
  async ricercaServizi(datiRicerca) {
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(servizioSliceActions.aggiornaServizi({
        servizi: result.items, 
      }));
    }

    return {
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
      const dati = {
        tipo_item: "servizio", 
        item: serviziDaModificare[i] 
      }

      const response = await super.getResponse("/MODIFICA_ITEM", dati);

      if(response.ok) {
        esitiModifiche[i] = [true, response.status];

        if(serviziDaModificare[i].prezzo !== serviziDaModificare[i].prezzo_attuale) {
          const result = await response.json();
          let nuovoServizio = { ...serviziDaModificare[i] };
          nuovoServizio["id"] = result.id;
          
          this.dispatch(servizioSliceActions.inserimentoServizio({
            nuovoServizio: nuovoServizio
          }))
        }

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

  /**
   * Azione per aggiornare un attributo di un servizio.
   * 
   * @param {number} id_servizio - id del servizio da aggiornare.
   * @param {String} nome_attributo - nome dell'attributo da aggiornare.
   * @param {*} nuovo_valore - nuovo valore dell'attributo.
   */
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

  /**
   * Azione per ottenere le entrate dei servizi presenti in un range di 2 date incluse.
   * 
   * @param {Function} setEntrateServizi - setter delle entrate dei servizi.
   * @param {Object} datiRicerca - dati della ricerca.
   * 
   * @returns {Object} risultato response operazione.
   */
  async handleSearchEntrateServizi(setEntrateServizi, datiRicerca) {
    const dati = {
      tipo_item: "servizio", 
      primo_anno: datiRicerca.primo_anno, 
      ultimo_anno: datiRicerca.ultimo_anno
    };
    
    const response = await super.getResponse("/VISUALIZZA_ENTRATE_ITEMS", dati);
    
    const result = await response.json();
    setEntrateServizi(result.items);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };
}









