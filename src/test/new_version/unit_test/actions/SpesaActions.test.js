import { SpesaActions } from "../../../../react_redux/actions/SpesaActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { controlloRicercaSpese } from "../../../../utils/Controlli";
import { generaFilePDF, generaFileSpeseExcel } from "../../../../utils/File";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../utils/Controlli', () => ({
  ...jest.requireActual('../../../../utils/Controlli'),
  controlloSpesa: jest.fn(), 
  controlloRicercaSpese: jest.fn(), 
}));

jest.mock('../../../../utils/File', () => ({
  ...jest.requireActual('../../../../utils/File'),
  generaFilePDF: jest.fn(), 
  generaFileSpeseExcel: jest.fn(), 
}));

describe('Vari test su "handleSearchSpeseRangeFile"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_SpeA_HndSrcSpeRngFil_01 **/
  test('num_errori > 0', async () => {
    const mockSetTipoFile = jest.fn();
    const mockSetDatiRicerca = jest.fn();
    const mockSetSpese = jest.fn(); 
    const tipoFile = "pdf";
    const datiRicerca = {datiRicerca:"datiRicerca"}
    
    controlloRicercaSpese.mockReturnValue({datiRicerca:"datiRicerca", num_errori:1});
    

    const result = await spesaActions.handleSearchSpeseRangeFile(tipoFile, mockSetTipoFile, datiRicerca, mockSetDatiRicerca, mockSetSpese);

    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:1});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** UT_SpeA_HndSrcSpeRngFil_02 **/
  test('num_errori = 0 AND response.ok = false', async () => {
    const mockSetTipoFile = jest.fn();
    const mockSetDatiRicerca = jest.fn();
    const mockSetSpese = jest.fn(); 
    const tipoFile = "pdf";
    const datiRicerca = {datiRicerca:"datiRicerca"}
    
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    controlloRicercaSpese.mockReturnValue({...datiRicerca, num_errori:0});

    const result = await spesaActions.handleSearchSpeseRangeFile(tipoFile, mockSetTipoFile, datiRicerca, mockSetDatiRicerca, mockSetSpese);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicerca);
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });
  
  /** UT_SpeA_HndSrcSpeRngFil_03 **/
  test('num_errori = 0 AND response.ok = true AND tipofile = "pdf"', async () => {
    const mockSetTipoFile = jest.fn();
    const mockSetDatiRicerca = jest.fn();
    const mockSetSpese = jest.fn(); 
    const tipoFile = "pdf";
    const datiRicerca = {datiRicerca:"datiRicerca"}

    generaFilePDF.mockReturnValue("... File PDF generato.");
    
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }), 
    });
    
    controlloRicercaSpese.mockReturnValue({...datiRicerca, num_errori:0});

    const result = await spesaActions.handleSearchSpeseRangeFile(tipoFile, mockSetTipoFile, datiRicerca, mockSetDatiRicerca, mockSetSpese);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicerca);
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockSetSpese).toHaveBeenCalledWith(["items1", "items2"]);
    expect(mockSetSpese).toHaveBeenCalledTimes(1);
    expect(generaFilePDF).toHaveBeenCalledWith(["items1", "items2"], "Spese");
    expect(generaFilePDF).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200, 
    });
  });
  
  /** UT_SpeA_HndSrcSpeRngFil_04 **/
  test('num_errori = 0 AND response.ok = true AND tipofile != "pdf"', async () => {
    const mockSetTipoFile = jest.fn();
    const mockSetDatiRicerca = jest.fn();
    const mockSetSpese = jest.fn(); 
    const tipoFile = "excel";
    const datiRicerca = {datiRicerca:"datiRicerca"}

    generaFileSpeseExcel.mockReturnValue("... File excel generato.");
    
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }), 
    });
    
    controlloRicercaSpese.mockReturnValue({...datiRicerca, num_errori:0});

    const result = await spesaActions.handleSearchSpeseRangeFile(tipoFile, mockSetTipoFile, datiRicerca, mockSetDatiRicerca, mockSetSpese);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicerca);
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockSetSpese).toHaveBeenCalledWith(["items1", "items2"]);
    expect(mockSetSpese).toHaveBeenCalledTimes(1);
    expect(generaFileSpeseExcel).toHaveBeenCalledWith(["items1", "items2"]);
    expect(generaFileSpeseExcel).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200, 
    });
  });
});









