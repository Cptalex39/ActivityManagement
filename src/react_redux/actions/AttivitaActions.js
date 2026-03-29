// React e Redux
import { useDispatch } from "react-redux";
// Reducers
import { attivitaSliceActions } from "../store/reducers/AttivitaReducer";

export class AttivitaActions {
  dispatch = useDispatch();
  
  constructor() {

  }

  async ricercaEntrateUsciteRicavi(e, datiRicerca) {
    e.preventDefault();
  }

  scegliWidgets(e, setPlusCliccato, plusCliccato) {
    e.preventDefault();
    setPlusCliccato(!plusCliccato);
    if(plusCliccato === true) {
      this.dispatch(attivitaSliceActions.widgetView())
    }
    else if(plusCliccato === false) {
      this.dispatch(attivitaSliceActions.widgetSelected());
    }
  }

  modificaWidget(nomeWidget, tipoVisualizzazione) {
    this.dispatch(attivitaSliceActions.modificaWidget({
      nomeWidget: nomeWidget,
      tipoVisualizzazione: tipoVisualizzazione,
    }))
  }

  modificaLingua(e) {
    e.preventDefault();
    this.dispatch(attivitaSliceActions.modificaLingua())
  }
}