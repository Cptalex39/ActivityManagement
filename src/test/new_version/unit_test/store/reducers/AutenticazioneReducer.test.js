import { autenticazioneReducer, autenticazioneSliceActions } from "../../../../../react_redux/store/reducers/AutenticazioneReducer.js";
import { saveToLocalStorage } from "../../../../../react_redux/store/reducers/LocalStorage.js";

jest.mock('../../../../../react_redux/store/reducers/LocalStorage.js', () => ({
  saveToLocalStorage: jest.fn(),
  loadFromLocalStorage: jest.fn(() => undefined),
}));

const actualStateAdmin = {
  value: {
    username: "mr_user",
    ruolo: "amministratore",
    isLogged: true,
    primo_intervallo: "08:00",
    secondo_intervallo: "12:00",
    numero_clienti: 10,
  },
};

const actualStateClient = {
  value: {
    username: "mr_user",
    ruolo: "cliente",
    isLogged: true,
    primo_intervallo: "08:00",
    secondo_intervallo: "12:00",
    numero_clienti: 10,
    id_utente: 5, 
    nome: "Mario", 
    cognome: "Rossi", 
    email: "mr@example.it", 
    contatto: "3434343434", 
    indirizzo: "Via Roma, 10",
  }
};

describe('Vari test su "login"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const initialState = {
    value: {
      username: null,
      ruolo: "guest",
      isLogged: false,
      primo_intervallo: null,
      secondo_intervallo: null, 
      numero_clienti: null,
    },
  };

  /** UT_AutR_Login_01 **/
  test('ruolo != "cliente"', () => {
    const action = autenticazioneSliceActions.login({
      username: "mr_user",
      ruolo: "amministratore",
      primo_intervallo: "08:00",
      secondo_intervallo: "12:00",
      numero_clienti: 10,
    });
    const valueExpected = {
      value: {
        username: "mr_user",
        ruolo: "amministratore",
        isLogged: true,
        primo_intervallo: "08:00",
        secondo_intervallo: "12:00",
        numero_clienti: 10,
      }
    };

    const result = autenticazioneReducer(initialState, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });

  /** UT_AutR_Login_02 **/
  test('ruolo = "cliente"', () => {
    const action = autenticazioneSliceActions.login({
      username: "mr_user",
      ruolo: "cliente",
      primo_intervallo: "08:00",
      secondo_intervallo: "12:00",
      numero_clienti: 10,
      id: 5, 
      nome: "Mario", 
      cognome: "Rossi", 
      email: "mr@example.it", 
      contatto: "3434343434", 
      indirizzo: "Via Roma, 10",
    });
    const valueExpected = {
      value: {
        username: "mr_user",
        ruolo: "cliente",
        isLogged: true,
        primo_intervallo: "08:00",
        secondo_intervallo: "12:00",
        numero_clienti: 10,
        id_utente: 5, 
        nome: "Mario", 
        cognome: "Rossi", 
        email: "mr@example.it", 
        contatto: "3434343434", 
        indirizzo: "Via Roma, 10",
      }
    }

    const result = autenticazioneReducer(initialState, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "logout"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_AutR_Logout_01 **/
  test('ruolo != "cliente"', () => {
    const action = autenticazioneSliceActions.logout({
      ruolo: "amministratore",
    });

    const valueExpected = {
      value: {
        primo_intervallo: null,
        secondo_intervallo: null,
        numero_clienti: null,
        username: null,
        ruolo: "guest",
        isLogged: false,
      }
    }

    const result = autenticazioneReducer(actualStateAdmin, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });

  /** UT_AutR_Logout_02 **/
  test('ruolo = "cliente"', () => {
    const action = autenticazioneSliceActions.logout({
      ruolo: "cliente",
    });

    const valueExpected = {
      value: {
        id_utente: null,
        nome: null,
        cognome: null,
        email: null,
        contatto: null,
        indirizzo: null,
        primo_intervallo: null,
        secondo_intervallo: null,
        numero_clienti: null,
        username: null,
        ruolo: "guest",
        isLogged: false,
      }
    }

    const result = autenticazioneReducer(actualStateClient, action);

    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaIndirizzo"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_AutR_AgnInd_01 **/
  test('indirizzo aggiornato', () => {
    const action = autenticazioneSliceActions.aggiornaIndirizzo({
      indirizzo: "Via Napoli, 20",
    });
    
    const valueExpected = {
      value: {
        username: "mr_user",
        ruolo: "cliente",
        isLogged: true,
        primo_intervallo: "08:00",
        secondo_intervallo: "12:00",
        numero_clienti: 10,
        id_utente: 5, 
        nome: "Mario", 
        cognome: "Rossi", 
        email: "mr@example.it", 
        contatto: "3434343434", 
        indirizzo: "Via Napoli, 20",
      }
    }

    const result = autenticazioneReducer(actualStateClient, action);
  
    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaProfiloCliente"', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** UT_AutR_AgnProCli_01 **/
  test('Profilo cliente aggiornato', () => {
    const action = autenticazioneSliceActions.aggiornaProfiloCliente({
      email: "new_mr@example.it",
      contatto: "3838383838",
      indirizzo: "Via Milano, 40",
      username: "new_mr_user",
    });
    
    const valueExpected = {
      value: {
        username: "new_mr_user",
        ruolo: "cliente",
        isLogged: true,
        primo_intervallo: "08:00",
        secondo_intervallo: "12:00",
        numero_clienti: 10,
        id_utente: 5, 
        nome: "Mario", 
        cognome: "Rossi", 
        email: "new_mr@example.it",
        contatto: "3838383838", 
        indirizzo: "Via Milano, 40",
      }
    }

    const result = autenticazioneReducer(actualStateClient, action);
  
    expect(saveToLocalStorage).toHaveBeenCalledTimes(1);
    expect(result).toEqual(valueExpected);
  });
});








