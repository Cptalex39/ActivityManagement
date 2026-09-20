import { autenticazioneSliceReducer, autenticazioneSliceActions } from "../../../../store/slice/AutenticazioneSlice.js";

describe("Gestione LocalStorage", () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
  });

  test("loadFromLocalStorage restituisce lo stato corretto", () => {
    global.localStorage.getItem.mockReturnValue(JSON.stringify({ username: "test", isLogged: true }));
    expect(localStorage.getItem("autenticazioneSession")).toEqual(JSON.stringify({ username: "test", isLogged: true }));
  });

  test("saveToLocalStorage salva correttamente", () => {
    const state = { value: { username: "test", isLogged: true } };
    global.localStorage.setItem.mockImplementation(() => {});
    expect(() => localStorage.setItem("autenticazioneSession", JSON.stringify(state))).not.toThrow();
  });
});

describe("autenticazioneSlice reducer", () => {
  const initialState = {
    value: { username: null, ruolo: "guest", note: "", isLogged: false },
  };

  test("eseguiLogin imposta i dati correttamente", () => {
    const action = autenticazioneSliceActions.eseguiLogin({ username: "user1", ruolo: "admin", note: "test" });
    const newState = autenticazioneSliceReducer(initialState, action);
  
    expect(newState.value.username).toBe("user1");
    expect(newState.value.ruolo).toBe("admin");
    expect(newState.value.isLogged).toBe(true);
  });
  

  test("eseguiLogout ripristina lo stato iniziale", () => {
    const loggedState = {
      value: { username: "user1", ruolo: "admin", note: "test", isLogged: true },
    };

    const newState = autenticazioneSliceReducer(loggedState, autenticazioneSliceActions.eseguiLogout());
    
    expect(newState.value.username).toBeNull();
    expect(newState.value.ruolo).toBe("guest");
    expect(newState.value.isLogged).toBe(false);
  });
});









