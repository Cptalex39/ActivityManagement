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
}










