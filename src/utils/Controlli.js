// Utils
import { passwordIsCorrect } from "./Sicurezza";

const isEmpty = (value) => {
  return !value;
}

const isInRange = (num, min, max) => {
  return (num >= min && num <= max);
}

const matchRegex = (value, regexStr) => {
  const regex = new RegExp(regexStr);
  return regex.test(value);
};

const setErrore = (settersErrori, nomeErrore, messaggioErrore) => {
  settersErrori(prevErrori => ({
    ...prevErrori, 
    [nomeErrore]: messaggioErrore
  }));
}

const isNumber = (numStr) => {
  const num = parseFloat(numStr);
  return !isNaN(num) && isFinite(num);  
}

export const controlloCliente = (dati, settersErrori) => {
  let numErrori = 0;
  let messaggioErrore = "";
  setErrore(settersErrori, "errore_nome", "");
  setErrore(settersErrori, "errore_cognome", "");
  setErrore(settersErrori, "errore_contatto", "");
  setErrore(settersErrori, "errore_email", "");
  setErrore(settersErrori, "errore_note", "");

  // controllo sul nome
  messaggioErrore = "";
  if (isEmpty(dati.nome)) {
    numErrori += 1; 
    messaggioErrore = "Inserire il nome.";
  }
  else if(!isInRange(dati.nome.length, 1, 30)) {
    numErrori += 1; 
    messaggioErrore = "Lunghezza nome non valido, deve avere un numero di caratteri tra 1 e 30 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_nome", messaggioErrore);

  // controllo sul cognome
  messaggioErrore = "";
  if (isEmpty(dati.cognome)) {
    numErrori += 1; 
    messaggioErrore = "Inserire il cognome";
  }
  else if(!isInRange(dati.nome.length, 1, 30)) {
    numErrori += 1; 
    messaggioErrore = "Lunghezza cognome non valido, deve avere un numero di caratteri tra 1 e 30 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_cognome", messaggioErrore);

  // controllo sul contatto e sull'email
  if(isEmpty(dati.contatto) && isEmpty(dati.email)) {
    numErrori += 1;
    messaggioErrore = "Inserire il contatto e/o l\'email.";
    setErrore(settersErrori, "errore_contatto", messaggioErrore);
    setErrore(settersErrori, "errore_email", messaggioErrore);
  }
  else {
    messaggioErrore = "";
    if(!isEmpty(dati.email) && !matchRegex(dati.email, "^([a-z\\d\\._-]+)@([a-z\\d-]+)\\.([a-z]{2,8})(\\.[a-z]{2,8})?$")) {
      numErrori += 1;
      messaggioErrore = "Email non valida.";
      setErrore(settersErrori, "errore_email", messaggioErrore);
    }
  }
  
  return numErrori;
}  

export const controlloServizio = (dati, settersErrori) => {
  let numErrori = 0;
  let messaggioErrore = "";
  setErrore(settersErrori, "errore_nome", "");
  setErrore(settersErrori, "errore_prezzo", "");
  setErrore(settersErrori, "errore_note", "");
  
  // controllo sul nome
  messaggioErrore = "";
  if (isEmpty(dati.nome)) {
    numErrori += 1; 
    messaggioErrore = "Inserire il nome";
  }
  else if(!isInRange(dati.nome.length, 1, 100)) {
    numErrori += 1; 
    messaggioErrore = "Lunghezza nome non valido, deve avere un numero di caratteri tra 1 e 100 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_nome", messaggioErrore);

  // controllo sul prezzo
  messaggioErrore = "";
  if(!isNumber(dati.prezzo.toString())) {
    numErrori += 1;
    messaggioErrore = (isEmpty(dati.prezzo.toString())) ? ("Inserire il prezzo.") : (
      "Il prezzo inserito non è un numero."
    );
  }
  else if(!isInRange(parseFloat(dati.prezzo.toString()), 0.01, Number.MAX_VALUE)) {
    numErrori += 1;
    messaggioErrore = "Inserire un prezzo di almeno 0.01 €.";
  }
  setErrore(settersErrori, "errore_prezzo", messaggioErrore);
  
  // controllo sulle note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1;
    messaggioErrore = "Lunghezza note non valida, deve avere un numero di caratteri tra 0 e 200 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);

  return numErrori;
}

export const controlloSpesa = (dati, settersErrori) => {
  let numErrori = 0;
  let messaggioErrore = "";
  setErrore(settersErrori, "errore_nome", "");
  setErrore(settersErrori, "errore_giorno", "");
  setErrore(settersErrori, "errore_descrizione", "");
  setErrore(settersErrori, "errore_totale", "");
  setErrore(settersErrori, "errore_note", "");

  // controllo sul nome
  messaggioErrore = "";
  if (isEmpty(dati.nome)) {
    numErrori += 1; 
    messaggioErrore = "Inserire il nome";
  }
  else if(!isInRange(dati.nome.length, 1, 50)) {
    numErrori += 1; 
    messaggioErrore = "Lunghezza nome non valido, deve avere un numero di caratteri tra 1 e 50 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_nome", messaggioErrore);

  // controllo sul giorno
  messaggioErrore = "";
  if (isEmpty(dati.giorno)) {
    numErrori += 1; 
    messaggioErrore = "Inserire il giorno.";
  }
  setErrore(settersErrori, "errore_giorno", messaggioErrore);

  // controllo sulla descrizione
  messaggioErrore = "";
  if(!isInRange(dati.descrizione.length, 0, 1000)) {
    numErrori += 1;
    messaggioErrore = "Lunghezza descrizione non valida, deve avere un numero di caratteri tra 0 e 1000 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_descrizione", messaggioErrore);

  // controllo sul totale
  messaggioErrore = "";
  if(!isNumber(dati.totale.toString())) {
    numErrori += 1;
    messaggioErrore = (isEmpty(dati.totale.toString())) ? ("Inserire il totale.") : (
      "Il totale inserito non è un numero."
    );
  }
  else if(!isInRange(parseFloat(dati.totale.toString()), 0.01, Number.MAX_VALUE)) {
    numErrori += 1;
    messaggioErrore = "Inserire un totale di almeno 0.01 €."
  }
  setErrore(settersErrori, "errore_totale", messaggioErrore);
  
  // controllo sulle note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1;
    messaggioErrore = "Lunghezza note non valida, deve avere un numero di caratteri tra 0 e 200 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);

  return numErrori;
}

