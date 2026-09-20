import { AutenticazioneForms } from '../../../../view/forms/AutenticazioneForms.js';

describe('AutenticazioneForms', () => {
  let autenticazioneForms;

  beforeEach(() => {
    autenticazioneForms = new AutenticazioneForms();
  });

  it('Generazione campi login corretti.', () => {
    // Logica del test
    const item = {
      username: 'utente_test',
      password: 'password_test',
      errore_username: null,
      errore_password: 'Errore password'
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiLogin = autenticazioneForms.getCampiLogin(item, handleOnChange, handleOnClick, handleOnBlur);

    // Aspettative
    expect(campiLogin.header).toBe('Login');
    expect(campiLogin.label).toEqual(['Username*', 'Password*']);
    expect(campiLogin.value).toEqual(['utente_test', 'password_test']);
    expect(campiLogin.errore).toEqual([null, 'Errore password']);
    expect(campiLogin.onChange).toBe(handleOnChange);
  });

  it('Generazione campi profilo corretti.', () => {
    const item = {
      nuovo_username: 'nuovoUtente',
      note: 'Note di test',
      password_attuale: 'vecchiaPassword',
      nuova_password: 'nuovaPassword',
      conferma_nuova_password: 'confermaNuovaPassword',
      errore_nuovo_username: null,
      errore_note: null,
      errore_password_attuale: 'Errore vecchia password',
      errore_nuova_password: null,
      errore_conferma_nuova_password: 'Errore conferma password'
    };
    const handleOnChange = jest.fn();
    const handleOnClick = jest.fn();
    const handleOnBlur = jest.fn();

    const campiProfilo = autenticazioneForms.getCampiProfilo(item, handleOnChange, handleOnClick, handleOnBlur);

    expect(campiProfilo.header).toBe('Profilo');
    expect(campiProfilo.label).toEqual([
      'Nuovo username*',
      'Note',
      'Password attuale*',
      'Nuova password',
      'Conferma nuova password'
    ]);
    expect(campiProfilo.value).toEqual([
      'nuovoUtente',
      'Note di test',
      'vecchiaPassword',
      'nuovaPassword',
      'confermaNuovaPassword'
    ]);
    expect(campiProfilo.errore).toEqual([
      null,
      null,
      'Errore vecchia password',
      null,
      'Errore conferma password'
    ]);
    expect(campiProfilo.onChange).toBe(handleOnChange);
  });
});









