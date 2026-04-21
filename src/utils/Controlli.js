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

export const controlloCliente = (dati, settersErrori, lingua) => {
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
    messaggioErrore = lingua === "italiano" ? "Inserire il nome." : "The first name was not entered.";
  }
  else if(!isInRange(dati.nome.length, 1, 30)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza nome non valido, deve avere un numero di caratteri tra 1 e 30 estremi inclusi." : "First name length invalid, must have a number of characters between 1 and 30 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_nome", messaggioErrore);

  // controllo sul cognome
  messaggioErrore = "";
  if (isEmpty(dati.cognome)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Inserire il cognome" : "The last name was not entered.";
  }
  else if(!isInRange(dati.nome.length, 1, 30)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza cognome non valido, deve avere un numero di caratteri tra 1 e 30 estremi inclusi." : "Last name length invalid, must have a number of characters between 1 and 30 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_cognome", messaggioErrore);

  // controllo sul contatto e sull'email
  if(isEmpty(dati.contatto) && isEmpty(dati.email)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Inserire il contatto e/o l\'email." : "You enter contact and/or email.";
    setErrore(settersErrori, "errore_contatto", messaggioErrore);
    setErrore(settersErrori, "errore_email", messaggioErrore);
  }
  else {
    messaggioErrore = "";
    if(!isEmpty(dati.email) && !matchRegex(dati.email, "^([a-z\\d\\._-]+)@([a-z\\d-]+)\\.([a-z]{2,8})(\\.[a-z]{2,8})?$")) {
      numErrori += 1;
      messaggioErrore = lingua === "italiano" ? "Email non valida." : "Invalid email.";
      setErrore(settersErrori, "errore_email", messaggioErrore);
    }
  }
  
  // controllo sulle note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Lunghezza note non valida, deve avere un numero di caratteri tra 1 e 200 estremi inclusi." : "Invalid note length, must have between 1 and 200 characters including extremes.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);
  return numErrori;
}  

export const controlloServizio = (dati, settersErrori, lingua) => {
  let numErrori = 0;
  let messaggioErrore = "";
  setErrore(settersErrori, "errore_nome", "");
  setErrore(settersErrori, "errore_prezzo", "");
  setErrore(settersErrori, "errore_note", "");
  
  // controllo sul nome
  messaggioErrore = "";
  if (isEmpty(dati.nome)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Inserire il nome" : "The name was not entered.";
  }
  else if(!isInRange(dati.nome.length, 1, 100)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza nome non valido, deve avere un numero di caratteri tra 1 e 100 estremi inclusi." : "Name length invalid, must have a number of characters between 1 and 100 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_nome", messaggioErrore);

  // controllo sul prezzo
  messaggioErrore = "";
  if(!isNumber(dati.prezzo.toString())) {
    numErrori += 1;
    messaggioErrore = (isEmpty(dati.prezzo.toString())) ? (lingua === "italiano" ? "Inserire il prezzo." : "The price was not entered.") : (
      lingua === "Italiano" ? "Il prezzo inserito non è un numero." : "The price entered is not a number."
    );
  }
  else if(!isInRange(parseFloat(dati.prezzo.toString()), 0.01, Number.MAX_VALUE)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Inserire un prezzo di almeno 0.01 €." : "Enter a price of at least 0.01 €.";
  }
  setErrore(settersErrori, "errore_prezzo", messaggioErrore);
  
  // controllo sulle note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Lunghezza note non valida, deve avere un numero di caratteri tra 0 e 200 estremi inclusi." : "Invalid note length, must have a number of characters between 0 and 200 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);

  return numErrori;
}

export const controlloSpesa = (dati, settersErrori, lingua) => {
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
    messaggioErrore = lingua === "italiano" ? "Inserire il nome" : "The name was not entered.";
  }
  else if(!isInRange(dati.nome.length, 1, 50)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza nome non valido, deve avere un numero di caratteri tra 1 e 50 estremi inclusi." : "Name length invalid, must have a number of characters between 1 and 50 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_nome", messaggioErrore);

  // controllo sul giorno
  messaggioErrore = "";
  if (isEmpty(dati.giorno)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Inserire il giorno." : "The day was not entered.";
  }
  setErrore(settersErrori, "errore_giorno", messaggioErrore);

  // controllo sulla descrizione
  messaggioErrore = "";
  if(!isInRange(dati.descrizione.length, 0, 1000)) {
    numErrori += 1;
    messaggioErrore = lingua = "italiano" ? "Lunghezza descrizione non valida, deve avere un numero di caratteri tra 0 e 1000 estremi inclusi." : "Invalid description length, must have a number of characters between 0 and 1000 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_descrizione", messaggioErrore);

  // controllo sul totale
  messaggioErrore = "";
  if(!isNumber(dati.totale.toString())) {
    numErrori += 1;
    messaggioErrore = (isEmpty(dati.totale.toString())) ? (lingua === "italiano" ? "Inserire il totale." : "You insert the total.") : (
      lingua === "italiano" ? "Il totale inserito non è un numero." : "The total entered is not a number."
    );
  }
  else if(!isInRange(parseFloat(dati.totale.toString()), 0.01, Number.MAX_VALUE)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Inserire un totale di almeno 0.01 €." : "You enter a total of at least € 0.01."
  }
  setErrore(settersErrori, "errore_totale", messaggioErrore);
  
  // controllo sulle note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Lunghezza note non valida, deve avere un numero di caratteri tra 0 e 200 estremi inclusi." : "Invalid note length, must have a number of characters between 0 and 200 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);

  return numErrori;
}

export const controlloLavoro = (dati, settersErrori, lingua) => {  
  let numErrori = 0;
  let messaggioErrore = "";

  setErrore(settersErrori, "errore_cliente", "");
  setErrore(settersErrori, "errore_servizi", "");
  setErrore(settersErrori, "errore_giorno", "");
  setErrore(settersErrori, "errore_note", "");
    
  // controllo sul cliente
  messaggioErrore = "";
  if (dati.id_cliente <= 0) {
    console.log("A");
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Selezionare un cliente." : "You select a client.";
  }
  setErrore(settersErrori, "errore_cliente", messaggioErrore);

  // controllo sui servizi
  if(parseFloat(dati.totale) <= 0) {
    console.log("B");
    console.log(dati.totale);
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Selezionare almeno un\'unita\' di un servizio." : "You select at least one unit of a service.";
  }
  setErrore(settersErrori, "errore_servizi", messaggioErrore);

  // controllo sul giorno
  messaggioErrore = "";
  if (isEmpty(dati.giorno)) {
    console.log("C");
    numErrori += 1; 
    messaggioErrore = lingua = "italiano" ? "Inserire il giorno." : "The day was not entered.";
  }
  setErrore(settersErrori, "errore_giorno", messaggioErrore);

  // controllo sulle note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    console.log("D");
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Lunghezza note non valida, deve avere un numero di caratteri tra 0 e 200 estremi inclusi." : "Invalid note length, must have a number of characters between 0 and 200 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);
  
  return numErrori;
}

export const controlloLogin = (dati, settersErrori, lingua) => {
  const regexPassword = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,128}$";

  let numErrori = 0;
  let messaggioErrore = "";

  // controllo sullo username inserito
  messaggioErrore = "";
  if (isEmpty(dati.username)) {
    console.log(1);
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Inserire lo username." : "The username was not entered.";
  }
  else if(!isInRange(dati.username.length, 1, 10)) {
    console.log(2);
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza username non valida, deve avere un numero di caratteri alfanumerici tra 1 e 10 estremi inclusi." : "Invalid username length, must have a number of alphanumeric characters between 1 and 10 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_username", messaggioErrore);
  
  // constrollo sulla password inserita
  messaggioErrore = "";
  if(isEmpty(dati.password)) {
    console.log(3);
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "Inserire la password." : "The password was not entered.";
  }
  else if(!matchRegex(dati.password, regexPassword)) {
    console.log(4);
    numErrori += 1;
    messaggioErrore =  lingua === "italiano" ? "Password non valida. deve avere:<br>" : "Invalid password. Must have:<br>";
    messaggioErrore += lingua === "italiano" ? "- minimo 8 e massimo 128 caratteri alfanumerici.<br>" : "- minimum 8 and maximum 128 alphanumeric characters.<br>";
    messaggioErrore += lingua === "italiano" ? "- almeno 1 numero.<br>" : "- at least 1 number.<br>";
    messaggioErrore += lingua === "italiano" ? "- almeno 1 lettera maiuscola.<br>" : "- at least 1 uppercase letter.<br>";
    messaggioErrore += lingua === "italiano" ? "- almeno 1 lettera minuscola.<br>" : "- at least 1 lowercase letter.<br>";
    messaggioErrore += lingua === "italiano" ? "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*<br>" : "- At least 1 of the following special characters: !@#$%^&*<br>";
  }
  setErrore(settersErrori, "errore_password", messaggioErrore);

  if(numErrori === 0) {
    // controllo sullo username e sulla password inserita
    messaggioErrore = "";
    if(dati.num_utenti !== 1) {
      console.log(5);
      numErrori += 1;
      messaggioErrore = lingua === "italiano" ? "Username e/o password errati." : "Incorrect username and/or password.";
    }
    else if(!passwordIsCorrect(dati.password, dati.password_db, dati.salt_hex_db)) {
      console.log(6);
      numErrori += 1;
      messaggioErrore = lingua === "italiano" ? "Username e/o password errati." : "Incorrect username and/or password.";
    }
    setErrore(settersErrori, "errore_username", messaggioErrore);
    setErrore(settersErrori, "errore_password", messaggioErrore);
  }

  return numErrori;
}

export const controlloProfilo = (dati, settersErrori, lingua) => {
  const regexPassword = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,128}$";
  
  let numErrori = 0;
  let messaggioErrore = "";
  
  // controllo sul nuovo username
  messaggioErrore = "";
  if (isEmpty(dati.nuovo_username)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Inserire lo username." : "The username was not entered.";
  }
  else if(!isInRange(dati.nuovo_username.length, 1, 10)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza username non valida, deve avere un numero di caratteri tra 1 e 10 estremi inclusi." : "Invalid username length, must have a number of characters between 1 and 10 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_nuovo_username", messaggioErrore);

  // controllo sulle nuove note
  messaggioErrore = "";
  if(!isInRange(dati.note.length, 0, 200)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Lunghezza note non valida, deve avere un numero di caratteri alfanumerici tra 1 e 200 estremi inclusi." : "Invalid note length, must have a number of alphanumeric characters between 1 and 200 inclusive extremes.";
  }
  setErrore(settersErrori, "errore_note", messaggioErrore);
  
  // controllo sulla password attuale
  messaggioErrore = "";
  if (isEmpty(dati.password_attuale)) {
    numErrori += 1; 
    messaggioErrore = lingua === "italiano" ? "Inserire la password attuale." : "The current passwort was not entered.";
  }
  else if(!passwordIsCorrect(dati.password_attuale, dati.password_db, dati.salt_hex_db)) {
    numErrori += 1;
    messaggioErrore = lingua === "italiano" ? "La password attuale risulta errata." : "The current password appears to be incorrect.";
  }
  setErrore(settersErrori, "errore_password_attuale", messaggioErrore);

  // controllo le 2 nuove password:
  messaggioErrore = "";
  if(!isEmpty(dati.nuova_password) || !isEmpty(dati.conferma_nuova_password)) {
    if(!(dati.nuova_password === dati.conferma_nuova_password)) {
      numErrori += 1;
      messaggioErrore = lingua === "italiano" ? "Nuova password e conferma nuova password sono diverse." : "New password and confirm new password are different.";
    }
    else {
      if(!matchRegex(dati.nuova_password, regexPassword)) {
        numErrori += 1;
        messaggioErrore =  lingua === "italiano" ? "Password non valida. deve avere:<br>" : "Invalid password. Must have:<br>";
        messaggioErrore += lingua === "italiano" ? "- minimo 8 e massimo 128 caratteri alfanumerici.<br>" : "- minimum 8 and maximum 128 alphanumeric characters.<br>";
        messaggioErrore += lingua === "italiano" ? "- almeno 1 numero.<br>" : "- at least 1 number.<br>";
        messaggioErrore += lingua === "italiano" ? "- almeno 1 lettera maiuscola.<br>" : "- at least 1 uppercase letter.<br>";
        messaggioErrore += lingua === "italiano" ? "- almeno 1 lettera minuscola.<br>" : "- at least 1 lowercase letter.<br>";
        messaggioErrore += lingua === "italiano" ? "- almeno 1 dei seguenti caratteri speciali: !@#$%^&*<br>" : "- At least 1 of the following special characters: !@#$%^&*<br>";
      }
    }
  }
  setErrore(settersErrori, "errore_nuova_password", messaggioErrore);
  setErrore(settersErrori, "errore_conferma_nuova_password", messaggioErrore);

  return numErrori;
}










