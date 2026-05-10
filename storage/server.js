// node_modules
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
// storage
import { datiDB } from './DB.js';
import { ClienteSQL } from './ClienteSQL.js';
import { ServizioSQL } from './ServizioSQL.js'
import { SpesaSQL } from './SpesaSQL.js';
import { AutenticazioneSQL } from './AutenticazioneSQL.js';
import { CartaSQL } from './CartaSQL.js';
import { OrdineSQL } from './OrdineSQL.js';


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.json("from backend side");
})

app.listen(8081, () => {
  console.log("Porta 8081 in ascolto.");
})

app.listen(3000, () => {
  console.log('Server in esecuzione sulla porta 3000');
});

/************************************************** Database **************************************************/

const db = mysql.createConnection({
  host: datiDB.host, 
  user: datiDB.user, 
  password: datiDB.password, 
  database: datiDB.database, 
})

db.connect(err => {
  if (err) {
    console.error('Errore di connessione al database:', err.stack);
    return;
  }
  console.log('Connesso al database.');
});

const executeQuery = (sql, params, connection = db) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

const beginTransaction = (connection = db) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

const commitTransaction = (connection = db) => {
  return new Promise((resolve, reject) => {
    connection.commit(err => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

const rollbackTransaction = (connection = db) => {
  return new Promise((resolve) => {
    connection.rollback(() => {
      return resolve();
    });
  });
};

/*************************************************** Autenticazione **************************************************/

app.post("/LOGIN", async (req, res) => {
  const autenticazioneSQL = new AutenticazioneSQL();
  const clienteSQL = new ClienteSQL();
  try {
    await beginTransaction();
    let sql = "";
    let params = [];
    switch(req.body.tipo_utente) {
      case "utente":
        console.log("UTENTE")
        sql = autenticazioneSQL.SQL_SELEZIONE_UTENTE;
        params = autenticazioneSQL.params_selezione_utente(req.body);
        break;
      case "cliente":
        console.log("CLIENTE");
        sql = clienteSQL.SQL_SELEZIONE_CLIENTE;
        params = clienteSQL.params_selezione_cliente(req.body);
        break;
      default:
        console.log("Errore, riprova piu\' tardi (Error, please try again later.)");
        return;
    }
    const [utentiResult] = await executeQuery(sql, params);
    await commitTransaction();
    const utente = utentiResult;
    return res.status(200).json({ utente: utente });
  } 
  catch (err) {
    await rollbackTransaction();
    console.error('Errore durante il login: ', err);
    return res.status(500).json({ message: 'Errore del server.', error: err.message });
  }
});

app.post("/MODIFICA_PROFILO_UTENTE", async (req, res) => {
  const autenticazioneSQL = new AutenticazioneSQL();
  try {
    await beginTransaction();
    const response = await executeQuery(autenticazioneSQL.sql_modifica_utente(req.body), autenticazioneSQL.params_modifica_utente(req.body));
    await commitTransaction();
    return res.status(200).json({ result: response });
  } 
  catch (err) {
    await rollbackTransaction();
    console.error('Errore durante la modifica del profilo: ', err);
    return res.status(500).json({ message: 'Errore del server.' });
  }
});

app.post("/MODIFICA_PROFILO_CLIENTE", async (req, res) => {
  const clienteSQL = new ClienteSQL();
  try {
    await beginTransaction();
    await executeQuery(clienteSQL.sql_modifica_cliente(req.body), clienteSQL.params_modifica_cliente(req.body));
    await commitTransaction();
    return res.status(200).json();
  } 
  catch (err) {
    await rollbackTransaction();
    console.error('Errore durante la modifica del profilo: ', err);
    return res.status(500).json({ message: 'Errore del server.' });
  }
});

/*************************************************************************************************************/

/************************************************** Item **************************************************/

app.post("/INSERISCI_ITEM", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  const cartaSQL = new CartaSQL();
  let sql = "";
  let params = [];
  let sql_inserimento_collegamento = "";
  let params_inserimento_collegamento = [];
  switch(req.body.tipo_item) {
    case "cliente":
      sql = clienteSQL.SQL_INSERIMENTO_CLIENTE;
      params = clienteSQL.params_inserimento_cliente(req.body);
      break;
    case "servizio":
      sql = servizioSQL.SQL_INSERIMENTO_SERVIZIO;
      req.body["prezzo"] = req.body["prezzo"].substring(0, req.body["prezzo"].indexOf('€')).trim();
      params = servizioSQL.params_inserimento_servizio(req.body);
      break;
    case "spesa":
      sql = spesaSQL.SQL_INSERIMENTO_SPESA;
      req.body["totale"] = req.body["totale"].substring(0, req.body["totale"].indexOf('€')).trim();
      params = spesaSQL.params_inserimento_spesa(req.body);
      break;
    case "carta":
      sql = cartaSQL.SQL_INSERIMENTO_CARTA;
      params = cartaSQL.params_inserimento_carta(req.body);
      break;
    default:
      //alert("Errore, riprova piu\' tardi (Error, please try again later.)");
      console.log("Errore, riprova piu\' tardi (Error, please try again later.)");
      return;
  }

  try {
    await beginTransaction();
    
    const result = await executeQuery(sql, params);
    const insertedId = result.insertId; // ottengo l'id inserito
    const collegamenti = [];

    await commitTransaction();
    return res.status(200).json({ id: insertedId, collegamenti: collegamenti });
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json();
    }
    return res.status(500).json();
  }
});

app.post("/INSERISCI_ORDINE", async(req, res) => {
  const ordineSQL = new OrdineSQL();
  const clienteSQL = new ClienteSQL();

  try {
    await beginTransaction();

    // Inserimento ordine con i nuovi campi
    await executeQuery(ordineSQL.SQL_INSERIMENTO_ORDINE, ordineSQL.params_inserimento_ordine(req.body));
    if(req.body.indirizzo !== req.body.indirizzo_attuale) {
      const dati = {
        indirizzo: req.body.indirizzo, 
        id: req.body.id_cliente, 
      }
      await executeQuery(clienteSQL.SQL_MODIFICA_INDIRIZZO, clienteSQL.params_modifica_indirizzo(dati));
    }

    await commitTransaction();
    return res.status(200).json({});
  }
  catch (err) {
    console.log("Errore inserimento ordine: ", err);
    await rollbackTransaction();
    return res.status(500).json({ message: 'Errore durante la creazione dell\'ordine.' });
  }
});

app.post("/VISUALIZZA_ITEMS", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  const ordineSQL = new OrdineSQL();
  
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "cliente":
      sql = clienteSQL.sql_selezione_clienti(req.body);
      params = clienteSQL.params_selezione_clienti(req.body);
      break;
    case "servizio":
      sql = servizioSQL.sql_selezione_servizi(req.body);
      params = servizioSQL.params_selezione_servizi(req.body);
      break;
    case "spesa":
      sql = spesaSQL.sql_selezione_spese(req.body);
      params = spesaSQL.params_selezione_spese(req.body);
      break;
    case "ordine":
      console.log(req.body.metodo_pagamento);
      sql = ordineSQL.sql_selezione_ordini(req.body);
      params = ordineSQL.params_selezione_ordini(req.body);
      break;
    default:
      return res.status(500).json();
  }

  try {
    await beginTransaction();

    const result = await executeQuery(sql, params);
    
    await commitTransaction();
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    return res.status(500).json();
  }
});

