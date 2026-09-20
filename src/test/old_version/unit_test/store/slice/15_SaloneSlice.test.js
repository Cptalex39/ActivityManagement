import { attivitaSliceReducer, attivitaSliceActions } from "../../../../store/slice/AttivitaSlice.js";

describe("Gestione LocalStorage", () => {
  beforeEach(() => {
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
  });

  test("loadFromLocalStorage restituisce lo stato corretto", () => {
    global.localStorage.getItem.mockReturnValue(JSON.stringify({ username: "test", isLogged: true }));
    expect(localStorage.getItem("attivitaSession")).toEqual(JSON.stringify({ username: "test", isLogged: true }));
  });

  test("saveToLocalStorage salva correttamente", () => {
    const state = { value: { username: "test", isLogged: true } };
    global.localStorage.setItem.mockImplementation(() => {});
    expect(() => localStorage.setItem("attivitaSession", JSON.stringify(state))).not.toThrow();
  });
});

describe("attivitaSlice reducer", () => {
  const BC_NOT_SELECTED = "rgba(0, 0, 0, 0.5)";
  const BC_SELECTED = "#0050EF";
  const BC_VIEW = "rgba(0, 0, 0, 0.5)";
  let initialState;

  beforeEach(() => {
    initialState = {
      value: {
        clienti: {
          id: 1, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "clienti", titolo: "Clienti", 
          img: "clienti.png", backgroundColor: BC_SELECTED, x: 100, y: 100
        }, 
        servizi: {
          id: 2, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "servizi", titolo: "Servizi", 
          img: "servizi.png", backgroundColor: BC_NOT_SELECTED, x: 450, y: 100
        }, 
        lavori: {
          id: 3, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "lavori", titolo: "Lavori", 
          img: "lavori.png", backgroundColor: BC_SELECTED, x: 800, y: 100
        }, 
        prenotazione: {
          id: 4, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "prenotazione", titolo: "Prenotazione", 
          img: "prenotazione.png", backgroundColor: BC_NOT_SELECTED, x: 1150, y: 100
        },  
        spese: {
          id: 5, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "spese", titolo: "Spese", 
          img: "spese.png", backgroundColor: BC_SELECTED, x: 1500, y: 100
        }, 
        attivita: {
          id: 6, tipo:"CardWidget",  tipoVisualizzazione: 0, nome: "attivita", titolo: "Attivita", 
          img: "attivita.png", backgroundColor: BC_NOT_SELECTED, x: 1850, y: 100 
        }, 
        profilo: {
          id: 7, tipo:"CardWidget",  tipoVisualizzazione: 1, nome: "profilo", titolo: "Profilo", 
          img: "profilo.png", backgroundColor: BC_SELECTED, x: 2200, y: 100
        }, 
      },
    };
  });

  test("test su 'modificaWidget'", () => {
    const action = attivitaSliceActions.modificaWidget({ 
      nomeWidget: "spese", 
      tipoVisualizzazione: 1 
    });
    const newState = attivitaSliceReducer(initialState, action);
  
    expect(newState.value.spese).toEqual({
      id: 5, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "spese", titolo: "Spese", 
      img: "spese.png", backgroundColor: BC_SELECTED, x: 1500, y: 100
    });

    expect(newState.value.clienti).toEqual({
      id: 1, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "clienti", titolo: "Clienti", 
      img: "clienti.png", backgroundColor: BC_SELECTED, x: 100, y: 100
    });

    expect(newState.value.servizi).toEqual({
      id: 2, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "servizi", titolo: "Servizi", 
      img: "servizi.png", backgroundColor: BC_NOT_SELECTED, x: 450, y: 100
    });

    expect(newState.value.lavori).toEqual({
      id: 3, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "lavori", titolo: "Lavori", 
      img: "lavori.png", backgroundColor: BC_SELECTED, x: 800, y: 100
    });

    expect(newState.value.prenotazione).toEqual({
      id: 4, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "prenotazione", titolo: "Prenotazione", 
      img: "prenotazione.png", backgroundColor: BC_NOT_SELECTED, x: 1150, y: 100
    });

    expect(newState.value.attivita).toEqual({
      id: 6, tipo:"CardWidget",  tipoVisualizzazione: 0, nome: "attivita", titolo: "Attivita", 
      img: "attivita.png", backgroundColor: BC_NOT_SELECTED, x: 1850, y: 100 
    });

    expect(newState.value.profilo).toEqual({
      id: 7, tipo:"CardWidget",  tipoVisualizzazione: 1, nome: "profilo", titolo: "Profilo", 
      img: "profilo.png", backgroundColor: BC_SELECTED, x: 2200, y: 100
    });
  });

  test("test su 'widgetSelected'", () => {
    const action = attivitaSliceActions.widgetSelected({});
    const newState = attivitaSliceReducer(initialState, action);
        
    expect(newState.value.clienti).toEqual({
      id: 1, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "clienti", titolo: "Clienti", 
      img: "clienti.png", backgroundColor: BC_SELECTED, x: 100, y: 100
    });
    
    expect(newState.value.servizi).toEqual({
      id: 2, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "servizi", titolo: "Servizi", 
      img: "servizi.png", backgroundColor: BC_NOT_SELECTED, x: 450, y: 100
    });
    
    expect(newState.value.lavori).toEqual({
      id: 3, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "lavori", titolo: "Lavori", 
      img: "lavori.png", backgroundColor: BC_SELECTED, x: 800, y: 100
    });
    
    expect(newState.value.prenotazione).toEqual({
      id: 4, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "prenotazione", titolo: "Prenotazione", 
      img: "prenotazione.png", backgroundColor: BC_NOT_SELECTED, x: 1150, y: 100
    });
    
    expect(newState.value.spese).toEqual({
      id: 5, tipo:"CardWidget", tipoVisualizzazione: 1,  nome: "spese", titolo: "Spese", 
      img: "spese.png", backgroundColor: BC_SELECTED, x: 1500, y: 100
    });

    expect(newState.value.attivita).toEqual({
      id: 6, tipo:"CardWidget",  tipoVisualizzazione: 0, nome: "attivita", titolo: "Attivita", 
      img: "attivita.png", backgroundColor: BC_NOT_SELECTED, x: 1850, y: 100 
    });

    expect(newState.value.profilo).toEqual({
      id: 7, tipo:"CardWidget",  tipoVisualizzazione: 1, nome: "profilo", titolo: "Profilo", 
      img: "profilo.png", backgroundColor: BC_SELECTED, x: 2200, y: 100
    });
  });

  test("test su 'widgetView'", () => {
    const action = attivitaSliceActions.widgetView({});
    const newState = attivitaSliceReducer(initialState, action);
        
    expect(newState.value.clienti).toEqual({
      id: 1, tipo:"CardWidget", tipoVisualizzazione: 2,  nome: "clienti", titolo: "Clienti", 
      img: "clienti.png", backgroundColor: BC_VIEW, x: 100, y: 100
    });
    
    expect(newState.value.servizi).toEqual({
      id: 2, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "servizi", titolo: "Servizi", 
      img: "servizi.png", backgroundColor: BC_NOT_SELECTED, x: 450, y: 100
    });
    
    expect(newState.value.lavori).toEqual({
      id: 3, tipo:"CardWidget", tipoVisualizzazione: 2,  nome: "lavori", titolo: "Lavori", 
      img: "lavori.png", backgroundColor: BC_VIEW, x: 800, y: 100
    });
    
    expect(newState.value.prenotazione).toEqual({
      id: 4, tipo:"CardWidget", tipoVisualizzazione: 0,  nome: "prenotazione", titolo: "Prenotazione", 
      img: "prenotazione.png", backgroundColor: BC_NOT_SELECTED, x: 1150, y: 100
    });
    
    expect(newState.value.spese).toEqual({
      id: 5, tipo:"CardWidget", tipoVisualizzazione: 2,  nome: "spese", titolo: "Spese", 
      img: "spese.png", backgroundColor: BC_VIEW, x: 1500, y: 100
    });

    expect(newState.value.attivita).toEqual({
      id: 6, tipo:"CardWidget",  tipoVisualizzazione: 0, nome: "attivita", titolo: "Attivita", 
      img: "attivita.png", backgroundColor: BC_NOT_SELECTED, x: 1850, y: 100 
    });

    expect(newState.value.profilo).toEqual({
      id: 7, tipo:"CardWidget",  tipoVisualizzazione: 2, nome: "profilo", titolo: "Profilo", 
      img: "profilo.png", backgroundColor: BC_VIEW, x: 2200, y: 100
    });
  });
});









