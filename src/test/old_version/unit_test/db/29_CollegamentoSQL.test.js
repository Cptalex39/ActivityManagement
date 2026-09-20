import { CollegamentoSQL } from "../../../../db/CollegamentoSQL.js";

describe("Test su 'inserimentoCollegamento'", () => {
  let collegamentoSQL;

  beforeEach(() => {
    collegamentoSQL = new CollegamentoSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per l'inserimento del collegamento.", () => {
    const params = { 
      id_lavoro: 2, 
      id_servizio: 4, 
      quantita: 8
    };
    expect(collegamentoSQL.params_inserimento_collegamento(params)).toEqual([
      `${params.id_lavoro}`, 
      `${params.id_servizio}`, 
      `${params.quantita}`
    ]);
  });
});

describe("Test su 'selezioneCollegamentiLavoro'", () => {
  let collegamentoSQL;

  beforeEach(() => {
    collegamentoSQL = new CollegamentoSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la selezione dei collegamenti di un lavoro.", () => {
    const params = { 
      id_lavoro: 2, 
      id_servizio: 4, 
      quantita: 8
    };
    expect(collegamentoSQL.params_selezione_collegamenti_lavoro(params)).toEqual([
      `${params.id_lavoro}`
    ]);
  });
});

describe("Test su 'eliminazioneCollegamentiLavoro'", () => {
  let collegamentoSQL;

  beforeEach(() => {
    collegamentoSQL = new CollegamentoSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per l'eliminazione dei collegamenti di un lavoro.", () => {
    const params = { 
      id_lavoro: 2, 
      id_servizio: 4, 
      quantita: 8
    };
    expect(collegamentoSQL.params_eliminazione_collegamenti_lavoro(params)).toEqual([
      `${params.id_lavoro}`
    ]);
  });
});










