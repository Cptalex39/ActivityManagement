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
  async inserimentoCarta(nuovaCarta, setNuovaCarta) {
    /*
    if (controlloCarta(nuovaCarta, setNuovaCarta, lingua) > 0) { 
      return null;
    }
    */

    nuovaCarta.circuito = nuovaCarta.is_visa ? "VISA" : "MASTERCARD";

    const response = await super.getResponse("/INSERISCI_ITEM", nuovaCarta);

    if(response.ok) {
      const result = await response.json();

      let nuovaCartaAggiornata = {
        ...nuovaCarta, 
        id: result.id, 
      };
      
      setNuovaCarta(nuovaCartaAggiornata);

      this.dispatch(cartaSliceActions.aggiungiCarta({
        carta: nuovaCartaAggiornata, 
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };
    
    //console.log("NuovaCarta:");
    //console.log(nuovaCarta);
  };

  /**
   * Azione per ottenere le carte di un cliente.
   * 
   * @param {Object} datiRicerca - dati della ricerca.
   * 
   * @returns {Object} risultato response operazione.
   */
  async ottenimentoCarteCliente(id_cliente) {
    const dati = {
      id_cliente: id_cliente
    }
    
    const response = await super.getResponse("/OTTENIMENTO_CARTE_CLIENTE", dati);

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
  async eliminazioneCarta(id_carta, id_cliente) {
    const dati = {
      id_carta: id_carta, 
      id_cliente: id_cliente, 
    }
    
    const response = await super.getResponse("/ELIMINA_CARTA", dati);

    if(response.ok) {
      this.dispatch(cartaSliceActions.rimuoviCarta({
        id: id_carta, 
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    };

    //console.log("USERNAME CLIENTE: " + usernameCliente);
    //console.log("CODICE CARTA: " + codiceCarta);
  }
}









