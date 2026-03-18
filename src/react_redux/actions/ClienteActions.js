// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { clienteSliceActions } from '../store/reducers/ClienteReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloCliente } from '../../utils/Controlli';

export class ClienteActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  azzeraLista() {
    this.dispatch(clienteSliceActions.aggiornaClienti({
      clienti: -1, 
    }));
  }

  async registrazioneCliente(nuovoCliente, setNuovoCliente, lingua) {
    if (controlloCliente(nuovoCliente, setNuovoCliente, lingua) > 0) {
      return null;
    }

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoCliente);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async ricercaClienti(datiRicerca) {    
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(clienteSliceActions.aggiornaClienti({
        clienti: result.items, 
      }))
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  selezioneOperazioneCliente(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, 
    setSelectedIdsEliminazione, setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 0
        }))
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(clienteSliceActions.getClientePrimaDellaModifica({
          id_cliente: item.id,
        }))
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
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
        this.dispatch(clienteSliceActions.getClientePrimaDellaModifica({
          id_cliente: item.id,
        }))
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 0
        }))
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 1
        }))
        setSelectedIdsModifica(prevIdsModifica => [...prevIdsModifica, item.id]);
        setSelectedPencilCount(prevCount => prevCount + 1);
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  aggiornaCliente(id_cliente, nome_attributo, nuovo_valore) {
    this.dispatch(clienteSliceActions.aggiornaCliente({
      id_cliente: id_cliente,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore,
    }))
  }

  async eliminaClienti(selectedIdsEliminazione, setSelectedIdsEliminazione, clienti) {
    const dati = {
      tipo_item: "cliente", 
      ids: selectedIdsEliminazione
    }

    const itemsRestanti = (clienti && clienti !== -1) ? clienti.filter(cliente => !dati.ids.includes(cliente.id)) : -1;
    const response = await super.getResponse("/ELIMINA_ITEMS", dati);

    if(response.ok) {
      this.dispatch(clienteSliceActions.aggiornaClienti({
        clienti: itemsRestanti, 
      }));

      setSelectedIdsEliminazione([]);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }
}









