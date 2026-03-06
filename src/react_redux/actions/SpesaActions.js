// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { spesaSliceActions } from '../store/reducers/SpesaReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloSpesa } from "../../utils/Controlli";
import { generaFileSpesePDF, generaFileSpeseExcel } from "../../utils/File";

export class SpesaActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  azzeraLista() {
    this.dispatch(spesaSliceActions.aggiornaSpese({
      spese: -1,
    }));
  }

  async inserimentoSpesa(nuovaSpesa, setNuovaSpesa, lingua) {
    if (controlloSpesa(nuovaSpesa, setNuovaSpesa, lingua) > 0) 
      return null;

    let nuovaSpesaAggiornata = {
      ...nuovaSpesa, 
      nome_attuale: nuovaSpesa.nome,
      descrizione_attuale: nuovaSpesa.descrizione,
      totale_attuale: nuovaSpesa.totale,
      giorno_attuale: nuovaSpesa.giorno,
      note_attuale: nuovaSpesa.note,
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

  async ricercaSpese(datiRicerca) {        
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
  
  async handleSearchSpeseRangeFile(tipoFile, setTipoFile, datiRicerca, setSpese, lingua) {
    setTipoFile(tipoFile);

    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      setSpese(result.items);

      if (tipoFile === "pdf") {
        generaFileSpesePDF(result.items, lingua);
      }
      else {
        generaFileSpeseExcel(result.items, lingua);
      }
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async handleSearchUsciteSpese(setUsciteSpese, datiRicerca) {
    const dati = {
      tipo_item: "spesa", 
      primo_anno: datiRicerca.primo_anno, 
      ultimo_anno: datiRicerca.ultimo_anno
    };
    
    const response = await super.getResponse("/VISUALIZZA_USCITE_ITEMS", dati);

    if(response.ok) {    
      const result = await response.json();
      setUsciteSpese(result.items);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

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

  async modificaSpese(spese, selectedIdsModifica, setSelectedIdsModifica) {
    let speseDaModificare = spese.filter(spesa => selectedIdsModifica.includes(spesa.id)); 
    let idSpeseNonModificate = [];
    let idSpeseModificate = [];
    let esitiModifiche = [];
    
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









