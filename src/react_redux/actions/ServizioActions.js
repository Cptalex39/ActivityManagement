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

  azzeraLista() {
    this.dispatch(servizioSliceActions.aggiornaServizi({
      servizi: -1, 
    }));
  }

  async inserisciServizio(nuovoServizio, setNuovoServizio, lingua) {
    if (controlloServizio(nuovoServizio, setNuovoServizio, lingua) > 0) {
      return null;
    }

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoServizioAggiornato);

    if(response.ok) {
      const result = await response.json();

      nuovoServizioAggiornato = {
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

  aggiornaServizio(id_servizio, nome_attributo, nuovo_valore) {
    this.dispatch(servizioSliceActions.aggiornaServizio({
      id_servizio: id_servizio,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore
    }));
  }

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









