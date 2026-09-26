import { SpesaSQL } from "../../../../../storage/SpesaSQL";

describe("Test su 'inserimentoSpesa'", () => {
  let spesaSQL;
  
  beforeEach(() => {
    spesaSQL = new SpesaSQL();
  });
  
  /** RT_UT_SpeSQL_InsSpe_01 **/
  test("Dovrebbe restituire un array con i parametri per l'inserimento della spesa.", () => {
    const params = { 
      nome: "Test nome spesa", 
      giorno: "02/04/2026",
      descrizione: "Test descrizione spesa",  
      totale: 123.456, 
      note: "Test note spesa."
    };
    expect(spesaSQL.params_inserimento_spesa(params)).toEqual([
      `${params.nome}`, 
      `${params.giorno}`, 
      `${params.descrizione}`, 
      `${params.totale}`, 
      `${params.note}`
    ]);
  });
});

describe("Test su 'selezioneSpese'", () => {
  let spesaSQL;

  beforeEach(() => {
    spesaSQL = new SpesaSQL();
  });

  /** RT_UT_SpeSQL_SelSpe_01 **/
  test("Query per la selezione delle spese con la descrizione e con le note", () => {
    const params = {
      descrizione: "Test descrizione selezione spese.", 
      note: "Test note selezione spese."
    }

    const query = spesaSQL.sql_selezione_spese(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
          "SELECT id, nome, descrizione, descrizione AS descrizione_attuale, totale, totale AS totale_attuale, "
        + "DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno, DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno_attuale, note, note AS note_attuale, "
        + "0 AS tipo_selezione FROM spesa WHERE nome LIKE ? AND (totale BETWEEN ? AND ?) AND (giorno BETWEEN ? AND ?) "
        + "AND descrizione LIKE ? " 
        + "AND note LIKE ?;"
    );
  });

  /** RT_UT_SpeSQL_SelSpe_02 **/
  test("Query per la selezione delle spese con la descrizione e senza le note", () => {
    const params = {
      descrizione: "Test descrizione selezione spese.", 
      note: ""
    }

    const query = spesaSQL.sql_selezione_spese(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
          "SELECT id, nome, descrizione, descrizione AS descrizione_attuale, totale, totale AS totale_attuale, "
        + "DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno, DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno_attuale, note, note AS note_attuale, "
        + "0 AS tipo_selezione FROM spesa WHERE nome LIKE ? AND (totale BETWEEN ? AND ?) AND (giorno BETWEEN ? AND ?) "
        + "AND descrizione LIKE ? " 
        + "AND (note LIKE ? OR note IS NULL);"
    );
  });

  /** RT_UT_SpeSQL_SelSpe_03 **/
  test("Query per la selezione delle spese senza la descrizione e con le note", () => {
    const params = {
      descrizione: "", 
      note: "Test note selezione spese."
    }

    const query = spesaSQL.sql_selezione_spese(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
          "SELECT id, nome, descrizione, descrizione AS descrizione_attuale, totale, totale AS totale_attuale, "
        + "DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno, DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno_attuale, note, note AS note_attuale, "
        + "0 AS tipo_selezione FROM spesa WHERE nome LIKE ? AND (totale BETWEEN ? AND ?) AND (giorno BETWEEN ? AND ?) "
        + "AND (descrizione LIKE ? OR descrizione IS NULL) " 
        + "AND note LIKE ?;"
    );
  });

  /** RT_UT_SpeSQL_SelSpe_04 **/
  test("Query per la selezione delle spese senza la descrizione e senza le note", () => {
    const params = {
      descrizione: "", 
      note: ""
    }

    const query = spesaSQL.sql_selezione_spese(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
          "SELECT id, nome, descrizione, descrizione AS descrizione_attuale, totale, totale AS totale_attuale, "
        + "DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno, DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno_attuale, note, note AS note_attuale, "
        + "0 AS tipo_selezione FROM spesa WHERE nome LIKE ? AND (totale BETWEEN ? AND ?) AND (giorno BETWEEN ? AND ?) "
        + "AND (descrizione LIKE ? OR descrizione IS NULL) "
        + "AND (note LIKE ? OR note IS NULL);"
    );
  });

  /** RT_UT_SpeSQL_SelSpe_05 **/
  test("Dovrebbe restituire un array con i parametri per la selezione delle spese con la descrizione e con le note.", () => {
    const params_in = {
      nome: "Test nome spesa", 
      totale_min: 12.34, 
      totale_max: 56.78, 
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026", 
      descrizione: "Test descrizione selezione spese.", 
      note: "Test note selezione spese."
    };
    expect(spesaSQL.params_selezione_spese(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `${params_in.totale_min}`, 
      `${params_in.totale_max}`, 
      `${params_in.primo_giorno}`, 
      `${params_in.ultimo_giorno}`, 
      `%${params_in.descrizione}%`, 
      `%${params_in.note}%`, 
    ]);
  });

  /** RT_UT_SpeSQL_SelSpe_06 **/
  test("Dovrebbe restituire un array con i parametri per la selezione delle spese con la descrizione e senza le note.", () => {
    const params_in = {
      nome: "Test nome spesa", 
      totale_min: 12.34, 
      totale_max: 56.78, 
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026", 
      descrizione: "Test descrizione selezione spese.", 
      note: ""
    };
    expect(spesaSQL.params_selezione_spese(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `${params_in.totale_min}`, 
      `${params_in.totale_max}`, 
      `${params_in.primo_giorno}`, 
      `${params_in.ultimo_giorno}`, 
      `%${params_in.descrizione}%`, 
      `%`, 
    ]);
  });

  /** RT_UT_SpeSQL_SelSpe_07 **/
  test("Dovrebbe restituire un array con i parametri per la selezione delle spese senza la descrizione e con le note.", () => {
    const params_in = {
      nome: "Test nome spesa", 
      totale_min: 12.34, 
      totale_max: 56.78, 
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026", 
      descrizione: "", 
      note: "Test note selezione spese."
    };
    expect(spesaSQL.params_selezione_spese(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `${params_in.totale_min}`, 
      `${params_in.totale_max}`, 
      `${params_in.primo_giorno}`, 
      `${params_in.ultimo_giorno}`, 
      `%`, 
      `%${params_in.note}%`, 
    ]);
  });

  /** RT_UT_SpeSQL_SelSpe_08 **/
  test("Dovrebbe restituire un array con i parametri per la selezione delle spese senza la descrizione e senza le note.", () => {
    const params_in = {
      nome: "Test nome spesa", 
      totale_min: 12.34, 
      totale_max: 56.78, 
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026", 
      descrizione: "", 
      note: ""
    };
    expect(spesaSQL.params_selezione_spese(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `${params_in.totale_min}`, 
      `${params_in.totale_max}`, 
      `${params_in.primo_giorno}`, 
      `${params_in.ultimo_giorno}`, 
      `%`, 
      `%`, 
    ]);
  });
});

