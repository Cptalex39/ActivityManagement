export class ClienteSQL {
  SQL_INSERIMENTO_CLIENTE = ` 
    INSERT INTO cliente (nome, cognome, username, contatto, email, password, salt_hex, is_active) 
    VALUES (?, ?, ?, ?, ?, ?, ?, true); 
  `;

  SQL_SELEZIONE_TUTTI_I_CLIENTI = `
    SELECT 
      id, nome, cognome, contatto, email 
    FROM 
      cliente; 
  `;

  SQL_SELEZIONE_CLIENTE = ` 
    SELECT 
      \`id\`, \`username\`, "cliente" AS \`ruolo\`, \`nome\`, \`cognome\`, \`email\`, \`contatto\`, \`indirizzo\`, \`password\`, \`salt_hex\`, \`is_active\` 
    FROM 
      \`cliente\` 
    WHERE 
      \`username\` = ?; 
  `;

  SQL_MODIFICA_INDIRIZZO = `
    UPDATE 
      cliente 
    SET 
      indirizzo = ? 
    WHERE 
      id = ?; 
  `;

  SQL_RICHIESTA_ELIMINAZIONE = `
    UPDATE 
      cliente 
    SET 
      is_active = 0 
    WHERE 
      username = ?; 
  `;

  SQL_RIATTIVA_CLIENTE = `
    UPDATE 
      cliente 
    SET 
      is_active = 1 
    WHERE 
      username = ?; 
  `;

  SQL_OTTIENI_CLIENTI_DA_ELIMINARE = ` 
    SELECT 
      id, nome, cognome, username, email, contatto, 0 AS is_eliminabile 
    FROM 
      cliente 
    WHERE 
      is_active = 0; 
  `;

  SQL_ELIMINAZIONE_CLIENTE = `
    DELETE FROM 
      cliente 
    WHERE 
      username = ?; 
  `;

  SQL_OTTIENI_PASSWORD = `
    SELECT \`password\`, salt_hex 
    FROM cliente 
    WHERE id = ?; 
  `
  
  constructor() {
    
  }

  sql_selezione_clienti(params) { 
    let sql = `
      SELECT 
        nome, 
        cognome, 
        contatto, 
        email, 
        is_active, 
        0 AS tipo_selezione 
      FROM 
        cliente 
      WHERE 
        nome LIKE ? AND cognome LIKE ? AND contatto LIKE ? AND email LIKE ?;
    `;

    return sql;
  };

  sql_eliminazione_clienti(ids) {
    const placeholders = ids.map(() => '?').join(', ');
    return (` 
      DELETE FROM 
        cliente 
      WHERE 
        id IN (${placeholders}); 
    `);
  }

  sql_modifica_cliente(params) { 
    let sql = `UPDATE cliente `;
    sql += ` SET email = ?, contatto = ?, indirizzo = ?, username = ?`; 

    if(params.nuova_password !== "") {
      sql += `, \`password\` = ?, salt_hex = ?`;
    }

    sql += ` WHERE id = ?;`;

    return sql;
  }

  params_inserimento_cliente(params) {
    return [
      `${params.nome}`, 
      `${params.cognome}`, 
      `${params.username}`, 
      `${params.contatto}` ? params.contatto : "", 
      `${params.email}` ? params.email : "", 
      `${params.password}`, 
      `${params.salt_hex}` 
    ];
  }
  
  params_selezione_tutti_i_clienti() {
    return [];
  }

  params_selezione_cliente(params) {
    return [
      `${params.username}`
    ];
  }

  params_modifica_cliente(params) {
    let params_output = [
      params.email, 
      params.contatto, 
      params.indirizzo, 
      params.username
    ];
    
    if(params.nuova_password !== "") {
      params_output.push(params.nuova_password);
      params_output.push(params.salt_hex);
    }

    params_output.push(params.id);

    return params_output;
  }

  params_modifica_indirizzo(params) {
    return [
      `${params.indirizzo}`, 
      `${params.id}`
    ];
  }

  params_richiesta_eliminazione(params) {
    return [
      `${params.username}`, 
    ];
  }

  params_riattiva_cliente(params) {
    return [
      `${params.username}`, 
    ];
  }

  params_selezione_clienti(params_in) {
    let params_out = [
      `%${params_in.nome}%`, 
      `%${params_in.cognome}%`, 
      `%${params_in.contatto}%`, 
      `%${params_in.email}%`
    ];
    return params_out;
  }

  params_eliminazione_cliente(params) {
    return [
      `${params.username}`, 
    ];
  }

  params_eliminazione_clienti(ids) {
    return [];
  }

  params_ottieni_clienti_da_eliminare() {
    return [];
  }

  params_ottieni_password(params) {
    return [
      params.id
    ];
  }
}



