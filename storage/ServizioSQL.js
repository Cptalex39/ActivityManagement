export class ServizioSQL {
  SQL_INSERIMENTO_SERVIZIO = ` 
    INSERT INTO servizio (nome, prezzo, note, in_uso) 
    VALUES (?, ?, ?, ?); 
  `;
  
  SQL_SELEZIONE_TUTTI_I_SERVIZI = `
    SELECT 
      id, 
      nome, 
      prezzo, 
      in_uso, 
      0 AS quantita 
    FROM 
      servizio; 
  `;
  
  SQL_SELEZIONE_ENTRATE_SERVIZI = `
    SELECT 
      CONCAT(s.nome, " x ", s.prezzo) AS nome, 
      YEAR(l.giorno) AS anno, 
      SUM(CASE WHEN MONTH(l.giorno) = 1 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_gennaio, 
      SUM(CASE WHEN MONTH(l.giorno) = 1 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_gennaio, 
      SUM(CASE WHEN MONTH(l.giorno) = 2 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_febbraio, 
      SUM(CASE WHEN MONTH(l.giorno) = 2 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_febbraio, 
      SUM(CASE WHEN MONTH(l.giorno) = 3 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_marzo, 
      SUM(CASE WHEN MONTH(l.giorno) = 3 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_marzo, 
      SUM(CASE WHEN MONTH(l.giorno) = 4 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_aprile, 
      SUM(CASE WHEN MONTH(l.giorno) = 4 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_aprile, 
      SUM(CASE WHEN MONTH(l.giorno) = 5 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_maggio, 
      SUM(CASE WHEN MONTH(l.giorno) = 5 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_maggio, 
      SUM(CASE WHEN MONTH(l.giorno) = 6 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_giugno, 
      SUM(CASE WHEN MONTH(l.giorno) = 6 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_giugno, 
      SUM(CASE WHEN MONTH(l.giorno) = 7 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_luglio, 
      SUM(CASE WHEN MONTH(l.giorno) = 7 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_luglio, 
      SUM(CASE WHEN MONTH(l.giorno) = 8 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_agosto, 
      SUM(CASE WHEN MONTH(l.giorno) = 8 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_agosto, 
      SUM(CASE WHEN MONTH(l.giorno) = 9 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_settembre, 
      SUM(CASE WHEN MONTH(l.giorno) = 9 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_settembre, 
      SUM(CASE WHEN MONTH(l.giorno) = 10 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_ottobre, 
      SUM(CASE WHEN MONTH(l.giorno) = 10 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_ottobre, 
      SUM(CASE WHEN MONTH(l.giorno) = 11 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_novembre, 
      SUM(CASE WHEN MONTH(l.giorno) = 11 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_novembre, 
      SUM(CASE WHEN MONTH(l.giorno) = 12 THEN COALESCE(c.quantita, 0) ELSE 0 END) AS quantita_dicembre, 
      SUM(CASE WHEN MONTH(l.giorno) = 12 THEN COALESCE(c.quantita, 0) * s.prezzo ELSE 0 END) AS totale_dicembre 
    FROM lavoro AS l 
    LEFT JOIN collegamento AS c ON l.id = c.id_lavoro 
    LEFT JOIN servizio AS s ON c.id_servizio = s.id 
    WHERE YEAR(l.giorno) BETWEEN ? AND ? 
    GROUP BY anno, s.id 
    ORDER BY anno DESC, nome ASC; 
  `;


  SQL_MODIFICA_SERVIZIO = `
    UPDATE 
      servizio 
    SET 
      nome = ?, prezzo = ?, note = ?, in_uso = ?  
    WHERE 
      id = ?; 
  `;
  
  constructor() {

  }
  
  sql_selezione_servizi(params) { 
    let sql = `
      SELECT 
        id, 
        nome, 
        nome AS nome_attuale, 
        prezzo, 
        prezzo AS prezzo_attuale, 
        note, 
        note AS note_attuale, 
        CASE 
          WHEN in_uso = 1 THEN "Si" 
          ELSE "No" 
        END AS in_uso, 
        CASE 
          WHEN in_uso = 1 THEN "Si" 
          ELSE "No" 
        END AS in_uso_attuale, 
        0 AS tipo_selezione 
      FROM 
        servizio 
      WHERE 
        nome LIKE ? AND (prezzo BETWEEN ? AND ?)  
    `;
  
    sql += (!params.note) ? " AND (note LIKE ? OR note IS NULL) " : " AND note LIKE ? ";
    if(params.in_uso.toLowerCase() === "s" || params.in_uso.toLowerCase() === "si") {
      sql += " AND in_uso = 1; ";
    }
    else if(params.in_uso.toLowerCase() === "n" || params.in_uso.toLowerCase() === "no") {
      sql += " AND in_uso = 0; ";
    }
    else if(params.in_uso) {
      sql += " AND in_uso = -1; ";
    }
    
  
    return sql;
  };

  sql_eliminazione_servizi(ids) {
    const placeholders = ids.map(() => '?').join(', ');
    
    return (` 
      DELETE FROM 
        servizio 
      WHERE 
        id IN (${placeholders}); 
    `);
  }
  
  params_inserimento_servizio(params) {
    return [
      `${params.nome}`, 
      `${params.prezzo}`, 
      `${params.note}`, 
      true,  
    ];
  }

  params_selezione_tutti_i_servizi() {
    return [];
  }

  params_modifica_servizio(params) {
    return [
      `${params.nome}`, 
      `${params.prezzo}`, 
      `${params.note}`, 
      params.in_uso, 
      `${params.id}` 
    ];
  }

  params_selezione_servizi(params_in) {
    let params_out = [
      `%${params_in.nome}%`, 
      `${(params_in.prezzo_min) ? params_in.prezzo_min : Number.MIN_VALUE}`, 
      `${(params_in.prezzo_max) ? params_in.prezzo_max : Number.MAX_VALUE}`, 
    ];
    params_out.push((!params_in.note) ? '%' : `%${params_in.note}%`)
    return params_out;
  }

  params_eliminazione_servizi(params) {
    return [];
  }

  params_selezione_entrate_servizi(params) {
    return [
      `${params.primo_anno}`, 
      `${params.ultimo_anno}`
    ];
  }
}









