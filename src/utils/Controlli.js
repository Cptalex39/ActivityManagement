// Utils
import { passwordIsCorrect } from "./Sicurezza";

// Varie espressioni regolari
const REGEX_NOME_COGNOME = /^[\p{L}\s'\-.]+$/u;
const REGEX_PASSWORD = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,50}$/;
const REGEX_VISA = /^4[0-9]{12}(?:[0-9]{3})?$/;
const REGEX_MASTERCARD = /^(?:5[1-5][0-9]{14}|2(?:22[1-9]|2[3-9][0-9]|[3-6][0-9]{2}|7[0-9]|720)[0-9]{12})$/;
const REGEX_RICERCA_EMAIL = /^[a-z\d._@-]+$/i;
const REGEX_RICERCA_CONTATTO = /^[0-9]+$/;
const REGEX_STRINGA_NORMALE = /^[a-zA-Z]+$/;
const REGEX_INDIRIZZO = /^(via|viale|piazza|p\.zza|corso|c\.so|traversa|trav\.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio)\s+[A-Za-zÀ-ÿ0-9'\-\.\s]+(?:\s*,\s*|\s+)?\d{1,5}[A-Za-z0-9/\-bis]*$/i;
const REGEX_DESCRIZIONE_E_NOTE = /^[\p{L}\d\s'\-_|.@!?#,.;:]+$/u;
const REGEX_CELLULARE = /^3\d{9}$/;
const REGEX_FISSO = /^0\d{8,10}$/;
const REGEX_EMAIL = /^([a-z\d\._-]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
const REGEX_INTERVALLO = /^\d{1,2}-\d{1,2}$/;

const matchRegex = (value, regexStr) => {
  const regex = new RegExp(regexStr);
  return regex.test(value);
};

export const controlloRegistrazione = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nome: null,
    errore_cognome: null,
    errore_username: null,
    errore_email: null,  
    errore_password: null,
    errore_contatto: null,  
  };

  /** controllo nome **/
  // non è stato inserito
  if(!nuoviDati.nome) {
    nuoviDati.errore_nome = "Errore, il nome non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.nome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome = "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza non valida
      if(nuoviDati.nome.length > 30) {
        nuoviDati.errore_nome = "Errore, la lunghezza del nome deve essere inclusa tra 1 e 30 estremi incusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo cognome **/
  // non è stato inserito
  if(!nuoviDati.cognome) {
    nuoviDati.errore_cognome = "Errore, il cognome non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.cognome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_cognome = "Errore, il cognome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza non valida
      if(nuoviDati.cognome.length > 30) {
        nuoviDati.errore_cognome = "Errore, la lunghezza del cognome deve essere inclusa tra 1 e 30 estremi incusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo username **/
  // non è stato inserito
  if(!nuoviDati.username) {
    nuoviDati.errore_username = "Errore, lo username non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.username, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_username = "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza non valida
      if(nuoviDati.username.length > 10) {
        nuoviDati.errore_username = "Errore, la lunghezza dello username deve essere inclusa tra 1 e 10 estremi incusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** controllo email **/
  // non è stata inserita
  if(!nuoviDati.email) {
    nuoviDati.errore_email = "Errore, l'email non è stata inserita.";
    nuoviDati.num_errori += 1;
  }
  // è stata inserita
  else {
    // Non rispetta le REGEX
    if(!matchRegex(nuoviDati.email, REGEX_EMAIL)) {
      nuoviDati.errore_email = "Errore, l'email non è valida.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza email non valida
      if(nuoviDati.email.length > 254) {
        nuoviDati.errore_email = "Errore, la lunghezza dell'email deve essere massimo di 254 caratteri.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo le 2 password **/
  // "Password" non inserita
  if(!nuoviDati.password) {
    nuoviDati.errore_password = "Errore, \"Password\" non è stata inserita.";
    nuoviDati.num_errori += 1;
  }
  else {
    // "Conferma password" non inserita
    if(!nuoviDati.conferma_password) {
      nuoviDati.errore_password = "Errore, \"Conferma Password\" non è stata inserita.";
      nuoviDati.num_errori += 1;
    }
    else {
      // "Password" e "Conferma Password" non sono uguali
      if(nuoviDati.password !== nuoviDati.conferma_password) {
        nuoviDati.errore_password = "Errore, \"Password\" e \"Conferma Password\" non sono uguali.";
        nuoviDati.num_errori += 1;
      }
      else {
        // non rispettano la REGEX
        if(!matchRegex(nuoviDati.password, REGEX_PASSWORD)) {
          nuoviDati.errore_password =  "Password non valida. deve avere:\n";
          nuoviDati.errore_password += "- minimo 8 e massimo 50 caratteri alfanumerici.\n";
          nuoviDati.errore_password += "- almeno 1 numero.\n";
          nuoviDati.errore_password += "- almeno 1 lettera maiuscola.\n";
          nuoviDati.errore_password += "- almeno 1 lettera minuscola.\n";
          nuoviDati.errore_password += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";
          nuoviDati.num_errori += 1;
        }
      }
    }
  }

  /** controllo contatto **/
  // non è stato inserito
  if(!nuoviDati.contatto) {
    nuoviDati.errore_contatto = "Errore, il contatto non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta le REGEX
    if(!matchRegex(nuoviDati.contatto, REGEX_CELLULARE) && !matchRegex(nuoviDati.contatto, REGEX_FISSO)) {
      nuoviDati.errore_contatto = "Errore, il contatto non è valido. Deve essere un numero di cellulare oppure un numero di telefono fisso entrambi italiani, senza spazi e senza la desinenza iniziale come per esempio: +39";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}


export const controlloLogin = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_username: null,
    errore_password: null,
    errore_login: null,
  };

  /** controllo username **/
  // non è stato inserito
  if(!nuoviDati.username) {
    nuoviDati.errore_username = "Inserire lo username.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.username, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_username = "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza non valida
      if(nuoviDati.username.length > 10) {
        nuoviDati.errore_username = "Errore, utente non valido. Deve essere di lunghezza compresa tra 1 e 10, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** controllo password **/
  // non è stata inserita
  if(!nuoviDati.password) {
    nuoviDati.errore_password = "Inserire la password.";
    nuoviDati.num_errori += 1;
  }
  // è stata inserita
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.password, REGEX_PASSWORD)) {
      nuoviDati.errore_password =  "Password non valida. deve avere:\n";
      nuoviDati.errore_password += "- minimo 8 e massimo 50 caratteri alfanumerici.\n";
      nuoviDati.errore_password += "- almeno 1 numero.\n";
      nuoviDati.errore_password += "- almeno 1 lettera maiuscola.\n";
      nuoviDati.errore_password += "- almeno 1 lettera minuscola.\n";
      nuoviDati.errore_password += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}

export const controlloModificaProfiloCliente = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_email: null,
    errore_contatto: null,
    errore_indirizzo: null,
    errore_username: null,
    errore_password_attuale: null, 
    errore_nuova_password: null, 
  };

  /** controllo email **/
  // non è stata inserita
  if(!nuoviDati.email) {
    nuoviDati.errore_email = "Errore, l'email non è stata inserita.";
    nuoviDati.num_errori += 1;
  }
  // è stata inserita
  else {
    // Non rispetta le REGEX
    if(!matchRegex(nuoviDati.email, REGEX_EMAIL)) {
      nuoviDati.errore_email = "Errore, l'email non è valida.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza email non valida
      if(nuoviDati.email.length > 254) {
        nuoviDati.errore_email = "Errore, la lunghezza dell'email deve essere massimo di 254 caratteri.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** controllo contatto **/
  // non è stato inserito
  if(!nuoviDati.contatto) {
    nuoviDati.errore_contatto = "Errore, il contatto non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta le REGEX
    if(!matchRegex(nuoviDati.contatto, REGEX_CELLULARE) && !matchRegex(nuoviDati.contatto, REGEX_FISSO)) {
      nuoviDati.errore_contatto = "Errore, il contatto non è valido. Deve essere un numero di cellulare oppure un numero di telefono fisso entrambi italiani, senza spazi e senza la desinenza iniziale come per esempio: +39";
      nuoviDati.num_errori += 1;
    }
  }

  /** Controllo indirizzo **/
  // è stato inserito
  if(dati.indirizzo) {
    // indirizzo non valido
    if(!matchRegex(dati.indirizzo, REGEX_INDIRIZZO)) {
      nuoviDati.errore_indirizzo = "Errore, l'indirizzo inserito non è valido. deve essere del seguente tipo: via|viale|piazza|p.zza|corso|c.so|traversa|trav.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio, seguito dal nome della via e infine dal numero civico";
      nuoviDati.num_errori += 1;
    }
  }

  /** Controllo username **/
  // non è stato inserito
  if(!nuoviDati.username) {
    nuoviDati.errore_username = "Errore, lo username non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.username, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_username = "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza non valida
      if(nuoviDati.username.length > 10) {
        nuoviDati.errore_username = "Errore, la lunghezza dello username deve essere inclusa tra 1 e 10 estremi incusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** controllo password attuale **/
  // non è stata inserita
  if(!nuoviDati.password_attuale) {
    nuoviDati.errore_password_attuale = "Errore, \"Password attuale\" non è stata inserita.";
    nuoviDati.num_errori += 1;
  }
  // è stata inserita
  else {
    // non rispetta la REGEX
    if(!matchRegex(nuoviDati.password_attuale, REGEX_PASSWORD)) {
      nuoviDati.errore_password_attuale =  "Password attuale non valida. deve avere:\n";
      nuoviDati.errore_password_attuale += "- minimo 8 e massimo 50 caratteri alfanumerici.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 numero.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 lettera maiuscola.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 lettera minuscola.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";
      nuoviDati.num_errori += 1;
    }
  }

  /** Controllo le 2 nuove password **/
  // solo una delle 2 nuove password è stata inserita
  if((nuoviDati.nuova_password && !nuoviDati.conferma_nuova_password) || (!nuoviDati.nuova_password && nuoviDati.conferma_nuova_password)) {
    nuoviDati.errore_nuova_password = "Errore, inserire sia \"Nuova password\" e \"Conferma nuova password\" se si desidera modificare la password attuale.";
    nuoviDati.num_errori += 1;
  }
  else {
    // entrambe le 2 nuove password sono state inserite
    if(nuoviDati.nuova_password && nuoviDati.conferma_nuova_password) {
      // Le 2 nuove password non sono uguali
      if(nuoviDati.nuova_password !== nuoviDati.conferma_nuova_password) {
        nuoviDati.errore_nuova_password = "Errore, \"Nuova password\" e \"Conferma nuova password\" non sono uguali.";
        nuoviDati.num_errori += 1;
      }
      else {
        // non rispettano la REGEX
        if(!matchRegex(nuoviDati.nuova_password, REGEX_PASSWORD)) {
          nuoviDati.errore_nuova_password =  "Nuova password non valida. deve avere:\n";
          nuoviDati.errore_nuova_password += "- minimo 8 e massimo 50 caratteri alfanumerici.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 numero.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 lettera maiuscola.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 lettera minuscola.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";
          nuoviDati.num_errori += 1;
        }
      }
    }
  }

  return nuoviDati;
}

export const controlloModificaProfiloUtente = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nuovo_username: null, 
    errore_password_attuale: null, 
    errore_nuova_password: null,   
    errore_primo_intervallo: null, 
    errore_secondo_intervallo: null, 
    errore_numero_clienti: null
  };

  /** Controllo username **/
  // non è stato inserito
  if(!nuoviDati.nuovo_username) {
    nuoviDati.errore_nuovo_username = "Errore, lo username non è stato inserito.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.nuovo_username, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_nuovo_username = "Errore, il nuovo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza non valida
      if(nuoviDati.nuovo_username.length > 10) {
        nuoviDati.errore_nuovo_username = "Errore, la lunghezza dello username deve essere inclusa tra 1 e 10 estremi incusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** controllo password attuale **/
  // non è stata inserita
  if(!nuoviDati.password_attuale) {
    nuoviDati.errore_password_attuale = "Errore, \"Password attuale\" non è stata inserita.";
    nuoviDati.num_errori += 1;
  }
  // è stata inserita
  else {
    // non rispetta la REGEX
    if(!matchRegex(nuoviDati.password_attuale, REGEX_PASSWORD)) {
      nuoviDati.errore_password_attuale =  "Password attuale non valida. deve avere:\n";
      nuoviDati.errore_password_attuale += "- minimo 8 e massimo 50 caratteri alfanumerici.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 numero.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 lettera maiuscola.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 lettera minuscola.\n";
      nuoviDati.errore_password_attuale += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";
      nuoviDati.num_errori += 1;
    }
  }

  /** Controllo le 2 nuove password **/
  // solo una delle 2 nuove password è stata inserita
  if((nuoviDati.nuova_password && !nuoviDati.conferma_nuova_password) || (!nuoviDati.nuova_password && nuoviDati.conferma_nuova_password)) {
    nuoviDati.errore_nuova_password = "Errore, inserire sia \"Nuova password\" e \"Conferma nuova password\" se si desidera modificare la password attuale.";
    nuoviDati.num_errori += 1;
  }
  else {
    // entrambe le 2 nuove password sono state inserite
    if(nuoviDati.nuova_password && nuoviDati.conferma_nuova_password) {
      // Le 2 nuove password non sono uguali
      if(nuoviDati.nuova_password !== nuoviDati.conferma_nuova_password) {
        nuoviDati.errore_nuova_password = "Errore, \"Nuova password\" e \"Conferma nuova password\" non sono uguali.";
        nuoviDati.num_errori += 1;
      }
      else {
        // non rispettano la REGEX
        if(!matchRegex(nuoviDati.nuova_password, REGEX_PASSWORD)) {
          nuoviDati.errore_nuova_password =  "Nuova password non valida. deve avere:\n";
          nuoviDati.errore_nuova_password += "- minimo 8 e massimo 50 caratteri alfanumerici.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 numero.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 lettera maiuscola.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 lettera minuscola.\n";
          nuoviDati.errore_nuova_password += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*\n";
          nuoviDati.num_errori += 1;
        }
      }
    }
  }

  /** Controllo primo intervallo **/
  // è stato inserito
  if(nuoviDati.primo_intervallo) {
    // non rispetta la REGEX
    if(!matchRegex(nuoviDati.primo_intervallo, REGEX_INTERVALLO)) {
      nuoviDati.errore_primo_intervallo = "Errore, l'intervallo inserito non è valido. Deve rispettate il seguente formato: X-Y dove: 0 <= X <= 9 e 0 <= Y <= 9, X < Y.";
      nuoviDati.num_errori += 1;
    }
    else {
      // controllo se i numeri inseriti sono validi
      const indiceSep = nuoviDati.primo_intervallo.indexOf('-');
      const min = parseInt(nuoviDati.primo_intervallo.slice(0, indiceSep));
      const max = parseInt(nuoviDati.primo_intervallo.slice(indiceSep+1));
      if(min < 0 || min > 23) {
        nuoviDati.errore_primo_intervallo = "Errore, il valore minimo deve essere compreso tra 0 e 23 estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
      else if(max < 0 || max > 23) {
        nuoviDati.errore_primo_intervallo = "Errore, il valore massimo deve essere compreso tra 0 e 23 estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
      else if(max <= min) {
        nuoviDati.errore_primo_intervallo = "Errore, il valore massimo deve essere maggiore del valore minimo.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo secondo intervallo **/
  // è stato inserito
  if(nuoviDati.secondo_intervallo) {
    // non rispetta la REGEX
    if(!matchRegex(nuoviDati.secondo_intervallo, REGEX_INTERVALLO)) {
      nuoviDati.errore_secondo_intervallo = "Errore, l'intervallo inserito non è valido. Deve rispettate il seguente formato: X-Y dove: 0 <= X <= 9 e 0 <= Y <= 9, X < Y.";
      nuoviDati.num_errori += 1;
    }
    else {
      // controllo se i numeri inseriti sono validi
      const indiceSep = nuoviDati.secondo_intervallo.indexOf('-');
      const min = parseInt(nuoviDati.secondo_intervallo.slice(0, indiceSep));
      const max = parseInt(nuoviDati.secondo_intervallo.slice(indiceSep+1));
      if(min < 0 || min > 23) {
        nuoviDati.errore_secondo_intervallo = "Errore, il valore minimo deve essere compreso tra 0 e 23 estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
      else if(max < 0 || max > 23) {
        nuoviDati.errore_secondo_intervallo = "Errore, il valore massimo deve essere compreso tra 0 e 23 estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
      else if(max <= min) {
        nuoviDati.errore_secondo_intervallo = "Errore, il valore massimo deve essere maggiore del valore minimo.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo entrambi gli intervalli **/
  // hanno passato entrambi i controlli precedenti
  if(!nuoviDati.errore_primo_intervallo && !nuoviDati.errore_secondo_intervallo) {
    const indiceSep1 = nuoviDati.primo_intervallo.indexOf('-');
    const min1 = parseInt(nuoviDati.primo_intervallo.slice(0, indiceSep1));
    const max1 = parseInt(nuoviDati.primo_intervallo.slice(indiceSep1+1));
    const indiceSep2 = nuoviDati.secondo_intervallo.indexOf('-');
    const min2 = parseInt(nuoviDati.secondo_intervallo.slice(0, indiceSep2));
    const max2 = parseInt(nuoviDati.secondo_intervallo.slice(indiceSep2+1));
    // gli intervalli non sono consecutivi
    if((min1 >= min2 && min1 <= max2) || (max1 >= min2 && max1 <= max2) || (min2 >= min1 && min2 <= max1) || (max2 >= min1 && max2 <= max1)) {
      nuoviDati.errore_secondo_intervallo = "Errore, i 2 intervalli inseriti non sono consecutivi.";
      nuoviDati.num_errori += 1;
    }
    else {
      // il secondo intervallo viene prima del primo intervallo
      if(min2 < max1) {
        nuoviDati.errore_secondo_intervallo = "Errore, il secondo intervallo deve avvenire dopo il primo intervallo.";
        nuoviDati.num_errori += 1;
      }
    }

  }

  /** Controllo numero clienti **/
  // non è stato inserito
  if(!nuoviDati.numero_clienti) {
    nuoviDati.errore_numero_clienti = "Errore, inserire il numero di clienti.";
    nuoviDati.num_errori += 1;
  }
  else {
    // il numero inserito non è maggiore di 0
    if(parseInt(nuoviDati.numero_clienti) < 1) {
      nuoviDati.errore_numero_clienti = "Errore, inserire un numero maggiore di 0.";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}

export const controlloCarta = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_data_scadenza: null,
    errore_circuito: null,
    errore_numero: null,
    errore_cvv_cvs: null,
    errore_nome_titolare: null
  };

  const dataAttuale = new Date();
  
  /** controllo della data di scadenza **/
  // data non inserita
  if(!nuoviDati.anno_scadenza || !nuoviDati.mese_scadenza) {
    nuoviDati.errore_data_scadenza = "Inserire la data di scadenza.";
    nuoviDati.num_errori += 1;
  }
  // data inserita
  else {
    // non è una data
    if((typeof nuoviDati.anno_scadenza !== "number" && nuoviDati.anno_scadenza < dataAttuale.getFullYear()) || (typeof nuoviDati.mese_scadenza !== "number" && !(nuoviDati.mese_scadenza >= 1 && nuoviDati.mese_scadenza <= 12))) {
      nuoviDati.errore_data_scadenza = "Inserire una data di scadenza valida.";
      nuoviDati.num_errori += 1;
    }
    // è una data
    else {
      // consideriamo il mese dopo la scadenza
      const dataScadenza = new Date(parseInt(nuoviDati.anno_scadenza), parseInt(nuoviDati.mese_scadenza), 1);
      // Carta scaduta
      if(dataScadenza < dataAttuale) {
        nuoviDati.errore_data_scadenza = "Errore, la carta è scaduta. Inserire una carta non scaduta.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo circuito e numero di carta **/
  // circuito non selezionato
  if(!nuoviDati.is_visa && !nuoviDati.is_mastercard) {
    nuoviDati.errore_circuito = "Errore, selezionare un pulsante tra Visa e Mastercard.";
    nuoviDati.num_errori += 1;
  }
  // circuito selezionato
  else {
    // circuito Visa selezioanto
    if(nuoviDati.is_visa) {
      if(!matchRegex(nuoviDati.numero, REGEX_VISA)) {
        nuoviDati.errore_numero = "Errore, il numero della carta inserita non è valido. Controllare meglio.";
        nuoviDati.num_errori += 1;
      }
    }
    // circuito Mastercard selezionato
    else {
      if(!matchRegex(nuoviDati.numero, REGEX_MASTERCARD)) {
        nuoviDati.errore_numero = "Errore, il numero della carta inserita non è valido. Controllare meglio.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo cvv/cvs **/
  // cvv/cvs non inserito
  if(!nuoviDati.cvv_cvs) {
    nuoviDati.errore_cvv_cvs = "Inserire un numero di 3 cifre.";
    nuoviDati.num_errori += 1;
  }
  else {
    // FIX (bug #4): prima si controllava SOLO la lunghezza, quindi un CVV alfabetico
    // come 'abc' (lunghezza 3) superava la validazione e la carta veniva salvata.
    // Ora si richiedono esattamente 3 CIFRE.
    if(!/^\d{3}$/.test(nuoviDati.cvv_cvs)) {
      nuoviDati.errore_cvv_cvs = "Errore, il numero inserito non è valido, deve essere di 3 cifre.";
      nuoviDati.num_errori += 1;
    }
  } 

  /** Controllo nome titolare **/
  // nome titolare non inserito
  if(!nuoviDati.nome_titolare) {
    nuoviDati.errore_nome_titolare = "Inserire il nome del titolare.";
    nuoviDati.num_errori += 1;
  }
  else {
    // nome titolare non valido.
    if(!matchRegex(nuoviDati.nome_titolare, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome_titolare = "Errore, il nome del titolare deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza nome titolare non valida.
      if(nuoviDati.nome_titolare.length < 1 || nuoviDati.nome_titolare.length > 60) {
        nuoviDati.errore_nome_titolare = "Errore, nome non valido. Deve essere di lunghezza compresa tra 1 e 60, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  return nuoviDati;
}

export const controlloRicercaOrdini = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_tipo: null,
    errore_data_creazione: null,
    errore_data_prenotazione: null,
    errore_nome_cliente: null,
    errore_cognome_cliente: null,
    errore_email_cliente: null,
    errore_contatto_cliente: null,
    errore_username_cliente: null
  };

  /** Controllo sul tipo **/
  if(!["Struttura", "Spedizione", "Corriere", "Tutte"].includes(dati.metodo_pagamento)) {
    nuoviDati.errore_tipo = "Errore, selezionare un'opzione offerta dal tipo.";
    nuoviDati.num_errori += 1;
  }

  /** controllo le date di creazione **/
  // entrambe le date sono state inserite
  if(nuoviDati.data_creazione_min && nuoviDati.data_creazione_max) {
    // creo le date
    const data_creazione_min = new Date(nuoviDati.data_creazione_min);
    const data_creazione_max = new Date(nuoviDati.data_creazione_max);
    // la data massima è minore della data min
    if(data_creazione_max < data_creazione_min) {
      nuoviDati.errore_data_creazione = "Errore, la data di creazione massima è minore della data di creazione minima.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo le date di prenotazione **/
  // entrambe le date sono state inserite
  if(nuoviDati.data_prenotazione_min && nuoviDati.data_prenotazione_max) {
    // creo le date
    const data_prenotazione_min = new Date(nuoviDati.data_prenotazione_min);
    const data_prenotazione_max = new Date(nuoviDati.data_prenotazione_max);
    // la data massima è minore della data min
    if(data_prenotazione_max < data_prenotazione_min) {
      nuoviDati.errore_data_prenotazione = "Errore, la data di prenotazione massima è minore della data di prenotazione minima.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo il nome del cliente **/
  // Il nome del cliente è stato inserito
  if(nuoviDati.nome_cliente) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.nome_cliente, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome_cliente = "Errore, il nome del cliente deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo il cognome del cliente **/
  // Il cognome del cliente è stato inserito
  if(nuoviDati.cognome_cliente) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.cognome_cliente, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_cognome_cliente = "Errore, il cognome del cliente deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo email cliente **/
  // L'email del cliente è stata inserita
  if(nuoviDati.email_cliente) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.email_cliente, REGEX_RICERCA_EMAIL)) {
      nuoviDati.errore_email_cliente = "Errore, l'email deve contenere lettere, .@-.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo contatto cliente **/
  // Il contatto del cliente è stato inserito
  if(nuoviDati.contatto_cliente) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.contatto_cliente, REGEX_RICERCA_CONTATTO)) {
      nuoviDati.errore_contatto_cliente = "Errore, il contatto non è valido. Inserire solamente numeri senza altri tipi di caratteri come il -.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo username cliente **/
  // Lo username del cliente è stato inserito
  if(nuoviDati.username_cliente) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.username_cliente, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_username_cliente = "Errore, lo username deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?";
      nuoviDati.num_errori += 1;
    }
  }


  return nuoviDati;
}

export const controlloRicercaSpese = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nome: null,
    errore_descrizione: null,
    errore_totali: null,
    errore_giorni: null,
    errore_note: null
  };

  /** controllo nome **/
  // Il nome è stato inserito
  if(nuoviDati.nome) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.nome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome = "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo descrizione **/
  // La descrizione è stata inserita
  if(nuoviDati.descrizione) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.descrizione, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_descrizione = "Errore, la descrizione deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo totali */
  // entrambi i totali sono stati inseriti
  if(nuoviDati.totale_min && nuoviDati.totale_max) {
    // il totale massimo è più piccolo del totale minimo
    if(parseFloat(nuoviDati.totale_max) < parseFloat(nuoviDati.totale_min)) {
      nuoviDati.errore_totali = "Errore, il totale massimo è più piccolo del totale minimo.";
      nuoviDati.num_errori += 1;
    }
  }
  
  /** controllo i giorni **/
  // entrambi i giorni sono stati inseriti
  if(nuoviDati.primo_giorno && nuoviDati.ultimo_giorno) {
    // creo le date
    const primo_giorno = new Date(nuoviDati.primo_giorno);
    const ultimo_giorno = new Date(nuoviDati.ultimo_giorno);
    // il primo giorno è minore dell'ultimo giorno
    if(ultimo_giorno < primo_giorno) {
      nuoviDati.errore_giorni = "Errore, l'ultimo giorno è minore del primo giorno.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo note **/
  // le note sono state inserite
  if(nuoviDati.note) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.note, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_note = "Errore, le note devono contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}

export const controlloRicercaClienti = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nome: null,
    errore_cognome: null,
    errore_contatto: null,
    errore_email: null
  };

  /** controllo nome **/
  // Il nome è stato inserito
  if(nuoviDati.nome) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.nome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome = "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo cognome **/
  // Il cognome è stato inserito
  if(nuoviDati.cognome) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.cognome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_cognome = "Errore, il cognome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
  }

  // Il contatto è stato inserito
  if(nuoviDati.contatto) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.contatto, REGEX_RICERCA_CONTATTO)) {
      nuoviDati.errore_contatto = "Errore, il contatto non è valido. Inserire solamente numeri senza altri tipi di caratteri come il -.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo email **/
  // L'email è stata inserita
  if(nuoviDati.email) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.email, REGEX_RICERCA_EMAIL)) {
      nuoviDati.errore_email = "Errore, l'email deve contenere lettere, .@-.";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}

export const controlloRicercaServizi = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nome: null,
    errore_tipo: null,
    errore_prezzi: null,
    errore_in_uso: null
  };

  /** controllo nome **/
  // Il nome è stato inserito
  if(nuoviDati.nome) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.nome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome = "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo tipo **/
  // Il tipo è stato inserito
  if(nuoviDati.tipo) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.tipo, REGEX_STRINGA_NORMALE)) {
      nuoviDati.errore_tipo = "Errore, il tipo deve contenere solamente lettere senza accenti.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo prezzi */
  // entrambi i prezzi sono stati inseriti
  if(nuoviDati.prezzo_min && nuoviDati.prezzo_max) {
    // il prezzo massimo è più piccolo del prezzo minimo
    if(parseFloat(nuoviDati.prezzo_max) < parseFloat(nuoviDati.prezzo_min)) {
      nuoviDati.errore_prezzi = "Errore, il prezzo massimo è più piccolo del prezzo minimo.";
      nuoviDati.num_errori += 1;
    }
  }

  /** controllo "in uso" **/
  // "In uso" è stato inserito
  if(nuoviDati.in_uso) {
    // Non rispetta la REGEX
    if(!matchRegex(nuoviDati.in_uso, REGEX_STRINGA_NORMALE)) {
      nuoviDati.errore_in_uso = "Errore, \"In uso\" deve contenere solamente lettere senza accenti.";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}

export const controlloServizio = (dati, isNuovo) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nome: null,
    errore_tipo: null,
    errore_prezzo: null,
    errore_descrizione: null,
    errore_note: null, 
    errore_in_uso: null, 
  };

  /** Controllo nome **/
  // nome non inserito
  if(!nuoviDati.nome) {
    nuoviDati.errore_nome = "Inserire il nome.";
    nuoviDati.num_errori += 1;
  }
  else {
    // nome non valido.
    if(!matchRegex(nuoviDati.nome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome = "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza nome non valida.
      if(nuoviDati.nome.length < 1 || nuoviDati.nome.length > 100) {
        nuoviDati.errore_nome = "Errore, nome non valido. Deve essere di lunghezza compresa tra 1 e 100, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }
  
  /** controllo tipo **/
  if(!["Servizio", "Prodotto"].includes(nuoviDati.tipo)) {
    nuoviDati.errore_tipo = 'Errore, il tipo deve essere uguale a "Prodotto" o "Servizio".';
    nuoviDati.num_errori += 1;
  }

  /** Controllo prezzo **/
  // non è stato inserito
  if(!nuoviDati.prezzo) {
    nuoviDati.errore_prezzo = "Errore, inserire il prezzo.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non è un numero maggiore di 0
    if(parseFloat(nuoviDati.prezzo) <= 0) {
      nuoviDati.errore_prezzo = "Errore, il prezzo inserito non è maggiore di 0.";
      nuoviDati.num_errori += 1;
    }
  }

  /** Controllo descrizione **/
  // descrizione non inserita
  if(!nuoviDati.descrizione) {
    nuoviDati.errore_descrizione = "Inserire la descrizione.";
    nuoviDati.num_errori += 1;
  }
  else {
    // descrizione non valida.
    if(!matchRegex(nuoviDati.descrizione, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_descrizione = "Errore, la descrizione deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza descrizione non valida.
      if(nuoviDati.descrizione.length < 1 || nuoviDati.descrizione.length > 1000) {
        nuoviDati.errore_descrizione = "Errore, descrizione non valida. Deve essere di lunghezza compresa tra 1 e 1000, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }
  
  /** Controllo note **/
  // Note inserite
  if(nuoviDati.note) {
    // note non valide.
    if(!matchRegex(nuoviDati.note, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_note = "Errore, le note devono contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza note non valida.
      if(nuoviDati.note.length < 1 || nuoviDati.note.length > 200) {
        nuoviDati.errore_note = "Errore, note non valide. Deve essere di lunghezza compresa tra 1 e 200, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo in_uso **/
  if(!isNuovo) {
    // in_uso non valido
    if(nuoviDati.in_uso !== "Si" && nuoviDati.in_uso !== "No") {
      nuoviDati.errore_in_uso = "Errore, valore \"in uso\" non valido. Deve essere uguale a \"Si\" oppure a \"No\".";
      nuoviDati.num_errori += 1;
    }
  }

  return nuoviDati;
}

export const controlloSpesa = (dati) => {
  // Rimuoviamo gli errori
  const nuoviDati = {
    ...dati,
    num_errori: 0,
    errore_nome: null,
    errore_descrizione: null,
    errore_totale: null,
    errore_giorno: null,
    errore_note: null
  };

  /** Controllo nome **/
  // nome non inserito
  if(!nuoviDati.nome) {
    nuoviDati.errore_nome = "Inserire il nome.";
    nuoviDati.num_errori += 1;
  }
  else {
    // nome non valido.
    if(!matchRegex(nuoviDati.nome, REGEX_NOME_COGNOME)) {
      nuoviDati.errore_nome = "Errore, il nome deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), spazi, apostrofi, trattini e punti.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza nome non valida.
      if(nuoviDati.nome.length < 1 || nuoviDati.nome.length > 50) {
        nuoviDati.errore_nome = "Errore, nome non valido. Deve essere di lunghezza compresa tra 1 e 50, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo descrizione **/
  // descrizione inserita
  if(nuoviDati.descrizione) {
    // descrizione non valida.
    if(!matchRegex(nuoviDati.descrizione, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_descrizione = "Errore, la descrizione deve contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza descrizione non valida.
      if(nuoviDati.descrizione.length < 1 || nuoviDati.descrizione.length > 1000) {
        nuoviDati.errore_descrizione = "Errore, descrizione non valida. Deve essere di lunghezza compresa tra 1 e 1000, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }

  /** Controllo totale **/
  // non è stato inserito
  if(!nuoviDati.totale) {
    nuoviDati.errore_totale = "Errore, inserire il totale.";
    nuoviDati.num_errori += 1;
  }
  // è stato inserito
  else {
    // Non è un numero maggiore di 0
    if(parseFloat(nuoviDati.totale) <= 0) {
      nuoviDati.errore_totale = "Errore, il totale inserito non è maggiore di 0.";
      nuoviDati.num_errori += 1;
    }
  }

  /** Controllo giorno **/
  // non è stato inserito
  if(!nuoviDati.giorno) {
    nuoviDati.errore_giorno = "Errore, inserire il giorno.";
    nuoviDati.num_errori += 1;
  }

  /** Controllo note **/
  // Note inserite
  if(nuoviDati.note) {
    // note non valide.
    if(!matchRegex(nuoviDati.note, REGEX_DESCRIZIONE_E_NOTE)) {
      nuoviDati.errore_note = "Errore, le note devono contenere solamente i seguenti caratteri: lettere (comprese quelle accentate), numeri, spazi, -_.,;:@#!?.";
      nuoviDati.num_errori += 1;
    }
    else {
      // lunghezza note non valida.
      if(nuoviDati.note.length < 1 || nuoviDati.note.length > 200) {
        nuoviDati.errore_note = "Errore, note non valide. Deve essere di lunghezza compresa tra 1 e 200, estremi inclusi.";
        nuoviDati.num_errori += 1;
      }
    }
  }
  
  return nuoviDati;
}

export const controlloOrdine = (dati) => {
  /** controllo metodo di pagamento **/
  // metodo di pagamento non selezionato
  if (!dati.metodo_pagamento) {
    alert("Seleziona un metodo di pagamento!");
    return false;
  }

  /** controllo metodo di pagamento Struttura **/
  if (dati.metodo_pagamento === "Struttura") {
    // data e/o orario non inseriti
    if (!dati.data_prenotazione || !dati.ora_prenotazione) {
      alert("Seleziona data e orario per la prenotazione.");
      return false;
    }
    // data precedente o uguale a quella attuale
    const dataPrenotazione = new Date(dati.data_prenotazione)
    const dataAttuale = new Date();
    if(dataPrenotazione <= dataAttuale) {
      alert("Inserire un giorno successore a quello attuale.");
      return false;
    }
  }

  /** controllo metodo di pagamento Spedizione **/
  if (dati.metodo_pagamento === "Spedizione") {
    /** Controllo indirizzo **/
    // indirizzo non inserito
    if(!dati.indirizzo) {
      alert("Inserire l'indirizzo per la consegna.");
      return false;
    }
    // indirizzo non valido
    if(!matchRegex(dati.indirizzo, REGEX_INDIRIZZO)) {
      alert("Errore, l'indirizzo inserito non è valido. deve essere del seguente tipo: via|viale|piazza|p.zza|corso|c.so|traversa|trav.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio, seguito dal nome della via e infine dal numero civico");
      return false;
    }
    /** Controllo carta **/
    if (!dati.numero_carta) {
      alert("Seleziona una carta.");
      return false;
    }
  }

  /** controllo metodo di pagamento Corriere **/
  if (dati.metodo_pagamento === "Corriere") {
    /** Controllo indirizzo **/
    // indirizzo non inserito
    if(!dati.indirizzo) {
      alert("Inserire l'indirizzo per la consegna.");
      return false;
    }
    // indirizzo non valido
    if(!matchRegex(dati.indirizzo, REGEX_INDIRIZZO)) {
      alert("Errore, l'indirizzo inserito non è valido. deve essere del seguente tipo: via|viale|piazza|p.zza|corso|c.so|traversa|trav.|lungomare|largo|rotonda|circonvallazione|vico|vicolo|salita|discesa|parcheggio, seguito dal nome della via e infine dal numero civico");
      return false;
    }
  }

  return true;
}










