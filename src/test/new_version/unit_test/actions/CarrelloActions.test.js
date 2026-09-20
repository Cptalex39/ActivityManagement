import { CarrelloActions } from "../../../../react_redux/actions/CarrelloActions";
import { carrelloSliceActions } from "../../../../react_redux/store/reducers/CarrelloReducer";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Vari test su "aggiungiAlCarrello', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_AggCar_01 **/
  test('quantita <= 0', () => {
    const result = carrelloActions.aggiungiAlCarrello({test:"test"}, 0);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  /** UT_CarA_AggCar_02 **/
  test('quantita > 0', () => {
    const result = carrelloActions.aggiungiAlCarrello({test:"test"}, 2);
    
    expect(mockDispatch).toHaveBeenCalledWith(
      carrelloSliceActions.aggiungiAlCarrello({
        item: {test:"test"}, 
        quantita: 2
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "aggiungiMultipliAlCarrello', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_AggMulCar_01 **/
  test('itemsSelezionati = []', () => {
    const result = carrelloActions.aggiungiMultipliAlCarrello([], []);

    expect(mockDispatch).toHaveBeenCalledTimes(0);
    expect(result).toBeUndefined();
  });  

  /** UT_CarA_AggMulCar_02 **/
  test('itemsSelezionati != []', () => {
    const result = carrelloActions.aggiungiMultipliAlCarrello([{id:1}, {id:2}, {id:3}], {1:10, 2:20});

    expect(mockDispatch).toHaveBeenNthCalledWith(1, carrelloSliceActions.aggiungiAlCarrello({ item:{id:1}, quantita:10 }));
    expect(mockDispatch).toHaveBeenNthCalledWith(2, carrelloSliceActions.aggiungiAlCarrello({ item:{id:2}, quantita:20 }));
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    expect(result).toBeUndefined();
  });  
});

describe('Vari test su "rimuoviDalCarrello', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_RimCar_01 **/
  test('Elemento rimosso dal carrello', () => {
    const result = carrelloActions.rimuoviDalCarrello(5);

    expect(mockDispatch).toHaveBeenCalledWith(
      carrelloSliceActions.rimuoviDalCarrello({ id:5 })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "aggiornaQuantita', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_AgnQnt_01 **/
  test('Quantita\' aggiornata', () => {
    const result = carrelloActions.aggiornaQuantita(5, 10);

    expect(mockDispatch).toHaveBeenCalledWith(
      carrelloSliceActions.aggiornaQuantita({ id:5, quantita:10 })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "incrementaQuantita', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_IncQnt_01 **/
  test('Quantita\' incrementata', () => {
    const result = carrelloActions.incrementaQuantita(5, 10);

    expect(mockDispatch).toHaveBeenCalledWith(
      carrelloSliceActions.incrementaQuantita({ id:5 })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "decrementaQuantita', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_DecQnt_01 **/
  test('Quantita\' decrementata', () => {
    const result = carrelloActions.decrementaQuantita(5, 10);

    expect(mockDispatch).toHaveBeenCalledWith(
      carrelloSliceActions.decrementaQuantita({ id:5 })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  })
});

describe('Vari test su "svuotaCarrello', () => {
  let carrelloActions;

  beforeEach(() => {
    carrelloActions = new CarrelloActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CarA_SvtCar_01 **/
  test('Carrello svuotato', () => {
    const result = carrelloActions.svuotaCarrello();

    expect(mockDispatch).toHaveBeenCalledWith(
      carrelloSliceActions.svuotaCarrello()
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  })
});







