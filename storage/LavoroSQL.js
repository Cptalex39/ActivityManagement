export class LavoroSQL {
  SQL_INSERIMENTO_LAVORO = ` 
    INSERT INTO lavoro (cliente, giorno, totale, note) 
    VALUES (?, ?, ?, ?); 
  `;

  SQL_ELIMINAZIONE_LAVORI_RANGE_GIORNI = ` 
    DELETE FROM 
      lavoro 
    WHERE 
      giorno BETWEEN ? AND ?; 
  `;

  SQL_SELEZIONE_ENTRATE_LAVORI = ` 
    -- Creazione di una tabella temporanea con tutti i mesi degli anni di interesse
    WITH RECURSIVE DateRange AS ( 
        SELECT DATE_FORMAT(CONCAT(?, '-01-01'), '%Y-%m-%d') AS giorno 
        UNION ALL 
        SELECT DATE_ADD(giorno, INTERVAL 1 MONTH) 
        FROM DateRange 
        WHERE giorno < LAST_DAY(DATE_FORMAT(CONCAT(?, '-12-01'), '%Y-%m-%d')) 
    ) 
    SELECT 
      YEAR(DateRange.giorno) AS Anno, 
      SUM(IF(MONTH(DateRange.giorno) = 1, IFNULL(lavoro.totale, 0), 0)) AS gen, 
      SUM(IF(MONTH(DateRange.giorno) = 2, IFNULL(lavoro.totale, 0), 0)) AS feb, 
      SUM(IF(MONTH(DateRange.giorno) = 3, IFNULL(lavoro.totale, 0), 0)) AS mar, 
      SUM(IF(MONTH(DateRange.giorno) = 4, IFNULL(lavoro.totale, 0), 0)) AS apr, 
      SUM(IF(MONTH(DateRange.giorno) = 5, IFNULL(lavoro.totale, 0), 0)) AS mag, 
      SUM(IF(MONTH(DateRange.giorno) = 6, IFNULL(lavoro.totale, 0), 0)) AS giu, 
      SUM(IF(MONTH(DateRange.giorno) = 7, IFNULL(lavoro.totale, 0), 0)) AS lug, 
      SUM(IF(MONTH(DateRange.giorno) = 8, IFNULL(lavoro.totale, 0), 0)) AS ago, 
      SUM(IF(MONTH(DateRange.giorno) = 9, IFNULL(lavoro.totale, 0), 0)) AS \`set\`, 
      SUM(IF(MONTH(DateRange.giorno) = 10, IFNULL(lavoro.totale, 0), 0)) AS ott, 
      SUM(IF(MONTH(DateRange.giorno) = 11, IFNULL(lavoro.totale, 0), 0)) AS nov, 
      SUM(IF(MONTH(DateRange.giorno) = 12, IFNULL(lavoro.totale, 0), 0)) AS dic, 
      SUM(IFNULL(lavoro.totale, 0)) AS totale_anno 
    FROM 
      DateRange 
    LEFT JOIN 
      lavoro ON YEAR(DateRange.giorno) = YEAR(lavoro.giorno) AND MONTH(DateRange.giorno) = MONTH(lavoro.giorno) 
    GROUP BY 
      YEAR(DateRange.giorno) 
    UNION ALL 
    SELECT 
      'Totale', 
      SUM(IF(MONTH(DateRange.giorno) = 1, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 2, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 3, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 4, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 5, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 6, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 7, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 8, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 9, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 10, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 11, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 12, IFNULL(lavoro.totale, 0), 0)), 
      SUM(IFNULL(lavoro.totale, 0)) 
    FROM 
      DateRange 
    LEFT JOIN 
      lavoro ON YEAR(DateRange.giorno) = YEAR(lavoro.giorno) AND MONTH(DateRange.giorno) = MONTH(lavoro.giorno) 
    ORDER BY Anno Desc; 
  `;
  
  SQL_MODIFICA_LAVORO = `
    UPDATE 
      lavoro 
    SET 
      giorno = ?, totale = ?, note = ? 
    WHERE 
      id = ?; 
  `;
  SQL_INSERIMENTO_ORDINE = ` 
    INSERT INTO lavoro (
      cliente, id_cliente, tipo_lavoro, giorno, totale, 
      stato_pagamento, metodo_pagamento, tipo_ritiro, 
      indirizzo_spedizione, data_prenotazione, ora_prenotazione, note
    ) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); 
  `;
  constructor() {

  }

  
  sql_selezione_lavori(params) {
    let sql = `
      SELECT 
        0 AS tipo_selezione, 
        id AS id, 
        cliente AS cliente, 
        DATE_FORMAT(giorno, "%Y-%m-%d") AS giorno, 
        DATE_FORMAT(giorno, "%Y-%m-%d") AS giorno_attuale, 
        totale AS totale, 
        totale AS totale_attuale, 
        note AS note, 
        note AS note_attuale 
      FROM 
        lavoro  
      WHERE 
        cliente LIKE ? AND (giorno BETWEEN ? AND ?)  
    `;
    
    sql += (!params.note) ? " AND (note LIKE ? OR note IS NULL); " : " AND note LIKE ?; "; 
  
    return sql;
  }

  sql_eliminazione_lavori(ids) {
    const placeholders = ids.map(() => '?').join(', ');
    
    return (` 
      DELETE FROM 
        lavoro 
      WHERE 
        id IN (${placeholders}); 
    `);
  }
  
  params_inserimento_lavoro(params) { 
    return [
      `${params.cliente}`, 
      `${params.giorno}`, 
      `${params.totale}`, 
      `${params.note}`
    ];
  }

  params_eliminazione_lavori_range_giorni(params) {
    return [
      `${(params.primo_giorno) ? params.primo_giorno : "1111-01-01"}`, 
      `${(params.ultimo_giorno) ? params.ultimo_giorno : "9999-12-31"}` 
    ];
  }

  params_modifica_lavoro(params) {
    
    return [
      `${params.giorno}`, 
      `${params.totale}`, 
      `${params.note}`, 
      `${params.id}`, 
    ];
    
  }

  params_selezione_lavori(params_in) {
    let params_out = [
      `%${params_in.cliente}%`, 
      `${(params_in.primo_giorno) ? params_in.primo_giorno : "1111-01-01"}`, 
      `${(params_in.ultimo_giorno) ? params_in.ultimo_giorno : "9999-12-31"}`  
    ];
    params_out.push((!params_in.note) ? '%' : `%${params_in.note}%`);
    return params_out;
  }

  params_selezione_entrate_lavori(params) {
    return [
      (params.primo_anno) ? params.primo_anno : 0, 
      (params.ultimo_anno) ? params.ultimo_anno : 9999,
    ];
  }
  
  params_eliminazione_lavori() {
    return [];
  }  
  params_inserimento_ordine(params) {
    return [
      `${params.cliente}`,
      params.id_cliente || null,
      `${params.tipo_lavoro}`,              // 'ordine' o 'prenotazione'
      `${params.giorno}`,
      `${params.totale}`,
      `${params.stato_pagamento}`,          // 'pagato_online', 'in_sospeso', etc.
      `${params.metodo_pagamento}`,         // 'online', 'in_struttura', 'al_corriere'
      params.tipo_ritiro || null,           // 'spedizione' o 'ritiro_in_struttura'
      params.indirizzo_spedizione || null,
      params.data_prenotazione || null,
      params.ora_prenotazione || null,
      `${params.note || ""}`,
    ];
  }
}


  






