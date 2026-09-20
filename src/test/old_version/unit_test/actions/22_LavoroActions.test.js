import { LavoroActions } from "../../../actions/LavoroActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";
import { controlloLavoro } from "../../../utils/Controlli.js";
jest.mock("../../../dispatcher/Dispatcher.js");
jest.mock("../../../utils/Controlli.js");

global.confirm = jest.fn(() => true); 
global.alert = jest.fn(() => true); 

describe("Test su 'inserimentoLavoro'", () => {
  let lavoroActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    lavoroActions = new LavoroActions();
    lavoroActions.dispatcher = mockDispatcher;
  });

  test("test 1: inserimento di un lavoro con successo", async () => {
    const servizi = [{ prezzo: 100, quantita: 2 }, { prezzo: 50, quantita: 1 }];
    const clienti = [{ id: 1, nome: "Mario", cognome: "Rossi", email: "mario@example.com" }];
    const nuovoLavoro = { id_cliente: 1, giorno: "2025-05-08", totale: 0, servizi: [] };
    const setNuovoLavoro = jest.fn();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ id: 123, collegamenti: [] }),
      })
    );

    await lavoroActions.inserimentoLavoro({ preventDefault: jest.fn() }, servizi, clienti, nuovoLavoro, setNuovoLavoro);

    expect(nuovoLavoro.totale).toBe(250);
    expect(nuovoLavoro.servizi.length).toBe(servizi.length);
    expect(global.fetch).toHaveBeenCalledWith("/INSERISCI_ITEM", expect.any(Object));
    
    expect(lavoroActions.dispatcher.inserimentoLavoro).toHaveBeenCalledWith(expect.objectContaining(
      { 
        id: 123, 
        collegamenti: [] 
      }
    ));
  });

  test('test 2: errore 400', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 400 }));
    const servizi = [{ prezzo: 100, quantita: 2 }, { prezzo: 50, quantita: 1 }];
    const clienti = [{ id: 1, nome: "Mario", cognome: "Rossi", email: "mario@example.com" }];
    const nuovoLavoro = { id_cliente: 1, giorno: "2025-05-08", totale: 0, servizi: [] };
    const setNuovoLavoro = jest.fn();
    await lavoroActions.inserimentoLavoro({ preventDefault: jest.fn() }, servizi, clienti, nuovoLavoro, setNuovoLavoro);
    expect(lavoroActions.dispatcher.inserimentoLavoro).not.toHaveBeenCalled();
  });

  test('test 3: errore', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 500 }));
    const servizi = [{ prezzo: 100, quantita: 2 }, { prezzo: 50, quantita: 1 }];
    const clienti = [{ id: 1, nome: "Mario", cognome: "Rossi", email: "mario@example.com" }];
    const nuovoLavoro = { id_cliente: 1, giorno: "2025-05-08", totale: 0, servizi: [] };
    const setNuovoLavoro = jest.fn();
    await lavoroActions.inserimentoLavoro({ preventDefault: jest.fn() }, servizi, clienti, nuovoLavoro, setNuovoLavoro);
    expect(lavoroActions.dispatcher.inserimentoLavoro).not.toHaveBeenCalled();
  });
});

describe("Test su 'ricercaLavori'", () => {
  let lavoroActions;
  let mockDispatcher;

  beforeEach(() => {
    mockDispatcher = new Dispatcher();
    mockDispatcher.aggiornaLavori = jest.fn();
    lavoroActions = new LavoroActions();
    lavoroActions.dispatcher = mockDispatcher;
  });

  test("test 1: ricerca effettuata con successo", async () => {
    const datiRicerca = { query: "test" };
    const mockItems = [{ id: 1, nome: "Lavoro 1" }, { id: 2, nome: "Lavoro 2" }];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ items: mockItems }),
      })
    );

    await lavoroActions.ricercaLavori({ preventDefault: jest.fn() }, datiRicerca);

    expect(global.fetch).toHaveBeenCalledWith("/VISUALIZZA_ITEMS", expect.any(Object));
    expect(mockDispatcher.aggiornaLavori).toHaveBeenCalledWith(mockItems);
  });

  test("test 2: errore", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 500, 
      })
    );

    global.alert = jest.fn(); 

    await lavoroActions.ricercaLavori({ preventDefault: jest.fn() }, {});

    expect(mockDispatcher.aggiornaLavori).not.toHaveBeenCalled();
  });
});









