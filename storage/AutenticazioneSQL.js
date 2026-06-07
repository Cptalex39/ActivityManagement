// node_modules
import CryptoJS from 'crypto-js';

// Costante PEPPER_HEX
const PEPPER_HEX = "13pmcWU1ZAjDFi22U6ANycDY0len2k5H";

// Funzione per generare una stringa casuale
const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
  }
  return result;
}

// Funzione per criptare la password
const encryptPassword = (password, saltHex, pepperHex) => {
  const hash = CryptoJS.SHA512(password + saltHex + pepperHex);
  return hash.toString(CryptoJS.enc.Hex);
}

export class AutenticazioneSQL {
  SQL_SELEZIONE_UTENTE = ` 
    SELECT 
      u.\`username\` AS \`username\`, 
      u.\`ruolo\` AS \`ruolo\`, 
      u.\`password\` AS \`password\`, 
      u.\`salt_hex\` AS \`salt_hex\`, 
      a.\`primo_intervallo\` AS \`primo_intervallo\`, 
      a.\`secondo_intervallo\` AS \`secondo_intervallo\`, 
      a.\`numero_clienti\` AS \`numero_clienti\` 
    FROM 
      \`utente\` u 
    CROSS JOIN 
      \`attivita\` a 
    WHERE 
      u.\`username\` = ? 
      AND a.\`id\` = 1; 
  `;

  SQL_MODIFICA_ATTIVITA = `
    UPDATE attivita 
    SET primo_intervallo = ?, secondo_intervallo = ?, numero_clienti = ? 
    WHERE id = 1;
  `

  SQL_OTTIENI_PASSWORD = `
    SELECT \`password\`, salt_hex 
    FROM utente 
    WHERE username = ?; 
  `

  constructor() {
    
  }
  
  sql_modifica_utente(params) {
    return (`
      UPDATE 
        \`utente\` 
      SET 
        \`username\` = ? 
        ${params.nuova_password !== "" ? ", \`password\` = ?, \`salt_hex\` = ? " : ""} 
      WHERE 
        \`username\` = ? AND \`password\` = ?; 
    `);
  }

  params_selezione_utente(params) {
    return [
      `${params.username}`
    ];
  }

  params_modifica_utente(params) {
    const paramsOutput = [
      `${params.nuovo_username}`
    ];
    
    if(params.nuova_password !== "") {
      paramsOutput.push(params.nuova_password);
      paramsOutput.push(params.salt_hex);
    }

    paramsOutput.push(params.username_attuale);
    paramsOutput.push(params.password_attuale);

    return paramsOutput;
  }

  params_modifica_attivita(params) {
    return [
      params.primo_intervallo, 
      params.secondo_intervallo, 
      params.numero_clienti
    ];
  }

  params_ottieni_password(params) {
    return [
      params.username_attuale
    ];
  }
}









