import React from 'react';
import { ServizioForms } from '../../../../view/forms/ServizioForms.js';

// Mock degli hook di React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

describe('ServizioForms', () => {
  let servizioForms;
  let setErroriMock;

  beforeEach(() => {
    // Mock di useState
    setErroriMock = jest.fn();
    React.useState.mockImplementation(() => [{ errore_nome: "", errore_prezzo: "", errore_note: "", errore_in_uso: "" }, setErroriMock]);

    // Mock di useEffect
    React.useEffect.mockImplementation((callback) => callback());

    servizioForms = new ServizioForms(); // Creazione dell'istanza
  });

  it('Generazione campi nuovo servizio corretti.', () => {
    // Logica del test
    const item = {
      nome: "Taglio capelli",
      prezzo: 10.00, 
      note: "Note per il nuovo servizio taglio capelli.", 
      errore_nome: "Nessun errore nome",
      errore_prezzo: "Nessun errore prezzo", 
      errore_note: "Nessun errore note"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiNuovoServizio = servizioForms.getCampiNuovoServizio(item, handleOnChange, handleOnClick, handleOnBlur);

    // Aspettative
    expect(campiNuovoServizio.header).toBe('Nuovo servizio');
    expect(campiNuovoServizio.label).toEqual(["Nome*", "Prezzo*", "Note"]);
    expect(campiNuovoServizio.value).toEqual(["Taglio capelli", 10.00, "Note per il nuovo servizio taglio capelli."]);
    expect(campiNuovoServizio.errore).toEqual(["Nessun errore nome", "Nessun errore prezzo", "Nessun errore note"]);
    expect(campiNuovoServizio.onChange).toBe(handleOnChange);
  });

  it('Generazione campi ricerca servizi corretti.', () => {
    const item = {
      nome: "Taglio capelli",
      prezzo_min: 1.00,
      prezzo_max: 100.00,
      note: "Note sulla ricerca dei servizi.", 
      in_uso: "Si"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();
    
    const campiRicercaServizi = servizioForms.getCampiRicercaServizi(item, handleOnChange, handleOnClick, handleOnBlur);
    
    expect(campiRicercaServizi.header).toBe("Ricerca servizi");
    expect(campiRicercaServizi.label).toEqual(["Nome", "Prezzo minimo", "Prezzo massimo", "Note", "In uso"]);
    expect(campiRicercaServizi.value).toEqual(["Taglio capelli", 1.00, 100.00, "Note sulla ricerca dei servizi.", "Si"]);
    expect(campiRicercaServizi.onChange).toBe(handleOnChange);
  });

  it('Generazione campi servizio esistente corretti.', () => {
    const servizi = [];
    const item = {
      tipo_selezione: 0,
      nome: "Taglio capelli",
      prezzo: 10,
      note: "Note per il servizio taglio capelli.",
      in_uso: "Si"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiServizio = servizioForms.getCampiServizioEsistente(servizi, item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiServizio.header).toBe("Servizio");
    expect(campiServizio.tipoSelezione).toBe(0);
    expect(campiServizio.value).toEqual(["Taglio capelli", "10.00 €", "Note per il servizio taglio capelli.", "Si"]);
    expect(campiServizio.errore).toEqual(["", "", "", ""]);
    expect(campiServizio.onChange).toBe(handleOnChange);
  });
});









