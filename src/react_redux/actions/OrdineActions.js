// React e Redux
import { useDispatch } from "react-redux";
// Reducers
import { ordineSliceActions } from "../store/reducers/OrdineReducer";
// Actions
import { Actions } from "./Actions";

export class OrdineActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che azzera la lista degli ordini.
   */
  azzeraLista() {
    this.dispatch(ordineSliceActions.aggiornaOrdini({
      ordini: -1,
    }));
  }

  async inserimentoOrdine(nuovoOrdine) {
    console.log("Nuovo ordine:")
    console.log(nuovoOrdine);
  }
}









