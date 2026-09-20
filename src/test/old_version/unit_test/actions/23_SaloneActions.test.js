import { AttivitaActions } from "../../../actions/AttivitaActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";
jest.mock("../../../dispatcher/Dispatcher.js");
jest.mock("../../../utils/Controlli.js");

global.confirm = jest.fn(() => true); 
global.alert = jest.fn(() => true); 

describe("Test su 'azzeraListe'", () => {
  let attivitaActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    attivitaActions = new AttivitaActions();
    attivitaActions.dispatcher = mockDispatcher;
  });

  test("test 1.", async () => {
    attivitaActions.azzeraListe();

    expect(attivitaActions.dispatcher.azzeraListe).toHaveBeenCalled();
  });
});

describe("Test su 'ricercaEntrateUsciteRicavi'", () => {
  let attivitaActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    mockDispatcher.ricercaEntrateUsciteRicavi = jest.fn();
    attivitaActions = new AttivitaActions();
    attivitaActions.dispatcher = mockDispatcher;
  });

  test("test 1: ricerca effettuata con successo", async () => {
    const datiRicerca = { query: "test" };
    await attivitaActions.ricercaEntrateUsciteRicavi({ preventDefault: jest.fn() }, datiRicerca);
    expect(mockDispatcher.ricercaEntrateUsciteRicavi).toHaveBeenCalledWith(datiRicerca);
  });
});

describe("Test su 'scegliWidgets'", () => {
  let attivitaActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    mockDispatcher.widgetView = jest.fn();
    mockDispatcher.widgetSelected = jest.fn();
    attivitaActions = new AttivitaActions();
    attivitaActions.dispatcher = mockDispatcher;
  });

  test("test 1: plusCliccato === true", async () => {
    await attivitaActions.scegliWidgets({ preventDefault: jest.fn() }, jest.fn(), false);
    expect(attivitaActions.dispatcher.widgetSelected).toHaveBeenCalled();
  });

  test("test 2: plusCliccato === false", async () => {
    await attivitaActions.scegliWidgets({ preventDefault: jest.fn() }, jest.fn(), true);
    expect(attivitaActions.dispatcher.widgetView).toHaveBeenCalled();
  });
});

describe("Test su 'modificaWidget'", () => {
  let attivitaActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    mockDispatcher.modificaWidget = jest.fn();
    attivitaActions = new AttivitaActions();
    attivitaActions.dispatcher = mockDispatcher;
  });

  test("test 1: modificaWidget eseguita con successo.", async () => {
    await attivitaActions.modificaWidget("Test nome widget", 1);
    expect(attivitaActions.dispatcher.modificaWidget).toHaveBeenCalledWith("Test nome widget", 1);
  });
});









