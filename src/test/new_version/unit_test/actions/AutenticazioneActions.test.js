import { AutenticazioneActions } from "../../../../react_redux/actions/AutenticazioneActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { passwordIsCorrect, generateRandomString, encryptPassword } from "../../../../utils/Sicurezza";
import { controlloModificaProfiloUtente } from "../../../../utils/Controlli";
import { autenticazioneSliceActions } from "../../../../react_redux/store/reducers/AutenticazioneReducer";

// Mock del dispatch di Redux
const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

// Mock di sicurezza
jest.mock("../../../../utils/Sicurezza", () => ({
  ...jest.requireActual("../../../../utils/Sicurezza"),
  passwordIsCorrect: jest.fn(), 
  generateRandomString: jest.fn(),
  encryptPassword: jest.fn(),
  PEPPER_HEX: 'pepper-finto',
}));

// Mock di Controlli
jest.mock("../../../../utils/Controlli", () => ({
  ...jest.requireActual("../../../../utils/Controlli"), 
  controlloModificaProfiloUtente: jest.fn()
}));

describe("Vari test su 'login'", () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AutA_Login_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const datiLogin = { username: 'test', password: '1234' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isOK: false,
      responseStatus: 401,
      is_active: 0,
    });
  });

  /** UT_AutA_Login_02 **/
  test('response.ok = true AND num_utenti = 0', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ utente:false, password:null, salt_hex:null, ruolo:null, indirizzo:null }),
    });

    const datiLogin = { username: 'test', password: '1234' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
  
  /** UT_AutA_Login_03 **/
  test('response.ok = true AND num_utenti = 1 AND passwordIsCorrect = false', async () => {
    passwordIsCorrect.mockReturnValue(false);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ utente:true, password:"password", salt_hex:"salt_hex", ruolo:"ruolo", indirizzo:"indirizzo" }),
    });

    const datiLogin = { username: 'test', password: '1234' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  /** UT_AutA_Login_04 **/
  test('response.ok = true AND num_utenti = 1 AND passwordIsCorrect = true AND ruolo != "Amministratore" AND ruolo != "cliente"', async () => {
    passwordIsCorrect.mockReturnValue(true);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ utente:true, password:"password", salt_hex:"salt_hex", ruolo:"test", indirizzo:"indirizzo" }),
    });

    const datiLogin = { username: 'test', password: '1234' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.login({
        username: "test",
        ruolo: undefined,  
        indirizzo: undefined,
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200, 
      is_active: 0,
    });
  });

  /** UT_AutA_Login_05 **/
  test('Restituisce null se non trova nessun utente', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ utente: null }),
    });

    const datiLogin = { username: 'test', password: '1234' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(result).toBeNull();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  /** UT_AutA_Login_06 **/
  test('Restituisce null se la password è errata', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({
        utente: { password: 'hashXYZ', salt_hex: 'saltXYZ' },
      }),
    });

    passwordIsCorrect.mockReturnValue(false);

    const datiLogin = { username: 'test', password: 'wrongpass' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(passwordIsCorrect).toHaveBeenCalledWith('wrongpass', 'hashXYZ', 'saltXYZ');
    expect(result).toBeNull();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  /** UT_AutA_Login_07 **/
  test('Login riuscito per un Amministratore attivo', async () => {
    const mockUtente = {
      password: 'hashXYZ',
      salt_hex: 'saltXYZ',
      ruolo: 'Amministratore',
      indirizzo: 'Via Roma 1',
      is_active: true,
      primo_intervallo: '08:00',
      secondo_intervallo: '14:00',
      numero_clienti: 10,
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ utente: mockUtente }),
    });
    
    passwordIsCorrect.mockReturnValue(true);

    const datiLogin = { username: 'admin', password: 'correct' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.login(
        expect.objectContaining({
          username: 'admin',
          ruolo: 'Amministratore',
          primo_intervallo: '08:00',
          secondo_intervallo: '14:00',
          numero_clienti: 10,
        })
      )
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(autenticazioneSliceActions.logout());

    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
      is_active: 1,
    });
  });

  /** UT_AutA_Login_08 **/
  test('Login riuscito per un cliente attivo', async () => {
    const mockUtente = {
      password: 'hashXYZ',
      salt_hex: 'saltXYZ',
      ruolo: 'cliente',
      is_active: true,
      id: 1,
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario@test.it',
      contatto: '123456',
      indirizzo: 'Via Roma 1',
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ utente: mockUtente }),
    });

    passwordIsCorrect.mockReturnValue(true);

    const datiLogin = { username: 'mario', password: 'correct' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.login(
        expect.objectContaining({
          username: 'mario',
          ruolo: 'cliente',
          id: 1,
          nome: 'Mario',
          cognome: 'Rossi',
          email: 'mario@test.it',
          contatto: '123456',
          indirizzo: 'Via Roma 1',
        })
      )
    );
    expect(mockDispatch).not.toHaveBeenCalledWith(autenticazioneSliceActions.logout());

    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
      is_active: 1,
    });
  });

  /** UT_AutA_Login_09 **/
  test('Fa il dispatch di logout se il cliente non è attivo', async () => {
    const mockUtente = {
      password: 'hashXYZ',
      salt_hex: 'saltXYZ',
      ruolo: 'cliente',
      is_active: false,
      id: 1,
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario@test.it',
      contatto: '123456',
      indirizzo: 'Via Roma 1',
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ utente: mockUtente }),
    });

    passwordIsCorrect.mockReturnValue(true);

    const datiLogin = { username: 'mario', password: 'correct' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.login(expect.anything())
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.logout()
    );

    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
      is_active: 0,
    });
  });

  /** UT_AutA_Login_10 **/
  test('Un Amministratore è sempre considerato attivo anche se is_active è false', async () => {
    const mockUtente = {
      password: 'hashXYZ',
      salt_hex: 'saltXYZ',
      ruolo: 'Amministratore',
      is_active: false,
      primo_intervallo: '08:00',
      secondo_intervallo: '14:00',
      numero_clienti: 5,
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ utente: mockUtente }),
    });

    passwordIsCorrect.mockReturnValue(true);

    const datiLogin = { username: 'admin', password: 'correct' };

    const result = await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);
    expect(mockDispatch).not.toHaveBeenCalledWith(autenticazioneSliceActions.logout());
    expect(result.is_active).toBe(1);
  });

  /** UT_AutA_Login_11  **/
  test('Ruolo diverso da "cliente" e "Amministratore", non deve aggiungere i campi specifici al payload', async () => {
    const mockUtente = {
      password: 'hashXYZ',
      salt_hex: 'saltXYZ',
      ruolo: 'dipendente', // né "cliente" né "Amministratore"
      is_active: true,
      // campi del branch "cliente"
      id: 99,
      nome: 'Mario',
      cognome: 'Rossi',
      email: 'mario@test.it',
      contatto: '123456',
      indirizzo: 'Via Roma 1',
      // campi del branch "Amministratore"
      primo_intervallo: '08:00',
      secondo_intervallo: '14:00',
      numero_clienti: 10,
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ utente: mockUtente }),
    });

    const datiLogin = { username: 'mario', password: 'correct' };

    passwordIsCorrect.mockReturnValue(true);

    await autenticazioneActions.login(datiLogin);

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', datiLogin);

    // Recupera l'azione effettivamente dispatchata
    const dispatchedAction = mockDispatch.mock.calls.find(
      call => call[0]?.type === autenticazioneSliceActions.login.type
    )?.[0];

    expect(dispatchedAction.payload).not.toHaveProperty('id');
    expect(dispatchedAction.payload).not.toHaveProperty('nome');
    expect(dispatchedAction.payload).not.toHaveProperty('cognome');
    expect(dispatchedAction.payload).not.toHaveProperty('email');
    expect(dispatchedAction.payload).not.toHaveProperty('contatto');
    expect(dispatchedAction.payload).not.toHaveProperty('primo_intervallo');
    expect(dispatchedAction.payload).not.toHaveProperty('secondo_intervallo');
    expect(dispatchedAction.payload).not.toHaveProperty('numero_clienti');
  });
});

