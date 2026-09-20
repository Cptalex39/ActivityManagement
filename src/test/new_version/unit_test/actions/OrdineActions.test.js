import { OrdineActions } from "../../../../react_redux/actions/OrdineActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { ordineSliceActions } from "../../../../react_redux/store/reducers/OrdineReducer";
import { generaFilePDF, generaFileOrdiniExcel } from "../../../../utils/File";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));


jest.mock('../../../../utils/File', () => ({
  ...jest.requireActual('../../../../utils/File'),
  generaFilePDF: jest.fn(),
  generaFileOrdiniExcel: jest.fn(),
}));

describe('Vari test su "azzeraLista"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_AzzLis_01 **/
  test('Lista azzerata', () => {
    const result = ordineActions.azzeraLista();

    expect(mockDispatch).toHaveBeenCalledWith(
      ordineSliceActions.aggiornaOrdini({
        ordini: -1
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "inserimentoOrdine"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_InsOrd_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let nuovoOrdine = {
      codice: "codice", 
    }

    const result = await ordineActions.inserimentoOrdine(nuovoOrdine);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ORDINE', nuovoOrdine);
    expect(result).toEqual({
      problema: false, 
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OrdA_InsOrd_02 **/
  test('response.ok = true AND problema = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ problema:true }),
    });

    let nuovoOrdine = {
      codice: "codice", 
    }

    const result = await ordineActions.inserimentoOrdine(nuovoOrdine);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ORDINE', nuovoOrdine);
    expect(result).toEqual({
      problema: true, 
      isOK: true, 
      responseStatus: 200,
    });
  });

  /** UT_OrdA_InsOrd_03 **/
  test('response.ok = true AND problema = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ problema:false }),
    });

    let nuovoOrdine = {
      codice: "codice", 
    }

    const result = await ordineActions.inserimentoOrdine(nuovoOrdine);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ORDINE', nuovoOrdine);
    expect(result).toEqual({
      problema: false, 
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ottieniPagamentiDaConfermare"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_OttPagConf_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.ottieniPagamentiDaConfermare(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_PAGAMENTI_DA_CONFERMARE', dati);
    expect(result).toEqual({
      items: [], 
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OrdA_OttPagConf_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.ottieniPagamentiDaConfermare(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_PAGAMENTI_DA_CONFERMARE', dati);
    expect(result).toEqual({
      items: ["items1", "items2"], 
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ricercaOrdini"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_RicOrd_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let datiRicerca = {
      datiRicerca: "datiRicerca",
    }

    const result = await ordineActions.ricercaOrdini(datiRicerca);

    const datiRicercaSpy = {
      ...datiRicerca, 
      data_creazione_min: "1111-11-11",
      data_creazione_max: "9999-01-01",
      data_prenotazione_min: "1111-11-11",
      data_prenotazione_max: "9999-01-01",
      azione: "Ricerca",
    }

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicercaSpy);
    expect(result).toEqual({
      items: [], 
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OrdA_RicOrd_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    let datiRicerca = {
      datiRicerca: "datiRicerca",
    }

    const result = await ordineActions.ricercaOrdini(datiRicerca);

    const datiRicercaSpy = {
      ...datiRicerca, 
      data_creazione_min: "1111-11-11",
      data_creazione_max: "9999-01-01",
      data_prenotazione_min: "1111-11-11",
      data_prenotazione_max: "9999-01-01",
      azione: "Ricerca",
    }

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicercaSpy);
    expect(result).toEqual({
      items: ["items1", "items2"], 
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ottieniOrdiniUltime48Ore"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_OttOrdUlt48Ore_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.ottieniOrdiniUltime48Ore(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_ORDINI_ULTIME_48_ORE', dati);
    expect(result).toEqual({
      items: [], 
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OrdA_OttOrdUlt48Ore_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.ottieniOrdiniUltime48Ore(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_ORDINI_ULTIME_48_ORE', dati);
    expect(result).toEqual({
      items: ["items1", "items2"], 
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "eliminaPagamentoDaConfermare"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_EliPagCnf_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.eliminaPagamentoDaConfermare(dati);

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE', dati);
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OrdA_EliPagCnf_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.eliminaPagamentoDaConfermare(dati);

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINAZIONE_PAGAMENTO_DA_CONFERMARE', dati);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "confermaPagamento"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_CnfPag_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.confermaPagamento(dati);

    expect(responseSpy).toHaveBeenCalledWith('/CONFERMA_PAGAMENTO', dati);
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OrdA_CnfPag_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.confermaPagamento(dati);

    expect(responseSpy).toHaveBeenCalledWith('/CONFERMA_PAGAMENTO', dati);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ottieniNumeroPagamentiNonConfermatiCliente"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OttNumPagNoCnfCli_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.ottieniNumeroPagamentiNonConfermatiCliente(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE', dati);
    expect(result).toEqual({
      numero_pagamenti_non_confermati: -1, 
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_OttNumPagNoCnfCli_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ result:[{numero_pagamenti_non_confermati:10}] }),
    });

    let dati = {
      dati: "dati",
    }

    const result = await ordineActions.ottieniNumeroPagamentiNonConfermatiCliente(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_NUMERO_PAGAMENTI_NON_CONFERMATI_CLIENTE', dati);
    expect(result).toEqual({
      numero_pagamenti_non_confermati: 10, 
      isOK: true, 
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ottieniFileOrdini"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_OttFilOrd_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const datiRicerca = {datiRicerca: "datiRicerca"};

    const result = await ordineActions.ottieniFileOrdini("pdf", datiRicerca);

    const datiRicercaSpy = {
      ...datiRicerca, 
      data_creazione_min: "1111-11-11",
      data_creazione_max: "9999-01-01",
      data_prenotazione_min: "1111-11-11",
      data_prenotazione_max: "9999-01-01",
      azione: "File",
    }

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicercaSpy);
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401
    });
  });

  /** UT_OrdA_OttFilOrd_02 **/
  test('response.ok = true AND tipoFile = "pdf"', async () => {
    generaFilePDF.mockReturnValue("... File PDF generato.");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    const datiRicerca = {datiRicerca: "datiRicerca"};

    const result = await ordineActions.ottieniFileOrdini("pdf", datiRicerca);

    const datiRicercaSpy = {
      ...datiRicerca, 
      data_creazione_min: "1111-11-11",
      data_creazione_max: "9999-01-01",
      data_prenotazione_min: "1111-11-11",
      data_prenotazione_max: "9999-01-01",
      azione: "File",
    }

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicercaSpy);
    expect(generaFilePDF).toHaveBeenCalledWith(["items1", "items2"], "Ordini");
    expect(generaFilePDF).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200
    });
  });

  /** UT_OrdA_OttFilOrd_03 **/
  test('response.ok = true AND tipoFile != "pdf"', async () => {
    generaFileOrdiniExcel.mockReturnValue("... File Excel generato.");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:["items1", "items2"] }),
    });

    const datiRicerca = {datiRicerca: "datiRicerca"};

    const result = await ordineActions.ottieniFileOrdini("excel", datiRicerca);

    const datiRicercaSpy = {
      ...datiRicerca, 
      data_creazione_min: "1111-11-11",
      data_creazione_max: "9999-01-01",
      data_prenotazione_min: "1111-11-11",
      data_prenotazione_max: "9999-01-01",
      azione: "File",
    }

    expect(responseSpy).toHaveBeenCalledWith('/VISUALIZZA_ITEMS', datiRicercaSpy);
    expect(generaFileOrdiniExcel).toHaveBeenCalledWith(["items1", "items2"]);
    expect(generaFileOrdiniExcel).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200
    });
  });
});

describe('Vari test su "ottieniNumeroOrdiniDataPerOrario"', () => {
  let ordineActions;

  beforeEach(() => {
    ordineActions = new OrdineActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_OrdA_OttNumOrdDtaOra_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await ordineActions.ottieniNumeroOrdiniDataPerOrario({dati:"dati"});

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_NUMERO_ORDINI_DATA_PER_ORARIO', {dati:"dati"});
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401, 
      numero_ordini: null,
    });
  });

  /** UT_OrdA_OttNumOrdDtaOra_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ numero_ordini:10 }),
    });

    const result = await ordineActions.ottieniNumeroOrdiniDataPerOrario({dati:"dati"});

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_NUMERO_ORDINI_DATA_PER_ORARIO', {dati:"dati"});
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200, 
      numero_ordini: 10,
    });
  });
});








