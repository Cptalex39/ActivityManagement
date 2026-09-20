import { ServizioActions } from "../../../actions/ServizioActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";
jest.mock("../../../dispatcher/Dispatcher.js");
jest.mock("../../../utils/Controlli.js");

global.confirm = jest.fn(() => true); 
global.alert = jest.fn(() => true); 

describe("Test su 'inserimentoServizio'", () => {
  let servizioActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    servizioActions = new ServizioActions();
    servizioActions.dispatcher = mockDispatcher;
  });

  test("test 1: inserimento di un servizio con successo", async () => {
    const nuovoServizio = { nome: "Test nome servizio", prezzo: 12.34, note: "Note sul nuovo servizio." };
    const setNuovoServizio = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ id: 1234 }),
      })
    );

    await servizioActions.inserisciServizio({ preventDefault: jest.fn() }, nuovoServizio, setNuovoServizio);

    expect(global.fetch).toHaveBeenCalledWith("/INSERISCI_ITEM", expect.any(Object));
    expect(servizioActions.dispatcher.inserimentoServizio).toHaveBeenCalledWith(expect.objectContaining(
      { 
        id: 1234 
      }
    ));
  });

  test('test 2: errore 400', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 400 }));
    const nuovoServizio = { nome: "Test nome servizio", prezzo: 12.34, note: "Note sul nuovo servizio." };
    const setNuovoServizio = jest.fn();
    await servizioActions.inserisciServizio({ preventDefault: jest.fn() }, nuovoServizio, setNuovoServizio);
    expect(servizioActions.dispatcher.inserimentoServizio).not.toHaveBeenCalled();
  });

  test('test 3: errore', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 500 }));
    const nuovoServizio = { nome: "Test nome servizio", prezzo: 12.34, note: "Note sul nuovo servizio." };
    const setNuovoServizio = jest.fn();
    await servizioActions.inserisciServizio({ preventDefault: jest.fn() }, nuovoServizio, setNuovoServizio);
    expect(servizioActions.dispatcher.inserimentoServizio).not.toHaveBeenCalled();
  });
});

describe("Test su 'ricercaServizi'", () => {
  let servizioActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    mockDispatcher.aggiornaServizi = jest.fn();
    servizioActions = new ServizioActions();
    servizioActions.dispatcher = mockDispatcher;
  });

  test("test 1: ricerca effettuata con successo", async () => {
    const datiRicerca = { query: "test" };
    const mockItems = [
      { id: 1, nome: "Nome servizio 1", prezzo: 12.34, note: "Note servizio 1" }, 
      { id: 2, nome: "Nome servizio 2", prezzo: 56.78, note: "Note servizio 2" }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ items: mockItems }),
      })
    );

    await servizioActions.ricercaServizi({ preventDefault: jest.fn() }, datiRicerca);

    expect(global.fetch).toHaveBeenCalledWith("/VISUALIZZA_ITEMS", expect.any(Object));
    expect(mockDispatcher.aggiornaServizi).toHaveBeenCalledWith(mockItems);
  });

  test("test 2: errore", async () => {
    const datiRicerca = { query: "test" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500, 
      })
    );

    await servizioActions.ricercaServizi({ preventDefault: jest.fn() }, datiRicerca);

    expect(mockDispatcher.aggiornaServizi).not.toHaveBeenCalled();
  });
});









