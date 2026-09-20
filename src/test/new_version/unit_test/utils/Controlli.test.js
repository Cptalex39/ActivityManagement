import { 
  controlloRegistrazione, controlloLogin, 
  controlloModificaProfiloCliente, controlloModificaProfiloUtente, 
  controlloRicercaOrdini, controlloRicercaSpese, controlloRicercaClienti, controlloRicercaServizi, 
  controlloCarta, controlloServizio, controlloSpesa, controlloOrdine
 } from "../../../../utils/Controlli";

describe('Vari test su "controlloRegistrazione"', () => {
  /** UT_Con_Reg_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      nome: "",
      cognome: "",
      username: "",
      email: "",  
      password: "",
      conferma_password: "", 
      contatto: "",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 6,
      errore_nome: "Errore, il nome non è stato inserito.",
      errore_cognome: "Errore, il cognome non è stato inserito.",
      errore_username: "Errore, lo username non è stato inserito.",
      errore_email: "Errore, l'email non è stata inserita.",  
      errore_password: "Errore, \"Password\" non è stata inserita.",
      errore_contatto: "Errore, il contatto non è stato inserito.",  
    };

    const result = controlloRegistrazione(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Reg_02 **/
  test('nome, cognome, username, email, password, conferma_password, contatto non rispettano la regex', () => {
    let dati = {
      nome: "Mario10",
      cognome: "Rossi10",
      username: "(mr_user)",
      email: "mr#example.it",  
      password: "PassWord10",
      conferma_password: "PassWord10", 
      contatto: "03000", 
    }

    const errore_password = "" 
      + "Password non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const datiExpected = {
      ...dati, 
      num_errori: 6,
      errore_nome: "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_cognome: "Errore, il cognome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_username: "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
      errore_email: "Errore, l'email non è valida.",  
      errore_password: errore_password,
      errore_contatto: "Errore, il contatto non è valido. Deve essere un numero di cellulare oppure un numero di telefono fisso entrambi italiani, senza spazi e senza la desinenza iniziale come per esempio: +39",  
    };

    const result = controlloRegistrazione(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Reg_03 **/
  test('nome, cognome, username, email troppo lunghi', () => {
    let dati = {
      nome: "Marioooooooooooooooooooooooooooooo",
      cognome: "Rossiiiiiiiiiiiiiiiiiiiiiiiiiiii",
      username: "mr_userrrrrr",
      email: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmr@example.it",  
      password: "PassWord10!!",
      conferma_password: "PassWord10!!", 
      contatto: "3434343434",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_nome: "Errore, la lunghezza del nome deve essere inclusa tra 1 e 30 estremi incusi.",
      errore_cognome: "Errore, la lunghezza del cognome deve essere inclusa tra 1 e 30 estremi incusi.",
      errore_username: "Errore, la lunghezza dello username deve essere inclusa tra 1 e 10 estremi incusi.",
      errore_email: "Errore, la lunghezza dell'email deve essere massimo di 254 caratteri.",  
      errore_password: null,
      errore_contatto: null,  
    };

    const result = controlloRegistrazione(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Reg_04 **/
  test('nome, cognome, username, email, contatto validi AND conferma_password non inserita', () => {
    let dati = {
      nome: "Mario",
      cognome: "Rossi",
      username: "mr_user",
      email: "mr@example.it",  
      password: "PassWord10!!",
      conferma_password: "", 
      contatto: "3434343434",  
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_nome: null,
      errore_cognome: null,
      errore_username: null,
      errore_email: null,  
      errore_password: "Errore, \"Conferma Password\" non è stata inserita.",
      errore_contatto: null,  
    };

    const result = controlloRegistrazione(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Reg_05 **/
  test('nome, cognome, username, email, contatto validi AND password != conferma_password', () => {
    let dati = {
      nome: "Mario",
      cognome: "Rossi",
      username: "mr_user",
      email: "mr@example.it",  
      password: "PassWord10!!",
      conferma_password: "PassWord20!!", 
      contatto: "3434343434",  
    };

    const datiExpected = {
      ...dati,  
      num_errori: 1,
      errore_nome: null,
      errore_cognome: null,
      errore_username: null,
      errore_email: null,  
      errore_password: "Errore, \"Password\" e \"Conferma Password\" non sono uguali.",
      errore_contatto: null,  
    };

    const result = controlloRegistrazione(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Reg_06 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      nome: "Mario",
      cognome: "Rossi",
      username: "mr_user",
      email: "mr@example.it",  
      password: "PassWord10!!",
      conferma_password: "PassWord10!!", 
      contatto: "3434343434",  
    };

    const datiExpected = {
      ...dati, 
      num_errori: 0,
      errore_nome: null,
      errore_cognome: null,
      errore_username: null,
      errore_email: null,  
      errore_password: null, 
      errore_contatto: null,  
    };

    const result = controlloRegistrazione(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloLogin"', () => {
  /** UT_Con_Login_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      username: "",
      password: "",  
    };

    const datiExpected = {
      ...dati,      
      num_errori: 2,
      errore_username: "Inserire lo username.",
      errore_password: "Inserire la password.",
      errore_login: null,
    };

    const result = controlloLogin(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Login_02 **/
  test('username, password non rispettano la regex', () => {
    let dati = {
      username: "(mr_user)",
      password: "PassWord10",  
    };

    const errore_password = "" 
      + "Password non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const datiExpected = {
      ...dati,    
      num_errori: 2,
      errore_username: "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
      errore_password: errore_password,
      errore_login: null,
    };

    const result = controlloLogin(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Login_03 **/
  test('username troppo lungo', () => {
    let dati = {
      username: "mr_userrrrrr",
      password: "PassWord10!!",  
    };

    const datiExpected = {
      ...dati,       
      num_errori: 1,
      errore_username: "Errore, utente non valido. Deve essere di lunghezza compresa tra 1 e 10, estremi inclusi.",
      errore_password: null,
      errore_login: null,
    };

    const result = controlloLogin(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Login_04 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      username: "mr_user",
      password: "PassWord10!!",  
    };

    const datiExpected = {
      ...dati,        
      num_errori: 0,
      errore_username: null,
      errore_password: null,
      errore_login: null,
    };

    const result = controlloLogin(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloModificaProfiloCliente"', () => {
  /** UT_Con_ModProCli_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      email: "",
      contatto: "",
      indirizzo: "",
      username: "",
      password_attuale: "", 
      nuova_password: "", 
      conferma_nuova_password: "",
    };

    const datiExpected = {
      ...dati, 
      num_errori: 4,
      errore_email: "Errore, l'email non è stata inserita.",
      errore_contatto: "Errore, il contatto non è stato inserito.",
      errore_indirizzo: null,
      errore_username: "Errore, lo username non è stato inserito.",
      errore_password_attuale: "Errore, \"Password attuale\" non è stata inserita.", 
      errore_nuova_password: null, 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProCli_02 **/
  test('email, contatto, indirizzo, username, password_attuale, nuova_password, conferma_nuova_password non rispettano la regex', () => {
    let dati = {
      email: "mr#example.it",
      contatto: "03000",
      indirizzo: "indirizzo",
      username: "(mr_user)",
      password_attuale: "PassWord10", 
      nuova_password: "PassWord20", 
      conferma_nuova_password: "PassWord20", 
    };

    const errore_password_attuale = "" 
      + "Password attuale non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const errore_nuova_password = "" 
      + "Nuova password non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const datiExpected = {
      ...dati, 
      num_errori: 6,
      errore_email: "Errore, l'email non è valida.",
      errore_contatto: "Errore, il contatto non è valido. Deve essere un numero di cellulare oppure un numero di telefono fisso entrambi italiani, senza spazi e senza la desinenza iniziale come per esempio: +39",
      errore_indirizzo: "Errore, l'indirizzo inserito non è valido. deve essere del seguente tipo: via|viale|piazza|p.zza|corso|c.so|traversa|trav.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio, seguito dal nome della via e infine dal numero civico",
      errore_username: "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
      errore_password_attuale: errore_password_attuale, 
      errore_nuova_password: errore_nuova_password, 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProCli_03 **/
  test('email, username troppo lunghi', () => {
    let dati = {
      email: "mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmr@example.it",
      contatto: "3434343434",
      indirizzo: "Via Roma, 10",
      username: "mr_userrrrrr",
      password_attuale: "PassWord10!!", 
      nuova_password: "PassWord20!!", 
      conferma_nuova_password: "PassWord20!!", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 2,
      errore_email: "Errore, la lunghezza dell'email deve essere massimo di 254 caratteri.",
      errore_contatto: null,
      errore_indirizzo: null,
      errore_username: "Errore, la lunghezza dello username deve essere inclusa tra 1 e 10 estremi incusi.",
      errore_password_attuale: null, 
      errore_nuova_password: null, 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProCli_04 **/
  test('nuova_password inserita e conferma_nuova_password non inserita', () => {
    let dati = {
      email: "mr@example.it",
      contatto: "3434343434",
      indirizzo: "Via Roma, 5",
      username: "mr_user",
      password_attuale: "PassWord10!!", 
      nuova_password: "PassWord20!!",
      conferma_nuova_password: "", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_email: null,
      errore_contatto: null,
      errore_indirizzo: null,
      errore_username: null,
      errore_password_attuale: null, 
      errore_nuova_password: "Errore, inserire sia \"Nuova password\" e \"Conferma nuova password\" se si desidera modificare la password attuale.", 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProCli_05 **/
  test('nuova_password non inserita e conferma_nuova_password inserita', () => {
    let dati = {
      email: "mr@example.it",
      contatto: "3434343434",
      indirizzo: "Via Roma, 5",
      username: "mr_user",
      password_attuale: "PassWord10!!", 
      nuova_password: "",
      conferma_nuova_password: "PassWord20!!", 
    };

    const errore_password = "" 
      + "Password attuale non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_email: null,
      errore_contatto: null,
      errore_indirizzo: null,
      errore_username: null,
      errore_password_attuale: null, 
      errore_nuova_password: "Errore, inserire sia \"Nuova password\" e \"Conferma nuova password\" se si desidera modificare la password attuale.", 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProCli_06 **/
  test('nuova_password != conferma_nuova_password', () => {
    let dati = {
      email: "mr@example.it",
      contatto: "3434343434",
      indirizzo: "Via Roma, 5",
      username: "mr_user",
      password_attuale: "PassWord10!!", 
      nuova_password: "PassWord20!!",
      conferma_nuova_password: "PassWord40!!", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_email: null,
      errore_contatto: null,
      errore_indirizzo: null,
      errore_username: null,
      errore_password_attuale: null, 
      errore_nuova_password: "Errore, \"Nuova password\" e \"Conferma nuova password\" non sono uguali.", 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProCli_07 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      email: "mr@example.it",
      contatto: "3434343434",
      indirizzo: "Via Roma, 5",
      username: "mr_user",
      password_attuale: "PassWord10!!", 
      nuova_password: "PassWord20!!",
      conferma_nuova_password: "PassWord20!!", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_email: null,
      errore_contatto: null,
      errore_indirizzo: null,
      errore_username: null,
      errore_password_attuale: null, 
      errore_nuova_password: null, 
    };

    const result = controlloModificaProfiloCliente(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloModificaProfiloUtente"', () => {
  /** UT_Con_ModProUt_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      nuovo_username: "", 
      password_attuale: "", 
      nuova_password: "",   
      conferma_nuova_password: "",   
      primo_intervallo: "", 
      secondo_intervallo: "", 
      numero_clienti: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 3,
      errore_nuovo_username: "Errore, lo username non è stato inserito.", 
      errore_password_attuale: "Errore, \"Password attuale\" non è stata inserita.", 
      errore_nuova_password: null,   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: null, 
      errore_numero_clienti: "Errore, inserire il numero di clienti.",
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });  

  /** UT_Con_ModProUt_02 **/
  test('nuovo_username, password_attuale, nuova_password, conferma_nuova_password, primo_intervallo, secondo_intervallo non rispettano la regex', () => {
    let dati = {
      nuovo_username: "(mr_user)", 
      password_attuale: "PassWord10", 
      nuova_password: "Password20",
      conferma_nuova_password: "Password20",
      primo_intervallo: "1", 
      secondo_intervallo: "2", 
      numero_clienti: "10",
    };

    const errore_password_attuale = "" 
      + "Password attuale non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const errore_nuova_password = "" 
      + "Nuova password non valida. deve avere:\n"
      + "- minimo 8 e massimo 50 caratteri alfanumerici.\n"
      + "- almeno 1 numero.\n"
      + "- almeno 1 lettera maiuscola.\n"
      + "- almeno 1 lettera minuscola.\n"
      + "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";

    const datiExpected = {
      ...dati,
      num_errori: 5,
      errore_nuovo_username: "Errore, il nuovo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.", 
      errore_password_attuale: errore_password_attuale, 
      errore_nuova_password: errore_nuova_password,   
      errore_primo_intervallo: "Errore, l'intervallo inserito non è valido. Deve rispettate il seguente formato: X-Y dove: 0 <= X <= 9 e 0 <= Y <= 9, X < Y.", 
      errore_secondo_intervallo: "Errore, l'intervallo inserito non è valido. Deve rispettate il seguente formato: X-Y dove: 0 <= X <= 9 e 0 <= Y <= 9, X < Y.", 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });  

  /** UT_Con_ModProUt_03 **/
  test('nuovo_username troppo lungo AND numero_clienti < 1', () => {
    let dati = {
      nuovo_username: "mr_userrrrrr", 
      password_attuale: "PassWord10!!", 
      nuova_password: "PassWord20!!",
      conferma_nuova_password: "PassWord20!!",   
      primo_intervallo: "8-12", 
      secondo_intervallo: "14-22", 
      numero_clienti: "0",
    };

    const datiExpected = {
      ...dati,
      num_errori: 2,
      errore_nuovo_username: "Errore, la lunghezza dello username deve essere inclusa tra 1 e 10 estremi incusi.", 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: null, 
      errore_numero_clienti: "Errore, inserire un numero maggiore di 0.",
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_04 **/
  test('nuova_password inserita AND conferma_nuova_password non inserita', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "",    
      primo_intervallo: "8-12", 
      secondo_intervallo: "14-22", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: "Errore, inserire sia \"Nuova password\" e \"Conferma nuova password\" se si desidera modificare la password attuale.",   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: null, 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_05 **/
  test('nuova_password non inserita AND conferma_nuova_password inserita', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "8-12", 
      secondo_intervallo: "14-22", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: "Errore, inserire sia \"Nuova password\" e \"Conferma nuova password\" se si desidera modificare la password attuale.",   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: null, 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_06 **/
  test('nuova_password != conferma_nuova_password', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password40!!",    
      primo_intervallo: "8-12", 
      secondo_intervallo: "14-22", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: "Errore, \"Nuova password\" e \"Conferma nuova password\" non sono uguali.",   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: null, 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_07 **/
  test('primo_intervallo, secondo_intervallo non hanno il valore minimo valido', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "24-25", 
      secondo_intervallo: "26-27", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 2,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: "Errore, il valore minimo deve essere compreso tra 0 e 23 estremi inclusi.", 
      errore_secondo_intervallo: "Errore, il valore minimo deve essere compreso tra 0 e 23 estremi inclusi.", 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_08 **/
  test('primo_intervallo, secondo_intervallo non hanno il valore massimo valido', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "18-24", 
      secondo_intervallo: "14-24", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 2,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: "Errore, il valore massimo deve essere compreso tra 0 e 23 estremi inclusi.", 
      errore_secondo_intervallo: "Errore, il valore massimo deve essere compreso tra 0 e 23 estremi inclusi.", 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_09 **/
  test('primo_intervallo, secondo_intervallo hanno il massimo < minimo', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "12-8", 
      secondo_intervallo: "20-14", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 2,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: "Errore, il valore massimo deve essere maggiore del valore minimo.", 
      errore_secondo_intervallo: "Errore, il valore massimo deve essere maggiore del valore minimo.", 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_10 **/
  test('primo_intervallo, secondo_intervallo non sono consecutivi', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "9-16", 
      secondo_intervallo: "14-22", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: "Errore, i 2 intervalli inseriti non sono consecutivi.", 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });
  
  /** UT_Con_ModProUt_11 **/
  test('secondo_intervallo viene prima del primo_intervallo', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "14-22", 
      secondo_intervallo: "8-12", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: "Errore, il secondo intervallo deve avvenire dopo il primo intervallo.", 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_ModProUt_12 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      nuovo_username: "mr_user", 
      password_attuale: "PassWord10!!", 
      nuova_password: "Password20!!",
      conferma_nuova_password: "Password20!!",    
      primo_intervallo: "8-12", 
      secondo_intervallo: "14-22", 
      numero_clienti: "10",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nuovo_username: null, 
      errore_password_attuale: null, 
      errore_nuova_password: null,   
      errore_primo_intervallo: null, 
      errore_secondo_intervallo: null, 
      errore_numero_clienti: null,
    };

    const result = controlloModificaProfiloUtente(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloCarta"', () => {
  /** UT_Con_Crt_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      anno_scadenza: "",
      mese_scadenza: "",
      is_visa: false, 
      is_mastercard: false, 
      circuito: "", 
      numero: "", 
      cvv_cvs: "", 
      nome_titolare: "", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 4, 
      errore_data_scadenza: "Inserire la data di scadenza.", 
      errore_circuito: "Errore, selezionare un pulsante tra Visa e Mastercard.", 
      errore_numero: null, 
      errore_cvv_cvs: "Inserire un numero di 3 cifre.", 
      errore_nome_titolare: "Inserire il nome del titolare."
    };

    const result = controlloCarta(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Crt_02 **/
  test('Circuito visa selezionato AND numero non rispetta la regex AND cvv_cvs non e\' valido AND nome_titolare non rispetta la regex', () => {
    let dati = {
      anno_scadenza: 2026,
      mese_scadenza: 10, 
      is_visa: true, 
      is_mastercard: false,
      circuito: "", 
      numero: "2222", 
      cvv_cvs: "44", 
      nome_titolare: "Max_883", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 3,
      errore_data_scadenza: null,
      errore_circuito: null, 
      errore_numero: "Errore, il numero della carta inserita non è valido. Controllare meglio.", 
      errore_cvv_cvs: "Errore, il numero inserito non è valido, deve essere di 3 cifre.", 
      errore_nome_titolare: "Errore, il nome del titolare deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti."
    };

    const result = controlloCarta(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Crt_03 **/
  test('anno_scadenza non e\' valido AND circuito mastercard selezionato AND numero non rispetta la regex AND cvv_cvs non e\' valido AND nome_titolare non rispetta la regex', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 4)); 

    let dati = {
      anno_scadenza: 2002,
      mese_scadenza: 10, 
      is_visa: false, 
      is_mastercard: true,
      circuito: "", 
      numero: "2222", 
      cvv_cvs: "44", 
      nome_titolare: "Max_883", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_data_scadenza: "Inserire una data di scadenza valida.",
      errore_circuito: null, 
      errore_numero: "Errore, il numero della carta inserita non è valido. Controllare meglio.", 
      errore_cvv_cvs: "Errore, il numero inserito non è valido, deve essere di 3 cifre.", 
      errore_nome_titolare: "Errore, il nome del titolare deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti."
    };

    const result = controlloCarta(dati);

    expect(result).toEqual(datiExpected);

    jest.useRealTimers();
  });

  /** UT_Con_Crt_04 **/
  test('mese_scadenza non e\' valido AND circuito mastercard selezionato AND numero non rispetta la regex AND cvv_cvs non e\' valido AND nome_titolare non rispetta la regex', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 4)); 

    let dati = {
      anno_scadenza: 2030,
      mese_scadenza: 14, 
      is_visa: false, 
      is_mastercard: true,
      circuito: "", 
      numero: "2222", 
      cvv_cvs: "44", 
      nome_titolare: "Max_883", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_data_scadenza: "Inserire una data di scadenza valida.",
      errore_circuito: null, 
      errore_numero: "Errore, il numero della carta inserita non è valido. Controllare meglio.", 
      errore_cvv_cvs: "Errore, il numero inserito non è valido, deve essere di 3 cifre.", 
      errore_nome_titolare: "Errore, il nome del titolare deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti."
    };

    const result = controlloCarta(dati);

    expect(result).toEqual(datiExpected);

    jest.useRealTimers();
  });

  /** UT_Con_Crt_05 **/
  test('Carta scaduta AND circuito visa selezionato AND nome_titolare troppo lungo', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 4)); 

    let dati = {
      anno_scadenza: 2026,
      mese_scadenza: 7, 
      is_visa: true, 
      is_mastercard: false,
      circuito: "", 
      numero: "4123456789012680", 
      cvv_cvs: "248", 
      nome_titolare: "Massimo Verdiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", 
    };

    const datiExpected = {
      ...dati, 
      num_errori: 2,
      errore_data_scadenza: "Errore, la carta è scaduta. Inserire una carta non scaduta.",
      errore_circuito: null, 
      errore_numero: null, 
      errore_cvv_cvs: null, 
      errore_nome_titolare: "Errore, nome non valido. Deve essere di lunghezza compresa tra 1 e 60, estremi inclusi.",
    };

    const result = controlloCarta(dati);

    expect(result).toEqual(datiExpected);

    jest.useRealTimers();
  });

  /** UT_Con_Crt_06 **/
  test('Circuito mastercard selezionato AND tutti i dati sono validi', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 8, 4)); 

    let dati = {
      anno_scadenza: 2026,
      mese_scadenza: 10, 
      is_visa: false, 
      is_mastercard: true,
      circuito: "", 
      numero: "5123456789012680", 
      cvv_cvs: "248", 
      nome_titolare: "Massimo Verdi", 
    };

    const datiExpected = {
      ...dati, 
      num_errori: 0,
      errore_data_scadenza: null,
      errore_circuito: null, 
      errore_numero: null, 
      errore_cvv_cvs: null, 
      errore_nome_titolare: null,
    };

    const result = controlloCarta(dati);

    expect(result).toEqual(datiExpected);

    jest.useRealTimers();
  });
});

describe('Vari test su "controlloRicercaOrdini"', () => {
  /** UT_Con_RicOrd_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      metodo_pagamento: "",
      data_creazione_min: "",
      data_creazione_max: "",
      data_prenotazione_min: "",
      data_prenotazione_max: "",
      nome_cliente: "",
      cognome_cliente: "",
      email_cliente: "",
      contatto_cliente: "",
      username_cliente: "", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 1,
      errore_tipo: "Errore, selezionare un'opzione offerta dal tipo.",
      errore_data_creazione: null,
      errore_data_prenotazione: null,
      errore_nome_cliente: null,
      errore_cognome_cliente: null,
      errore_email_cliente: null,
      errore_contatto_cliente: null,
      errore_username_cliente: null,
    };

    const result = controlloRicercaOrdini(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicOrd_02 **/
  test('tipo non valido AND data_creazione_min, data_prenotazione_min inserite', () => {
    let dati = {
      metodo_pagamento: "METODO_PAGAMENTO",
      data_creazione_min: "2022-04-02",
      data_creazione_max: "",
      data_prenotazione_min: "2022-08-06",
      data_prenotazione_max: "",
      nome_cliente: "",
      cognome_cliente: "",
      email_cliente: "",
      contatto_cliente: "",
      username_cliente: "", 
    };

    const datiExpected = {
      ...dati, 
      num_errori: 1,
      errore_tipo: "Errore, selezionare un'opzione offerta dal tipo.",
      errore_data_creazione: null,
      errore_data_prenotazione: null,
      errore_nome_cliente: null,
      errore_cognome_cliente: null,
      errore_email_cliente: null,
      errore_contatto_cliente: null,
      errore_username_cliente: null,
    };

    const result = controlloRicercaOrdini(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicOrd_03 **/
  test('tipo valido AND data_creazione_max, data_prenotazione_max inserite', () => {
    let dati = {
      metodo_pagamento: "Corriere",
      data_creazione_min: "",
      data_creazione_max: "2022-08-06",
      data_prenotazione_min: "",
      data_prenotazione_max: "2022-12-10",
      nome_cliente: "",
      cognome_cliente: "",
      email_cliente: "",
      contatto_cliente: "",
      username_cliente: "", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_tipo: null,
      errore_data_creazione: null,
      errore_data_prenotazione: null,
      errore_nome_cliente: null,
      errore_cognome_cliente: null,
      errore_email_cliente: null,
      errore_contatto_cliente: null,
      errore_username_cliente: null,
    };

    const result = controlloRicercaOrdini(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicOrd_04 **/
  test('data_creazione_max < data_creazione_min AND data_prenotazione_max < data_prenotazione_min AND nome_cliente, cognome_cliente, email_cliente, contatto_cliente, username_cliente non rispettano la regex', () => {
    let dati = {
      metodo_pagamento: "Tutte",
      data_creazione_min: "2022-08-06",
      data_creazione_max: "2022-04-02",
      data_prenotazione_min: "2022-12-10",
      data_prenotazione_max: "2022-08-06",
      nome_cliente: "Mario10",
      cognome_cliente: "Rossi10",
      email_cliente: "mr#example.it",
      contatto_cliente: "CONTATTO",
      username_cliente: "(m.rossi)", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 7,
      errore_tipo: null,
      errore_data_creazione: "Errore, la data di creazione massima è minore della data di creazione minima.",
      errore_data_prenotazione: "Errore, la data di prenotazione massima è minore della data di prenotazione minima.",
      errore_nome_cliente: "Errore, il nome del cliente deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_cognome_cliente: "Errore, il cognome del cliente deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_email_cliente: "Errore, l'email deve contenere lettere, .@-.",
      errore_contatto_cliente: "Errore, il contatto non è valido. Inserire solamente numeri senza altri tipi di caratteri come il -.",
      errore_username_cliente: "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?",
    };

    const result = controlloRicercaOrdini(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicOrd_05 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      metodo_pagamento: "Tutte",
      data_creazione_min: "2022-04-02",
      data_creazione_max: "2022-08-06",
      data_prenotazione_min: "2022-08-06",
      data_prenotazione_max: "2022-12-10",
      nome_cliente: "Mario",
      cognome_cliente: "Rossi",
      email_cliente: "mr@example.it",
      contatto_cliente: "34",
      username_cliente: "m.rossi", 
    };

    const datiExpected = {
      ...dati, 
      num_errori: 0,
      errore_tipo: null,
      errore_data_creazione: null,
      errore_data_prenotazione: null,
      errore_nome_cliente: null,
      errore_cognome_cliente: null,
      errore_email_cliente: null,
      errore_contatto_cliente: null, 
      errore_username_cliente: null,
    };

    const result = controlloRicercaOrdini(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloRicercaSpese"', () => {
  /** UT_Con_RicSpe_01 **/
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

  /** UT_Con_RicSpe_02 **/
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

  /** UT_Con_RicSpe_03 **/
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

  /** UT_Con_RicSpe_04 **/
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

  /** UT_Con_RicSpe_05 **/
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
  /** UT_Con_RicCli_01 **/
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

  /** UT_Con_RicCli_02 **/
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

  /** UT_Con_RicCli_03 **/
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

describe('Vari test su "controlloRicercaServizi"', () => {
  /** UT_Con_RicSer_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      nome: "",
      tipo: "",
      prezzo_min: "",
      prezzo_max: "",
      in_uso: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_tipo: null,
      errore_prezzi: null,
      errore_in_uso: null, 
    };

    const result = controlloRicercaServizi(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicSer_02 **/
  test('prezzo_min inserito', () => {
    let dati = {
      nome: "",
      tipo: "",
      prezzo_min: 5.12,
      prezzo_max: "",
      in_uso: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_tipo: null,
      errore_prezzi: null,
      errore_in_uso: null, 
    };

    const result = controlloRicercaServizi(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicSer_03 **/
  test('prezzo_max inserito', () => {
    let dati = {
      nome: "",
      tipo: "",
      prezzo_min: "",
      prezzo_max: 10.34,
      in_uso: "",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_tipo: null,
      errore_prezzi: null,
      errore_in_uso: null, 
    };

    const result = controlloRicercaServizi(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicSer_04 **/
  test('prezzo_max < prezzo_min AND nome, tipo, in_uso non rispettano la regex', () => {
    let dati = {
      nome: "Ricarica telefonica 10",
      tipo: "Sèrvìziò",
      prezzo_min: 10.34,
      prezzo_max: 5.12,
      in_uso: "Sì",
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_nome: "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_tipo: "Errore, il tipo deve contenere solamente lettere senza accenti.",
      errore_prezzi: "Errore, il prezzo massimo è più piccolo del prezzo minimo.",
      errore_in_uso: "Errore, \"In uso\" deve contenere solamente lettere senza accenti.", 
    };

    const result = controlloRicercaServizi(dati);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_RicSer_05 **/
  test('Tutti i dati sono validi', () => {
    let dati = {
      nome: "Ricarica telefonica",
      tipo: "Servizio",
      prezzo_min: 5.12,
      prezzo_max: 10.34,
      in_uso: "Si",
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_tipo: null,
      errore_prezzi: null,
      errore_in_uso: null, 
    };

    const result = controlloRicercaServizi(dati);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloServizio"', () => {
  /** UT_Con_Ser_01 **/
  test('Dati non inseriti AND nuovo servizio', () => {
    let dati = {
      nome: "",
      tipo: "",
      prezzo: "",
      descrizione: "",
      note: "", 
      in_uso: "", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 4,
      errore_nome: "Inserire il nome.",
      errore_tipo: "Errore, il tipo deve essere uguale a \"Prodotto\" o \"Servizio\".",
      errore_prezzo: "Errore, inserire il prezzo.",
      errore_descrizione: "Inserire la descrizione.",
      errore_note: null, 
      errore_in_uso: null,  
    };

    const result = controlloServizio(dati, true);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Ser_02 **/
  test('nome, descrizione, note non rispettano la regex AND prezzo <= 0 AND tipo, in_uso non validi', () => {
    let dati = {
      nome: "Ricarica telefonica 10",
      tipo: "TIPO",
      prezzo: "0",
      descrizione: "(Descrizione servizio)",
      note: "(Note servizio)", 
      in_uso: "Ni", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 6,
      errore_nome: "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.",
      errore_tipo: "Errore, il tipo deve essere uguale a \"Prodotto\" o \"Servizio\".",
      errore_prezzo: "Errore, il prezzo inserito non è maggiore di 0.",
      errore_descrizione: "Errore, la descrizione deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.",
      errore_note: "Errore, le note devono contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.", 
      errore_in_uso: "Errore, valore \"in uso\" non valido. Deve essere uguale a \"Si\" oppure a \"No\".",  
    };

    const result = controlloServizio(dati, false);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Ser_03 **/
  test('nome, descrizione, note troppo lunghi', () => {
    let dati = {
      nome: "Ricarica telefonicaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      tipo: "Servizio",
      prezzo: "10.12",
      descrizione: "Descrizione serviziooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo",
      note: "Note servizioooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo", 
      in_uso: "Si", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 3,
      errore_nome: "Errore, nome non valido. Deve essere di lunghezza compresa tra 1 e 100, estremi inclusi.",
      errore_tipo: null,
      errore_prezzo: null,
      errore_descrizione: "Errore, descrizione non valida. Deve essere di lunghezza compresa tra 1 e 1000, estremi inclusi.",
      errore_note: "Errore, note non valide. Deve essere di lunghezza compresa tra 1 e 200, estremi inclusi.", 
      errore_in_uso: null,  
    };

    const result = controlloServizio(dati, false);

    expect(result).toEqual(datiExpected);
  });

  /** UT_Con_Ser_04 **/
  test('Tutti i dati sono corretti', () => {
    let dati = {
      nome: "Ricarica telefonica",
      tipo: "Servizio",
      prezzo: "10.12",
      descrizione: "Descrizione servizio",
      note: "Note servizio", 
      in_uso: "Si", 
    };

    const datiExpected = {
      ...dati,
      num_errori: 0,
      errore_nome: null,
      errore_tipo: null,
      errore_prezzo: null,
      errore_descrizione: null,
      errore_note: null, 
      errore_in_uso: null,  
    };

    const result = controlloServizio(dati, false);

    expect(result).toEqual(datiExpected);
  });
});

describe('Vari test su "controlloSpesa"', () => {
  /** UT_Con_Spe_01 **/
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

  /** UT_Con_Spe_02 **/
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

  /** UT_Con_Spe_03 **/
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

  /** UT_Con_Spe_04 **/
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

describe('Vari test su "controlloOrdine"', () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_Con_Ord_01 **/
  test('Dati non inseriti', () => {
    let dati = {
      metodo_pagamento: "",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Seleziona un metodo di pagamento!");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_02 **/
  test('metodo_pagamento != "Struttura" AND metodo_pagamento != "Spedizione" AND metodo_pagamento != "Corriere"', () => {
    let dati = {
      metodo_pagamento: "METODO_PAGAMENTO",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Seleziona un metodo di pagamento valido!");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_03 **/
  test('metodo_pagamento = "Struttura" AND data_prenotazione non inserita', () => {
    let dati = {
      metodo_pagamento: "Struttura",
      data_prenotazione: "",
      ora_prenotazione: "10:00", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Seleziona data e orario per la prenotazione.");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_04 **/
  test('metodo_pagamento = "Struttura" AND ora_prenotazione non inserita', () => {
    let dati = {
      metodo_pagamento: "Struttura",
      data_prenotazione: "2026-12-10",
      ora_prenotazione: "", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Seleziona data e orario per la prenotazione.");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_05 **/
  test('metodo_pagamento = "Struttura" AND data_prenotazione <= data attuale', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 8));

    let dati = {
      metodo_pagamento: "Struttura",
      data_prenotazione: "2022-12-10",
      ora_prenotazione: "10:00", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Inserire un giorno successivo a quello attuale.");
    expect(result).toBe(false);

    jest.useRealTimers();
  });

  /** UT_Con_Ord_06 **/
  test('metodo_pagamento = "Struttura" AND dati inseriti validi', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2026, 10, 8));

    let dati = {
      metodo_pagamento: "Struttura",
      data_prenotazione: "2026-12-10",
      ora_prenotazione: "10:00", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(result).toBe(true);

    jest.useRealTimers();
  });

  /** UT_Con_Ord_07 **/
  test('metodo_pagamento = "Spedizione" AND indirizzo non inserito', () => {
    let dati = {
      metodo_pagamento: "Spedizione",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Inserire l'indirizzo per la consegna.");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_08 **/
  test('metodo_pagamento = "Spedizione" AND indirizzo non rispetta la regex', () => {
    let dati = {
      metodo_pagamento: "Spedizione",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "INDIRIZZO", 
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Errore, l'indirizzo inserito non è valido. deve essere del seguente tipo: via|viale|piazza|p.zza|corso|c.so|traversa|trav.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio, seguito dal nome della via e infine dal numero civico");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_09 **/
  test('metodo_pagamento = "Spedizione" AND indirizzo valido AND numero_carta non inserita', () => {
    let dati = {
      metodo_pagamento: "Spedizione",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "Via Roma, 10",
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Seleziona una carta.");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_10 **/
  test('metodo_pagamento = "Spedizione" AND dati inseriti validi', () => {
    let dati = {
      metodo_pagamento: "Spedizione",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "Via Roma, 10",
      numero_carta: "41234567890123456789012",  
    };

    const result = controlloOrdine(dati);

    expect(result).toBe(true);
  });

  /** UT_Con_Ord_11 **/
  test('metodo_pagamento = "Corriere" AND indirizzo non inserito', () => {
    let dati = {
      metodo_pagamento: "Corriere",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "",
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Inserire l'indirizzo per la consegna.");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_12 **/
  test('metodo_pagamento = "Corriere" AND indirizzo non rispetta la regex', () => {
    let dati = {
      metodo_pagamento: "Corriere",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "INDIRIZZO",
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(window.alert).toHaveBeenCalledWith("Errore, l'indirizzo inserito non è valido. deve essere del seguente tipo: via|viale|piazza|p.zza|corso|c.so|traversa|trav.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio, seguito dal nome della via e infine dal numero civico");
    expect(result).toBe(false);
  });

  /** UT_Con_Ord_13 **/
  test('metodo_pagamento = "Corriere" AND dati inseriti validi', () => {
    let dati = {
      metodo_pagamento: "Corriere",
      data_prenotazione: "",
      ora_prenotazione: "", 
      indirizzo: "Via Roma, 10",
      numero_carta: "",  
    };

    const result = controlloOrdine(dati);

    expect(result).toBe(true);
  });
});






