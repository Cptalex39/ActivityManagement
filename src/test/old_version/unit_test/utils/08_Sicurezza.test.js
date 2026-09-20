import { generateRandomString, encryptPassword, passwordIsCorrect } from "../../../utils/Sicurezza.js";

describe('Test per la funzione generateRandomString', () => {
  it('dovrebbe restituire una stringa della lunghezza specificata', () => {
    const lunghezza = 10;
    const result = generateRandomString(lunghezza);
    expect(result.length).toBe(lunghezza);
  });

  it('dovrebbe restituire una stringa con solo caratteri validi.', () => {
    const lunghezza = 10;
    const validCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const result = generateRandomString(lunghezza);
    for (const char of result) {
      expect(validCharacters.includes(char)).toBe(true);
    }
  });

  it('dovrebbe gestire input interi minori di 1.', () => {
    expect(generateRandomString(0)).toBe('');
    expect(generateRandomString(-5)).toBe('');
  });
});

describe('Test per la funzione encryptPassword', () => {
  it('dovrebbe criptare correttamente la password.', () => {
    const password = "Ciao mondo!!10";
    const saltHex = "n6Rn5rdJinVVrNqRANc4";
    const pepperHex = "13pmcWU1ZAjDFi22U6ANycDY0len2k5H";
    const passwordCriptata =  encryptPassword(password, saltHex, pepperHex);
    expect(passwordCriptata).toBe("f4aa8e68d6abb30f9acfb313b5e0953ad6502eab0109151c1c3135196fd4e256c38407429d25ed9531eba27e34f2963695fa3e7a4776229d3d7256d0513ce6f8");
  });
});

describe('Test per la funzione passwordIsCorrect', () => {
  it('Le 2 password dovrebbero essere uguali.', () => {
    const passwordInserted = "Ciao mondo!!10";
    const passwordDb = "f4aa8e68d6abb30f9acfb313b5e0953ad6502eab0109151c1c3135196fd4e256c38407429d25ed9531eba27e34f2963695fa3e7a4776229d3d7256d0513ce6f8";
    const saltHex = "n6Rn5rdJinVVrNqRANc4";
    const result =  passwordIsCorrect(passwordInserted, passwordDb, saltHex);
    expect(result).toBe(true);
  });

  it('Le 2 password dovrebbero essere diverse.', () => {
    const passwordInserted = "Ciaomondo!!10";
    const passwordDb = "f4aa8e68d6abb30f9acfb313b5e0953ad6502eab0109151c1c3135196fd4e256c38407429d25ed9531eba27e34f2963695fa3e7a4776229d3d7256d0513ce6f8";
    const saltHex = "n6Rn5rdJinVVrNqRANc4";
    const result =  passwordIsCorrect(passwordInserted, passwordDb, saltHex);
    expect(result).toBe(false);
  });
});









