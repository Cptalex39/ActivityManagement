// node_modules
import CryptoJS from 'crypto-js';

// Costante PEPPER_HEX
export const PEPPER_HEX = "13pmcWU1ZAjDFi22U6ANycDY0len2k5H";

// Funzione per generare una stringa casuale
export const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

// Funzione per criptare la password
export const encryptPassword = (password, saltHex, pepperHex) => {
  const hash = CryptoJS.SHA512(password + saltHex + pepperHex);
  return hash.toString(CryptoJS.enc.Hex);
}

// Funzione per verificare se la password è corretta
export const passwordIsCorrect = (passwordInserted, passwordDb, saltHex) => {
  const encryptedPassword = encryptPassword(passwordInserted, saltHex, PEPPER_HEX);
  return encryptedPassword === passwordDb;
}
