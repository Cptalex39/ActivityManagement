// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { carrelloSliceActions } from '../store/reducers/CarrelloReducer';
// Actions
import { Actions } from './Actions';

export class CarrelloActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che aggiunge un item selezionati dal catalogo al carrello.
   * 
   * @param {Object} item - item da aggiungere.
   * @param {number} quantita - quantità dell'item aggiunto.
   * 
   * @returns {void} se quantità <= 0
   */
  aggiungiAlCarrello(item, quantita) {
    if (quantita <= 0) return;
    this.dispatch(carrelloSliceActions.aggiungiAlCarrello({
      item: item,
      quantita: quantita,
    }));
  }

  /**
   * Azione che aggiunge più items dal catalogo al carrello (usato dal riepilogo del Catalogo).
   * 
   * @param {*} itemsSelezionati - collezione di items selezionati. 
   * @param {*} quantitaMap - quantità per ciascun articolo.
   */
  aggiungiMultipliAlCarrello(itemsSelezionati, quantitaMap) {
    for (const item of itemsSelezionati) {
      const qta = quantitaMap[item.id] || 0;
      if (qta > 0) {
        this.dispatch(carrelloSliceActions.aggiungiAlCarrello({
          item: item,
          quantita: qta,
        }));
      }
    }
  }

  /**
   * Azione per eliminare un item dal carrello tramite il suo id
   * 
   * @param {number} id - id dell'item.
   */
  rimuoviDalCarrello(id) {
    this.dispatch(carrelloSliceActions.rimuoviDalCarrello({ id }));
  }

  /**
   * Azione per aggiornare la quantità di un item del carrello tramite il suo id.
   * 
   * @param {number} id - id dell'item.
   * @param {number} quantita - nuova quantità dell'item.
   */
  aggiornaQuantita(id, quantita) {
    this.dispatch(carrelloSliceActions.aggiornaQuantita({ id, quantita }));
  }

  /**
   * Azione per incrementare la quantità di un item del carrello tramite il suo id.
   * 
   * @param {number} id - id dell'item. 
   */
  incrementaQuantita(id) {
    this.dispatch(carrelloSliceActions.incrementaQuantita({ id }));
  }

  /**
   * Azione per decrementare la quantità di un item del carrello tramite il suo id.
   * 
   * @param {number} id - id dell'item.
   */
  decrementaQuantita(id) {
    this.dispatch(carrelloSliceActions.decrementaQuantita({ id }));
  }

  /**
   * Azione per svuotare il carrello.
   */
  svuotaCarrello() {
    this.dispatch(carrelloSliceActions.svuotaCarrello());
  }
}









