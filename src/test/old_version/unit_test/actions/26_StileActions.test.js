import { StileActions } from "../../../actions/StileActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";
jest.mock("../../../dispatcher/Dispatcher.js");
jest.mock("../../../utils/Controlli.js");

global.confirm = jest.fn(() => true); 
global.alert = jest.fn(() => true); 

describe("Test su 'cambioSfondo'", () => {
  let stileActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    stileActions = new StileActions();
    stileActions.dispatcher = mockDispatcher;
  });

  test("test 1: cambio sfondo con un immagine", async () => {
    stileActions.cambioSfondo("img", "immagineSfondo.png");
    expect(stileActions.dispatcher.cambioImmagineSfondo).toHaveBeenCalledWith("immagineSfondo.png");
    expect(stileActions.dispatcher.cambioColoreSfondo).not.toHaveBeenCalled();
  });

  test("test 2: cambio sfondo con un colore", async () => {
    stileActions.cambioSfondo("rgb", "#224466");
    expect(stileActions.dispatcher.cambioImmagineSfondo).not.toHaveBeenCalled();
    expect(stileActions.dispatcher.cambioColoreSfondo).toHaveBeenCalledWith("#224466");
  });

  test("test 3: errore, tipo sfondo non valido", async () => {
    stileActions.cambioSfondo("sfondo", "sfondo");
    expect(stileActions.dispatcher.cambioImmagineSfondo).not.toHaveBeenCalled();
    expect(stileActions.dispatcher.cambioColoreSfondo).not.toHaveBeenCalled();
  });
});

describe("Test su 'cambioVista'", () => {
  let stileActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    stileActions = new StileActions();
    stileActions.dispatcher = mockDispatcher;
  });

  test("test 1: cambio vista degli elementi di tipo 'item'", async () => {
    stileActions.cambioVista("item", "card");
    expect(stileActions.dispatcher.cambioVistaItem).toHaveBeenCalledWith("card");
    expect(stileActions.dispatcher.cambioVistaForm).not.toHaveBeenCalled();
  });

  test("test 2: cambio vista degli elementi di tipo 'form'", async () => {
    stileActions.cambioVista("form", "card");
    expect(stileActions.dispatcher.cambioVistaItem).not.toHaveBeenCalled();
    expect(stileActions.dispatcher.cambioVistaForm).toHaveBeenCalledWith("card");
  });

  test("test 3: errore, tipo elemento non valido", async () => {
    stileActions.cambioVista("elemento", "card");
    expect(stileActions.dispatcher.cambioVistaItem).not.toHaveBeenCalled();
    expect(stileActions.dispatcher.cambioVistaForm).not.toHaveBeenCalled();
  });
});









