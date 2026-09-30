import { SpesaActions } from "../../../../react_redux/actions/SpesaActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { spesaSliceActions } from "../../../../react_redux/store/reducers/SpesaReducer";
import { controlloSpesa, controlloRicercaSpese } from "../../../../utils/Controlli";

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

describe('Vari test su "azzeraLista"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SpeA_AzzLis_01 **/
  test('Lista azzerata', () => {
    const result = spesaActions.azzeraLista();

    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({
        spese: -1
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "inserimentoSpesa"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  /** RT_UT_SpeA_InsSpe_01 **/
  test('num_errori > 0', async () => {
    mockSetNuovaSpesa = jest.fn();
    controlloSpesa.mockReturnValue({ nuovaSpesa:"nuovaSpesa", num_errori:1 })

    const result = await spesaActions.inserimentoSpesa({ nuovaSpesa:"nuovaSpesa" }, mockSetNuovaSpesa);

    expect(mockSetNuovaSpesa).toHaveBeenCalledWith({ nuovaSpesa:"nuovaSpesa", num_errori:1 })
    expect(mockSetNuovaSpesa).toHaveBeenCalledTimes(1)
    expect(result).toBeNull();
  });

  /** RT_UT_SpeA_InsSpe_02 **/
  test('num_errori = 0 AND response.ok = false', async () => {
    mockSetNuovaSpesa = jest.fn();

    const nuovaSpesa = {
      nome: "Bolletta luce", 
      descrizione: "Descrizione della spesa", 
      totale: 123.45, 
      giorno: "2022-10-05", 
      note: "Note sulla spesa", 
    };

    controlloSpesa.mockReturnValue({ ...nuovaSpesa, num_errori:0 });

    const nuovaSpesaSpy = {
      ...nuovaSpesa, 
      num_errori: 0,
      nome_attuale: nuovaSpesa.nome, 
      descrizione_attuale: nuovaSpesa.descrizione, 
      totale_attuale: nuovaSpesa.totale, 
      giorno_attuale: nuovaSpesa.giorno, 
      note_attuale: nuovaSpesa.note, 
    }

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await spesaActions.inserimentoSpesa(nuovaSpesa, mockSetNuovaSpesa);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', nuovaSpesaSpy);
    expect(mockSetNuovaSpesa).toHaveBeenCalledWith({ ...nuovaSpesa, num_errori:0 })
    expect(mockSetNuovaSpesa).toHaveBeenCalledTimes(1)
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });
  
  /** RT_UT_SpeA_InsSpe_03 **/
  test('num_errori = 0 AND response.ok = true', async () => {
    mockSetNuovaSpesa = jest.fn();

    const nuovaSpesa = {
      nome: "Bolletta luce", 
      descrizione: "Descrizione della spesa", 
      totale: 123.45, 
      giorno: "2022-10-05", 
      note: "Note sulla spesa", 
    };

    controlloSpesa.mockReturnValue({ ...nuovaSpesa, num_errori:0 });

    const nuovaSpesaSpy = {
      ...nuovaSpesa, 
      num_errori: 0, 
      nome_attuale: nuovaSpesa.nome, 
      descrizione_attuale: nuovaSpesa.descrizione, 
      totale_attuale: nuovaSpesa.totale, 
      giorno_attuale: nuovaSpesa.giorno, 
      note_attuale: nuovaSpesa.note, 
    }

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id: 5 }),
    });

    const result = await spesaActions.inserimentoSpesa(nuovaSpesa, mockSetNuovaSpesa);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', nuovaSpesaSpy);
    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.inserimentoSpesa({
        nuovaSpesa: { ...nuovaSpesaSpy, id:5 },
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(mockSetNuovaSpesa).toHaveBeenNthCalledWith(1, { ...nuovaSpesa, num_errori:0 });
    expect(mockSetNuovaSpesa).toHaveBeenNthCalledWith(2, { ...nuovaSpesaSpy, id:5 });
    expect(mockSetNuovaSpesa).toHaveBeenCalledTimes(2);

    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ricercaSpese"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SpeA_RicSpe_01 **/
  test('num_errori > 0', async () => {
    const mockSetDatiRicerca = jest.fn();
    controlloRicercaSpese.mockReturnValue({datiRicerca:"datiRicerca", num_errori:1});

    const result = await spesaActions.ricercaSpese({datiRicerca:"datiRicerca"}, mockSetDatiRicerca);

    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:1});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** RT_UT_SpeA_RicSpe_02 **/
  test('num_errori = 0 AND response.ok = false', async () => {
    const mockSetDatiRicerca = jest.fn();
    controlloRicercaSpese.mockReturnValue({datiRicerca:"datiRicerca", num_errori:0});

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await spesaActions.ricercaSpese({datiRicerca:"datiRicerca"}, mockSetDatiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', {datiRicerca:"datiRicerca"});
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ 
      isOK: false,
      responseStatus: 401,
    });
  });

  /** RT_UT_SpeA_RicSpe_03 **/
  test('num_errori = 0 AND response.ok = true', async () => {
    const mockSetDatiRicerca = jest.fn();
    controlloRicercaSpese.mockReturnValue({datiRicerca:"datiRicerca", num_errori:0});

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    const result = await spesaActions.ricercaSpese({datiRicerca:"datiRicerca"}, mockSetDatiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', {datiRicerca:"datiRicerca"});
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({
        spese: ["items1", "items2"],
      })
    )
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ 
      isOK: true,
      responseStatus: 200,
    });
  });
});

