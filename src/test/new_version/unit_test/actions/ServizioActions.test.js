import { ServizioActions } from "../../../../react_redux/actions/ServizioActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { servizioSliceActions } from "../../../../react_redux/store/reducers/ServizioReducer";
import { controlloRicercaServizi, controlloServizio } from "../../../../utils/Controlli";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../utils/Controlli', () => ({
  ...jest.requireActual('../../../../utils/Controlli'),
  controlloServizio: jest.fn(), 
  controlloRicercaServizi: jest.fn(),
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
  
  /** UT_SerA_AzzLis_01 **/
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

describe('Vari test su "inserisciServizio"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  /** UT_SerA_InsSer_01 **/
  test('num_errori > 0', async () => {
    mockSetNuovoServizio = jest.fn();
    controlloServizio.mockReturnValue({ nuovoServizio:"nuovoServizio", num_errori:1 })

    const result = await servizioActions.inserisciServizio({ nuovoServizio:"nuovoServizio" }, mockSetNuovoServizio);

    expect(mockSetNuovoServizio).toHaveBeenCalledWith({ nuovoServizio:"nuovoServizio", num_errori:1 })
    expect(mockSetNuovoServizio).toHaveBeenCalledTimes(1)
    expect(controlloServizio).toHaveBeenCalledWith({ nuovoServizio:"nuovoServizio" }, true);
    expect(result).toBeNull();
  });
  
  /** UT_SerA_InsSer_02 **/
  test('num_errori = 0 AND response.ok = false', async () => {
    mockSetNuovoServizio = jest.fn();

    const nuovoServizio = {
      nome: "Ricarica telefonica", 
      tipo: "Servizio", 
      prezzo: 10.12, 
      descrizione: "Descrizione del servizio", 
      note: "Note sul servizio",  
    };

    controlloServizio.mockReturnValue({ ...nuovoServizio, num_errori:0 });

    const nuovoServizioSpy = {
      ...nuovoServizio, 
      num_errori: 0, 
      nome_attuale: nuovoServizio.nome, 
      tipo_attuale: nuovoServizio.tipo, 
      prezzo_attuale: nuovoServizio.prezzo, 
      descrizione_attuale: nuovoServizio.descrizione, 
      note_attuale: nuovoServizio.note, 
      in_uso: "Si", 
      in_uso_attuale: "Si", 
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await servizioActions.inserisciServizio(nuovoServizio, mockSetNuovoServizio);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', nuovoServizioSpy);
    expect(mockSetNuovoServizio).toHaveBeenCalledWith({ ...nuovoServizio, num_errori:0 })
    expect(mockSetNuovoServizio).toHaveBeenCalledTimes(1)
    expect(controlloServizio).toHaveBeenCalledWith(nuovoServizio, true);
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
    });
  });
  
  /** UT_SerA_InsSer_03 **/
  test('num_errori = 0 AND response.ok = true', async () => {
    mockSetNuovoServizio = jest.fn();
    
    const nuovoServizio = {
      nome: "Ricarica telefonica", 
      tipo: "Servizio", 
      prezzo: 10.12, 
      descrizione: "Descrizione del servizio", 
      note: "Note sul servizio",  
    };

    controlloServizio.mockReturnValue({ ...nuovoServizio, num_errori:0 });

    const nuovoServizioSpy = {
      ...nuovoServizio, 
      num_errori: 0, 
      nome_attuale: nuovoServizio.nome, 
      tipo_attuale: nuovoServizio.tipo, 
      prezzo_attuale: nuovoServizio.prezzo, 
      descrizione_attuale: nuovoServizio.descrizione, 
      note_attuale: nuovoServizio.note, 
      in_uso: "Si", 
      in_uso_attuale: "Si", 
    };

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ id: 5 }),
    });

    const result = await servizioActions.inserisciServizio(nuovoServizio, mockSetNuovoServizio);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', nuovoServizioSpy);
    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.inserimentoServizio({
        nuovoServizio: { ...nuovoServizioSpy, id:5 },
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    expect(mockSetNuovoServizio).toHaveBeenNthCalledWith(1, { ...nuovoServizio, num_errori:0 });
    expect(mockSetNuovoServizio).toHaveBeenNthCalledWith(2, { ...nuovoServizioSpy, id:5 });
    expect(mockSetNuovoServizio).toHaveBeenCalledTimes(2);
    expect(controlloServizio).toHaveBeenCalledWith(nuovoServizio, true);
    expect(result).toEqual({
      isOK: true,
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ricercaServizi"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_SerA_RicSer_01 **/
  test('num_errori > 0', async () => {
    const mockSetDatiRicerca = jest.fn();
    controlloRicercaServizi.mockReturnValue({datiRicerca:"datiRicerca", num_errori:1});

    const result = await servizioActions.ricercaServizi({datiRicerca:"datiRicerca"}, mockSetDatiRicerca);

    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:1});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
  
  /** UT_SerA_RicSer_02 **/
  test('num_errori = 0 AND response.ok = false', async () => {
    const mockSetDatiRicerca = jest.fn();
    controlloRicercaServizi.mockReturnValue({datiRicerca:"datiRicerca", num_errori:0});

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
      json: jest.fn().mockResolvedValue({ items:[] }),
    });

    const result = await servizioActions.ricercaServizi({datiRicerca:"datiRicerca"}, mockSetDatiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', {datiRicerca:"datiRicerca"});
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      servizi: [], 
      isOK: false,
      responseStatus: 401,
    });
  });
  
  /** UT_SerA_RicSer_03 **/
  test('num_errori = 0 AND response.ok = true', async () => {
    const mockSetDatiRicerca = jest.fn();
    controlloRicercaServizi.mockReturnValue({datiRicerca:"datiRicerca", num_errori:0});

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    const result = await servizioActions.ricercaServizi({datiRicerca:"datiRicerca"}, mockSetDatiRicerca);

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', {datiRicerca:"datiRicerca"});
    expect(mockSetDatiRicerca).toHaveBeenCalledWith({datiRicerca:"datiRicerca", num_errori:0});
    expect(mockSetDatiRicerca).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({
        servizi: ["items1", "items2"],
      })
    )
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      servizi: ["items1", "items2"], 
      isOK: true,
      responseStatus: 200,
    });
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

  /** UT_SerA_SelOpSer_01 **/
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

  /** UT_SerA_SelOpSer_02 **/
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

  /** UT_SerA_SelOpSer_03 **/
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
  
  /** UT_SerA_SelOpSer_04 **/
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

  /** UT_SerA_SelOpSer_05 **/
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

