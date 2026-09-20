import { AutenticazioneActions } from "../../../actions/AutenticazioneActions.js";
import { Dispatcher } from "../../../dispatcher/Dispatcher.js";
import { controlloLogin } from "../../../utils/Controlli.js";

jest.mock("../../../dispatcher/Dispatcher.js");
jest.mock("../../../utils/Controlli.js");

describe("Test su 'login'", () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
  });

  test("test 1", async () => {
    const mockNavigate = jest.fn();
    const mockSetDatiLogin = jest.fn();
    
    const datiLogin = { username: 'username', password: 'password' };
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ utente: { username: 'username', ruolo: 'ruolo', note: 'Test note' } }),
      })
    );

    await autenticazioneActions.login({ preventDefault: jest.fn() }, datiLogin, mockSetDatiLogin, mockNavigate);

    expect(autenticazioneActions.dispatcher.eseguiLogin).toHaveBeenCalledWith('username', 'ruolo', 'Test note');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

describe("Test su 'logout'", () => {
  let autenticazioneActions;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
  });

  test("test 1", () => {
    autenticazioneActions.logout();

    expect(autenticazioneActions.dispatcher.eseguiLogout).toHaveBeenCalled();
  });
});

describe("Test su 'modificaProfilo'", () => {
  let autenticazioneActions;
  let mockSetDatiProfilo;
  let mockAutenticazioneSession;
  let datiProfilo;

  beforeEach(() => {
    autenticazioneActions = new AutenticazioneActions();
    mockSetDatiProfilo = jest.fn();
    mockAutenticazioneSession = { username: 'testUser', ruolo: 'user' };
    datiProfilo = { nuovo_username: 'newUser', note: 'updated note' };

    global.fetch = jest.fn((url) => {
      if (url === '/LOGIN') {
        return Promise.resolve({
          status: 200,
          json: () => Promise.resolve({ utente: { password: 'hashed_pw', salt_hex: 'salt123' } }),
        });
      }
      if (url === '/MODIFICA_PROFILO') {
        return Promise.resolve({ status: 200 });
      }
      return Promise.resolve({ status: 500 }); 
    });

    global.confirm = jest.fn(() => true);
    global.alert = jest.fn(); 
  });

  test("modificaProfilo aggiorna il profilo e chiama eseguiLogin", async () => {
    await autenticazioneActions.modificaProfilo({ preventDefault: jest.fn() }, mockAutenticazioneSession, datiProfilo, mockSetDatiProfilo);

    expect(global.fetch).toHaveBeenCalledWith('/LOGIN', expect.any(Object));
    expect(global.fetch).toHaveBeenCalledWith('/MODIFICA_PROFILO', expect.any(Object));
    expect(autenticazioneActions.dispatcher.eseguiLogin).toHaveBeenCalledWith(datiProfilo.nuovo_username, mockAutenticazioneSession.ruolo, datiProfilo.note);
  });

  test("modificaProfilo annulla se utente non conferma", async () => {
    global.confirm.mockReturnValueOnce(false);

    await autenticazioneActions.modificaProfilo({ preventDefault: jest.fn() }, mockAutenticazioneSession, datiProfilo, mockSetDatiProfilo);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(autenticazioneActions.dispatcher.eseguiLogin).not.toHaveBeenCalled();
    expect(global.alert).toHaveBeenCalledWith("Modifica annullata.");
  });

  test("gestione errore quando login fallisce", async () => {
    global.fetch.mockImplementationOnce((url) => {
      if (url === '/LOGIN') {
        return Promise.resolve({ status: 500 });
      }
    });

    await autenticazioneActions.modificaProfilo({ preventDefault: jest.fn() }, mockAutenticazioneSession, datiProfilo, mockSetDatiProfilo);

    expect(global.alert).toHaveBeenCalledWith("Errore durante la modifica del profilo, riprova più tardi.");
  });
});













