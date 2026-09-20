import { CartaActions } from "../../../../react_redux/actions/CartaActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { cartaSliceActions } from "../../../../react_redux/store/reducers/CartaReducer";
import { controlloCarta } from "../../../../utils/Controlli";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock("../../../../utils/Controlli", () => ({
  ...jest.requireActual("../../../../utils/Controlli"), 
  controlloCarta: jest.fn()
}))

describe('Vari test su "inserimentoCarta', () => {
  let cartaActions;

  beforeEach(() => {
    cartaActions = new CartaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  /** UT_CrtA_InsCrt_01 **/
  test('num_errori > 0', async () => {
    const mockSetNuovaCarta = jest.fn();
    
    controlloCarta.mockReturnValue({ dati_carta:"dati_carta", num_errori:1 });

    const result = await cartaActions.inserimentoCarta({dati_carta:"dati_carta"}, mockSetNuovaCarta);

    expect(mockSetNuovaCarta).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  /** UT_CrtA_InsCrt_02 **/
  test('num_errori = 0 AND nuovaCarta.is_visa = true AND response.ok = false', async () => {
    const mockSetNuovaCarta = jest.fn();

    let nuovaCarta = { is_visa:true };
    
    controlloCarta.mockReturnValue({ is_visa:true, num_errori:0 });

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await cartaActions.inserimentoCarta(nuovaCarta, mockSetNuovaCarta);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', {...nuovaCarta, circuito:"VISA"});
    expect(mockSetNuovaCarta).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(nuovaCarta.circuito).toEqual("VISA");
    expect(result).toEqual({ isOK:false, responseStatus:401 });
  });

  /** UT_CrtA_InsCrt_03 **/
  test('num_errori = 0 AND nuovaCarta.is_visa = false AND response.ok = false', async () => {
    const mockSetNuovaCarta = jest.fn();

    let nuovaCarta = { is_visa:false };
    
    controlloCarta.mockReturnValue({ is_visa:false, num_errori:0 });

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await cartaActions.inserimentoCarta(nuovaCarta, mockSetNuovaCarta);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', {...nuovaCarta, circuito:"MASTERCARD"});
    expect(mockSetNuovaCarta).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(nuovaCarta.circuito).toEqual("MASTERCARD");
    expect(result).toEqual({ isOK:false, responseStatus:401 });
  });

  /** UT_CrtA_InsCrt_04 **/
  test('num_errori = 0 AND nuovaCarta.is_visa = true AND response.ok = true', async () => {
    const mockSetNuovaCarta = jest.fn();

    let nuovaCarta = { is_visa:true };
    
    controlloCarta.mockReturnValue({ is_visa:true, num_errori:0 });

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id:5 }),
    });

    const result = await cartaActions.inserimentoCarta(nuovaCarta, mockSetNuovaCarta);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', {...nuovaCarta, circuito:"VISA"});
    expect(mockSetNuovaCarta).toHaveBeenCalledWith({ is_visa:true, circuito:"VISA", id:5 });
    expect(mockSetNuovaCarta).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      cartaSliceActions.aggiungiCarta({carta:{ is_visa:true, circuito:"VISA", id:5 }})
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(nuovaCarta.circuito).toEqual("VISA");
    expect(result).toEqual({ isOK:true, responseStatus:200 });
  });

  /** UT_CrtA_InsCrt_05 **/
  test('num_errori = 0 AND nuovaCarta.is_visa = false AND response.ok = true', async () => {
    const mockSetNuovaCarta = jest.fn();

    let nuovaCarta = { is_visa:false };
    
    controlloCarta.mockReturnValue({ is_visa:false, num_errori:0 });

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id:5 }),
    });

    const result = await cartaActions.inserimentoCarta(nuovaCarta, mockSetNuovaCarta);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', {...nuovaCarta, circuito:"MASTERCARD"});
    expect(mockSetNuovaCarta).toHaveBeenCalledWith({ is_visa:false, circuito:"MASTERCARD", id:5 });
    expect(mockSetNuovaCarta).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      cartaSliceActions.aggiungiCarta({carta:{ is_visa:false, circuito:"MASTERCARD", id:5 }})
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(nuovaCarta.circuito).toEqual("MASTERCARD");
    expect(result).toEqual({ isOK:true, responseStatus:200 });
  });
});

describe('Vari test su "ottenimentoCarteCliente"', () => {
  let cartaActions;

  beforeEach(() => {
    cartaActions = new CartaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CrtA_OttCrtCli_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await cartaActions.ottenimentoCarteCliente(5);

    expect(responseSpy).toHaveBeenCalledWith('/OTTENIMENTO_CARTE_CLIENTE', { id_cliente:5 });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({ isOK:false, responseStatus:401 });
  });

  /** UT_CrtA_OttCrtCli_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["carta1", "carta2"] })
    });

    const result = await cartaActions.ottenimentoCarteCliente(5);

    expect(responseSpy).toHaveBeenCalledWith('/OTTENIMENTO_CARTE_CLIENTE', { id_cliente:5 });
    expect(mockDispatch).toHaveBeenCalledWith(
      cartaSliceActions.aggiornaCarte({carte:["carta1", "carta2"]})
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ isOK:true, responseStatus:200 });
  });
});

describe('Vari test su "eliminazioneCarta"', () => {
  let cartaActions;

  beforeEach(() => {
    cartaActions = new CartaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CrtA_EliCrt_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await cartaActions.eliminazioneCarta(10, 5);

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_CARTA', { id_carta:10, id_cliente:5 });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({ isOK:false, responseStatus:401 });
  });

  /** UT_CrtA_EliCrt_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await cartaActions.eliminazioneCarta(10, 5);

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_CARTA', { id_carta:10, id_cliente:5 });
    expect(mockDispatch).toHaveBeenCalledWith(
      cartaSliceActions.rimuoviCarta({id:10})
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ isOK:true, responseStatus:200 });
  });
});









