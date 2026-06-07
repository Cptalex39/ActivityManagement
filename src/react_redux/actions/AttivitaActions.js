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

  async ottieniDatiAttivita() {
    const response = await super.getResponse("/OTTIENI_DATI_ATTIVITA", {});
    let primo_intervallo = null;
    let secondo_intervallo = null;
    let numero_clienti = null;

    if(response.ok){
      let result = (await response.json()).result[0]
      primo_intervallo = result.primo_intervallo;
      secondo_intervallo = result.secondo_intervallo;
      numero_clienti = result.numero_clienti;
    }

    return {
      primo_intervallo: primo_intervallo,
      secondo_intervallo: secondo_intervallo,
      numero_clienti: numero_clienti,
      isOK: response.ok,
      responseStatus: response.status,
    };
  }
}









