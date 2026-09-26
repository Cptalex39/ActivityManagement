import CryptoJS from 'crypto-js';
import { PEPPER_HEX, generateRandomString, encryptPassword, passwordIsCorrect } from '../../../../utils/Sicurezza';

describe('Vari test su "PEPPER_HEX"', () => {
  /** RT_UT_Sic_PepHex_01 **/
  test('E\' definita come stringa non vuota di 32 caratteri', () => {
    expect(typeof PEPPER_HEX).toBe('string');
    expect(PEPPER_HEX).toHaveLength(32);
  });
});

describe('Vari test su "generateRandomString"', () => {
  /** RT_UT_Sic_GenRndStr_01 **/
  test('length > 0', () => {
    expect(generateRandomString(32)).toHaveLength(32);
  });

  /** RT_UT_Sic_GenRndStr_02 **/
  test('length = 0', () => {
    expect(generateRandomString(0)).toHaveLength(0);
  });

  /** RT_UT_Sic_GenRndStr_03 **/
  test('La stringa casuale generata usa solo caratteri alfanumerici consentiti', () => {
    const result = generateRandomString(200);
    expect(result).toMatch(/^[A-Za-z0-9]*$/);
  });

  /** RT_UT_Sic_GenRndStr_04 **/
  test('length < 0', () => {
    expect(generateRandomString(-5)).toBe('');
  });
});

describe('Vari test su "encryptPassword"', () => {
  const password = "PassWord10!!";
  const saltHex = "abcd1234";

  /** RT_UT_Sic_EncPsw_01 **/
  test('Produce un hash esadecimale SHA512 (128 caratteri)', () => {
    const result = encryptPassword(password, saltHex, PEPPER_HEX);
    expect(result).toHaveLength(128);
    expect(result).toMatch(/^[a-f0-9]{128}$/);
  });

  /** RT_UT_Sic_EncPsw_02 **/
  test('"encryptPassword" è deterministica: stessi input producono lo stesso hash', () => {
    const hash1 = encryptPassword(password, saltHex, PEPPER_HEX);
    const hash2 = encryptPassword(password, saltHex, PEPPER_HEX);
    expect(hash1).toBe(hash2);
  });

  /** RT_UT_Sic_EncPsw_03 **/
  test('"encryptPassword" produce hash differenti cambiando la password', () => {
    const hash1 = encryptPassword("PassWord10!!", saltHex, PEPPER_HEX);
    const hash2 = encryptPassword("PassWord20!!", saltHex, PEPPER_HEX);
    expect(hash1).not.toBe(hash2);
  });

  /** RT_UT_Sic_EncPsw_04 **/
  test('"encryptPassword" produce hash differenti cambiando il saltHex', () => {
    const hash1 = encryptPassword(password, "SaltHex1", PEPPER_HEX);
    const hash2 = encryptPassword(password, "SaltHex2", PEPPER_HEX);
    expect(hash1).not.toBe(hash2);
  });

  /** RT_UT_Sic_EncPsw_05 **/
  test('"encryptPassword" produce hash differenti cambiando il pepperHex', () => {
    const hash1 = encryptPassword(password, saltHex, "PepperHex1");
    const hash2 = encryptPassword(password, saltHex, "PepperHex2");
    expect(hash1).not.toBe(hash2);
  });

  /** RT_UT_Sic_EncPsw_06 **/
  test('L\'hash di "encryptPassword" corrisponde al calcolo manuale con CryptoJS.SHA512', () => {
    const expected = CryptoJS.SHA512(password + saltHex + PEPPER_HEX).toString(CryptoJS.enc.Hex);
    expect(encryptPassword(password, saltHex, PEPPER_HEX)).toBe(expected);
  });

  /** RT_UT_Sic_EncPsw_07 **/
  test('dovrebbe criptare correttamente la password.', () => {
    const password = "Ciao mondo!!10";
    const saltHex = "n6Rn5rdJinVVrNqRANc4";
    const pepperHex = "13pmcWU1ZAjDFi22U6ANycDY0len2k5H";
    const passwordCriptata =  encryptPassword(password, saltHex, pepperHex);
    expect(passwordCriptata).toBe("f4aa8e68d6abb30f9acfb313b5e0953ad6502eab0109151c1c3135196fd4e256c38407429d25ed9531eba27e34f2963695fa3e7a4776229d3d7256d0513ce6f8");
  });
});

describe('Vari test su "passwordIsCorrect"', () => {
  const password = "PassWord10!!";
  const saltHex = "abcd1234";

  /** RT_UT_Sic_PswIsCrct_01 **/
  test('Ritorna true se la password inserita corrisponde a quella salvata', () => {
    const passwordDb = encryptPassword(password, saltHex, PEPPER_HEX);
    expect(passwordIsCorrect(password, passwordDb, saltHex)).toBe(true);
  });

  /** RT_UT_Sic_PswIsCrct_02 **/
  test('Ritorna false se la password inserita è sbagliata', () => {
    const passwordDb = encryptPassword(password, saltHex, PEPPER_HEX);
    expect(passwordIsCorrect('WrongPassword10!!', passwordDb, saltHex)).toBe(false);
  });

  /** RT_UT_Sic_PswIsCrct_03 **/
  test('Ritorna false se il saltHex usato per la verifica è diverso da quello originale', () => {
    const passwordDb = encryptPassword(password, saltHex, PEPPER_HEX);
    expect(passwordIsCorrect(password, passwordDb, 'SaltHexDiverso')).toBe(false);
  });

  /** RT_UT_Sic_PswIsCrct_04 **/
  test('Ritorna false confrontando con un hash nel db manomesso', () => {
    const passwordDb = encryptPassword(password, saltHex, PEPPER_HEX);
    const hashManomesso = passwordDb.slice(0, -1) + (passwordDb.endsWith('a') ? 'b' : 'a');
    expect(passwordIsCorrect(password, hashManomesso, saltHex)).toBe(false);
  });
});









