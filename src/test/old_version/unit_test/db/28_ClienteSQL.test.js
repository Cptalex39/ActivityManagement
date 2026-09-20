import { ClienteSQL } from "../../../../db/ClienteSQL.js";

describe("Test su 'inserimentoCliente'", () => {
  let clienteSQL;

  beforeEach(() => {
    clienteSQL = new ClienteSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per l'inserimento del cliente con contatto e con email.", () => {
    const params = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note per la ricerca dei clienti"
    };
    expect(clienteSQL.params_inserimento_cliente(params)).toEqual([
      `${params.nome}`, 
      `${params.cognome}`, 
      `${params.contatto}`, 
      `${params.email}`, 
      `${params.note}`
    ]);
  });

  test("test 2: dovrebbe restituire un array con i parametri per l'inserimento del cliente con contatto e senza email.", () => {
    const params = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "", 
      note: "Note per la ricerca dei clienti"
    };
    expect(clienteSQL.params_inserimento_cliente(params)).toEqual([
      `${params.nome}`, 
      `${params.cognome}`, 
      `${params.contatto}`, 
      "",  
      `${params.note}`
    ]);
  });

  test("test 3: dovrebbe restituire un array con i parametri per l'inserimento del cliente senza contatto e con email.", () => {
    const params = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "", 
      email: "mr@gmail.com", 
      note: "Note per la ricerca dei clienti"
    };
    expect(clienteSQL.params_inserimento_cliente(params)).toEqual([
      `${params.nome}`, 
      `${params.cognome}`, 
      "", 
      `${params.email}`,  
      `${params.note}`
    ]);
  });

  test("test 4: dovrebbe restituire un array con i parametri per l'inserimento del cliente senza contatto e senza email.", () => {
    const params = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "", 
      email: "", 
      note: "Note per la ricerca dei clienti"
    };
    expect(clienteSQL.params_inserimento_cliente(params)).toEqual([
      `${params.nome}`, 
      `${params.cognome}`,
      "", 
      "",  
      `${params.note}`
    ]);
  });
});

describe("Test su 'selezioneClienti'", () => {
  let clienteSQL;

  beforeEach(() => {
    clienteSQL = new ClienteSQL();
  });

  test("test 1: query con note", () => {
    const params = {
      note: "Note ricerca clienti",
    }

    const query = clienteSQL.sql_selezione_clienti(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT"
      + " id, nome, cognome, contatto, contatto AS contatto_attuale, email, email AS email_attuale, note, note AS note_attuale,"
      + " 0 AS tipo_selezione FROM cliente WHERE nome LIKE ? AND cognome LIKE ? AND contatto LIKE ? AND email LIKE ?"
      + " AND note LIKE ?;"
    );
  });

  test("test 2: query senza note", () => {
    const params = {
      note: "",
    }

    const query = clienteSQL.sql_selezione_clienti(params).replace(/\s+/g, ' ').trim();

    expect(query).toEqual(
        "SELECT"
      + " id, nome, cognome, contatto, contatto AS contatto_attuale, email, email AS email_attuale, note, note AS note_attuale,"
      + " 0 AS tipo_selezione FROM cliente WHERE nome LIKE ? AND cognome LIKE ? AND contatto LIKE ? AND email LIKE ?"
      + " AND (note LIKE ? OR note IS NULL);"
    );
  });

  test("test 3: dovrebbe restituire un array con i parametri per la selezione dei clienti con il parametro 'note'.", () => {
    const params_in = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note per la ricerca dei clienti"
    };
    expect(clienteSQL.params_selezione_clienti(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `%${params_in.cognome}%`, 
      `%${params_in.contatto}%`, 
      `%${params_in.email}%`, 
      `%${params_in.note}%`
    ]);
  });

  test("test 4: dovrebbe restituire un array con i parametri per la selezione dei clienti senza il parametro 'note'.", () => {
    const params_in = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: ""
    };
    expect(clienteSQL.params_selezione_clienti(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `%${params_in.cognome}%`, 
      `%${params_in.contatto}%`, 
      `%${params_in.email}%`, 
      `%`
    ]);
  });
});

describe("Test su 'selezioneTuttiIClienti'", () => {
  let clienteSQL;

  beforeEach(() => {
    clienteSQL = new ClienteSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la selezione di tutti i clienti.", () => {
    expect(clienteSQL.params_selezione_tutti_i_clienti()).toEqual([]);
  });
});

describe("Test su 'modificaCliente'", () => {
  let clienteSQL;

  beforeEach(() => {
    clienteSQL = new ClienteSQL();
  });

  test("test 1: dovrebbe restituire un array con i parametri per la modifica di un cliente.", () => {
    const params = { 
      id: 1, 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com", 
      note: "Note per la modifica del cliente"
    };
    expect(clienteSQL.params_modifica_cliente(params)).toEqual([
      `${params.contatto}`, 
      `${params.email}`, 
      `${params.note}`, 
      `${params.id}` 
    ]);
  });
});

describe("Test su 'eliminazioneClienti'", () => {
  let clienteSQL;

  beforeEach(() => {
    clienteSQL = new ClienteSQL();
  });

  test("test 1: query per l'eliminazione dei clienti", () => {
    const ids = [1, 2, 3, 4]

    const query = clienteSQL.sql_eliminazione_clienti(ids).replace(/\s+/g, ' ').trim();

    expect(query).toEqual("DELETE FROM cliente WHERE id IN ([1, 2, 3, 4])");
  });

  test("test 2: dovrebbe restituire un array con i parametri per l'eliminazione dei clienti.", () => {
    const ids = [1, 2, 3, 4];
    expect(clienteSQL.params_eliminazione_clienti(ids)).toEqual([]);
  });
});










