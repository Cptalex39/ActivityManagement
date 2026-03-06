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









