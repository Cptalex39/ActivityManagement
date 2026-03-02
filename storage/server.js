// node_modules
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
// storage
import { ClienteSQL } from './ClienteSQL.js';
import { LavoroSQL } from './LavoroSQL.js';
import { ServizioSQL } from './ServizioSQL.js'
import { SpesaSQL } from './SpesaSQL.js';
import { AutenticazioneSQL } from './AutenticazioneSQL.js';
import { CollegamentoSQL } from './CollegamentoSQL.js';


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
    host: "localhost",
    user: "root",
    password: "root",
    database: "activity_management"
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
  try {
    await beginTransaction();
    const [utentiResult] = await executeQuery(autenticazioneSQL.SQL_SELEZIONE_UTENTE, autenticazioneSQL.params_selezione_utente(req.body));
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

app.post("/MODIFICA_PROFILO", async (req, res) => {
  const autenticazioneSQL = new AutenticazioneSQL();
  try {
    await beginTransaction();
    await executeQuery(autenticazioneSQL.sql_modifica_utente(req.body), autenticazioneSQL.params_modifica_utente(req.body));
    await commitTransaction();
    return res.status(200).json();
  } 
  catch (err) {
    await rollbackTransaction();
    console.error('Errore durante il login: ', err);
    return res.status(500).json({ message: 'Errore del server.' });
  }
});

/*************************************************************************************************************/

/************************************************** Item **************************************************/

app.post("/INSERISCI_ITEM", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const lavoroSQL = new LavoroSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  const collegamentoSQL = new CollegamentoSQL();
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
    case "lavoro":
      sql = lavoroSQL.SQL_INSERIMENTO_LAVORO;
      params = lavoroSQL.params_inserimento_lavoro(req.body);
      break;
    case "spesa":
      sql = spesaSQL.SQL_INSERIMENTO_SPESA;
      req.body["totale"] = req.body["totale"].substring(0, req.body["totale"].indexOf('€')).trim();
      params = spesaSQL.params_inserimento_spesa(req.body);
      break;
    default:
      alert("Errore, riprova piu\' tardi (Error, please try again later.)");
      return;
  }

  try {
    await beginTransaction();
    const result = await executeQuery(sql, params);
    const insertedId = result.insertId; // ottengo l'id inserito
    const collegamenti = [];
    if(req.body.tipo_item === "lavoro") {
      for(let servizio of req.body.servizi) {
        if(servizio.quantita > 0) {
          let params_collegamento = {
            id_lavoro: insertedId, 
            id_servizio: servizio.id, 
            quantita: servizio.quantita, 
            prezzo: servizio.prezzo 
          }
          sql_inserimento_collegamento = collegamentoSQL.SQL_INSERIMENTO_COLLEGAMENTO;
          params_inserimento_collegamento = collegamentoSQL.params_inserimento_collegamento(params_collegamento);
          await executeQuery(sql_inserimento_collegamento, params_inserimento_collegamento);
          collegamenti.push(params_collegamento);
        }
      }
    }  
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

app.post("/VISUALIZZA_ITEMS", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const lavoroSQL = new LavoroSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  const collegamentoSQL = new CollegamentoSQL();
  
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
    case "lavoro":
      sql = lavoroSQL.sql_selezione_lavori(req.body);
      params = lavoroSQL.params_selezione_lavori(req.body);
      break;
    case "spesa":
      sql = spesaSQL.sql_selezione_spese(req.body);
      params = spesaSQL.params_selezione_spese(req.body);
      break;
    default:
      return res.status(500).json();
  }

  try {
    await beginTransaction();

    const result = await executeQuery(sql, params);
    if(req.body.tipo_item === "lavoro") {
      const servizi = await executeQuery(servizioSQL.SQL_SELEZIONE_TUTTI_I_SERVIZI, servizioSQL.params_selezione_tutti_i_servizi());
      for(let i = 0; i < result.length; i++) {
        let params = {
          id_lavoro: result[i].id
        }
        result[i]["collegamenti"] = await executeQuery(collegamentoSQL.SQL_SELEZIONE_COLLEGAMENTI_LAVORO, collegamentoSQL.params_selezione_collegamenti_lavoro(params))
        result[i]["collegamenti_attuale"] = result[i]["collegamenti"];
        result[i]["servizi"] = servizi;
      }
    }
    
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

app.post("/VISUALIZZA_ENTRATE_ITEMS", async(req, res) => {
  const lavoroSQL = new LavoroSQL();
  const servizioSQL = new ServizioSQL();
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "lavoro":
      sql = lavoroSQL.SQL_SELEZIONE_ENTRATE_LAVORI;
      params = lavoroSQL.params_selezione_entrate_lavori(req.body);
      break;
    case "servizio":
      sql = servizioSQL.SQL_SELEZIONE_ENTRATE_SERVIZI;
      params = servizioSQL.params_selezione_entrate_servizi(req.body);
      break;
    default:
      console.log("Tipo item non valido.");
      return res.status(500).json();
  }

  try {
    const result = await executeQuery(sql, params);

    return res.status(200).json({ items: result });
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json();
  }
});

app.post("/VISUALIZZA_USCITE_ITEMS", async(req, res) => {
  const spesaSQL = new SpesaSQL();
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "spesa":
      sql = spesaSQL.SQL_SELEZIONE_USCITE_SPESE;
      params = spesaSQL.params_selezione_uscite_spese(req.body);
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

app.post("/ELIMINA_ITEMS", async(req, res) => {
  const clienteSQL = new ClienteSQL();
  const lavoroSQL = new LavoroSQL();
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
    case "lavoro":
      sql = lavoroSQL.sql_eliminazione_lavori(req.body.ids);
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
  const lavoroSQL = new LavoroSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  let sql = "";
  let params = [];
  switch(req.body.tipo_item) {
    case "lavoro":
      sql = lavoroSQL.SQL_ELIMINAZIONE_LAVORI_RANGE_GIORNI; 
      params = lavoroSQL.params_eliminazione_lavori_range_giorni(req.body);
      break;
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
  const lavoroSQL = new LavoroSQL();
  const servizioSQL = new ServizioSQL();
  const spesaSQL = new SpesaSQL();
  const collegamentoSQL = new CollegamentoSQL();
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
    case "lavoro":
      sql = lavoroSQL.SQL_MODIFICA_LAVORO
      params = lavoroSQL.params_modifica_lavoro(req.body.item);
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
    if(req.body.tipo_item === "lavoro") {
      let params = {
        id_lavoro: req.body.item.id
      };
      await executeQuery(collegamentoSQL.SQL_ELIMINAZIONE_COLLEGAMENTI_LAVORO, collegamentoSQL.params_eliminazione_collegamenti_lavoro(params));
      for(let collegamento of req.body.item.collegamenti) {
        if(collegamento.quantita > 0) {
          await executeQuery(collegamentoSQL.SQL_INSERIMENTO_COLLEGAMENTO, collegamentoSQL.params_inserimento_collegamento(collegamento));        
        }
      }
    }

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