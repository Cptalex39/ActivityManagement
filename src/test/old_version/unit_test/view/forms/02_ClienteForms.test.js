import React from 'react';
import { ClienteForms } from '../../../../view/forms/ClienteForms.js';

// Mock degli hook di React
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
  useEffect: jest.fn(),
}));

describe('ClienteForms', () => {
  let clienteForms;
  let setErroriMock;

  beforeEach(() => {
    // Mock di useState
    setErroriMock = jest.fn();
    React.useState.mockImplementation(() => [{ errore_contatto: "", errore_email: "", errore_note: "" }, setErroriMock]);

    // Mock di useEffect
    React.useEffect.mockImplementation((callback) => callback());

    clienteForms = new ClienteForms(); // Creazione dell'istanza
  });

  it('Generazione campi nuovo cliente corretti.', () => {
    // Logica del test
    const item = {
      nome: "Mario",
      cognome: "Rossi",
      contatto: "3214567890", 
      email: "mr@gmail.com", 
      note: "Note per il nuovo cliente Mario Rossi.", 
      errore_nome: "Nessun errore",
      errore_cognome: "Nessun errore", 
      errore_contatto: "Nessun errore", 
      errore_email: "Nessun errore", 
      errore_note: "Nessun errore"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiNuovoCliente = clienteForms.getCampiNuovoCliente(item, handleOnChange, handleOnClick, handleOnBlur);

    // Aspettative
    expect(campiNuovoCliente.header).toBe('Nuovo cliente');
    expect(campiNuovoCliente.label).toEqual(["Nome*", "Cognome*", "Contatto", "Email", "Note"]);
    expect(campiNuovoCliente.value).toEqual(["Mario", "Rossi", "3214567890", "mr@gmail.com", "Note per il nuovo cliente Mario Rossi."]);
    expect(campiNuovoCliente.errore).toEqual(["Nessun errore", "Nessun errore", "Nessun errore", "Nessun errore", "Nessun errore"]);
    expect(campiNuovoCliente.onChange).toBe(handleOnChange);
  });

  it('Generazione campi ricerca clienti corretti.', () => {
    const item = {
      nome: "Mario",
      cognome: "Rossi",
      contatto: "3333300000",
      email: "mr@gmail.com",
      note: "Note sulla ricerca dei clienti.",
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiRicercaClienti = clienteForms.getCampiRicercaClienti(item, handleOnChange, handleOnClick, handleOnBlur);

    expect(campiRicercaClienti.header).toBe("Ricerca clienti");
    expect(campiRicercaClienti.label).toEqual(["Nome", "Cognome", "Contatto", "email", "Note"]);
    expect(campiRicercaClienti.value).toEqual(["Mario", "Rossi", "3333300000", "mr@gmail.com", "Note sulla ricerca dei clienti."]);
    expect(campiRicercaClienti.onChange).toBe(handleOnChange);
  });

  it('Generazione campi cliente esistente corretti.', () => {
    const servizi = [];
    const item = {
      tipo_selezione: 0,
      nome: "Mario",
      cognome: "Rossi",
      contatto: "3214567890",
      email: "mr@gmail.com",
      note: "Note per il cliente Mario Rossi.",
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiCliente = clienteForms.getCampiClienteEsistente(servizi, item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiCliente.header).toBe("Cliente");
    expect(campiCliente.tipoSelezione).toBe(0);
    expect(campiCliente.value).toEqual(["Mario Rossi", "3214567890", "mr@gmail.com", "Note per il cliente Mario Rossi."]);
    expect(campiCliente.errore).toEqual([null, "", "", ""]);
    expect(campiCliente.onChange).toBe(handleOnChange);
  });
});









