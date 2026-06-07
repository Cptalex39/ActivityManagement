export class OrdineSQL {
  SQL_INSERIMENTO_ORDINE = ` 
    INSERT INTO ordine (codice, data_creazione, items, metodo_pagamento, data_prenotazione, ora_prenotazione, indirizzo, numero_carta, totale, id_cliente) 
    VALUES (DATE_FORMAT(NOW(3), '%Y-%m-%d_%H:%i:%s:%f'), NOW(), ?, ?, ?, ?, ?, ?, ?, ?); 
  `;

  SQL_ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE = `
    DELETE 
    FROM ordine 
    WHERE ordine.codice=?
  `

  SQL_CONFERMA_PAGAMENTO = `
    UPDATE 
      ordine 
    SET 
      is_pagato = 1, data_conferma_pagamento = NOW() 
    WHERE 
      ordine.codice = ?; 
  `

  SQL_OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE = `
    SELECT COUNT(*) AS numero_pagamenti_non_confermati 
    FROM ordine 
    WHERE is_pagato = 0 AND id_cliente = ?;
  `

  SQL_OTTIENI_ENTRATE_ORDINI = `
    SELECT 
      m.num_mese AS mese, 
      COALESCE(SUM(o.totale), 0) AS totale, 
      IF(
        COUNT(i.id) = 0, 
        JSON_ARRAY(), 
        JSON_ARRAYAGG(
          JSON_OBJECT('nome', i.nome, 'totale', i.prezzo * i.quantita) 
        ) 
      ) AS items 
    FROM (
      SELECT 1 AS num_mese UNION SELECT 2 UNION SELECT 3 UNION SELECT 4
      UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8
      UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
    ) m
    LEFT JOIN ordine o 
      ON MONTH(o.data_conferma_pagamento) = m.num_mese 
      AND YEAR(o.data_conferma_pagamento) = ? 
    LEFT JOIN (
      SELECT 
        MONTH(o.data_conferma_pagamento) AS mese,
        jt.*
      FROM ordine o
      CROSS JOIN JSON_TABLE(o.items, '$[*]' COLUMNS (
        id INT PATH '$.id',
        nome VARCHAR(100) PATH '$.nome',
        prezzo DOUBLE PATH '$.prezzo',
        tipo VARCHAR(50) PATH '$.tipo',
        note TEXT PATH '$.note',
        quantita INT PATH '$.quantita'
      )) AS jt
      WHERE YEAR(o.data_conferma_pagamento) = ?
      ORDER BY mese
    ) i ON i.mese = m.num_mese
    GROUP BY m.num_mese 
    ORDER BY m.num_mese;   
  `;

  SQL_OTTIENI_NUMERO_ORDINI_DATA_PER_ORARIO = `
    SELECT 
      SUM(CASE WHEN ora_prenotazione = '00:00:00' THEN 1 ELSE 0 END) AS "00:00", 
      SUM(CASE WHEN ora_prenotazione = '01:00:00' THEN 1 ELSE 0 END) AS "01:00", 
      SUM(CASE WHEN ora_prenotazione = '02:00:00' THEN 1 ELSE 0 END) AS "02:00", 
      SUM(CASE WHEN ora_prenotazione = '03:00:00' THEN 1 ELSE 0 END) AS "03:00", 
      SUM(CASE WHEN ora_prenotazione = '04:00:00' THEN 1 ELSE 0 END) AS "04:00", 
      SUM(CASE WHEN ora_prenotazione = '05:00:00' THEN 1 ELSE 0 END) AS "05:00", 
      SUM(CASE WHEN ora_prenotazione = '06:00:00' THEN 1 ELSE 0 END) AS "06:00", 
      SUM(CASE WHEN ora_prenotazione = '07:00:00' THEN 1 ELSE 0 END) AS "07:00", 
      SUM(CASE WHEN ora_prenotazione = '08:00:00' THEN 1 ELSE 0 END) AS "08:00", 
      SUM(CASE WHEN ora_prenotazione = '09:00:00' THEN 1 ELSE 0 END) AS "09:00", 
      SUM(CASE WHEN ora_prenotazione = '10:00:00' THEN 1 ELSE 0 END) AS "10:00", 
      SUM(CASE WHEN ora_prenotazione = '11:00:00' THEN 1 ELSE 0 END) AS "11:00", 
      SUM(CASE WHEN ora_prenotazione = '12:00:00' THEN 1 ELSE 0 END) AS "12:00", 
      SUM(CASE WHEN ora_prenotazione = '13:00:00' THEN 1 ELSE 0 END) AS "13:00", 
      SUM(CASE WHEN ora_prenotazione = '14:00:00' THEN 1 ELSE 0 END) AS "14:00", 
      SUM(CASE WHEN ora_prenotazione = '15:00:00' THEN 1 ELSE 0 END) AS "15:00", 
      SUM(CASE WHEN ora_prenotazione = '16:00:00' THEN 1 ELSE 0 END) AS "16:00", 
      SUM(CASE WHEN ora_prenotazione = '17:00:00' THEN 1 ELSE 0 END) AS "17:00", 
      SUM(CASE WHEN ora_prenotazione = '18:00:00' THEN 1 ELSE 0 END) AS "18:00", 
      SUM(CASE WHEN ora_prenotazione = '19:00:00' THEN 1 ELSE 0 END) AS "19:00", 
      SUM(CASE WHEN ora_prenotazione = '20:00:00' THEN 1 ELSE 0 END) AS "20:00", 
      SUM(CASE WHEN ora_prenotazione = '21:00:00' THEN 1 ELSE 0 END) AS "21:00", 
      SUM(CASE WHEN ora_prenotazione = '22:00:00' THEN 1 ELSE 0 END) AS "22:00", 
      SUM(CASE WHEN ora_prenotazione = '23:00:00' THEN 1 ELSE 0 END) AS "23:00" 
    FROM ordine 
    WHERE data_prenotazione = ? AND metodo_pagamento = "Struttura";
  `;   

  constructor() {
    
  }

  sql_ottieni_pagamenti_da_confermare(params) { 
    let sql = `
      SELECT 
        ordine.codice AS codice, 
        ordine.data_creazione AS data_creazione, 
        ordine.items AS items, 
        ordine.metodo_pagamento AS metodo_pagamento, 
        ordine.data_prenotazione AS data_prenotazione, 
        ordine.ora_prenotazione AS ora_prenotazione, 
        ordine.indirizzo AS indirizzo, 
        ordine.numero_carta AS numero_carta, 
        ordine.totale AS totale, 
        cliente.username AS username_cliente, 
        cliente.nome AS nome_cliente, 
        cliente.cognome AS cognome_cliente, 
        cliente.contatto AS contatto_cliente, 
        cliente.email AS email_cliente 
      FROM ordine INNER JOIN cliente 
      ON ordine.id_cliente = cliente.id 
      WHERE is_pagato = 0
    `;
    sql += params.id_cliente > 0 ? ` AND ordine.id_cliente = ?;` : `;`;
    return sql;
  }

  sql_ottieni_ordini_ultime_48_ore(params) {
    let sql = `
      SELECT 
        ordine.codice AS codice, 
        ordine.data_creazione AS data_creazione, 
        ordine.items AS items, 
        ordine.metodo_pagamento AS metodo_pagamento, 
        ordine.data_prenotazione AS data_prenotazione, 
        ordine.ora_prenotazione AS ora_prenotazione, 
        ordine.indirizzo AS indirizzo, 
        ordine.numero_carta AS numero_carta, 
        ordine.totale AS totale, 
        ordine.is_pagato AS is_pagato, 
        cliente.username AS username_cliente, 
        cliente.nome AS nome_cliente, 
        cliente.cognome AS cognome_cliente, 
        cliente.contatto AS contatto_cliente, 
        cliente.email AS email_cliente 
      FROM ordine INNER JOIN cliente 
      ON ordine.id_cliente = cliente.id 
      WHERE ordine.data_creazione >= NOW() - INTERVAL 2 DAY
    `;
    sql += params.id_cliente > 0 ? ` AND ordine.id_cliente = ?;` : `;`;
    return sql;
  }

  sql_selezione_ordini(params) {
    let sql = `
      SELECT 
        ordine.codice AS codice, 
        ordine.data_creazione AS data_creazione, 
        ordine.items AS items, 
        ordine.metodo_pagamento AS metodo_pagamento, 
        ordine.data_prenotazione AS data_prenotazione, 
        ordine.ora_prenotazione AS ora_prenotazione, 
        ordine.indirizzo AS indirizzo, 
        ordine.numero_carta AS numero_carta, 
        ordine.totale AS totale, 
        ordine.is_pagato AS is_pagato, 
        cliente.username AS username_cliente, 
        cliente.nome AS nome_cliente, 
        cliente.cognome AS cognome_cliente, 
        cliente.contatto AS contatto_cliente, 
        cliente.email AS email_cliente 
      FROM ordine INNER JOIN cliente 
      ON ordine.id_cliente = cliente.id 
      WHERE 
        (data_creazione BETWEEN ? AND ?) 
    `;
    sql += params.azione === "Ricerca" ? ` AND is_pagato = 1 ` : ``;
    sql += params.metodo_pagamento !== "Tutte" ? ` AND metodo_pagamento = ? ` : ``;
    sql += params.metodo_pagamento === "Struttura" ? ` AND (data_prenotazione BETWEEN ? AND ?) ` : ``;
    sql += params.id_cliente > 0 ? ` AND ordine.id_cliente = ? ` : ``; 
    sql += params.nome_cliente !== "" ? ` AND cliente.nome LIKE ? ` : ``;
    sql += params.cognome_cliente !== "" ? ` AND cliente.cognome LIKE ? ` : ``;
    sql += params.email_cliente !== "" ? ` AND cliente.email LIKE ? ` : ``;
    sql += params.contatto_cliente !== "" ? ` AND cliente.contatto LIKE ? ` : ``;
    sql += params.username_cliente !== "" ? ` AND cliente.username LIKE ?;` : `;`;

    return sql;
  }

  params_inserimento_ordine(params) {
    return [  
      params.items, 
      params.metodo_pagamento, 
      params.metodo_pagamento === "Struttura" ? params.data_prenotazione : null, 
      params.metodo_pagamento === "Struttura" ? params.ora_prenotazione  : null, 
      ["Spedizione", "Corriere"].includes(params.metodo_pagamento) ? `${params.indirizzo}` : null, 
      params.metodo_pagamento === "Spedizione" ? params.numero_carta : null, 
      params.totale, 
      params.id_cliente  
    ];
  }

  params_ottieni_pagamenti_da_confermare(params) {
    return params.id_cliente > 0 ? [
      params.id_cliente
    ] : [];
  }

  params_ottieni_ordini_ultime_48_ore(params) {
    return params.id_cliente > 0 ? [
      params.id_cliente
    ] : [];
  }

  params_selezione_ordini(params) {
    let paramsOutput = [
      params.data_creazione_min, 
      params.data_creazione_max
    ];

    if(params.metodo_pagamento !== "Tutte") {
      paramsOutput.push(params.metodo_pagamento);
    }

    if(params.metodo_pagamento === "Struttura") {
      paramsOutput.push(params.data_prenotazione_min);
      paramsOutput.push(params.data_prenotazione_max);
    }

    if(params.id_cliente > 0) {
      paramsOutput.push(params.id_cliente);
    }

    if(params.nome_cliente !== "") {
      paramsOutput.push("%"+params.nome_cliente+"%");
    }

    if(params.cognome_cliente !== "") {
      paramsOutput.push("%"+params.cognome_cliente+"%");
    }

    if(params.email_cliente !== "") {
      paramsOutput.push("%"+params.email_cliente+"%");
    }

    if(params.contatto_cliente !== "") {
      paramsOutput.push("%"+params.contatto_cliente+"%");
    }

    if(params.username_cliente !== "") {
      paramsOutput.push("%"+params.username_cliente+"%");
    }
    
    return paramsOutput;
  }

  params_eliminazione_pagamento_da_confermare(params) {
    return [
      params.codice 
    ]
  }

  params_conferma_pagamento(params) {
    return [
      params.codice 
    ]
  }

  params_ottieni_numero_pagamenti_non_confermati_cliente(params) {
    return [
      params.id_cliente
    ];
  } 

  params_ottieni_entrate_ordini(params) {
    return [
      params.anno, 
      params.anno
    ];
  }

  params_ottieni_numero_ordini_data_per_orario(params) {
    return [
      params.data_prenotazione 
    ];
  }
}









