import { ServizioActions } from "../../../../react_redux/actions/ServizioActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { servizioSliceActions } from "../../../../react_redux/store/reducers/ServizioReducer";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Vari test su "azzeraLista"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  /** RT_UT_SerA_AzzLis_01 **/
  test('lista azzerata', () => {
    const result = servizioActions.azzeraLista();

    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({
        servizi: -1
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "selezioneOperazioneServizio"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SerA_SelOpSer_01 **/
  test('icon != "trash" AND icon != "pencil"', () => {
    const icon = "test";
    const item = {item:"item"};
    const selectedIdsModifica = [];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();

    const result = servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    expect(mockSetSelectedIdsModifica).not.toHaveBeenCalled();
    expect(mockSetSelectedIdsEliminazione).not.toHaveBeenCalled();
    expect(mockSetSelectedPencilCount).not.toHaveBeenCalled();
    expect(mockSetSelectedTrashCount).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  /** RT_UT_SerA_SelOpSer_02 **/
  test('icon = "trash" AND selectedIdsEliminazione.includes(item.id) = true', () => {
    const icon = "trash";
    const item = {id:6};
    const selectedIdsModifica = [];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedTrashCount = selectedIdsEliminazione.length;

    const result = servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    expect(mockSetSelectedIdsModifica).not.toHaveBeenCalled();
    const updaterFn = mockSetSelectedIdsEliminazione.mock.calls[0][0];
    expect(typeof updaterFn).toBe('function');
    expect(updaterFn(selectedIdsEliminazione)).toEqual([2, 4, 8, 10]);
    const nuovoArray = updaterFn(selectedIdsEliminazione);
    expect(nuovoArray).toEqual([2, 4, 8, 10]);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedPencilCount).not.toHaveBeenCalled();
    const counterFn = mockSetSelectedTrashCount.mock.calls[0][0];
    expect(typeof counterFn).toBe('function');
    expect(counterFn(selectedTrashCount)).toEqual(nuovoArray.length);

    const counterTrashFn = mockSetSelectedTrashCount.mock.calls[0][0];
    expect(typeof counterTrashFn).toBe('function');
    expect(counterTrashFn(5)).toBe(4);
    expect(mockSetSelectedTrashCount).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaTipoSelezione({
        id_servizio: item.id, 
        nuova_selezione: 0,
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** RT_UT_SerA_SelOpSer_03 **/
  test('icon = "trash" AND selectedIdsEliminazione.includes(item.id) = false', () => {
    const icon = "trash";
    const item = {id:5};
    const selectedIdsModifica = [1,3,5,7,9];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedTrashCount = selectedIdsEliminazione.length;
    const selectedPencilCount = selectedIdsModifica.length;

    const result = servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    const updaterModifiedFn = mockSetSelectedIdsModifica.mock.calls[0][0];
    expect(typeof updaterModifiedFn).toBe('function');
    expect(updaterModifiedFn(selectedIdsModifica)).toEqual([1,3,7,9]);
    const nuovoArrayPencil = updaterModifiedFn(selectedIdsModifica); 
    expect(nuovoArrayPencil).toEqual([1,3,7,9]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);

    const updaterDeleteFn = mockSetSelectedIdsEliminazione.mock.calls[0][0];
    expect(typeof updaterDeleteFn).toBe('function');
    expect(updaterDeleteFn(selectedIdsEliminazione)).toEqual([2,4,6,8,10,5]);
    const nuovoArrayTrash = updaterDeleteFn(selectedIdsEliminazione); 
    expect(nuovoArrayTrash).toEqual([2,4,6,8,10,5]);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledTimes(1); 
    
    expect(mockSetSelectedPencilCount).toHaveBeenCalledTimes(1);
    const counterPencilFn = mockSetSelectedPencilCount.mock.calls[0][0];
    expect(typeof counterPencilFn).toBe('function');
    expect(counterPencilFn(selectedPencilCount)).toEqual(nuovoArrayPencil.length);
    
    const counterTrashFn = mockSetSelectedTrashCount.mock.calls[0][0];
    expect(typeof counterTrashFn).toBe('function');
    expect(counterTrashFn(selectedTrashCount)).toEqual(nuovoArrayTrash.length);
    expect(mockSetSelectedTrashCount).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenNthCalledWith(1, 
      servizioSliceActions.getServizioPrimaDellaModifica({
        id_servizio: item.id, 
      })
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 
      servizioSliceActions.aggiornaTipoSelezione({
        id_servizio: item.id, 
        nuova_selezione: 2, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(result).toBeUndefined();
  });
  
  /** RT_UT_SerA_SelOpSer_04 **/
  test('icon = "pencil" AND selectedIdsModifica.includes(item.id) = true', () => {
    const icon = "pencil";
    const item = {id:5};
    const selectedIdsModifica = [1,3,5,7,9];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedPencilCount = selectedIdsModifica.length;

    const result = servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    const updaterModifiedFn = mockSetSelectedIdsModifica.mock.calls[0][0];
    expect(typeof updaterModifiedFn).toBe('function');
    expect(updaterModifiedFn(selectedIdsModifica)).toEqual([1,3,7,9]);
    const nuovoArrayPencil = updaterModifiedFn(selectedIdsModifica); 
    expect(nuovoArrayPencil).toEqual([1,3,7,9]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    
    expect(mockSetSelectedPencilCount).toHaveBeenCalledTimes(1);
    const counterPencilFn = mockSetSelectedPencilCount.mock.calls[0][0];
    expect(typeof counterPencilFn).toBe('function');
    expect(counterPencilFn(selectedPencilCount)).toEqual(nuovoArrayPencil.length);
    
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 
      servizioSliceActions.getServizioPrimaDellaModifica({
        id_servizio: item.id, 
      })
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 
      servizioSliceActions.aggiornaTipoSelezione({
        id_servizio: item.id, 
        nuova_selezione: 0, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);

    expect(mockSetSelectedIdsEliminazione).not.toHaveBeenCalled();
    expect(mockSetSelectedTrashCount).not.toHaveBeenCalled();

    expect(result).toBeUndefined();
  });

  /** RT_UT_SerA_SelOpSer_05 **/
  test('icon = "pencil" AND selectedIdsModifica.includes(item.id) = false', () => {
    const icon = "pencil";
    const item = {id:6};
    const selectedIdsModifica = [1,3,5,7,9];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedPencilCount = selectedIdsModifica.length;

    const result = servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    const updaterModifiedFn = mockSetSelectedIdsModifica.mock.calls[0][0];
    expect(typeof updaterModifiedFn).toBe('function');
    expect(updaterModifiedFn(selectedIdsModifica)).toEqual([1,3,5,7,9,6]);
    const nuovoArrayPencil = updaterModifiedFn(selectedIdsModifica); 
    expect(nuovoArrayPencil).toEqual([1,3,5,7,9,6]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    
    expect(mockSetSelectedPencilCount).toHaveBeenCalledTimes(1);
    const counterPencilFn = mockSetSelectedPencilCount.mock.calls[0][0];
    expect(typeof counterPencilFn).toBe('function');
    expect(counterPencilFn(selectedPencilCount)).toEqual(nuovoArrayPencil.length);

    const updaterDeletedFn = mockSetSelectedIdsEliminazione.mock.calls[0][0];
    expect(typeof updaterDeletedFn).toBe('function');
    expect(updaterDeletedFn(selectedIdsEliminazione)).toEqual([2,4,8,10]);
    const nuovoArrayTrash = updaterDeletedFn(selectedIdsEliminazione); 
    expect(nuovoArrayTrash).toEqual([2,4,8,10]);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledTimes(1);

    const counterTrashFn = mockSetSelectedTrashCount.mock.calls[0][0];
    expect(typeof counterTrashFn).toBe('function');
    expect(counterTrashFn(5)).toBe(4);
    expect(mockSetSelectedTrashCount).toHaveBeenCalledTimes(1);
    

    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaTipoSelezione({
        id_servizio: item.id, 
        nuova_selezione: 1, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(result).toBeUndefined();
  });
});

describe('Vari test su "aggiornaServizio"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SerA_AgnSer_01 **/
  test('Servizio aggiornato', () => {
    const result = servizioActions.aggiornaServizio(5, "nome", "Nuovo nome servizio");

    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizio({
        id_servizio: 5,
        nome_attributo: "nome", 
        nuovo_valore: "Nuovo nome servizio"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "eliminaServizi"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  /** RT_UT_SerA_EliSer_01 **/
  test('response.ok = false AND servizi = []', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [];
    const servizi = [];

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await servizioActions.eliminaServizi(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, servizi)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item: "servizio", ids:selectedIdsEliminazione });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });

  /** RT_UT_SerA_EliSer_02 **/
  test('response.ok = true AND servizi presenti', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [2, 4];
    const servizi = [{id:1, nome:"Servizio 1"}, {id:2, nome:"Servizio 2"}, {id:3, nome:"Servizio 3"}, {id:4, nome:"Servizio 4"}];

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await servizioActions.eliminaServizi(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, servizi)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item: "servizio", ids:selectedIdsEliminazione });
    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({
        servizi: [{id:1, nome:"Servizio 1"}, {id:3, nome:"Servizio 3"}]
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200, 
    });
  });

  /** RT_UT_SerA_EliSer_03 **/
  test('response.ok = false AND servizi = -1', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [];
    const servizi = -1;

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await servizioActions.eliminaServizi(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, servizi)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item: "servizio", ids:selectedIdsEliminazione });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });

  /** RT_UT_SerA_EliSer_04 **/
  test('response.ok = true AND servizi = null', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [2, 4];
    const servizi = null;

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await servizioActions.eliminaServizi(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, servizi)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item: "servizio", ids:selectedIdsEliminazione });
    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({
        servizi: -1
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200, 
    });
  });
});









