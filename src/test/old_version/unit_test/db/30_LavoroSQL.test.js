import { LavoroSQL } from "../../../../db/LavoroSQL.js";

describe("Test su 'inserimentoLavoro'", () => {
  let lavoroSQL;

  beforeEach(() => {
    lavoroSQL = new LavoroSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per l'inserimento del lavoro.", () => {
    const params = { 
      cliente: "Mario Rossi - 3333300000 - mr@gmail.com", 
      giorno: "02/04/2026", 
      totale: 12.34, 
      note: "Note per il nuovo lavoro."
    };
    expect(lavoroSQL.params_inserimento_lavoro(params)).toEqual([
      `${params.cliente}`, 
      `${params.giorno}`, 
      `${params.totale}`, 
      `${params.note}`
    ]);
  });
});

describe("Test su 'selezioneEntrateLavori'", () => {
  let lavoroSQL;

  beforeEach(() => {
    lavoroSQL = new LavoroSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la selezione delle entrate dei lavori con primo_anno e con ultimo_anno.", () => {
    const params = { 
      primo_anno: "01/02/2023", 
      ultimo_anno: "04/05/2026"
    };
    expect(lavoroSQL.params_selezione_entrate_lavori(params)).toEqual([
      `${params.primo_anno}`, 
      `${params.ultimo_anno}`
    ]);
  });

  test("test 2: dovrebbe restituire un array con i parametri per la selezione delle entrate dei lavori con primo_anno e senza ultimo_anno.", () => {
    const params = { 
      primo_anno: "01/02/2023", 
      ultimo_anno: ""
    };
    expect(lavoroSQL.params_selezione_entrate_lavori(params)).toEqual([
      `${params.primo_anno}`, 
      9999
    ]);
  });

  test("test 3: dovrebbe restituire un array con i parametri per la selezione delle entrate dei lavori senza primo_anno e con ultimo_anno.", () => {
    const params = { 
      primo_anno: "", 
      ultimo_anno: "04/05/2026"
    };
    expect(lavoroSQL.params_selezione_entrate_lavori(params)).toEqual([
      0, 
      `${params.ultimo_anno}`
    ]);
  });

  test("test 4: dovrebbe restituire un array con i parametri per la selezione delle entrate dei lavori senza primo_anno e senza ultimo_anno.", () => {
    const params = { 
      primo_anno: "", 
      ultimo_anno: ""
    };
    expect(lavoroSQL.params_selezione_entrate_lavori(params)).toEqual([
      0, 
      9999
    ]);
  });
});

describe("Test su 'selezioneLavori'", () => {
  let lavoroSQL;

  beforeEach(() => {
    lavoroSQL = new LavoroSQL();
  });

  test("test 1: query per la selezione dei lavori con note", () => {
    const params = {
      note: "Note per la selezione dei lavori."
    }

    const query = lavoroSQL.sql_selezione_lavori(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT 0 AS tipo_selezione, id AS id, cliente AS cliente, DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno, "
      + "DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno_attuale, totale AS totale, totale AS totale_attuale, note AS note, "
      + "note AS note_attuale FROM lavoro WHERE cliente LIKE ? AND (giorno BETWEEN ? AND ?) AND note LIKE ?;"
    );
  });

  test("test 2: query per la selezione dei lavori senza note", () => {
    const params = {
      note: ""
    }

    const query = lavoroSQL.sql_selezione_lavori(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT 0 AS tipo_selezione, id AS id, cliente AS cliente, DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno, "
      + "DATE_FORMAT(giorno, \"%Y-%m-%d\") AS giorno_attuale, totale AS totale, totale AS totale_attuale, note AS note, "
      + "note AS note_attuale FROM lavoro WHERE cliente LIKE ? AND (giorno BETWEEN ? AND ?) AND (note LIKE ? OR note IS NULL);"
    );
  });

  test("test 3: dovrebbe restituire un array con i parametri per la selezione dei lavori con le note.", () => {
    const params_in = {
      cliente: "Mario Rossi", 
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026", 
      note: "Note per la selezione dei lavori."
    };
    expect(lavoroSQL.params_selezione_lavori(params_in)).toEqual([
      `%${params_in.cliente}%`, 
      `${params_in.primo_giorno}`, 
      `${params_in.ultimo_giorno}`, 
      `%${params_in.note}%`, 
    ]);
  });

  test("test 4: dovrebbe restituire un array con i parametri per la selezione dei lavori senza le note.", () => {
    const params_in = {
      cliente: "Mario Rossi", 
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026", 
      note: ""
    }
    expect(lavoroSQL.params_selezione_lavori(params_in)).toEqual([
      `%${params_in.cliente}%`, 
      `${params_in.primo_giorno}`, 
      `${params_in.ultimo_giorno}`, 
      `%`, 
    ]);
  });
});

describe("Test su 'modificaLavoro'", () => {
  let lavoroSQL;

  beforeEach(() => {
    lavoroSQL = new LavoroSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la modifica di un lavoro.", () => {
    const params = { 
      giorno: "02/04/2026", 
      totale: 12.34, 
      note: "Note per la modifica del lavoro", 
      id: 1
    };
    expect(lavoroSQL.params_modifica_lavoro(params)).toEqual([
      `${params.giorno}`, 
      `${params.totale}`, 
      `${params.note}`, 
      `${params.id}` 
    ]);
  });
});

describe("Test su 'eliminazioneLavori'", () => {
  let lavoroSQL;

  beforeEach(() => {
    lavoroSQL = new LavoroSQL();
  });

  test("test 1: query per l'eliminazione dei lavori", () => {
    const ids = [1, 2, 3, 4]

    const query = lavoroSQL.sql_eliminazione_lavori(ids).replace(/\s+/g, ' ').trim();

    expect(query).toEqual("DELETE FROM lavoro WHERE id IN (?, ?, ?, ?);");
  });

  test("test 2: dovrebbe restituire un array con i parametri per l'eliminazione dei lavori.", () => {
    const ids = [1, 2, 3, 4];
    expect(lavoroSQL.params_eliminazione_lavori(ids)).toEqual([]);
  });
});

describe("Test su 'eliminazioneLavoriRangeGiorni'", () => {
  let lavoroSQL;

  beforeEach(() => {
    lavoroSQL = new LavoroSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per l'eliminazione dei lavori presenti in un range di giorni.", () => {
    const params = {
      primo_giorno: "01/02/2023", 
      ultimo_giorno: "04/05/2026"
    };
    expect(lavoroSQL.params_eliminazione_lavori_range_giorni(params)).toEqual([
      `${params.primo_giorno}`,
      `${params.ultimo_giorno}`,
    ]);
  });
});