export const controlloLogin = (dati, settersErrori) => {
  const regexPassword = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,128}$";

  let numErrori = 0;
  let messaggioErrore = "";

  // controllo sullo username inserito
  messaggioErrore = "";
  if (isEmpty(dati.username)) {
    console.log(1);
    numErrori += 1; 
    messaggioErrore = "Inserire lo username.";
  }
  else if(!isInRange(dati.username.length, 1, 10)) {
    console.log(2);
    numErrori += 1; 
    messaggioErrore = "Lunghezza username non valida, deve avere un numero di caratteri alfanumerici tra 1 e 10 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_username", messaggioErrore);
  
  // constrollo sulla password inserita
  messaggioErrore = "";
  if(isEmpty(dati.password)) {
    console.log(3);
    numErrori += 1;
    messaggioErrore = "Inserire la password.";
  }
  else if(!matchRegex(dati.password, regexPassword)) {
    console.log(4);
    numErrori += 1;
    messaggioErrore =  "Password non valida. deve avere:<br>";
    messaggioErrore += "- minimo 8 e massimo 128 caratteri alfanumerici.<br>";
    messaggioErrore += "- almeno 1 numero.<br>";
    messaggioErrore += "- almeno 1 lettera maiuscola.<br>";
    messaggioErrore += "- almeno 1 lettera minuscola.<br>";
    messaggioErrore += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*<br>";
  }
  setErrore(settersErrori, "errore_password", messaggioErrore);

  if(numErrori === 0) {
    // controllo sullo username e sulla password inserita
    messaggioErrore = "";
    if(dati.num_utenti !== 1) {
      console.log(5);
      numErrori += 1;
      messaggioErrore = "Username e/o password errati.";
    }
    else if(!passwordIsCorrect(dati.password, dati.password_db, dati.salt_hex_db)) {
      console.log(6);
      numErrori += 1;
      messaggioErrore = "Username e/o password errati.";
    }
    setErrore(settersErrori, "errore_username", messaggioErrore);
    setErrore(settersErrori, "errore_password", messaggioErrore);
  }

  return numErrori;
}

export const controlloProfilo = (dati, settersErrori) => {
  const regexPassword = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,128}$";
  
  let numErrori = 0;
  let messaggioErrore = "";
  
  // controllo sul nuovo username
  messaggioErrore = "";
  if (isEmpty(dati.nuovo_username)) {
    numErrori += 1; 
    messaggioErrore = "Inserire lo username.";
  }
  else if(!isInRange(dati.nuovo_username.length, 1, 10)) {
    numErrori += 1; 
    messaggioErrore = "Lunghezza username non valida, deve avere un numero di caratteri tra 1 e 10 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_nuovo_username", messaggioErrore);

  // controllo sulle nuove note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1; 
    messaggioErrore = "Lunghezza note non valida, deve avere un numero di caratteri alfanumerici tra 1 e 200 estremi inclusi.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);
  
  // controllo sulla password attuale
  messaggioErrore = "";
  if (isEmpty(dati.password_attuale)) {
    numErrori += 1; 
    messaggioErrore = "Inserire la password attuale.";
  }
  else if(!passwordIsCorrect(dati.password_attuale, dati.password_db, dati.salt_hex_db)) {
    numErrori += 1;
    messaggioErrore = "La password attuale risulta errata.";
  }
  setErrore(settersErrori, "errore_password_attuale", messaggioErrore);

  // controllo le 2 nuove password:
  messaggioErrore = "";
  if(!isEmpty(dati.nuova_password) || !isEmpty(dati.conferma_nuova_password)) {
    if(!(dati.nuova_password === dati.conferma_nuova_password)) {
      numErrori += 1;
      messaggioErrore = "Nuova password e conferma nuova password sono diverse.";
    }
    else {
      if(!matchRegex(dati.nuova_password, regexPassword)) {
        numErrori += 1;
        messaggioErrore =  "Password non valida. deve avere:<br>";
        messaggioErrore += "- minimo 8 e massimo 128 caratteri alfanumerici.<br>";
        messaggioErrore += "- almeno 1 numero.<br>";
        messaggioErrore += "- almeno 1 lettera maiuscola.<br>";
        messaggioErrore += "- almeno 1 lettera minuscola.<br>";
        messaggioErrore += "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*<br>";
      }
    }
  }
  setErrore(settersErrori, "errore_nuova_password", messaggioErrore);
  setErrore(settersErrori, "errore_conferma_nuova_password", messaggioErrore);

  return numErrori;
}










