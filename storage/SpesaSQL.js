export class SpesaSQL {
  SQL_INSERIMENTO_SPESA = ` 
    INSERT INTO spesa (nome, giorno, descrizione, totale, note) 
    VALUES (?, ?, ?, ?, ?); 
  `;

  SQL_SELEZIONE_USCITE_SPESE = `
    -- Creazione di una tabella temporanea con tutti i mesi degli ultimi 5 anni  
    WITH RECURSIVE DateRange AS ( 
      SELECT DATE_FORMAT(CONCAT(?, '-01-01'), '%Y-%m-%d') AS giorno 
      UNION ALL 
      SELECT DATE_ADD(giorno, INTERVAL 1 MONTH) 
      FROM DateRange 
      WHERE giorno < LAST_DAY(DATE_FORMAT(CONCAT(?, '-12-01'), '%Y-%m-%d')) 
    ) 
    SELECT 
      YEAR(DateRange.giorno) AS Anno, 
      SUM(IF(MONTH(DateRange.giorno) = 1, IFNULL(spesa.totale, 0), 0)) AS gen, 
      SUM(IF(MONTH(DateRange.giorno) = 2, IFNULL(spesa.totale, 0), 0)) AS feb, 
      SUM(IF(MONTH(DateRange.giorno) = 3, IFNULL(spesa.totale, 0), 0)) AS mar, 
      SUM(IF(MONTH(DateRange.giorno) = 4, IFNULL(spesa.totale, 0), 0)) AS apr, 
      SUM(IF(MONTH(DateRange.giorno) = 5, IFNULL(spesa.totale, 0), 0)) AS mag, 
      SUM(IF(MONTH(DateRange.giorno) = 6, IFNULL(spesa.totale, 0), 0)) AS giu, 
      SUM(IF(MONTH(DateRange.giorno) = 7, IFNULL(spesa.totale, 0), 0)) AS lug, 
      SUM(IF(MONTH(DateRange.giorno) = 8, IFNULL(spesa.totale, 0), 0)) AS ago, 
      SUM(IF(MONTH(DateRange.giorno) = 9, IFNULL(spesa.totale, 0), 0)) AS \`set\`, 
      SUM(IF(MONTH(DateRange.giorno) = 10, IFNULL(spesa.totale, 0), 0)) AS ott, 
      SUM(IF(MONTH(DateRange.giorno) = 11, IFNULL(spesa.totale, 0), 0)) AS nov, 
      SUM(IF(MONTH(DateRange.giorno) = 12, IFNULL(spesa.totale, 0), 0)) AS dic, 
      SUM(IFNULL(spesa.totale, 0)) AS totale_anno 
    FROM 
      DateRange 
    LEFT JOIN 
      spesa ON YEAR(DateRange.giorno) = YEAR(spesa.giorno) AND MONTH(DateRange.giorno) = MONTH(spesa.giorno) 
    GROUP BY 
      YEAR(DateRange.giorno) 
    UNION ALL 
    SELECT 
      'Totale', 
      SUM(IF(MONTH(DateRange.giorno) = 1, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 2, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 3, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 4, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 5, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 6, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 7, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 8, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 9, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 10, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 11, IFNULL(spesa.totale, 0), 0)), 
      SUM(IF(MONTH(DateRange.giorno) = 12, IFNULL(spesa.totale, 0), 0)), 
      SUM(IFNULL(spesa.totale, 0)) 
    FROM 
      DateRange 
    LEFT JOIN 
      spesa ON YEAR(DateRange.giorno) = YEAR(spesa.giorno) AND MONTH(DateRange.giorno) = MONTH(spesa.giorno) 
    ORDER BY Anno Desc;  
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

  params_selezione_uscite_spese(params) {
    return [
      (params.primo_anno) ? params.primo_anno : 0, 
      (params.ultimo_anno) ? params.ultimo_anno : 9999,
    ];
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









