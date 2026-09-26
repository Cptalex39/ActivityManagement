//import { OperazioniForms } from '../../../../view/forms/OperazioniForms';
import { OperazioniForms } from "../../../../react_redux/views/forms/OperazioniForms";

describe('OperazioniForms', () => {
  let operazioniForms;
  let mockSetItem;

  beforeEach(() => {
    operazioniForms = new OperazioniForms();
    mockSetItem = jest.fn(); // Crea un mock per la funzione `setItem`
  });

  /** RT_UT_OpForms_01 **/
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

  /** RT_UT_OpForms_02 **/
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
});









