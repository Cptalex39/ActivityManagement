import React from 'react';
import { LavoroForms } from '../../../../view/forms/LavoroForms.js';

// Mock degli hook di React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

describe("LavoroForms", () => {
  let lavoroForms;
  let setErroriMock;

  beforeEach(() => {
    // Mock di useState
    setErroriMock = jest.fn();
    React.useState.mockImplementation(() => [{ errore_cliente: "", errore_servizi: "", errore_totale: "", errore_giorno: "", errore_note: "" }, setErroriMock]);
    // Mock di useEffect
    React.useEffect.mockImplementation((callback) => callback());

    lavoroForms = new LavoroForms(); // Creazione dell'istanza
  });

  it("Generazione campi nuovo lavoro corretti.", () => {
    // Logica del test
    const clienti = ["Mario Rossi - 3214567890 - mr@gmail.com", "Luca Verdi - 0818883322 - lv@gmail.com"];
    const servizi = ["Taglio capelli - 10.00 €", "Rasatura barba - 20.00 €"];
    const item = {
      cliente: "Mario Rossi - 3214567890 - mr@gmail.com",
      servizio: "Taglio capelli - 10.00 €",
      giorno: "05/10/2022", 
      note: "Note sul nuovo lavoro.", 
      errore_cliente: "Nessun errore cliente",
      errore_servizi: "Nessun errore servizi", 
      errore_giorno: "Nessun errore giorno",  
      errore_note: "Nessun errore note"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiNuovoLavoro = lavoroForms.getCampiNuovoLavoro(item, clienti, servizi, handleOnChange, handleOnClick, handleOnBlur);

    // Aspettative
    expect(campiNuovoLavoro.header).toBe('Nuovo lavoro');
    expect(campiNuovoLavoro.label).toEqual(["Cliente*", "Servizio*", "Giorno*", "Note"]);
    expect(campiNuovoLavoro.value).toEqual(["Mario Rossi - 3214567890 - mr@gmail.com", "Taglio capelli - 10.00 €", "05/10/2022", "Note sul nuovo lavoro."]);
    expect(campiNuovoLavoro.errore).toEqual(["Nessun errore cliente", "Nessun errore servizi", "Nessun errore giorno", "Nessun errore note"]);
    expect(campiNuovoLavoro.onChange).toBe(handleOnChange);
  });

  it('Generazione campi ricerca lavori corretti.', () => {
    const item = {
      cliente: "Mario Rossi - 3214567890 - mr@gmail.com",
      primo_giorno: "01/01/2024", 
      ultimo_giorno: "31/12/2024", 
      note: "Note sulla ricerca dei lavori.",
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiRicercaLavori = lavoroForms.getCampiRicercaLavori(item, handleOnChange, handleOnClick, handleOnBlur);

    expect(campiRicercaLavori.header).toBe("Ricerca lavori");
    expect(campiRicercaLavori.label).toEqual(["Cliente", "Primo giorno", "Ultimo giorno", "Note"]);
    expect(campiRicercaLavori.value).toEqual(["Mario Rossi - 3214567890 - mr@gmail.com", "01/01/2024", "31/12/2024", "Note sulla ricerca dei lavori."]);
    expect(campiRicercaLavori.onChange).toBe(handleOnChange);
  });

  it('Generazione campi lavoro esistente corretti.', () => {
    const servizi = ["Taglio capelli - 10.00 €", "Rasatura barba - 20.00 €"];
    const item = {
      tipo_selezione: 0,
      cliente: "Mario Rossi - 3214567890 - mr@gmail.com",
      servizio: "Taglio capelli - 10.00 €",
      giorno: "05/10/2022", 
      note: "Note sul lavoro esistente.", 
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiLavoro = lavoroForms.getCampiLavoroEsistente(servizi, item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiLavoro.header).toBe("Lavoro");
    expect(campiLavoro.tipoSelezione).toBe(0);
    expect(campiLavoro.value).toEqual(["Mario Rossi - 3214567890 - mr@gmail.com", "Taglio capelli - 10.00 €", "05/10/2022", "Note sul lavoro esistente."]);
    expect(campiLavoro.errore).toEqual(["", "", "", ""]);
    expect(campiLavoro.onChange).toBe(handleOnChange);
  });

  it('Generazione campi file lavori.', () => {
    const item = {
      primo_giorno: "01/01/2024", 
      ultimo_giorno: "31/12/2024",  
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiFileLavori = lavoroForms.getCampiFile(item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiFileLavori.header).toBe("File lavori");
    expect(campiFileLavori.value).toEqual(["01/01/2024", "31/12/2024"]);
    expect(campiFileLavori.onChange).toBe(handleOnChange);
  });
});









