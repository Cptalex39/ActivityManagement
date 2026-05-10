export class SpesaSQL {
  SQL_INSERIMENTO_SPESA = ` 
    INSERT INTO spesa (nome, giorno, descrizione, totale, note) 
    VALUES (?, ?, ?, ?, ?); 
  `;

  SQL_MODIFICA_SPESA = `
    UPDATE 
      spesa 
    SET 
      descrizione = ?, totale = ?, giorno = ?, note = ? 
    WHERE 
      id = ?; 
  `;

  SQL_ELIMINAZIONE_SPESE_RANGE_GIORNI = ` 
    DELETE FROM 
      spesa 
    WHERE 
      giorno BETWEEN ? AND ?; 
  `;

  SQL_OTTIENI_USCITE_SPESE = `
    WITH mesi AS (
      SELECT 1 AS num_mese UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 
      UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 
      UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12 
    ) 
    SELECT 
      m.num_mese AS mese, 
      COALESCE(SUM(s.totale), 0) AS totale, 
      IF(
        COUNT(s.giorno) = 0, 
        JSON_ARRAY(), 
        JSON_ARRAYAGG(JSON_OBJECT('nome', s.nome, 'totale', s.totale))
      ) AS spese 
    FROM mesi m 
    LEFT JOIN spesa s ON MONTH(s.giorno) = m.num_mese AND YEAR(s.giorno) = ? 
    GROUP BY m.num_mese 
    ORDER BY m.num_mese;   
  `

  constructor() {

  }

  sql_selezione_spese(params) { 
    let sql = ` 
      SELECT 
        id, 
        nome, 
        descrizione, 
        descrizione AS descrizione_attuale, 
        totale, 
        totale AS totale_attuale, 
        DATE_FORMAT(giorno, "%Y-%m-%d") AS giorno, 
        DATE_FORMAT(giorno, "%Y-%m-%d") AS giorno_attuale, 
        note, 
        note AS note_attuale, 
        0 AS tipo_selezione 
      FROM 
        spesa 
      WHERE 
        nome LIKE ? AND (totale BETWEEN ? AND ?) AND (giorno BETWEEN ? AND ?) 
    `;
    sql += (!params.descrizione) ? " AND (descrizione LIKE ? OR descrizione IS NULL) " : " AND descrizione LIKE ? ";
    sql += (!params.note) ? " AND (note LIKE ? OR note IS NULL); " : " AND note LIKE ?; ";
  
    return sql;
  };

  sql_eliminazione_spese(ids) {
    const placeholders = ids.map(() => '?').join(', ');

    return (` 
      DELETE FROM 
        spesa 
      WHERE 
        id IN (${placeholders}); 
    `);
  }
  
  params_inserimento_spesa(params) {
    return [
      `${params.nome}`, 
      `${params.giorno}`, 
      `${params.descrizione}`, 
      `${params.totale}`, 
      `${params.note}` 
    ];
  }

  params_selezione_spese(params_in) {
    let params_out = [
      `%${params_in.nome}%`, 
      `${(params_in.totale_min) ? params_in.totale_min : Number.MIN_VALUE}`, 
      `${(params_in.totale_max) ? params_in.totale_max : Number.MAX_VALUE}`, 
      `${(params_in.primo_giorno) ? params_in.primo_giorno : "1111-01-01"}`, 
      `${(params_in.ultimo_giorno) ? params_in.ultimo_giorno : "9999-12-31"}`
    ];
    params_out.push((!params_in.descrizione) ? '%' : `%${params_in.descrizione}%`);
    params_out.push((!params_in.note) ? '%' : `%${params_in.note}%`);
    
    return params_out;
  }

  params_modifica_spesa(params) {
    const totale = (typeof params.totale === "string" && params.totale.includes("€")) 
      ? params.totale.substring(0, params.totale.length - 1).trim() 
      : params.totale;
    return [
      `${params.descrizione}`,
      `${totale}`,
      `${params.giorno}`,
      `${params.note}`,
      `${params.id}`
    ];
  }

  params_eliminazione_spese() {
    return [];
  }  

  params_eliminazione_spese_range_giorni(params) {
    return [
      `${(params.primo_giorno) ? params.primo_giorno : "1111-01-01"}`, 
      `${(params.ultimo_giorno) ? params.ultimo_giorno : "9999-12-31"}` 
    ];
  }

  params_ottieni_uscite_spese(params) {
    return [
      params.anno 
    ]
  }
}









