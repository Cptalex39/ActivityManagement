export class Actions {
  constructor() {
    
  }

  /**
   * Esecuzione operazione di tipo POST.
   * 
   * @param {String}  operation - operazione POST da eseguire.
   * @param {Object} data - dati passati all'operazione.
   * 
   * @returns {Promise<Response>} risposta dell'operazione POST come Promise.
   */
  async getResponse(operation, data) {
    return (fetch(operation, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }));
  }

  /**
   * azione per ottenere una collezione di items.
   * 
   * @param {Function} setItems - setter di items. 
   * @param {String} tipoItem - tipo degli item.
   * 
   * @returns {Object} risultato response operazione.
   */
  async getAllItems(setItems, tipoItem) {
    const dati = {
      tipo_item: tipoItem
    }

    const response = await this.getResponse("/OTTIENI_TUTTI_GLI_ITEMS", dati);

    if(response.ok) {
      const result = await response.json();
      setItems(result.items);
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }
}










