import { ClienteActions } from "../../../../react_redux/actions/ClienteActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { clienteSliceActions } from "../../../../react_redux/store/reducers/ClienteReducer";
import { controlloRicercaClienti } from "../../../../utils/Controlli";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../utils/Controlli', () => ({
  ...jest.requireActual('../../../../utils/Controlli'),
  controlloRicercaClienti: jest.fn(), 
}));

describe('Vari test su "azzeraLista"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_CliA_AzzLis_01 **/
  test('Lista azzerata', () => {
    const result = clienteActions.azzeraLista();

    expect(mockDispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaClienti({clienti:[], listaDaAggiornare:"clienti"})
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "ricercaClienti"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_CliA_RicCli_01 **/
  test('num_errori > 0', async () => {
    const mockSetDatiRicerca = jest.fn();
    let datiRicerca = {dati_ricerca:"dati_ricerca"};
    
    controlloRicercaClienti.mockReturnValue({dati_ricerca:"dati_ricerca", num_errori:1});
    const result = await clienteActions.ricercaClienti(datiRicerca, mockSetDatiRicerca);

    expect(mockSetDatiRicerca).toHaveBeenCalledWith({dati_ricerca:"dati_ricerca", num_errori:1});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  /** RT_UT_CliA_RicCli_02 **/
  test('num_errori = 0 AND response.ok = false', async () => {
    const mockSetDatiRicerca = jest.fn();
    let datiRicerca = {dati_ricerca:"dati_ricerca"};

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    controlloRicercaClienti.mockReturnValue({dati_ricerca:"dati_ricerca", num_errori:0});
    const result = await clienteActions.ricercaClienti(datiRicerca, mockSetDatiRicerca);
    
    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicerca);
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({dati_ricerca:"dati_ricerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({isOK:false, responseStatus:401});
  });

  /** RT_UT_CliA_RicCli_03 **/
  test('num_errori = 0 AND response.ok = true', async () => {
    const mockSetDatiRicerca = jest.fn();
    let datiRicerca = {dati_ricerca:"dati_ricerca"};

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:[{user:"m.rossi"}, {user:"l.verdi"}] }),
    });
    
    controlloRicercaClienti.mockReturnValue({dati_ricerca:"dati_ricerca", num_errori:0});
    const result = await clienteActions.ricercaClienti(datiRicerca, mockSetDatiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicerca);
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({dati_ricerca:"dati_ricerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaClienti({
        clienti: [{user:"m.rossi"}, {user:"l.verdi"}], 
        listaDaAggiornare: "clienti"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({isOK:true, responseStatus:200});
  });
});









