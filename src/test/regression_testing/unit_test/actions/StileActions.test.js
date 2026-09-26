import { StileActions } from "../../../../react_redux/actions/StileActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { stileSliceActions } from "../../../../react_redux/store/reducers/StileReducer";


const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Vari test su "cambioSfondo"', () => {
  let stileActions;

  beforeEach(() => {
    stileActions = new StileActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_StiA_CmbSfo_01 **/
  test('tipoSfondo = "img"', () => {
    const tipoSfondo = "img";
    const sfondo = "/sfondo";

    const result = stileActions.cambioSfondo(tipoSfondo, sfondo);

    expect(mockDispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioImmagineSfondo({
        pathImg: sfondo
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** UT_StiA_CmbSfo_02 **/
  test('tipoSfondo = "color"', () => {
    const tipoSfondo = "color";
    const sfondo = "#123456";

    const result = stileActions.cambioSfondo(tipoSfondo, sfondo);

    expect(mockDispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioColoreSfondo({
        coloreRGB: sfondo
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** UT_StiA_CmbSfo_03 **/
  test('tipoElemento != "item" AND tipoElemento != "form"', async () => {
    const tipoSfondo = "TIPO_SFONDO";
    const sfondo = "/sfondo";

    const result = stileActions.cambioSfondo(tipoSfondo, sfondo);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "cambioVista"', () => {
  let stileActions;

  beforeEach(() => {
    stileActions = new StileActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_StiA_CmbVis_01 **/
  test('tipoElemento = "item"', () => {
    const tipoElemento = "item";
    const tipoView = "card";

    const result = stileActions.cambioVista(tipoElemento, tipoView);

    expect(mockDispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioVistaItem({
        vistaItem: tipoView
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** UT_StiA_CmbVis_02 **/
  test('tipoElemento = "form"', () => {
    const tipoElemento = "form";
    const tipoView = "card";

    const result = stileActions.cambioVista(tipoElemento, tipoView);

    expect(mockDispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioVistaForm({
        vistaForm: tipoView
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** UT_StiA_CmbVis_03 **/
  test('tipoElemento != "item" AND tipoElemento != "form"', async () => {
    const tipoElemento = "TIPO_ELEMENTO";
    const tipoView = "card";

    const result = stileActions.cambioVista(tipoElemento, tipoView);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});









