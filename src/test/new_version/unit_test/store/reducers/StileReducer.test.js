import { stileReducer, stileSliceActions } from "../../../../../react_redux/store/reducers/StileReducer.js";
import { saveToLocalStorage } from "../../../../../react_redux/store/reducers/LocalStorage.js";

jest.mock('../../../../../react_redux/store/reducers/LocalStorage.js', () => ({
  saveToLocalStorage: jest.fn(),
  loadFromLocalStorage: jest.fn(() => undefined),
}));

const actualState = {
  value: {
    pathImg: "./path_img",
    coloreRGB: "#123456",
    vistaItem: "card",
    vistaForm: "form"
  },
};

describe('Vari test su "cambioImmagineSfondo"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_StiR_CmbImgSfo_01 **/
  test('Immagine sfondo cambiata', () => {
    const action = stileSliceActions.cambioImmagineSfondo({
      pathImg: "./new_path_img",
    });
    const valueExpected = {
      value: {
        pathImg: "./new_path_img",
        coloreRGB: null,
        vistaItem: "card",
        vistaForm: "form"
      }
    };

    const result = stileReducer(actualState, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "cambioColoreSfondo"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_StiR_CmbColSfo_01 **/
  test('Colore sfondo cambiato', () => {
    const action = stileSliceActions.cambioColoreSfondo({
      coloreRGB: "#654321",
    });
    const valueExpected = {
      value: {
        pathImg: null,
        coloreRGB: "#654321",
        vistaItem: "card",
        vistaForm: "form"
      }
    };

    const result = stileReducer(actualState, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "cambioVistaItem"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_StiR_CmbVisItm_01 **/
  test('Vista item cambiata', () => {
    const action = stileSliceActions.cambioVistaItem({
      vistaItem: "form",
    });
    const valueExpected = {
      value: {
        pathImg: "./path_img",
        coloreRGB: "#123456",
        vistaItem: "form",
        vistaForm: "form"
      }
    };

    const result = stileReducer(actualState, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "cambioVistaForm"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_StiR_CmbVisForm_01 **/
  test('Vista item cambiata', () => {
    const action = stileSliceActions.cambioVistaForm({
      vistaForm: "card",
    });
    const valueExpected = {
      value: {
        pathImg: "./path_img",
        coloreRGB: "#123456",
        vistaItem: "card",
        vistaForm: "card"
      }
    };

    const result = stileReducer(actualState, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});







