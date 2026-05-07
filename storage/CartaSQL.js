export class CartaSQL {
  SQL_INSERIMENTO_CARTA = ` 
    INSERT INTO carta (numero, mese_scadenza, anno_scadenza, cvv_cvs, nome_titolare, circuito, id_cliente) 
    VALUES (?, ?, ?, ?, ?, ?, ?); 
  `;
  
  SQL_COLLEGAMENTO_CARTA_CLIENTE = `
    INSERT INTO \`utilizzo\` (\`id_cliente\`, \`id_carta\`) 
    VALUES (?, ?);
  `

  SQL_OTTENIMENTO_CARTE_CLIENTE = `
    SELECT id, numero, mese_scadenza, anno_scadenza, cvv_cvs, nome_titolare, circuito 
    FROM carta 
    WHERE id_cliente = ?;
  `

  SQL_OTTIENI_NUMERO_UTILIZZI_CARTA = `
    SELECT COUNT(*) AS num_utilizzi_carta 
    FROM utilizzo 
    WHERE id_carta = ?;
  `
  
  SQL_ELIMINA_CARTA = `
    DELETE FROM 
      carta 
    WHERE 
      id = ? AND id_cliente = ?; 
  `

  constructor() {
    
  }

  params_inserimento_carta(params) {
    return [
      `${params.numero}`, 
      `${params.mese_scadenza}`, 
      `${params.anno_scadenza}`, 
      `${params.cvv_cvs}`, 
      `${params.nome_titolare}`, 
      `${params.circuito}`,  
      `${params.id_cliente}`, 
    ];
  }

  params_collegamento_carta_cliente(params) {
    return [
      `${params.id_cliente}`, 
      `${params.id_carta}`,  
    ];
  }

  params_ottenimento_carte_cliente(params) {
    return [
      `${params.id_cliente}`, 
    ];
  }

  params_ottieni_numero_utilizzi_carta(params) {
    return [
      `${params.id_carta}`, 
    ];
  };

  params_elimina_carta(params) {
    return [
      `${params.id_carta}`, 
      `${params.id_cliente}`, 
    ]
  }
}









