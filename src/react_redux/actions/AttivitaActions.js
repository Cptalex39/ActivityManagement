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

  scegliWidgets(e, setPlusCliccato, plusCliccato) {
    e.preventDefault();
    setPlusCliccato(!plusCliccato);
    this.dispatch(plusCliccato ? attivitaSliceActions.widgetView() : attivitaSliceActions.widgetSelected());
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









