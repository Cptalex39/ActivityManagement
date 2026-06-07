export class ServizioSQL {
  SQL_INSERIMENTO_SERVIZIO = ` 
    INSERT INTO servizio (nome, tipo, prezzo, descrizione, note, in_uso) 
    VALUES (?, ?, ?, ?, ?, 1); 
  `;
  
  SQL_SELEZIONE_TUTTI_I_SERVIZI = `
    SELECT 
      id, 
      nome, 
      prezzo, 
      tipo, 
      in_uso, 
      0 AS quantita 
    FROM 
      servizio; 
  `;

  // CR: Selezione servizi/prodotti per il catalogo lato cliente (solo in_uso = 1)
  SQL_SELEZIONE_CATALOGO = `
    SELECT 
      id, 
      nome, 
      prezzo, 
      tipo, 
      note 
    FROM 
      servizio 
    WHERE 
      in_uso = 1 
    ORDER BY tipo ASC, nome ASC; 
  `;

  // CR: Selezione solo prodotti per il catalogo
  SQL_SELEZIONE_CATALOGO_PRODOTTI = `
    SELECT 
      id, 
      nome, 
      prezzo, 
      tipo, 
      note 
    FROM 
      servizio 
    WHERE 
      in_uso = 1 AND tipo = 'prodotto' 
    ORDER BY nome ASC; 
  `;

  // CR: Selezione solo servizi per il catalogo
  SQL_SELEZIONE_CATALOGO_SERVIZI = `
    SELECT 
      id, 
      nome, 
      prezzo, 
      tipo, 
      note 
    FROM 
      servizio 
    WHERE 
      in_uso = 1 AND tipo = 'servizio' 
    ORDER BY nome ASC; 
  `;
  
  SQL_MODIFICA_SERVIZIO = `
    UPDATE 
      servizio 
    SET 
      nome = ?, prezzo = ?, tipo = ?, note = ?, in_uso = ?  
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
        tipo, 
        tipo AS tipo_attuale, 
        prezzo, 
        prezzo AS prezzo_attuale, 
        descrizione, 
        descrizione as descrizione_attuale, 
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
  
    if(params.tipo && params.tipo !== "" && params.tipo !== "tutti") {
      sql += " AND tipo = '" + params.tipo + "' ";
    }

    if(params.id_cliente > 0 || params.in_uso.toLowerCase() === "s" || params.in_uso.toLowerCase() === "si") {
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
      `${params.tipo}`, 
      `${params.prezzo}`, 
      `${params.descrizione}`, 
      `${params.note}`, 
    ];
  }

  params_selezione_tutti_i_servizi() {
    return [];
  }

  params_selezione_catalogo() {
    return [];
  }

  params_modifica_servizio(params) {
    return [
      `${params.nome}`, 
      `${params.prezzo}`, 
      `${params.tipo || 'servizio'}`,
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
}