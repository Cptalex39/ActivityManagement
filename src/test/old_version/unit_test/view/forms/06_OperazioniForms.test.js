import { OperazioniForms } from '../../../../view/forms/OperazioniForms';

describe('OperazioniForms', () => {
  let operazioniForms;
  let mockSetItem;

  beforeEach(() => {
    operazioniForms = new OperazioniForms();
    mockSetItem = jest.fn(); // Crea un mock per la funzione `setItem`
  });

  test('Aggiornamento corretto di primo_anno e ultimo_anno.', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'primo_anno',
        value: '2025',
        id: 'primo_anno',
      },
    };

    operazioniForms.handleInputChange(event, mockSetItem);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockSetItem).toHaveBeenCalledWith(expect.any(Function));
    
    // Simula il risultato finale di setItem
    const currentState = {};
    const updateFunction = mockSetItem.mock.calls[0][0];
    const newState = updateFunction(currentState);
    
    expect(newState).toEqual({
      primo_anno: '2025',
      ultimo_anno: 2026,
    });
  });

  test('Non chiama setItem poiché il valore non è valido.', () => {
    const event = {
      preventDefault: jest.fn(),
      target: {
        name: 'nuovo_nome_cliente',
        value: 'ValoreMoltoLungo'.repeat(10),
        id: 'nuovo_nome_cliente',
      },
    };

    operazioniForms.handleInputChange(event, mockSetItem);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockSetItem).not.toHaveBeenCalled();
  });

  test('Cambio tipo di input in "data" per ID specifici.', () => {
    const event = {
      target: {
        id: 'nuovo_giorno_lavoro',
        type: 'text',
      },
    };

    operazioniForms.handleInputClick(event, mockSetItem);

    expect(event.target.type).toBe('date'); // Verifica che il tipo sia cambiato
  });

  test('Modifica del valore di input e chiamata setItem correttamente per gli ID relativi al prezzo.', () => {
    const event = {
      target: {
        id: 'nuovo_prezzo_servizio',
        name: 'prezzo',
        value: '12345 €',
      },
    };

    operazioniForms.handleInputClick(event, mockSetItem);

    expect(mockSetItem).toHaveBeenCalledWith(expect.any(Function));

    // Simula il risultato finale di setItem
    const currentState = { prezzo: '' };
    const updateFunction = mockSetItem.mock.calls[0][0];
    const newState = updateFunction(currentState);

    expect(newState).toEqual({
      prezzo: '12345', // Verifica che il valore sia stato modificato
    });
  });

  test('Non dovrebbe cambiare il tipo di input o modificare il valore per ID non correlati.', () => {
    const event = {
      target: {
        id: 'unrelated_id',
        type: 'text',
        name: 'qualcosa',
        value: 'test',
      },
    };

    operazioniForms.handleInputClick(event, mockSetItem);

    expect(event.target.type).toBe('text'); // Il tipo non cambia
    expect(mockSetItem).not.toHaveBeenCalled(); // setItem non viene chiamato
  });

  test('Test 1 handleInputBlur primo if..', () => {
    const event = {
      target: {
        id: 'nuovo_giorno_spesa', 
        value: "01/02/2024", 
        type: 'text',
      },
    };

    operazioniForms.handleInputBlur(event, mockSetItem);

    expect(event.target.type).toBe('date'); // Verifica che il tipo sia cambiato
  });

  test('Test 2 handleInputBlur primo if..', () => {
    const event = {
      target: {
        id: 'nuovo_giorno_spesa', 
        value: "", 
        type: 'date',
      },
    };

    operazioniForms.handleInputBlur(event, mockSetItem);

    expect(event.target.type).toBe('text'); // Verifica che il tipo sia cambiato
  });

  test('Test 3 handleInputBlur secondo if..', () => {
    const event = {
      target: {
        id: "ricerca_totale_max_spesa", 
        name: "ricerca_totale_max_spesa",
        value: 20
      },
    };

    operazioniForms.handleInputBlur(event, mockSetItem);

    expect(mockSetItem).toHaveBeenCalledWith(expect.any(Function));
    
    // Simula il risultato finale di setItem
    const currentState = {};
    const updateFunction = mockSetItem.mock.calls[0][0];
    const newState = updateFunction(currentState);
    expect(newState).toEqual({
      ricerca_totale_max_spesa: "20 €"
    });
  });
});