describe('Vari test su "selezioneOperazioneSpesa"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SpeA_SelOpSpe_01 **/
  test('icon != "trash" AND icon != "pencil"', () => {
    const icon = "test";
    const item = {item:"item"};
    const selectedIdsModifica = [];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();

    const result = spesaActions.selezioneOperazioneSpesa(
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

  /** RT_UT_SpeA_SelOpSpe_02 **/
  test('icon = "trash" AND selectedIdsEliminazione.includes(item.id)', () => {
    const icon = "trash";
    const item = {id:6};
    const selectedIdsModifica = [];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedTrashCount = selectedIdsEliminazione.length;

    const result = spesaActions.selezioneOperazioneSpesa(
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
    expect(mockSetSelectedTrashCount).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaTipoSelezione({
        id_spesa: item.id, 
        nuova_selezione: 0,
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** RT_UT_SpeA_SelOpSpe_03 **/
  test('icon = "trash" AND !selectedIdsEliminazione.includes(item.id)', () => {
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

    const result = spesaActions.selezioneOperazioneSpesa(
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
      spesaSliceActions.getSpesaPrimaDellaModifica({
        id_spesa: item.id, 
      })
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 
      spesaSliceActions.aggiornaTipoSelezione({
        id_spesa: item.id, 
        nuova_selezione: 2, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(result).toBeUndefined();
  });

  /** RT_UT_SpeA_SelOpSpe_04 **/
  test('icon = "pencil" AND selectedIdsModifica.includes(item.id)', () => {
    const icon = "pencil";
    const item = {id:5};
    const selectedIdsModifica = [1,3,5,7,9];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedPencilCount = selectedIdsModifica.length;

    const result = spesaActions.selezioneOperazioneSpesa(
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
      spesaSliceActions.getSpesaPrimaDellaModifica({
        id_spesa: item.id, 
      })
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 
      spesaSliceActions.aggiornaTipoSelezione({
        id_spesa: item.id, 
        nuova_selezione: 0, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(2);

    expect(mockSetSelectedIdsEliminazione).not.toHaveBeenCalled();
    expect(mockSetSelectedTrashCount).not.toHaveBeenCalled();

    expect(result).toBeUndefined();
  });

  /** RT_UT_SpeA_SelOpSpe_05 **/
  test('icon = "pencil" AND !selectedIdsModifica.includes(item.id)', () => {
    const icon = "pencil";
    const item = {id:6};
    const selectedIdsModifica = [1,3,5,7,9];
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedPencilCount = selectedIdsModifica.length;

    const result = spesaActions.selezioneOperazioneSpesa(
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
      spesaSliceActions.aggiornaTipoSelezione({
        id_spesa: item.id, 
        nuova_selezione: 1, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(result).toBeUndefined();
  });
});

describe('Vari test su "modificaSpese"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SpeA_ModSpe_01 **/
  test('spese = [] AND speseDaModificare = []', async () => {
    const mockSetSelectedIdsModifica = jest.fn();

    const spese = [];
    const selectedIdsModifica = [];

    const result = await spesaActions.modificaSpese(spese, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({
        spese: [], 
      })
    )
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      esitiModifiche: [],
    });
  });

  /** RT_UT_SpeA_ModSpe_02 **/
  test('spese != [] AND speseDaModificare = []', async () => {
    const mockSetSelectedIdsModifica = jest.fn();

    const spese= [
      {nome:"Spesa 1", tipo_selezione:1}, 
      {nome:"Spesa 2", tipo_selezione:0}, 
      {nome:"Spesa 3", tipo_selezione:2}, 
      {nome:"Spesa 4", tipo_selezione:1},
    ];
    const selectedIdsModifica = [];

    const result = await spesaActions.modificaSpese(spese, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({
        spese: [
          {nome:"Spesa 1", tipo_selezione:0}, 
          {nome:"Spesa 2", tipo_selezione:0}, 
          {nome:"Spesa 3", tipo_selezione:2}, 
          {nome:"Spesa 4", tipo_selezione:0},
        ], 
      })
    )
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      esitiModifiche: [],
    });
  });

  /** RT_UT_SpeA_ModSpe_03 **/
  test('spese != [] AND speseDaModificare != [] con 1 errore (nome)', async () => {
    const mockSetSelectedIdsModifica = jest.fn();
    const spese = [
      {
        id: 1, 
        nome: "Spesa 1", 
        descrizione: "Descrizione spesa 1", 
        totale: 100.12, 
        giorno: "2022-1-2", 
        note: "Note spesa 1", 
        tipo_selezione: 1, 
      }, 
      {
        id: 2, 
        nome: "Spesa 2", 
        descrizione: "Descrizione spesa 2", 
        totale: 200.34, 
        giorno: "2022-3-4", 
        note: "Note spesa 2", 
        tipo_selezione: 0, 
      }, 
      {
        id: 3, 
        nome: "Spesa 3", 
        descrizione: "Descrizione spesa 3", 
        totale: 300.56, 
        giorno: "2022-5-6", 
        note: "Note spesa 3", 
        tipo_selezione: 2,
      }, 
      {
        id: 4, 
        nome: "Spesa 4 !!", 
        descrizione: "Descrizione spesa 4", 
        totale: 400.78, 
        giorno: "2022-7-8", 
        note: "Note spesa 4", 
        tipo_selezione: 1, 
      },
    ];
    
    controlloSpesa
      .mockReturnValueOnce({
        ...spese[0], 
        num_errori: 0 
      })
      .mockReturnValueOnce({
        ...spese[3], 
        num_errori: 1, 
        errore_nome: "Errore nome spesa"
      });

    const selectedIdsModifica = [1, 4];

    const erroreModificaSpese = "" 
      + "Errore spesa numero 2:\n" 
      + "- Errore nome spesa\n";

    const result = await spesaActions.modificaSpese(spese, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(window.alert).toHaveBeenCalledWith(erroreModificaSpese);
    expect(result).toBeNull();
  });

  /** RT_UT_SpeA_ModSpe_04 **/
  test('spese != [] AND speseDaModificare != [] con 0 errori', async () => {
    const mockSetSelectedIdsModifica = jest.fn();
    controlloSpesa
      .mockReturnValueOnce({id:1, nome:"Spesa 1", tipo_selezione:1, num_errori:0 })
      .mockReturnValueOnce({id:4, nome:"Spesa 4", tipo_selezione:1, num_errori:0 })

    const spese = [
      {id:1, nome:"Spesa 1", tipo_selezione:1}, 
      {id:2, nome:"Spesa 2", tipo_selezione:0}, 
      {id:3, nome:"Spesa 3", tipo_selezione:2}, 
      {id:4, nome:"Spesa 4", tipo_selezione:1},
    ];
    const selectedIdsModifica = [1,4];

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ ok:true, status:200 })
      .mockResolvedValueOnce({ ok:false, status:401 });

    const result = await spesaActions.modificaSpese(spese, selectedIdsModifica, mockSetSelectedIdsModifica);
    
    expect(controlloSpesa).toHaveBeenCalledTimes(2);
    expect(responseSpy).toHaveBeenCalledTimes(2);

    expect(responseSpy).toHaveBeenNthCalledWith(1, "/MODIFICA_ITEM", { tipo_item:"spesa", item:spese[0] });
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_ITEM", { tipo_item:"spesa", item:spese[3] });
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 
      spesaSliceActions.aggiornaSpese({
        spese: [
          {id:1, nome:"Spesa 1", tipo_selezione:0}, 
          {id:2, nome:"Spesa 2", tipo_selezione:0}, 
          {id:3, nome:"Spesa 3", tipo_selezione:2}, 
          {id:4, nome:"Spesa 4", tipo_selezione:0},
        ], 
      })
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(2, 
      spesaSliceActions.getSpesaPrimaDellaModifica({
        id_spesa: 4
      })
    );
    expect(mockDispatch).toHaveBeenNthCalledWith(3, 
      spesaSliceActions.getSpesaDopoLaModifica({
        id_spesa: 1
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      esitiModifiche: [[true, 200], [false, 401]],
    });
  });

  /** RT_UT_SpeA_ModSpe_05 **/
  test('spese != [] AND speseDaModificare != [] con 4 errori (descrizione, totale, giorno, note)', async () => {
    const mockSetSelectedIdsModifica = jest.fn();
    const spese = [
      {
        id: 1, 
        nome: "Spesa 1", 
        descrizione: "Descrizione spesa 1", 
        totale: 100.12, 
        giorno: "2022-1-2", 
        note: "Note spesa 1", 
        tipo_selezione: 1, 
      }, 
      {
        id: 2, 
        nome: "Spesa 2", 
        descrizione: "Descrizione spesa 2", 
        totale: 200.34, 
        giorno: "2022-3-4", 
        note: "Note spesa 2", 
        tipo_selezione: 0, 
      }, 
      {
        id: 3, 
        nome: "Spesa 3", 
        descrizione: "Descrizione spesa 3", 
        totale: 300.56, 
        giorno: "2022-5-6", 
        note: "Note spesa 3", 
        tipo_selezione: 2,
      }, 
      {
        id: 4, 
        nome: "Spesa 4", 
        descrizione: "Descrizione spesa 4 !!", 
        totale: -400.78, 
        giorno: "2022-7-8 !!", 
        note: "Note spesa 4 !!", 
        tipo_selezione: 1, 
      },
    ];
    
    controlloSpesa
      .mockReturnValueOnce({
        ...spese[0], 
        num_errori: 0 
      })
      .mockReturnValueOnce({
        ...spese[3], 
        num_errori: 4, 
        errore_descrizione: "Errore descrizione spesa", 
        errore_totale: "Errore totale spesa", 
        errore_giorno: "Errore giorno spesa", 
        errore_note: "Errore note spesa", 
      });

    const selectedIdsModifica = [1, 4];

    const erroreModificaSpese = "" 
      + "Errore spesa numero 2:\n" 
      + "- Errore descrizione spesa\n"
      + "- Errore totale spesa\n"
      + "- Errore giorno spesa\n"
      + "- Errore note spesa";

    const result = await spesaActions.modificaSpese(spese, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(window.alert).toHaveBeenCalledWith(erroreModificaSpese);
    expect(result).toBeNull();
  });
});

describe('Vari test su "aggiornaSpesa"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SpeA_AgnSpe_01 **/
  test('Spesa aggiornata', () => {
    const result = spesaActions.aggiornaSpesa(5, "nome", "Nuovo nome spesa");

    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpesa({
        id_spesa: 5,
        nome_attributo: "nome", 
        nuovo_valore: "Nuovo nome spesa"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "eliminaSpese"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** RT_UT_SpeA_EliSpe_01 **/
  test('response.ok = false AND spese = []', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [];
    const spese = [];

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await spesaActions.eliminaSpese(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, spese)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item:"spesa", ids:selectedIdsEliminazione });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });
  
  /** RT_UT_SpeA_EliSpe_02 **/
  test('response.ok = true AND spese presenti', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [2, 4];
    const spese = [
      {id:1, nome:"Spesa 1"}, 
      {id:2, nome:"Spesa 2"}, 
      {id:3, nome:"Spesa 3"}, 
      {id:4, nome:"Spesa 4"}
    ];

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await spesaActions.eliminaSpese(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, spese)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item:"spesa", ids:selectedIdsEliminazione });
    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({
        spese: [
          {id:1, nome:"Spesa 1"}, 
          {id:3, nome:"Spesa 3"}
        ]
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

  /** RT_UT_SpeA_EliSpe_03 **/
  test('response.ok = false AND spese = -1', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [];
    const spese = -1;

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await spesaActions.eliminaSpese(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, spese)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item:"spesa", ids:selectedIdsEliminazione });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });

  /** RT_UT_SpeA_EliSpe_04 **/
  test('response.ok = true AND spese = null', async () => {
    const mockSetSelectedIdsEliminazione = jest.fn();
    const selectedIdsEliminazione = [2, 4];
    const spese = null;

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await spesaActions.eliminaSpese(selectedIdsEliminazione, mockSetSelectedIdsEliminazione, spese)

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS', { tipo_item:"spesa", ids:selectedIdsEliminazione });
    expect(mockDispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({
        spese: -1
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

describe('Vari test su "handleDeleteSpeseRangeFile"', () => {
  let spesaActions;

  beforeEach(() => {
    spesaActions = new SpesaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  /** RT_UT_SpeA_HndDelSpeRngFil_01 **/
  test('response.ok = false', async () => {
    const datiRicerca = {
      primo_giorno: "2022-10-05", 
      ultimo_giorno: "2024-08-04", 
    };
    const datiSpy = {
      ...datiRicerca, 
      tipo_item: "spesa", 
    }

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await spesaActions.handleDeleteSpeseRangeFile(datiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS_RANGE_GIORNI', datiSpy);
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** RT_UT_SpeA_HndDelSpeRngFil_02 **/
  test('response.ok = true', async () => {
    const datiRicerca = {
      primo_giorno: "2022-10-05", 
      ultimo_giorno: "2024-08-04", 
    };
    const datiSpy = {
      ...datiRicerca, 
      tipo_item: "spesa", 
    }

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await spesaActions.handleDeleteSpeseRangeFile(datiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEMS_RANGE_GIORNI', datiSpy);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200,
    });
  });
});









