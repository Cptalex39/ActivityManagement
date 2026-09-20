import { AutenticazioneSQL } from "../../../../db/AutenticazioneSQL.js";
import { encryptPassword, generateRandomString, PEPPER_HEX } from "../../../utils/Sicurezza.js";


jest.mock("../../../utils/Sicurezza.js", () => ({
  encryptPassword: jest.fn((password, salt, pepper) => `hashed_${password}_${salt}_${pepper}`),
  generateRandomString: jest.fn(() => "mocked_salt"),
  PEPPER_HEX: "mocked_pepper"
}));

describe("Test su 'selezioneUtente'", () => {
  let autenticazioneSQL;

  beforeEach(() => {
    autenticazioneSQL = new AutenticazioneSQL();
  });

  test("test 1: dovrebbe restituire un array con l'username.", () => {
    const params = { username: "utenteTest" };
    expect(autenticazioneSQL.params_selezione_utente(params)).toEqual(["utenteTest"]);
  });
});

describe("Test su 'modificaUtente'", () => {
  let autenticazioneSQL;

  beforeEach(() => {
    autenticazioneSQL = new AutenticazioneSQL();
  });

  test("test 1: stringa sql con modifica password", () => {
    const params = {
      nuova_password: "nuovaPassword",
    }

    const query = autenticazioneSQL.sql_modifica_utente(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual("UPDATE `utente` SET `username` = ?, `note` = ? , `password` = ?, `salt_hex` = ? WHERE `username` = ? AND `password` = ?;");
  });

  test("test 2: stringa sql senza modifica password", () => {
    const params = {
      nuova_password: "",
    }

    const query = autenticazioneSQL.sql_modifica_utente(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual("UPDATE `utente` SET `username` = ?, `note` = ? WHERE `username` = ? AND `password` = ?;");
  });
  
  test("test 3: dovrebbe restituire un array con i parametri modificati con password modificata", () => {
    const params_in = {
      nuovo_username: "nuovoUsername",
      note: "Note aggiornate",
      nuova_password: "nuovaPassword",
      username_attuale: "usernameAttuale",
      password_attuale: "passwordAttuale",
      salt_hex_db: "saltHexDB"
    };

    const result = autenticazioneSQL.params_modifica_utente(params_in);

    expect(result).toEqual([
      "nuovoUsername", 
      "Note aggiornate", 
      "hashed_nuovaPassword_mocked_salt_mocked_pepper", 
      "mocked_salt",
      "usernameAttuale", 
      "hashed_passwordAttuale_saltHexDB_mocked_pepper"
    ]);
  });

  test("test 4: dovrebbe restituire un array con i parametri modificati senza password modificata", () => {
    const params_in = {
      nuovo_username: "nuovoUsername",
      note: "Note aggiornate",
      nuova_password: "",
      username_attuale: "usernameAttuale",
      password_attuale: "passwordAttuale",
      salt_hex_db: "saltHexDB"
    };

    const result = autenticazioneSQL.params_modifica_utente(params_in);

    expect(result).toEqual([
      "nuovoUsername", 
      "Note aggiornate", 
      "usernameAttuale", 
      "hashed_passwordAttuale_saltHexDB_mocked_pepper"
    ]);
  });
});









