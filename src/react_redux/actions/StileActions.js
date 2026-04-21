// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { stileSliceActions } from '../store/reducers/StileReducer';
// Actions
import { Actions } from "./Actions";

export class StileActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione per il cambio dello sfondo.
   * 
   * @param {String} tipoSfondo - il tipo dello sfondo. 
   * @param {String} sfondo - il nuovo sfondo.
   */
  cambioSfondo(tipoSfondo, sfondo) {
    if(tipoSfondo === "img") {
      this.dispatch(stileSliceActions.cambioImmagineSfondo({
        pathImg: sfondo
      }));
    }
    else {
      this.dispatch(stileSliceActions.cambioColoreSfondo({
        coloreRGB: sfondo
      }));
    }
  }

  /**
   * Azione per il cambio della vista degli item o dei form.
   * 
   * @param {String} tipoElemento - il tipo di elemento. 
   * @param {String} tipoView - il tipo della vista.
   */
  cambioVista(tipoElemento, tipoView) {
    if(tipoElemento === "item") {
      this.dispatch(stileSliceActions.cambioVistaItem({
        vistaItem: tipoView
      }));
    }
    else {
      this.dispatch(stileSliceActions.cambioVistaForm({
        vistaForm: tipoView
      }))
    }
  }
}









