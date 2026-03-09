export class Actions {
  constructor() {
    
  }

  async getResponse(operation, data) {
    return (fetch(operation, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }));
  }

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










