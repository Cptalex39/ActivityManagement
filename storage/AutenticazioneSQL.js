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
      \`username\`, \`ruolo\`, \`password\`, \`salt_hex\` 
    FROM 
      \`utente\` 
    WHERE 
      \`username\` = ?; 
  `;

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

  params_ottieni_password(params) {
    return [
      params.username_attuale
    ];
  }
}









