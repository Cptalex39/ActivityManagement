export class AttivitaSQL {
  SQL_OTTIENI_DATI_ATTIVITA = `
    SELECT primo_intervallo, secondo_intervallo, numero_clienti 
    FROM attivita 
    WHERE id = 1;
  `;

  constructor() {
    
  }
  
  
  params_ottieni_dati_attivita(params) {
    return [];
  }
}









