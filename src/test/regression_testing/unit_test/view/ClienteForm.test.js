import React from "react";
import { ClienteForms } from "../../../../react_redux/views/forms/ClienteForms";

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
    React.useState.mockImplementation(() => [{ errore_contatto: "", errore_email: "" }, setErroriMock]);

    // Mock di useEffect
    React.useEffect.mockImplementation((callback) => callback());

    clienteForms = new ClienteForms(); // Creazione dell'istanza
  });
  
  /** RT_UT_CliForm_01 **/
  it('Generazione campi ricerca clienti corretti.', () => {
    const item = {
      nome: "Mario",
      cognome: "Rossi",
      contatto: "3333300000",
      email: "mr@gmail.com"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiRicercaClienti = clienteForms.getCampiRicercaClienti(item, handleOnChange, handleOnClick, handleOnBlur);

    expect(campiRicercaClienti.header).toBe("Ricerca clienti");
    expect(campiRicercaClienti.label).toEqual(["Nome", "Cognome", "Telefono / cellulare", "Email"]);
    expect(campiRicercaClienti.value).toEqual(["Mario", "Rossi", "3333300000", "mr@gmail.com"]);
    expect(campiRicercaClienti.onChange).toBe(handleOnChange);
  });

  /** RT_UT_CliForm_02 **/
  it('Generazione campi cliente esistente corretti.', () => {
    const item = {
      tipo_selezione: 0,
      nome: "Mario",
      cognome: "Rossi",
      contatto: "3214567890",
      email: "mr@gmail.com"
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    // Chiamata al metodo
    const campiCliente = clienteForms.getCampiClienteEsistente(item, handleOnChange, handleOnClick, handleOnBlur);

    // Verifiche delle aspettative
    expect(campiCliente.header).toBe("Cliente");
    expect(campiCliente.value).toEqual(["Mario Rossi", "3214567890", "mr@gmail.com"]);
    expect(campiCliente.errore).toEqual([null, "", ""]);
    expect(campiCliente.onChange).toBe(handleOnChange);
  });
});