/************************************************** CR: Catalogo **************************************************/

// CR: Endpoint per ottenere il catalogo completo (servizi + prodotti in uso)
app.post("/VISUALIZZA_CATALOGO", async(req, res) => {
  const servizioSQL = new ServizioSQL();
  let sql = "";
  let params = [];

  switch(req.body.filtro_tipo) {
    case "prodotto":
      sql = servizioSQL.SQL_SELEZIONE_CATALOGO_PRODOTTI;
      break;
    case "servizio":
      sql = servizioSQL.SQL_SELEZIONE_CATALOGO_SERVIZI;
      break;
    default:
      // tutti
      sql = servizioSQL.SQL_SELEZIONE_CATALOGO;
      break;
  }
  params = servizioSQL.params_selezione_catalogo();

  try {
    const result = await executeQuery(sql, params);
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

/*************************************************************************************************************/

app.post("/OTTIENI_TUTTI_GLI_ITEMS", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const servizioSQL = new ServizioSQL();
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "cliente": 
      sql = clienteSQL.SQL_SELEZIONE_TUTTI_I_CLIENTI;
      params = clienteSQL.params_selezione_tutti_i_clienti();
      break;
    case "servizio":
      sql = servizioSQL.SQL_SELEZIONE_TUTTI_I_SERVIZI;
      params = servizioSQL.params_selezione_tutti_i_servizi();
      break;
    default:
      return res.status(500).json();
  }

  try {
    const result = await executeQuery(sql, params);
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    return res.status(500).json();
  }
});

app.post("/ELIMINA_ITEM", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const cartaSQL = new CartaSQL();
  let sql = "";
  let params = [];

  switch(req.body.tipo_item) {
    case "cliente":
      sql = clienteSQL.SQL_ELIMINAZIONE_CLIENTE;
      params = clienteSQL.params_eliminazione_cliente(req.body);
      break;
    case "collegamento_carta_cliente":
      sql = cartaSQL.SQL_ELIMINAZIONE_COLLEGAMENTO_CARTA_CLIENTE;
      params = cartaSQL.params_eliminazione_collegamento_carta_cliente(req.body);
      break;
    /*
    case "carta":
      sql = cartaSQL.SQL_ELIMINAZIONE_CARTA;
      params = cartaSQL.params_eliminazione_carta(req.body);
      break;
    */
    default:
      return res.status(500).json();
  }

  try {
    await executeQuery(sql, params);
    return res.status(200).json();
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/ELIMINA_ITEMS", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  let sql = "";
  switch(req.body.tipo_item) {
    case "cliente":
      sql = clienteSQL.sql_eliminazione_clienti(req.body.ids);
      break;
    case "servizio":
      sql = servizioSQL.sql_eliminazione_servizi(req.body.ids);
      break;
    case "spesa":
      sql = spesaSQL.sql_eliminazione_spese(req.body.ids);
      break;
    default:
      return res.status(500).json();
  }

  try {
    await executeQuery(sql, req.body.ids);
    return res.status(200).json();
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/ELIMINA_ITEMS_RANGE_GIORNI", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "spesa":
      sql = spesaSQL.SQL_ELIMINAZIONE_SPESE_RANGE_GIORNI;
      params = spesaSQL.params_eliminazione_spese_range_giorni(req.body);
      break;
    default:
      return res.status(500).json();
  }

  try {
    await executeQuery(sql, params);
    return res.status(200).json();
  } 
  catch (err) {
    return res.status(500).json();
  }
});

app.post("/MODIFICA_ITEM", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "cliente":
      sql = clienteSQL.SQL_MODIFICA_CLIENTE;
      params = clienteSQL.params_modifica_cliente(req.body.item);
      break;
    case "servizio":
      req.body.item["in_uso"] = (req.body.item.in_uso.toLowerCase() === "si");
      if(req.body.item.prezzo_attuale === req.body.item.prezzo) {
        sql = servizioSQL.SQL_MODIFICA_SERVIZIO;
        params = servizioSQL.params_modifica_servizio(req.body.item);
      }
      else {
        sql = servizioSQL.SQL_INSERIMENTO_SERVIZIO;
        params = servizioSQL.params_inserimento_servizio(req.body.item);
      }
      break;
    case "spesa":
      sql = spesaSQL.SQL_MODIFICA_SPESA;
      params = spesaSQL.params_modifica_spesa(req.body.item);
      break;
    default:
      return res.status(500).json();
  }

  try {
    await beginTransaction();

    let insertedId = 0;
    if(req.body.tipo_item === "servizio") {
      const result = await executeQuery(sql, params);
      insertedId = result.insertId; // ottengo l'id inserito
      await commitTransaction();
    }
    else {
      await executeQuery(sql, params);
      await commitTransaction();
    }
    if(req.body.tipo_item === "servizio" && req.body.item.prezzo_attuale !== req.body.item.prezzo) {
      return res.status(200).json({ id: insertedId });
    }
    else {
      return res.status(200).json();
    }
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    if (err.code === 'ER_DUP_ENTRY') {
      return (req.body.tipo_item === "servizio") ? res.status(200).json() : res.status(400).json();
    }
    return res.status(500).json();
  }
});

