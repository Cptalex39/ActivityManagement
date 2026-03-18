// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { cartaSliceActions } from '../store/reducers/CartaReducer';
// Actions
import { Actions } from "./Actions";

export class CartaActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  async inserimentoCarta(nuovaCarta, setNuovaCarta, lingua) {
    if (controlloCarta(nuovaCarta, setNuovaCarta, lingua) > 0) { 
      return null;
    }

    const response = await super.getResponse("/INSERISCI_ITEM", nuovaCarta);

    if(response.ok) {
      const result = await response.json();

      let nuovaCartaAggiornata = {
        ...nuovaCarta, 
        id: result.id, 
      };
      
      setNuovaCarta(nuovaCartaAggiornata);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  };

  async ottenimentoCarteCliente(datiRicerca) {
    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(cartaSliceActions.aggiornaCarte({
        carte: result.items, 
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }

  async eliminazioneCarte(selectedIdsEliminazione, setSelectedIdsEliminazione, carte) {
    const dati = {
      tipo_item: "carta", 
      ids: selectedIdsEliminazione
    }
    
    const itemsRestanti = (carte && carte !== -1) ? carte.filter(carta => !dati.ids.includes(carta.id)) : -1;
    const response = await super.getResponse("/ELIMINA_ITEMS", dati);

    if(response.ok) {
      this.dispatch(cartaSliceActions.aggiornaCarte({
        carte: itemsRestanti, 
      }));
      setSelectedIdsEliminazione([]);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
  }
}









