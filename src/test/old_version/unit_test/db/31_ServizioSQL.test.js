import { ServizioSQL } from "../../../../db/ServizioSQL.js";

describe("Test su 'inserimentoServizio'", () => {
  let servizioSQL;

  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per l'inserimento del servizio.", () => {
    const params = { 
      nome: "Taglio capelli", 
      prezzo: 12.34, 
      note: "Note per il nuovo servizio", 
      in_uso: 1
    };
    expect(servizioSQL.params_inserimento_servizio(params)).toEqual([
      `${params.nome}`, 
      `${params.prezzo}`, 
      `${params.note}`, 
      params.in_uso
    ]);
  });
});

describe("Test su 'selezioneServizi'", () => {
  let servizioSQL;

  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });

  test("test 1: query con note e con in uso = Si", () => {
    const params = {
      note: "Note selezione servizi", 
      in_uso: "Si"
    }

    const query = servizioSQL.sql_selezione_servizi(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT id, nome, nome AS nome_attuale, prezzo, prezzo AS prezzo_attuale, note, note AS note_attuale, "
      + "CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso, CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso_attuale, "
      + "0 AS tipo_selezione FROM servizio WHERE nome LIKE ? AND (prezzo BETWEEN ? AND ?) " 
      + "AND note LIKE ? AND in_uso = 1;"
    );
  });

  test("test 2: query con note e con in uso = No", () => {
    const params = {
      note: "Note selezione servizi", 
      in_uso: "No"
    }

    const query = servizioSQL.sql_selezione_servizi(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT id, nome, nome AS nome_attuale, prezzo, prezzo AS prezzo_attuale, note, note AS note_attuale, "
      + "CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso, CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso_attuale, "
      + "0 AS tipo_selezione FROM servizio WHERE nome LIKE ? AND (prezzo BETWEEN ? AND ?) " 
      + "AND note LIKE ? AND in_uso = 0;"
    );
  });

  test("test 3: query con note e con in uso = X", () => {
    const params = {
      note: "Note selezione servizi", 
      in_uso: "X"
    }

    const query = servizioSQL.sql_selezione_servizi(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT id, nome, nome AS nome_attuale, prezzo, prezzo AS prezzo_attuale, note, note AS note_attuale, "
      + "CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso, CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso_attuale, "
      + "0 AS tipo_selezione FROM servizio WHERE nome LIKE ? AND (prezzo BETWEEN ? AND ?) " 
      + "AND note LIKE ? AND in_uso = -1;"
    );
  });

  test("test 4: query senza note e con in uso = Si", () => {
    const params = {
      note: "", 
      in_uso: "Si"
    }

    const query = servizioSQL.sql_selezione_servizi(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT id, nome, nome AS nome_attuale, prezzo, prezzo AS prezzo_attuale, note, note AS note_attuale, "
      + "CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso, CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso_attuale, "
      + "0 AS tipo_selezione FROM servizio WHERE nome LIKE ? AND (prezzo BETWEEN ? AND ?) " 
      + "AND (note LIKE ? OR note IS NULL) AND in_uso = 1;"
    );
  });

  test("test 5: query senza note e con in uso = No", () => {
    const params = {
      note: "", 
      in_uso: "No"
    }

    const query = servizioSQL.sql_selezione_servizi(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT id, nome, nome AS nome_attuale, prezzo, prezzo AS prezzo_attuale, note, note AS note_attuale, "
      + "CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso, CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso_attuale, "
      + "0 AS tipo_selezione FROM servizio WHERE nome LIKE ? AND (prezzo BETWEEN ? AND ?) " 
      + "AND (note LIKE ? OR note IS NULL) AND in_uso = 0;"
    );
  });

  test("test 6: query senza note e con in uso = X", () => {
    const params = {
      note: "", 
      in_uso: "X"
    }

    const query = servizioSQL.sql_selezione_servizi(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT id, nome, nome AS nome_attuale, prezzo, prezzo AS prezzo_attuale, note, note AS note_attuale, "
      + "CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso, CASE WHEN in_uso = 1 THEN \"Si\" ELSE \"No\" END AS in_uso_attuale, "
      + "0 AS tipo_selezione FROM servizio WHERE nome LIKE ? AND (prezzo BETWEEN ? AND ?) " 
      + "AND (note LIKE ? OR note IS NULL) AND in_uso = -1;"
    );
  });

  test("test 7: dovrebbe restituire un array con i parametri per la selezione dei servizi con il parametro 'note'.", () => {
    const params_in = { 
      nome: "Taglio capelli", 
      prezzo_min: 12.34, 
      prezzo_max: 56.78, 
      note: "Note per la selezione dei servizi"
    };
    expect(servizioSQL.params_selezione_servizi(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `${params_in.prezzo_min}`, 
      `${params_in.prezzo_max}`, 
      `%${params_in.note}%`
    ]);
  });

  test("test 8: dovrebbe restituire un array con i parametri per la selezione dei servizi senza il parametro 'note'.", () => {
    const params_in = { 
      nome: "Taglio capelli", 
      prezzo_min: 12.34, 
      prezzo_max: 56.78, 
      note: ""
    };
    expect(servizioSQL.params_selezione_servizi(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `${params_in.prezzo_min}`, 
      `${params_in.prezzo_max}`, 
      `%`
    ]);
  });
});

describe("Test su 'selezioneTuttiIServizi'", () => {
  let servizioSQL;

  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la selezione di tutti i servizi.", () => {
    expect(servizioSQL.params_selezione_tutti_i_servizi()).toEqual([]);
  });
});

describe("Test su 'selezioneEntrateServizi'", () => {
  let servizioSQL;

  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la selezione delle entrate dei servizi.", () => {
    const params = {
      primo_anno: "01/02/2023", 
      ultimo_anno: "04/05/2026"
    }

    expect(servizioSQL.params_selezione_entrate_servizi(params)).toEqual([
      `${params.primo_anno}`, 
      `${params.ultimo_anno}`
    ]);
  });
});

describe("Test su 'modificaServizio'", () => {
  let servizioSQL;

  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la modifica di un servizio.", () => {
    const params = { 
      nome: "Taglio capelli", 
      prezzo: 12.34, 
      note: "Note per la modifica del servizio", 
      in_uso: 1, 
      id: 1
    };
    expect(servizioSQL.params_modifica_servizio(params)).toEqual([
      `${params.nome}`, 
      `${params.prezzo}`, 
      `${params.note}`, 
      params.in_uso, 
      `${params.id}` 
    ]);
  });
});

describe("Test su 'eliminazioneServizi'", () => {
  let servizioSQL;

  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });

  test("test 1: query per l'eliminazione dei servizi", () => {
    const ids = [1, 2, 3, 4]

    const query = servizioSQL.sql_eliminazione_servizi(ids).replace(/\s+/g, ' ').trim();

    expect(query).toEqual("DELETE FROM servizio WHERE id IN (?, ?, ?, ?);");
  });

  test("test 2: dovrebbe restituire un array con i parametri per l'eliminazione dei servizi.", () => {
    const ids = [1, 2, 3, 4];
    expect(servizioSQL.params_eliminazione_servizi(ids)).toEqual([]);
  });
});