app.post("/RICHIESTA_ELIMINAZIONE", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  let sql = "";
  let params = [];

  sql = clienteSQL.SQL_RICHIESTA_ELIMINAZIONE;
  params = clienteSQL.params_richiesta_eliminazione(req.body);

  try {
    const result = await executeQuery(sql, params);
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/OTTIENI_CLIENTI_DA_ELIMINARE", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  let sql = "";
  let params = [];
  
  sql = clienteSQL.SQL_OTTIENI_CLIENTI_DA_ELIMINARE; 
  params = clienteSQL.params_ottieni_clienti_da_eliminare();
  
  try {
    await beginTransaction();

    const result = await executeQuery(sql, params);
       
    await commitTransaction();
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    return res.status(500).json();
  }
});

app.post("/COLLEGAMENTO_CARTA_CLIENTE", async(req, res) => {
  const cartaSQL = new CartaSQL();
  let sql = "";
  let params = [];
  
  sql = cartaSQL.SQL_COLLEGAMENTO_CARTA_CLIENTE;
  params = cartaSQL.params_collegamento_carta_cliente(req.body);
  
  try {
    await beginTransaction();
    const result = await executeQuery(sql, params);
    await commitTransaction();
    return res.status(200).json({});
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json();
    }
    return res.status(500).json();
  }
});

