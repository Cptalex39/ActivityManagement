import React from 'react';
import { SpesaForms } from '../../../../view/forms/SpesaForms.js';

// Mock degli hook di React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

describe("SpesaForms", () => {
  let spesaForms;
  let setErroriMock;

  beforeEach(() => {
    // Mock di useState
    setErroriMock = jest.fn();
    React.useState.mockImplementation(() => [{ errore_nome: "", errore_descrizione: "", errore_totale: "", errore_giorno: "", errore_note: "" }, setErroriMock]);
    // Mock di useEffect
    React.useEffect.mockImplementation((callback) => callback());

    spesaForms = new SpesaForms(); // Creazione dell'istanza
  });

  it("Generazione campi nuova spesa corretti.", () => {
    // Logica del test
    const item = {
      nome: "Bolletta luce",
      descrizione: "Prima spesa del mese.", 
      totale: 252.24, 
      giorno: "01/01/2024", 
      note: "Note sulla nuova spesa bolletta luce.", 
      errore_nome: "Nessun errore nome",
      errore_descrizione: "Nessun errore descrizione", 
      errore_totale: "Nessun errore totale", 
      errore_giorno: "Nessun errore giorno",  
      errore_note: "Nessun errore note"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiNuovaSpesa = spesaForms.getCampiNuovaSpesa(item, handleOnChange, handleOnClick, handleOnBlur);

    // Aspettative
    expect(campiNuovaSpesa.header).toBe("Nuova spesa");
    expect(campiNuovaSpesa.label).toEqual(["Nome*", "Descrizione", "Totale*", "Giorno*", "Note"]);
    expect(campiNuovaSpesa.value).toEqual(["Bolletta luce", "Prima spesa del mese.", 252.24, "01/01/2024", "Note sulla nuova spesa bolletta luce."]);
    expect(campiNuovaSpesa.errore).toEqual(["Nessun errore nome", "Nessun errore descrizione", "Nessun errore totale", "Nessun errore giorno", "Nessun errore note"]);
    expect(campiNuovaSpesa.onChange).toBe(handleOnChange);
  });

  it('Generazione campi ricerca spese corretti.', () => {
    const item = {
      nome: "Bolletta luce",
      descrizione: "Prima spesa del mese.", 
      totale_min: 1.00, 
      totale_max: 1000.00, 
      primo_giorno: "01/01/2024", 
      ultimo_giorno: "31/12/2024", 
      note: "Note sulla ricerca delle spese.",
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiRicercaSpese = spesaForms.getCampiRicercaSpese(item, handleOnChange, handleOnClick, handleOnBlur);

    expect(campiRicercaSpese.header).toBe("Ricerca spese");
    expect(campiRicercaSpese.label).toEqual(["Nome", "Descrizione", "Totale minimo", "Totale massimo", "Primo giorno", "Ultimo giorno", "Note"]);
    expect(campiRicercaSpese.value).toEqual(["Bolletta luce", "Prima spesa del mese.", 1.00, 1000.00, "01/01/2024", "31/12/2024", "Note sulla ricerca delle spese."]);
    expect(campiRicercaSpese.onChange).toBe(handleOnChange);
  });

  it('Generazione campi spesa esistente corretti.', () => {
    const servizi = ["Taglio capelli - 10.00 €", "Rasatura barba - 20.00 €"];
    const item = {
      tipo_selezione: 0,
      nome: "Bolletta luce",
      descrizione: "Prima spesa del mese.", 
      totale: 252, 
      giorno: "01/01/2024", 
      note: "Note sulla spesa bolletta luce.", 
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiSpesa = spesaForms.getCampiSpesaEsistente(null, item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiSpesa.header).toBe("Spesa");
    expect(campiSpesa.tipoSelezione).toBe(0);
    expect(campiSpesa.value).toEqual(["Bolletta luce", "Prima spesa del mese.", "252.00", "01/01/2024", "Note sulla spesa bolletta luce."]);
    expect(campiSpesa.errore).toEqual(["", "", "", "", ""]);
    expect(campiSpesa.onChange).toBe(handleOnChange);
  });
  
  it('Generazione campi file spese.', () => {
    const item = {
      primo_giorno: "01/01/2024", 
      ultimo_giorno: "31/12/2024",  
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiFileSpese = spesaForms.getCampiFile(item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiFileSpese.header).toBe("File spese");
    expect(campiFileSpese.value).toEqual(["01/01/2024", "31/12/2024"]);
    expect(campiFileSpese.onChange).toBe(handleOnChange);
  });
});









