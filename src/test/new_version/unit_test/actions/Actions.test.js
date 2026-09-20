import { Actions } from "../../../../react_redux/actions/Actions";

let actions;

beforeEach(() => {
  actions = new Actions();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Vari test su "getResponse"', () => {
  /** UT_A_GetRes_01 **/
  test('Deve chiamare fetch con il metodo POST, gli header e il body corretti', async () => {
    const fakeResponse = { ok: true };
    global.fetch.mockResolvedValue(fakeResponse);

    const operation = '/UN_OPERAZIONE';
    const data = { chiave: 'valore' };

    const result = await actions.getResponse(operation, data);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(operation, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    expect(result).toBe(fakeResponse);
  });

  /** UT_A_GetRes_02 **/
  test('Deve propagare il rifiuto (reject) se fetch fallisce', async () => {
    const errore = new Error('Errore di rete');
    global.fetch.mockRejectedValue(errore);

    await expect(actions.getResponse('/OP', {})).rejects.toThrow('Errore di rete');
  });
});

describe('Vari test su "getAllItems"', () => {
  /** UT_A_GetAllItm_01 **/
  test('Deve chiamare getResponse con l\'operazione e il tipo item corretti', async () => {
    const responseSpy = jest.spyOn(actions, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items: [] }),
    });
    const setItems = jest.fn();

    await actions.getAllItems(setItems, 'prodotto');

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_TUTTI_GLI_ITEMS', {
      tipo_item: 'prodotto',
    });
  });

  /** UT_A_GetAllItm_02 **/
  test('Quando la risposta e\' ok, deve chiamare setItems con gli items e restituire isOK true', async () => {
    const items = [{ id: 1 }, { id: 2 }];
    jest.spyOn(actions, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items }),
    });
    const setItems = jest.fn();

    const result = await actions.getAllItems(setItems, 'prodotto');

    expect(setItems).toHaveBeenCalledWith(items);
    expect(result).toEqual({ isOK: true, responseStatus: 200 });
  });
  
  /** UT_A_GetAllItm_03 **/
  test('Quando la risposta non e\' ok, non deve chiamare setItems e deve restituire isOK false', async () => {
    jest.spyOn(actions, 'getResponse').mockResolvedValue({
      ok: false,
      status: 404,
      json: jest.fn(),
    });
    const setItems = jest.fn();

    const result = await actions.getAllItems(setItems, 'prodotto');

    expect(setItems).not.toHaveBeenCalled();
    expect(result).toEqual({ isOK: false, responseStatus: 404 });
  });
  
  /** UT_A_GetAllItm_04 **/
  test('Deve propagare l\'errore se getResponse fallisce', async () => {
    const errore = new Error('Errore di rete');
    jest.spyOn(actions, 'getResponse').mockRejectedValue(errore);
    const setItems = jest.fn();

    await expect(actions.getAllItems(setItems, 'prodotto')).rejects.toThrow('Errore di rete');
    expect(setItems).not.toHaveBeenCalled();
  });
});










