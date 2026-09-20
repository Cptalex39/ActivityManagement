import { ClienteActions } from "../../../actions/ClienteActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";

jest.mock("../../../dispatcher/Dispatcher.js"); 

global.fetch = jest.fn((url, options) => {
  if (url === '/INSERISCI_ITEM' && options.method === 'POST') {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ id: 10 }),
    });
  }
  if (url === '/VISUALIZZA_ITEMS') {
    return Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ items: [{ id: 1, nome: 'Mario Rossi' }] }),
    });
  }
  return Promise.resolve({ status: 400 });
});

global.confirm = jest.fn(() => true); 
global.alert = jest.fn(() => true); 

describe("Tests sull'inizializzazione del dispatcher", () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
  });

  test("test 1", () => {
    expect(clienteActions.dispatcher).toBeInstanceOf(Dispatcher);
  });
});

describe("Tests su 'inserimentoCliente'", () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
  });
  

  test('test 1: inserimento di un cliente con successo', async () => {
    const nuovoCliente = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note sul cliente." 
    };
    await clienteActions.inserimentoCliente({ preventDefault: jest.fn() }, nuovoCliente, jest.fn());
  
    expect(clienteActions.dispatcher.inserimentoCliente).toHaveBeenCalledWith(expect.objectContaining({ id: 10 }));
  });

  test('test 2: errore 400', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 400 }));
    const nuovoCliente = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note sul cliente." 
    };
    await clienteActions.inserimentoCliente({ preventDefault: jest.fn() }, nuovoCliente, jest.fn());
    expect(clienteActions.dispatcher.inserimentoCliente).not.toHaveBeenCalled();
  });

  test('test 3: errore', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 500 }));
    const nuovoCliente = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note sul cliente." 
    };
    await clienteActions.inserimentoCliente({ preventDefault: jest.fn() }, nuovoCliente, jest.fn());
    expect(clienteActions.dispatcher.inserimentoCliente).not.toHaveBeenCalled();
  });
});

describe("Tests su 'ricercaClienti'", () => {
  let clienteActions;
  
  beforeEach(() => {
    clienteActions = new ClienteActions();
  });
  

  test('test 1: ricerca effettuata con successo', async () => {
    const datiRicerca = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note sul cliente." 
    };
    await clienteActions.ricercaClienti({ preventDefault: jest.fn() }, datiRicerca);
    expect(clienteActions.dispatcher.aggiornaClienti).toHaveBeenCalledWith([{ id: 1, nome: 'Mario Rossi' }]);
  });
  
  test('test 2: errore', async () => {
    fetch.mockImplementationOnce(() => Promise.resolve({ status: 500 }));
    const datiRicerca = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note sul cliente." 
    };
    await clienteActions.ricercaClienti({ preventDefault: jest.fn() }, datiRicerca);
    expect(clienteActions.dispatcher.aggiornaClienti).not.toHaveBeenCalled();
  });
});











