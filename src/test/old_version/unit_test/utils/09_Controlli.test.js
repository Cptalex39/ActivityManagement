import { controlloCliente, controlloServizio, controlloSpesa, controlloLavoro, controlloLogin, controlloProfilo } from "../../../utils/Controlli.js";

describe('Test per la funzione controlloCliente', () => {
  let mockSettersErrori;

  beforeEach(() => {
    mockSettersErrori = jest.fn();
  });

  it('dovrebbe restituire 0 errori', () => {
    const dati = {
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000",
      email: "mr@gmail.com", 
      note: "Note per il cliente Mario Rossi."
    }
    const numErrori = controlloCliente(dati, mockSettersErrori);
    expect(numErrori).toBe(0);
  });

  it('dovrebbe restituire 5 errori', () => {
    const dati = {
      nome: "MarioMarioMarioMarioMarioMarioMario", 
      cognome: "RossiRossiRossiRossiRossiRossiRossi", 
      contatto: "2333300000",
      email: "mr#gmail.com", 
      note: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
    }
    const numErrori = controlloCliente(dati, mockSettersErrori);
    expect(numErrori).toBe(5);
  });
});

describe('Test per la funzione controlloServizio', () => {
  let mockSettersErrori;

  beforeEach(() => {
    mockSettersErrori = jest.fn(); 
  });

  it('dovrebbe restituire 0 errori', () => {
    const dati = {
      nome: "Taglio capelli", 
      prezzo: 12.48, 
      note: "Note per il servizio \'Taglio capelli\'."
    }
    const numErrori = controlloServizio(dati, mockSettersErrori);
    expect(numErrori).toBe(0);
  });

  it('dovrebbe restituire 3 errori', () => {
    const dati = {
      nome: "Taglio capelli Taglio capelli Taglio capelli Taglio capelli Taglio capelli Taglio capelli Taglio capelli Taglio capelli Taglio capelli Taglio capelli.", 
      prezzo: 0.00, 
      note: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
    }
    const numErrori = controlloServizio(dati, mockSettersErrori);
    expect(numErrori).toBe(3);
  });
});

describe('Test per la funzione controlloSpesa', () => {
  let mockSettersErrori;

  beforeEach(() => {
    mockSettersErrori = jest.fn(); 
  });

  it('dovrebbe restituire 0 errori', () => {
    const dati = {
      nome: "Bolletta luce.", 
      giorno: "01/02/2024", 
      descrizione: "Descrizione per la spesa \'bolletta luce\'",
      totale: 123.45, 
      note: "Note per la spesa \'bolletta luce\'"
    }
    const numErrori = controlloSpesa(dati, mockSettersErrori);
    expect(numErrori).toBe(0);
  });

  it('dovrebbe restituire 5 errori', () => {
    const dati = {
      nome: "Bolletta luce Bolletta luce Bolletta luce Bolletta luce Bolletta luce Bolletta luce Bolletta luce Bolletta luce Bolletta luce Bolletta luce", 
      giorno: "", 
      descrizione: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt",
      totale: 0.00, 
      note: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
    }
    const numErrori = controlloSpesa(dati, mockSettersErrori);
    expect(numErrori).toBe(5);
  });
});

describe('Test per la funzione controlloLavoro', () => {
  let mockSettersErrori;

  beforeEach(() => {
    mockSettersErrori = jest.fn(); 
  });

  it('dovrebbe restituire 0 errori', () => {
    const dati = {
      id_cliente: 10, 
      totale: 12.34, 
      giorno: "01/02/2024", 
      note: "Note per il lavoro."
    }
    const numErrori = controlloLavoro(dati, mockSettersErrori);
    expect(numErrori).toBe(0);
  });

  it('dovrebbe restituire 4 errori', () => {
    const dati = {
      id_cliente: 0, 
      totale: 0.00, 
      giorno: "", 
      note: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec."
    }
    const numErrori = controlloLavoro(dati, mockSettersErrori);
    expect(numErrori).toBe(4);
  });
});

describe('Test per la funzione controlloLogin', () => {
  let mockSettersErrori;

  beforeEach(() => {
    mockSettersErrori = jest.fn(); 
  });

  it('dovrebbe restituire 0 errori', () => {
    const dati = {
      num_utenti: 1, 
      username: "username", 
      password: "CiaoMondo!!10", 
      password_db: "6d037657379112944e780c3fc123ea546885b44d666a73c48d4ad56698917b81feb2c255645cdc7ca864aaadf064a7cc45b799648f571b3159ddf253f3151530", 
      salt_hex_db: "n6Rn5rdJinVVrNqRANc4"
    }
    const numErrori = controlloLogin(dati, mockSettersErrori);
    expect(numErrori).toBe(0);
  });

  it('dovrebbe restituire 2 errori', () => {
    const dati = {
      username: "usernameusernameusernameusername", 
      password: "PassW"
    }
    const numErrori = controlloLogin(dati, mockSettersErrori);
    expect(numErrori).toBe(2);
  });
});

describe('Test per la funzione controlloProfilo', () => {
  let mockSettersErrori;

  beforeEach(() => {
    mockSettersErrori = jest.fn(); 
  });

  it('dovrebbe restituire 0 errori', () => {
    const dati = {
      nuovo_username: "username_2", 
      note: "Note sull\'utente.", 
      password_attuale: "CiaoMondo!!10", 
      password_db: "6d037657379112944e780c3fc123ea546885b44d666a73c48d4ad56698917b81feb2c255645cdc7ca864aaadf064a7cc45b799648f571b3159ddf253f3151530", 
      salt_hex_db: "n6Rn5rdJinVVrNqRANc4",
      nuova_password: "Ciaomondo!!20", 
      conferma_nuova_password: "Ciaomondo!!20",
    };
    const numErrori = controlloProfilo(dati, mockSettersErrori);
    expect(numErrori).toBe(0);
  });

  it('dovrebbe restituire 4 errori', () => {
    const dati = {
      nuovo_username: "usernameusernameusernameusername", 
      note: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.", 
      password_attuale: "CiaoMondo!!100", 
      password_db: "6d037657379112944e780c3fc123ea546885b44d666a73c48d4ad56698917b81feb2c255645cdc7ca864aaadf064a7cc45b799648f571b3159ddf253f3151530", 
      salt_hex_db: "n6Rn5rdJinVVrNqRANc4",
      nuova_password: "Ciaomondo!!20", 
      conferma_nuova_password: "Ciaomondo!!200",
    }
    const numErrori = controlloProfilo(dati, mockSettersErrori);
    expect(numErrori).toBe(4);
  });
});









