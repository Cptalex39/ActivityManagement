// React e Redux
import { useDispatch } from "react-redux";
// Reducers
import { attivitaSliceActions } from "../store/reducers/AttivitaReducer";
// Actions
import { Actions } from "./Actions";

export class AttivitaActions extends Actions {
  dispatch = useDispatch();
  
  constructor() {
    super();
  }

  /**
   * Azione per scegliere un widget.
   * 
   * @param {Event} e - oggetto evento.
   * @param {Function} setPlusCliccato - setter di plusCliccato. 
   * @param {Boolean} plusCliccato - valore di plusCliccato.
   */
  scegliWidgets(e, setPlusCliccato, plusCliccato) {
    e.preventDefault();
    setPlusCliccato(!plusCliccato);
    this.dispatch(plusCliccato ? attivitaSliceActions.widgetView() : attivitaSliceActions.widgetSelected());
  }

  /**
   * Azione per modificare la visualizzazione del widget.
   * 
   * @param {String} nomeWidget - il nome del widget cliccato.
   * @param {number} tipoVisualizzazione - il nuovo tipo di visualizzazione del widget.
   */
  modificaWidget(nomeWidget, tipoVisualizzazione) {
    this.dispatch(attivitaSliceActions.modificaWidget({
      nomeWidget: nomeWidget,
      tipoVisualizzazione: tipoVisualizzazione,
    }))
  }

  /**
   * Azione per cambiare la lingua.
   * 
   * @param {Event} e - oggetto evento. 
   */
  modificaLingua(e) {
    e.preventDefault();
    this.dispatch(attivitaSliceActions.modificaLingua())
  }
}