describe('Vari test su "modificaServizi"', () => {
  let servizioActions;

  beforeEach(() => {
    servizioActions = new ServizioActions();
    jest.clearAllMocks();
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_SerA_ModSer_01 **/
  test('servizi = [] AND serviziDaModificare = []', async () => {
    const mockSetSelectedIdsModifica = jest.fn();

    const servizi = [];
    const selectedIdsModifica = [];

    const result = await servizioActions.modificaServizi(servizi, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({
        servizi: [], 
      })
    )
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      esitiModifiche: [],
    });
  });

  /** UT_SerA_ModSer_02 **/
  test('servizi != [] AND serviziDaModificare = []', async () => {
    const mockSetSelectedIdsModifica = jest.fn();

    const servizi = [
      {nome:"Servizio 1", tipo_selezione:1}, 
      {nome:"Servizio 2", tipo_selezione:0}, 
      {nome:"Servizio 3", tipo_selezione:2}, 
      {nome:"Servizio 4", tipo_selezione:1},
    ];
    const selectedIdsModifica = [];

    const result = await servizioActions.modificaServizi(servizi, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(mockDispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({
        servizi: [
          {nome:"Servizio 1", tipo_selezione:0}, 
          {nome:"Servizio 2", tipo_selezione:0}, 
          {nome:"Servizio 3", tipo_selezione:2}, 
          {nome:"Servizio 4", tipo_selezione:0},
        ], 
      })
    )
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      esitiModifiche: [],
    });
  });
  
  /** UT_SerA_ModSer_03 **/
  test('servizi != [] AND serviziDaModificare != [] con 1 errore (nome)', async () => {
    const mockSetSelectedIdsModifica = jest.fn();
    const servizi = [
      { 
        id: 1,
        nome: "Servizio 1",
        tipo: "Servizio",
        prezzo: 10.12,
        descrizione: "Descrizione servizio 1",
        note: "Note servizio 1",
        tipo_selezione: 1,
      },
      { 
        id: 2,
        nome: "Servizio 2",
        tipo: "Servizio",
        prezzo: 20.34,
        descrizione: "Descrizione servizio 2",
        note: "Note servizio 2",
        tipo_selezione: 0,
      },
      { 
        id: 3,
        nome: "Prodotto 1",
        tipo: "Prodotto",
        prezzo: 30.56,
        descrizione: "Descrizione prodotto 1",
        note: "Note prodotto 1",
        tipo_selezione: 2,
      },
      { 
        id: 4,
        nome: "Prodotto 2 !!",
        tipo: "Prodotto",
        prezzo: 40.78,
        descrizione: "Descrizione prodotto 2",
        note: "Note prodotto 2",
        tipo_selezione: 1,
      },
    ];

    controlloServizio
      .mockReturnValueOnce({ 
        ...servizi[0], 
        num_errori: 0 
      })
      .mockReturnValueOnce({ 
        ...servizi[3], 
        num_errori: 1, 
        errore_nome: "Errore nome servizio/prodotto", 
      });

    const selectedIdsModifica = [1, 4]; 
    
    const erroreModificaServizi = "" 
      + "Errore servizio numero 2:\n" 
      + "- Errore nome servizio/prodotto\n";

    const result = await servizioActions.modificaServizi(servizi, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(window.alert).toHaveBeenCalledWith(erroreModificaServizi);
    expect(controlloServizio).toHaveBeenCalledWith({ ...servizi[0] }, false);
    expect(result).toBeNull();
  });

  /** UT_SerA_ModSer_04 **/
  test('servizi != [] AND serviziDaModificare != [] con 0 errori', async () => {
    const mockSetSelectedIdsModifica = jest.fn();
    const servizi = [
      { 
        id: 1,
        nome: "Servizio 1",
        tipo: "Servizio",
        prezzo: 10.12,
        descrizione: "Descrizione servizio 1",
        note: "Note servizio 1",
        tipo_selezione: 1,
      },
      { 
        id: 2,
        nome: "Servizio 2",
        tipo: "Servizio",
        prezzo: 20.34,
        descrizione: "Descrizione servizio 2",
        note: "Note servizio 2",
        tipo_selezione: 0,
      },
      { 
        id: 3,
        nome: "Prodotto 1",
        tipo: "Prodotto",
        prezzo: 30.56,
        descrizione: "Descrizione prodotto 1",
        note: "Note prodotto 1",
        tipo_selezione: 2,
      },
      { 
        id: 4,
        nome: "Prodotto 2",
        tipo: "Prodotto",
        prezzo: 40.78,
        descrizione: "Descrizione prodotto 2",
        note: "Note prodotto 2",
        tipo_selezione: 1,
      },
    ];
    const selectedIdsModifica = [1, 4];

    controlloServizio
      .mockReturnValueOnce({ 
        ...servizi[0], 
        num_errori: 0 
      })
      .mockReturnValueOnce({ 
        ...servizi[3], 
        num_errori: 0
      });

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ ok: true, status: 200 })
      .mockResolvedValueOnce({ ok: false, status: 401 });

    const result = await servizioActions.modificaServizi(servizi, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(controlloServizio).toHaveBeenCalledTimes(2);
    expect(responseSpy).toHaveBeenCalledTimes(2);
    
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/MODIFICA_ITEM", { tipo_item: "servizio", item: servizi[0] });
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_ITEM", { tipo_item: "servizio", item: servizi[3] });
    
    expect(mockDispatch).toHaveBeenNthCalledWith(1, 
      servizioSliceActions.aggiornaServizi({
        servizi: [
          { ...servizi[0], tipo_selezione: 0 }, 
          { ...servizi[1], tipo_selezione: 0 }, 
          { ...servizi[2], tipo_selezione: 2 }, 
          { ...servizi[3], tipo_selezione: 0 },
        ], 
      })
    );

    expect(mockDispatch).toHaveBeenNthCalledWith(2, 
      servizioSliceActions.getServizioPrimaDellaModifica({
        id_servizio: 4
      })
    );

    expect(mockDispatch).toHaveBeenNthCalledWith(3, 
      servizioSliceActions.getServizioDopoLaModifica({
        id_servizio: 1
      })
    );

    expect(mockDispatch).toHaveBeenCalledTimes(3);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledWith([]);
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);
    expect(controlloServizio).toHaveBeenCalledWith({ ...servizi[0] }, false);
    expect(result).toEqual({
      esitiModifiche: [[true, 200], [false, 401]],
    });
  });

  /** UT_SerA_ModSer_05 **/
  test('servizi != [] AND serviziDaModificare != [] con 4 errori (tipo, prezzo, descrizione, note)', async () => {
    const mockSetSelectedIdsModifica = jest.fn();
    const servizi = [
      { 
        id: 1,
        nome: "Servizio 1",
        tipo: "Servizio",
        prezzo: 10.12,
        descrizione: "Descrizione servizio 1",
        note: "Note servizio 1",
        tipo_selezione: 1,
      },
      { 
        id: 2,
        nome: "Servizio 2",
        tipo: "Servizio",
        prezzo: 20.34,
        descrizione: "Descrizione servizio 2",
        note: "Note servizio 2",
        tipo_selezione: 0,
      },
      { 
        id: 3,
        nome: "Prodotto 1",
        tipo: "Prodotto",
        prezzo: 30.56,
        descrizione: "Descrizione prodotto 1",
        note: "Note prodotto 1",
        tipo_selezione: 2,
      },
      { 
        id: 4,
        nome: "Prodotto 2",
        tipo: "Prodotto !!",
        prezzo: -40.78,
        descrizione: "Descrizione prodotto 2 !!",
        note: "Note prodotto 2 !!",
        tipo_selezione: 1,
      },
    ];

    controlloServizio
      .mockReturnValueOnce({ 
        ...servizi[0], 
        num_errori: 0 
      })
      .mockReturnValueOnce({ 
        ...servizi[3], 
        num_errori: 4, 
        errore_tipo: "Errore tipo servizio/prodotto", 
        errore_prezzo: "Errore prezzo servizio/prodotto", 
        errore_descrizione: "Errore descrizione servizio/prodotto", 
        errore_note: "Errore note servizio/prodotto", 
      });

    const selectedIdsModifica = [1, 4]; 
    
    const erroreModificaServizi = "" 
      + "Errore servizio numero 2:\n" 
      + "- Errore tipo servizio/prodotto\n"
      + "- Errore prezzo servizio/prodotto\n"
      + "- Errore descrizione servizio/prodotto\n"
      + "- Errore note servizio/prodotto";

    const result = await servizioActions.modificaServizi(servizi, selectedIdsModifica, mockSetSelectedIdsModifica);

    expect(window.alert).toHaveBeenCalledWith(erroreModificaServizi);
    expect(controlloServizio).toHaveBeenCalledWith({ ...servizi[0] }, false);
    expect(result).toBeNull();
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

  /** UT_SerA_AgnSer_01 **/
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
  
  /** UT_SerA_EliSer_01 **/
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

  /** UT_SerA_EliSer_02 **/
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

  /** UT_SerA_EliSer_03 **/
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

  /** UT_SerA_EliSer_04 **/
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











