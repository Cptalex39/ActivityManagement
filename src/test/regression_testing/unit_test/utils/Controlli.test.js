import { controlloRicercaSpese, controlloRicercaClienti, controlloSpesa } from "../../../../utils/Controlli";

describe('Vari test su "controlloRicercaSpese"', () => {
  /** RT_UT_Con_RicSpe_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      nome: "",
      descrizione: "",
      totale_min: "",
      totale_max: "",
      primo_giorno: "",
      ultimo_giorno: "",
      note: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_descrizione: null,
      errore_totali: null,
      errore_giorni: null,
      errore_note: null,
    };

    const result = controlloRicercaSpese(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_RicSpe_02 **/
  test('totale_min, primo_giorno sono stati inseriti', () => {
    let dati = {
      nome: "",
      descrizione: "",
      totale_min: 5,
      totale_max: "",
      primo_giorno: "2022-04-02",
      ultimo_giorno: "",
      note: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_descrizione: null,
      errore_totali: null,
      errore_giorni: null,
      errore_note: null,
    };

    const result = controlloRicercaSpese(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_RicSpe_03 **/
  test('totale_max, ultimo_giorno sono stati inseriti', () => {
    let dati = {
      nome: "",
      descrizione: "",
      totale_min: "",
      totale_max: 10,
      primo_giorno: "",
      ultimo_giorno: "2022-08-06",
      note: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_descrizione: null,
      errore_totali: null,
      errore_giorni: null,
      errore_note: null,
    };

    const result = controlloRicercaSpese(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_RicSpe_04 **/
  test('totale_max < totale_min AND ultimo_giorno < primo_giorno AND nome, descrizione, note non rispettano la regex', () => {
    let dati = {
      nome: "Luce 10",
      descrizione: "(Descrizione della spesa)",
      totale_min: 10,
      totale_max: 5,
      primo_giorno: "2022-08-06",
      ultimo_giorno: "2022-04-02",
      note: "(Note sulla spesa)",
    };

    const datiExpected = {
      ...dati,
      num_errori: 5,
      errore_nome: "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_descrizione: "Errore, la descrizione deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
      errore_totali: "Errore, il totale massimo è più piccolo del totale minimo.",
      errore_giorni: "Errore, l'ultimo giorno è minore del primo giorno.",
      errore_note: "Errore, le note devono contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
    };

    const result = controlloRicercaSpese(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_RicSpe_05 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      nome: "Luce",
      descrizione: "Descrizione della spesa",
      totale_min: 5,
      totale_max: 10,
      primo_giorno: "2022-04-02",
      ultimo_giorno: "2022-08-06",
      note: "Note sulla spesa",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_descrizione: null,
      errore_totali: null,
      errore_giorni: null,
      errore_note: null,
    };

    const result = controlloRicercaSpese(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloRicercaClienti"', () => {
  /** RT_UT_Con_RicCli_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      nome: "",
      cognome: "",
      contatto: "",
      email: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_cognome: null,
      errore_contatto: null,
      errore_email: null
    };

    const result = controlloRicercaClienti(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_RicCli_02 **/
  test('nome, cognome, contatto, email non rispettano la regex', () => {
    let dati = {
      nome: "Mario10",
      cognome: "Rossi10",
      contatto: "CONTATTO",
      email: "mr#example.it",
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_nome: "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_cognome: "Errore, il cognome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_contatto: "Errore, il contatto non è valido. Inserire solamente numeri senza altri tipi di caratteri come il -.",
      errore_email: "Errore, l'email deve contenere lettere, .@-."
    };

    const result = controlloRicercaClienti(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_RicCli_03 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      nome: "Mario",
      cognome: "Rossi",
      contatto: "34",
      email: "mr@example.it",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_cognome: null,
      errore_contatto: null,
      errore_email: null,
    };

    const result = controlloRicercaClienti(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloSpesa"', () => {
  /** RT_UT_Con_Spe_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      nome: "",
      descrizione: "",
      totale: "",
      giorno: "",
      note: "",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 3,
      errore_nome: "Inserire il nome.",
      errore_descrizione: null,
      errore_totale: "Errore, inserire il totale.",
      errore_giorno: "Errore, inserire il giorno.",
      errore_note: null 
    };

    const result = controlloSpesa(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_Spe_02 **/
  test('nome, descrizione, note non rispettano la regex AND totale <= 0', () => {
    let dati = {
      nome: "Luce 10",
      descrizione: "(Descrizione spesa)",
      totale: "0",
      giorno: "2022-10-08",
      note: "(Note spesa)",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_nome: "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_descrizione: "Errore, la descrizione deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
      errore_totale: "Errore, il totale inserito non è maggiore di 0.",
      errore_giorno: null,
      errore_note: "Errore, le note devono contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
    };

    const result = controlloSpesa(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_Spe_03 **/
  test('nome, descrizione, note troppo lunghi', () => {
    let dati = {
      nome: "Luceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      descrizione: "Descrizione spesaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      totale: "10.12",
      giorno: "2022-10-08",
      note: "Note spesaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 3,
      errore_nome: "Errore, nome non valido. Deve essere di lunghezza compresa tra 1 e 50, estremi inclusi.",
      errore_descrizione: "Errore, descrizione non valida. Deve essere di lunghezza compresa tra 1 e 1000, estremi inclusi.",
      errore_totale: null,
      errore_giorno: null,
      errore_note: "Errore, note non valide. Deve essere di lunghezza compresa tra 1 e 200, estremi inclusi.",
    };

    const result = controlloSpesa(dati);

    expect(result).toEqual(datiExpected);
  });

  /** RT_UT_Con_Spe_04 **/
  test('Tutti i dati sono corretti', () => {
    let dati = {
      nome: "Luce",
      descrizione: "Descrizione spesa",
      totale: "10.12",
      giorno: "2022-10-08",
      note: "Note spesa",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_descrizione: null,
      errore_totale: null,
      errore_giorno: null,
      errore_note: null,
    };

    const result = controlloSpesa(dati);

    expect(result).toEqual(datiExpected);
  });
});