app.post("/OTTENIMENTO_CARTE_CLIENTE", async(req, res) => {
  const cartaSQL = new CartaSQL();
  let sql = "";
  let params = [];
  
  sql = cartaSQL.SQL_OTTENIMENTO_CARTE_CLIENTE; 
  params = cartaSQL.params_ottenimento_carte_cliente(req.body);
  
  try {
    await beginTransaction();

    const result = await executeQuery(sql, params);
       
    await commitTransaction();
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    return res.status(500).json();
  }
});

app.post("/ELIMINA_CARTA", async(req, res) => {
  const cartaSQL = new CartaSQL();
  
  try {
    await beginTransaction();

    await executeQuery(cartaSQL.SQL_ELIMINA_CARTA, cartaSQL.params_elimina_carta(req.body));
    
    await commitTransaction();
    return res.status(200).json();
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/OTTIENI_PAGAMENTI_DA_CONFERMARE", async(req, res) => {
  const ordineSQL = new OrdineSQL();

  try {
    await beginTransaction();

    const result = await executeQuery(ordineSQL.sql_ottieni_pagamenti_da_confermare(req.body), ordineSQL.params_ottieni_pagamenti_da_confermare(req.body));
    
    await commitTransaction();
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    return res.status(500).json();
  }
});

app.post("/OTTIENI_ORDINI_ULTIME_48_ORE", async(req, res) => {
  const ordineSQL = new OrdineSQL();
  
  try {
    const result = await executeQuery(ordineSQL.SQL_OTTIENI_ORDINI_ULTIME_48_ORE, ordineSQL.params_ottieni_ordini_ultime_48_ore());
    return res.status(200).json({ items: result });
  } 
  catch (err) {
    return res.status(500).json();
  }
});

app.post("/ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE", async(req, res) => {
  const ordineSQL = new OrdineSQL();

  try {
    await executeQuery(ordineSQL.SQL_ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE, ordineSQL.params_eliminazione_pagamento_da_confermare(req.body));
    return res.status(200).json();
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/CONFERMA_PAGAMENTO", async(req, res) => {
  const ordineSQL = new OrdineSQL();

  try {
    await executeQuery(ordineSQL.SQL_CONFERMA_PAGAMENTO, ordineSQL.params_conferma_pagamento(req.body));
    return res.status(200).json();
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE", async(req, res) => {
  const ordineSQL = new OrdineSQL();

  try {
    const result = await executeQuery(ordineSQL.SQL_OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE, ordineSQL.params_ottieni_numero_pagamenti_non_confermati_cliente(req.body));
    return res.status(200).json({ result: result }); 
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/OTTIENI_PASSWORD", async(req, res) => {
  const clienteSQL = new ClienteSQL();

  try {
    const result = await executeQuery(clienteSQL.SQL_OTTIENI_PASSWORD, clienteSQL.params_ottieni_password(req.body));
    return res.status(200).json({ result: result }); 
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/OTTIENI_PASSWORD_UTENTE", async(req, res) => {
  const autenticazioneSQL = new AutenticazioneSQL();

  try {
    const result = await executeQuery(autenticazioneSQL.SQL_OTTIENI_PASSWORD, autenticazioneSQL.params_ottieni_password(req.body));
    return res.status(200).json({ result: result }); 
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/ESEGUI_ANALISI", async(req, res) => {
  const spesaSQL = new SpesaSQL();
  const ordineSQL = new OrdineSQL();

  try {
    await beginTransaction();

    let result = await executeQuery(spesaSQL.SQL_OTTIENI_USCITE_SPESE, spesaSQL.params_ottieni_uscite_spese(req.body));
    const usciteAnno = result;
    result = await executeQuery(ordineSQL.SQL_OTTIENI_ENTRATE_ORDINI, ordineSQL.params_ottieni_entrate_ordini(req.body));
    const entrateAnno = result;

    await commitTransaction();
    return res.status(200).json({ uscite_anno: usciteAnno, entrate_anno: entrateAnno });
  } 
  catch (err) {
    console.log(err);
    await rollbackTransaction();
    return res.status(500).json();
  }
});







