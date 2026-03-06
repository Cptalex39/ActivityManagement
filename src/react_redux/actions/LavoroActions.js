// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { lavoroSliceActions } from '../store/reducers/LavoroReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloLavoro } from "../../utils/Controlli";
import { generaFileLavoriPDF, generaFileLavoriExcel } from "../../utils/File";

export class LavoroActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  azzeraLista() {
    this.dispatch(lavoroSliceActions.aggiornaLavori({
      lavori: -1,
    }));
  }
  
  async inserimentoLavoro(servizi, clienti, nuovoLavoro, setNuovoLavoro, lingua) {
    let totale = 0;
    
    for(let servizio of servizi) {
      if(parseInt(servizio.quantita) > 0) {
        totale += parseFloat(servizio.prezzo) * parseInt(servizio.quantita);
      }
    }
        
    let clienteInteressato = null
    for(let cliente of clienti) {
      if (parseInt(cliente.id) === parseInt(nuovoLavoro.id_cliente)) {
        clienteInteressato = cliente.nome + " " + cliente.cognome 
          + ((cliente.contatto && cliente.contatto !== "Contatto non inserito.") ? (" - " + cliente.contatto) : "") 
          + ((cliente.email && cliente.email !== "Email non inserita.") ? (" - " + cliente.email) : "");
        break;
      }
    }
    
    let nuovoLavoroAggiornato = {
      ...nuovoLavoro, 
      cliente: clienteInteressato, 
      servizi: servizi,
      totale: totale,
    }
    
    if (controlloLavoro(nuovoLavoroAggiornato, setNuovoLavoro, lingua) > 0) {
      return null;
    } 
    
    nuovoLavoroAggiornato = {
      ...nuovoLavoroAggiornato, 
      giorno_attuale: nuovoLavoro.giorno,
      totale_attuale: nuovoLavoro.totale,
      note_attuale: nuovoLavoro.note,
      servizi_attuale: nuovoLavoro.servizi,
    }

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoLavoroAggiornato);
    
    if(response.ok) {
      const result = await response.json();

      nuovoLavoroAggiornato = {
        ...nuovoLavoroAggiornato, 
        id: result.id,
        collegamenti: result.collegamenti,
        collegamenti_attuale: result.collegamenti,
      }

      this.dispatch(lavoroSliceActions.inserimentoLavoro({
        nuovoLavoro: nuovoLavoroAggiornato, 
      }));

      setNuovoLavoro(nuovoLavoroAggiornato);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

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

  selezioneOperazioneLavoro(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
    setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          id_lavoro: item.id, 
          nuova_selezione: 0
        }))

        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        
        this.dispatch(lavoroSliceActions.getLavoroPrimaDellaModifica({
          id_lavoro: item.id,
        }));

        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          id_lavoro: item.id, 
          nuova_selezione: 2
        }));

        setSelectedIdsEliminazione(prevIds => [...prevIds, item.id]);
        setSelectedTrashCount(prevCount => prevCount + 1);
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
    else if(icon === "pencil") {
      if(selectedIdsModifica.includes(item.id)) {
        
        this.dispatch(lavoroSliceActions.getLavoroPrimaDellaModifica({
          id_lavoro: item.id,
        }));

        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          id_lavoro: item.id, 
          nuova_selezione: 0
        }));

        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        
        this.dispatch(lavoroSliceActions.aggiornaTipoSelezione({
          id_lavoro: item.id, 
          nuova_selezione: 1
        }))

        setSelectedIdsModifica(prevIdsModifica => [...prevIdsModifica, item.id]);
        setSelectedPencilCount(prevCount => prevCount + 1);
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  async modificaLavori(servizi, lavori, selectedIdsModifica, setSelectedIdsModifica) {
    let lavoriDaModificare = lavori.filter(lavoro => selectedIdsModifica.includes(lavoro.id));
    let idLavoriNonModificati = [];
    let idLavoriModificati = [];
    let esitiModifiche = [];

    for(let i = 0; i < lavoriDaModificare.length; i++) {
      const dati = {
        tipo_item: "lavoro", 
        servizi: servizi, 
        item: lavoriDaModificare[i] 
      }

      const response = await super.getResponse("/MODIFICA_ITEM", dati);

      if(response.ok) {
        esitiModifiche[i] = [true, response.status];
        idLavoriModificati.push(lavoriDaModificare[i].id);
      }
      else {
        esitiModifiche[i] = [false, response.status];
        idLavoriNonModificati.push(lavoriDaModificare[i].id);
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

    for(let id of idLavoriNonModificati) {
      this.dispatch(lavoroSliceActions.getLavoroPrimaDellaModifica({
        id_lavoro: id
      }));
    }

    for(let id of idLavoriModificati) {
      this.dispatch(lavoroSliceActions.getLavoroDopoLaModifica({
        id_lavoro: id
      }))
    }

    setSelectedIdsModifica([]);

    return {
      esitiModifiche: esitiModifiche, 
    };
  }

  aggiornaLavoro(id_lavoro, nome_attributo, nuovo_valore) {
    this.dispatch(lavoroSliceActions.aggiornaLavoro({
      id_lavoro: id_lavoro, 
      nome_attributo: nome_attributo, 
      nuovo_valore: nuovo_valore
    }))
  }

  async eliminaLavori(selectedIdsEliminazione, setSelectedIdsEliminazione, lavori) {
    const dati = {
      tipo_item: "lavoro", 
      ids: selectedIdsEliminazione
    }
    
    const itemsRestanti = (lavori && lavori !== -1) ? lavori.filter(lavoro => !dati.ids.includes(lavoro.id)) : -1;
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

    setSelectedIdsEliminazione([]);
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

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









