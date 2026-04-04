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

  /**
   * Azione per inserire una nuova carta.
   * 
   * @param {Object} nuovaCarta - dati della nuova carta. 
   * @param {Function} setNuovaCarta - setter dei dati della nuova carta.
   * @param {String} lingua - lingua attuale del sistema.
   * 
   * @returns {Object} risultato response operazione.
   */
  async inserimentoCarta(nuovaCarta, setNuovaCarta, lingua) {
    /*
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
    */
    console.log("NuovaCarta:");
    console.log(nuovaCarta);
  };

  /**
   * Azione per ottenere le carte di un cliente.
   * 
   * @param {Object} datiRicerca - dati della ricerca.
   * 
   * @returns {Object} risultato response operazione.
   */
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

  /**
   * Azione per eliminare le carte selezionate.
   * 
   * @param {Array<number>} selectedIdsEliminazione - id delle carte selezionate.
   * @param {Function} setSelectedIdsEliminazione - setter degli id delle carte selezionate.
   * @param {Array<Object>} carte - elenco delle carte di un cliente.
   * @returns risultato response operazione.
   */
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