describe("Test su 'modificaSpesa'", () => {
  let spesaSQL;

  beforeEach(() => {
    spesaSQL = new SpesaSQL();
  });

  /** RT_UT_SpeSQL_ModSpe_01 **/
  test("Dovrebbe restituire un array con i parametri per la modifica di una spesa.", () => {
    const params = { 
      descrizione: "Test descrizione spesa.", 
      totale: 123.456, 
      giorno: "02/04/2026", 
      note: "Test note spesa.", 
      id: 1
    };
    expect(spesaSQL.params_modifica_spesa(params)).toEqual([
      `${params.descrizione}`, 
      `${params.totale}`, 
      `${params.giorno}`, 
      `${params.note}`, 
      `${params.id}` 
    ]);
  });
});

describe("Test su 'eliminazioneSpese'", () => {
  let spesaSQL;

  beforeEach(() => {
    spesaSQL = new SpesaSQL();
  });

  /** RT_UT_SpeSQL_EliSpe_01 **/
  test("Query per l'eliminazione delle spese", () => {
    const ids = [1, 2, 3, 4]

    const query = spesaSQL.sql_eliminazione_spese(ids).replace(/\s+/g, ' ').trim();

    expect(query).toEqual("DELETE FROM spesa WHERE id IN (?, ?, ?, ?);");
  });

  /** RT_UT_SpeSQL_EliSpe_02 **/
  test("Dovrebbe restituire un array con i parametri per l'eliminazione delle spese.", () => {
    expect(spesaSQL.params_eliminazione_spese()).toEqual([]);
  });
});

describe("Test su 'eliminazioneSpeseRangeGiorni'", () => {
  let spesaSQL;

  beforeEach(() => {
    spesaSQL = new SpesaSQL();
  });

  /** RT_UT_SpeSQL_EliSpeRngGrn_01 **/
  test("Dovrebbe restituire un array con i parametri per l'eliminazione delle spese presenti in un range di giorni.", () => {
    const params = {
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026"
    };
    expect(spesaSQL.params_eliminazione_spese_range_giorni(params)).toEqual([
      `${params.primo_giorno}`,
      `${params.ultimo_giorno}`,
    ]);
  });
});









