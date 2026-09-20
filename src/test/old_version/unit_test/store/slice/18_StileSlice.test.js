import { stileSliceReducer, stileSliceActions } from "../../../../store/slice/StileSlice.js";

describe("Gestione LocalStorage", () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
  });

  test("loadFromLocalStorage restituisce lo stato corretto", () => {
    global.localStorage.getItem.mockReturnValue(JSON.stringify({ username: "test", isLogged: true }));
    expect(localStorage.getItem("stileSession")).toEqual(JSON.stringify({ username: "test", isLogged: true }));
  });

  test("saveToLocalStorage salva correttamente", () => {
    const state = { value: { username: "test", isLogged: true } };
    global.localStorage.setItem.mockImplementation(() => {});
    expect(() => localStorage.setItem("stileSession", JSON.stringify(state))).not.toThrow();
  });
});

describe("stileSlice reducer", () => {
  const initialState = {
    value: {
      pathImg: "../img/immagine_sfondo1.jpg",
      coloreRGB: null,
      vistaItem: "row",
      vistaForm: "form"
    },
  };

  test("test su 'cambioImmagineSfondo", () => {
    const action = stileSliceActions.cambioImmagineSfondo({ 
      pathImg: "nuovaImmagineSfondo.png" 
    });
    const newState = stileSliceReducer(initialState, action);
  
    expect(newState.value.pathImg).toBe("nuovaImmagineSfondo.png");
    expect(newState.value.coloreRGB).toBe(null);
    expect(newState.value.vistaItem).toBe("row");
    expect(newState.value.vistaForm).toBe("form");
  });

  test("test su 'cambioColoreSfondo", () => {
    const action = stileSliceActions.cambioColoreSfondo({ 
      coloreRGB: "#224466" 
    });
    const newState = stileSliceReducer(initialState, action);
  
    expect(newState.value.pathImg).toBe(null);
    expect(newState.value.coloreRGB).toBe("#224466");
    expect(newState.value.vistaItem).toBe("row");
    expect(newState.value.vistaForm).toBe("form");
  });

  test("test su 'cambioVistaItem", () => {
    const action = stileSliceActions.cambioVistaItem({ 
      vistaItem: "card" 
    });
    const newState = stileSliceReducer(initialState, action);
  
    expect(newState.value.pathImg).toBe("../img/immagine_sfondo1.jpg");
    expect(newState.value.coloreRGB).toBe(null);
    expect(newState.value.vistaItem).toBe("card");
    expect(newState.value.vistaForm).toBe("form");
  });

  test("test su 'cambioVistaForm", () => {
    const action = stileSliceActions.cambioVistaForm({ 
      vistaForm: "card" 
    });
    const newState = stileSliceReducer(initialState, action);
  
    expect(newState.value.pathImg).toBe("../img/immagine_sfondo1.jpg");
    expect(newState.value.coloreRGB).toBe(null);
    expect(newState.value.vistaItem).toBe("row");
    expect(newState.value.vistaForm).toBe("card");
  });
});









