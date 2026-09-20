import { SpesaActions } from "../../../actions/SpesaActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";
jest.mock("../../../dispatcher/Dispatcher.js");
jest.mock("../../../utils/Controlli.js");

global.confirm = jest.fn(() => true); 
global.alert = jest.fn(() => true); 

describe("Test su 'inserimentoSpesa'", () => {
  let spesaActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    spesaActions = new SpesaActions();
    spesaActions.dispatcher = mockDispatcher;
  });

  test("test 1: inserimento di una spesa con successo", async () => {
    const nuovaSpesa = { nome: "Test nome spesa", totale: 123.45, note: "Note sulla nuova spesa." };
    const setNuovaSpesa = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ id: 1234 }),
      })
    );

    await spesaActions.inserimentoSpesa({ preventDefault: jest.fn() }, nuovaSpesa, setNuovaSpesa);

    expect(global.fetch).toHaveBeenCalledWith("/INSERISCI_ITEM", expect.any(Object));
    expect(spesaActions.dispatcher.inserimentoSpesa).toHaveBeenCalledWith(expect.objectContaining(
      { 
        id: 1234 
      }
    ));
  });

  test('test 2: errore 400', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 400 }));
    const nuovaSpesa = { nome: "Test nome spesa", totale: 123.45, note: "Note sulla nuova spesa." };
    const setNuovaSpesa = jest.fn();
    await spesaActions.inserimentoSpesa({ preventDefault: jest.fn() }, nuovaSpesa, setNuovaSpesa);
    expect(spesaActions.dispatcher.inserimentoSpesa).not.toHaveBeenCalled();
  });

  test('test 2: errore', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 500 }));
    const nuovaSpesa = { nome: "Test nome spesa", totale: 123.45, note: "Note sulla nuova spesa." };
    const setNuovaSpesa = jest.fn();
    await spesaActions.inserimentoSpesa({ preventDefault: jest.fn() }, nuovaSpesa, setNuovaSpesa);
    expect(spesaActions.dispatcher.inserimentoSpesa).not.toHaveBeenCalled();
  });
});

describe("Test su 'ricercaSpese'", () => {
  let spesaActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    mockDispatcher.aggiornaSpese = jest.fn();
    spesaActions = new SpesaActions();
    spesaActions.dispatcher = mockDispatcher;
  });

  test("test 1: ricerca effettuata con successo", async () => {
    const datiRicerca = { query: "test" };
    const mockItems = [
      { id: 1, nome: "Nome spesa 1", totale: 123.45, note: "Note sulla spesa 1." }, 
      { id: 2, nome: "Nome spesa 2", totale: 678.90, note: "Note sulla spesa 2." }
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ items: mockItems }),
      })
    );

    await spesaActions.ricercaSpese({ preventDefault: jest.fn() }, datiRicerca);

    expect(global.fetch).toHaveBeenCalledWith("/VISUALIZZA_ITEMS", expect.any(Object));
    expect(mockDispatcher.aggiornaSpese).toHaveBeenCalledWith(mockItems);
  });

  test("test 2: errore", async () => {
    const datiRicerca = { query: "test" };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500, 
      })
    );

    await spesaActions.ricercaSpese({ preventDefault: jest.fn() }, datiRicerca);

    expect(mockDispatcher.aggiornaSpese).not.toHaveBeenCalled();
  });
});









