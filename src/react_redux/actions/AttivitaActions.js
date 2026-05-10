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

  async eseguiAnalisi(dati) {
    const response = await super.getResponse("/ESEGUI_ANALISI", dati);
    const json = response.ok ? await response.json() : null;

    return {
      uscite_anno: json?.uscite_anno || [],
      entrate_anno: json?.entrate_anno || [],
      isOK: response.ok,
      responseStatus: response.status,
    };
  }
}