describe("Vari test su 'eseguiLogin'", () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AutA_EseLogin_01 **/
  test('Restituisce isOK: false se la risposta non è ok', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401, 
      json: jest.fn().mockResolvedValue({ utente: null })
    });

    const result = await autenticazioneActions.eseguiLogin("test", "1234");

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', { username:"test", password:"1234" });
    expect(result).toEqual({
      isOK: false,
      responseStatus: 401,
      password_db: null,
      salt_hex_db: null
    });
  });
  
  /** UT_AutA_EseLogin_02 **/
  test('Non trova nessun utente', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ utente: [] })
    });

    const result = await autenticazioneActions.eseguiLogin("test", "1234");

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', { username:"test", password:"1234" });
    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
      password_db: undefined, 
      salt_hex_db: undefined
    });
  });

  /** UT_AutA_EseLogin_03 **/
  test('Utente trovato', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ utente: {salt_hex:"abcd", password:"1234" } })
    });

    const result = await autenticazioneActions.eseguiLogin("test", "1234");

    expect(responseSpy).toHaveBeenCalledWith('/LOGIN', { username:"test", password:"1234" });
    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
      password_db: "1234",
      salt_hex_db: "abcd"
    });
  });
});

describe('Vari test su "modificaProfilo"', () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AutA_ModPro_01 **/
  test('num_errori > 1', async () => {
    const mockSetDatiProfilo = jest.fn();
    const mockNavigate = jest.fn();
    const risultatoControllo = { dati: "dati", num_errori: 1 };

    controlloModificaProfiloUtente.mockReturnValue(risultatoControllo);

    const result = await autenticazioneActions.modificaProfilo(
      "ruolo",
      { dati: "dati" },
      mockSetDatiProfilo,
      mockNavigate
    );

    expect(mockSetDatiProfilo).toHaveBeenCalledWith(risultatoControllo);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  /** UT_AutA_ModPro_02 **/
  test('response.ok = false', async () => {
    const mockSetDatiProfilo = jest.fn();
    const mockNavigate = jest.fn();
    const risultatoControllo = { dati:"dati", num_errori:0 };

    controlloModificaProfiloUtente.mockReturnValue(risultatoControllo);
    
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const datiProfilo = { password_attuale: 'vecchiaPassword' };

    const result = await autenticazioneActions.modificaProfilo(
      'cliente',
      datiProfilo,
      mockSetDatiProfilo,
      mockNavigate
    );

    expect(responseSpy).toHaveBeenCalledTimes(1);
    expect(responseSpy).toHaveBeenCalledWith("/OTTIENI_PASSWORD_UTENTE", datiProfilo);

    expect(passwordIsCorrect).not.toHaveBeenCalled();

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();

    expect(mockSetDatiProfilo).toHaveBeenCalledTimes(2); 
    const updaterFn = mockSetDatiProfilo.mock.calls[1][0];
    expect(typeof updaterFn).toBe('function');

    const prevState = { username: 'mario' };
    const nuovoStato = updaterFn(prevState);
    expect(nuovoStato).toEqual({
      username: 'mario',
      errore_password_attuale: "La password non è corretta.",
    });

    expect(result).toBeUndefined();
  });

  /** UT_AutA_ModPro_03 **/
  test('response.ok = true AND isPasswordCorrect = false', async () => {
    const mockSetDatiProfilo = jest.fn();
    const mockNavigate = jest.fn();
    const risultatoControllo = { dati: "dati", num_errori: 0 };

    controlloModificaProfiloUtente.mockReturnValue(risultatoControllo);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        result: [{ password: 'hashSalvatoNelDb', salt_hex: 'saltSalvato' }],
      }),
    });

    passwordIsCorrect.mockReturnValue(false);

    const datiProfilo = { password_attuale: 'passwordSbagliata' };

    const result = await autenticazioneActions.modificaProfilo(
      'cliente',
      datiProfilo,
      mockSetDatiProfilo,
      mockNavigate
    );

    expect(responseSpy).toHaveBeenCalledTimes(1);
    expect(responseSpy).toHaveBeenCalledWith("/OTTIENI_PASSWORD_UTENTE", datiProfilo);

    expect(passwordIsCorrect).toHaveBeenCalledWith(
      'passwordSbagliata',
      'hashSalvatoNelDb',
      'saltSalvato'
    );

    expect(datiProfilo.password_attuale).toBe('passwordSbagliata');

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();

    expect(mockSetDatiProfilo).toHaveBeenCalledTimes(2);
    const updaterFn = mockSetDatiProfilo.mock.calls[1][0];
    const nuovoStato = updaterFn({ username: 'mario' });
    expect(nuovoStato).toEqual({
      username: 'mario',
      errore_password_attuale: "La password non è corretta.",
    });

    expect(result).toBeUndefined();
  });

  /** UT_AutA_ModPro_04 **/
  test('response.ok = true (solo il primo) AND isPasswordCorrect = true', async () => {
    const mockSetDatiProfilo = jest.fn();
    const mockNavigate = jest.fn();
    const risultatoControllo = { dati: "dati", num_errori: 0 };

    controlloModificaProfiloUtente.mockReturnValue(risultatoControllo);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: [{ password: 'hashCorretto', salt_hex: 'saltCorretto' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

    passwordIsCorrect.mockReturnValue(true);

    const datiProfilo = {
      password_attuale: 'passwordCorretta',
      nuova_password: "",
      nuovo_username: 'mario.rossi',
      primo_intervallo: '09:00',
      secondo_intervallo: '18:00',
      numero_clienti: 5,
    };

    const result = await autenticazioneActions.modificaProfilo(
      'cliente',
      datiProfilo,
      mockSetDatiProfilo,
      mockNavigate
    );

    expect(responseSpy).toHaveBeenCalledTimes(2);
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD_UTENTE", datiProfilo);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_UTENTE", datiProfilo);

    expect(passwordIsCorrect).toHaveBeenCalledWith(
      'passwordCorretta',
      'hashCorretto',
      'saltCorretto'
    );

    expect(datiProfilo.password_attuale).toBe('hashCorretto');

    expect(generateRandomString).not.toHaveBeenCalled();
    expect(encryptPassword).not.toHaveBeenCalled();

    expect(mockNavigate).not.toHaveBeenCalled();

    expect(mockSetDatiProfilo).toHaveBeenCalledTimes(1);
    expect(mockSetDatiProfilo).toHaveBeenCalledWith(risultatoControllo);
    expect(window.alert).toHaveBeenCalledWith("Modifica profilo fallita.");
    expect(result).toBeUndefined();
  });

  /** UT_AutA_ModPro_05 **/
  test('response.ok = true (entrambi) AND isPasswordCorrect = true', async () => {
    const mockSetDatiProfilo = jest.fn();
    const mockNavigate = jest.fn();
    const risultatoControllo = { dati: "dati", num_errori: 0 };

    controlloModificaProfiloUtente.mockReturnValue(risultatoControllo);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: [{ password: 'hashCorretto', salt_hex: 'saltCorretto' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

    passwordIsCorrect.mockReturnValue(true);

    const datiProfilo = {
      password_attuale: 'passwordCorretta',
      nuova_password: "",
      nuovo_username: 'mario.rossi',
      primo_intervallo: '09:00',
      secondo_intervallo: '18:00',
      numero_clienti: 5,
    };

    const result = await autenticazioneActions.modificaProfilo(
      'cliente',
      datiProfilo,
      mockSetDatiProfilo,
      mockNavigate
    );

    expect(responseSpy).toHaveBeenCalledTimes(2);
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD_UTENTE", datiProfilo);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_UTENTE", datiProfilo);

    expect(passwordIsCorrect).toHaveBeenCalledWith(
      'passwordCorretta',
      'hashCorretto',
      'saltCorretto'
    );

    expect(datiProfilo.password_attuale).toBe('hashCorretto');

    expect(generateRandomString).not.toHaveBeenCalled();
    expect(encryptPassword).not.toHaveBeenCalled();

    expect(mockDispatch).toHaveBeenCalledWith(autenticazioneSliceActions.login({
      username: 'mario.rossi',
      ruolo: 'cliente',
      primo_intervallo: '09:00',
      secondo_intervallo: '18:00',
      numero_clienti: 5,
    }));

    expect(mockNavigate).toHaveBeenCalledWith("/");

    expect(mockSetDatiProfilo).toHaveBeenCalledTimes(1);
    expect(mockSetDatiProfilo).toHaveBeenCalledWith(risultatoControllo);
    expect(window.alert).toHaveBeenCalledWith("Profilo modificato con successo.");
    expect(result).toBeUndefined();
  });

  /** UT_AutA_ModPro_06 **/
  test('response.ok = true (entrambi) AND isPasswordCorrect = true AND datiProfilo.nuova_password inserita', async () => {
    const mockSetDatiProfilo = jest.fn();
    const mockNavigate = jest.fn();
    const risultatoControllo = { dati: "dati", num_errori: 0 };

    generateRandomString.mockReturnValue("12345678901234567890123456789012");
    encryptPassword.mockReturnValue("password_criptata");

    controlloModificaProfiloUtente.mockReturnValue(risultatoControllo);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          result: [{ password: 'hashCorretto', salt_hex: 'saltCorretto' }],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
      });

    passwordIsCorrect.mockReturnValue(true);

    const datiProfilo = {
      password_attuale: 'passwordCorretta',
      nuova_password: "NuovaPassword10!!",
      conferma_nuova_password: "NuovaPassword10!!",
      nuovo_username: 'mario.rossi',
      primo_intervallo: '09:00',
      secondo_intervallo: '18:00',
      numero_clienti: 5,
    };

    const result = await autenticazioneActions.modificaProfilo(
      'cliente',
      datiProfilo,
      mockSetDatiProfilo,
      mockNavigate
    );

    expect(responseSpy).toHaveBeenCalledTimes(2);
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD_UTENTE", datiProfilo);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_UTENTE", datiProfilo);

    expect(passwordIsCorrect).toHaveBeenCalledWith(
      'passwordCorretta',
      'hashCorretto',
      'saltCorretto'
    );

    expect(datiProfilo.password_attuale).toBe('hashCorretto');

    expect(generateRandomString).toHaveBeenCalledTimes(1);
    expect(encryptPassword).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalledWith(autenticazioneSliceActions.login({
      username: 'mario.rossi',
      ruolo: 'cliente',
      primo_intervallo: '09:00',
      secondo_intervallo: '18:00',
      numero_clienti: 5,
    }));

    expect(mockNavigate).toHaveBeenCalledWith("/");

    expect(mockSetDatiProfilo).toHaveBeenCalledTimes(1);
    expect(mockSetDatiProfilo).toHaveBeenCalledWith(risultatoControllo);
    expect(window.alert).toHaveBeenCalledWith("Profilo modificato con successo.");
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "aggiornaIndirizzo"', () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AutA_AgnInd_01 **/
  test('Indirizzo aggiornato', async () => {
    const nuovoIndirizzo = "Via Napoli, 20";

    const result = await autenticazioneActions.aggiornaIndirizzo(nuovoIndirizzo);

    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.aggiornaIndirizzo({
        indirizzo: nuovoIndirizzo
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "eliminazioneProfilo"', () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AutA_EliPro_01 **/
  test('respone.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const dati = {
      dati: "dati"
    };

    const result = await autenticazioneActions.eliminazioneProfilo(dati);

    expect(responseSpy).toHaveBeenCalledWith('/AGGIORNA_STATO_PROFILO', { ...dati, stato:"DELETION_REQUEST" });
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_AutA_EliPro_02 **/
  test('respone.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const dati = {
      dati: "dati"
    };

    const result = await autenticazioneActions.eliminazioneProfilo(dati);

    expect(responseSpy).toHaveBeenCalledWith('/AGGIORNA_STATO_PROFILO', { ...dati, stato:"DELETION_REQUEST" });
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200,
    });
  });
});









