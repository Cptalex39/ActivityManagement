import { AttivitaActions } from "../../../../react_redux/actions/AttivitaActions";
import { Actions } from "../../../../react_redux/actions/Actions";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('Vari test su "eseguiAnalisi"', () => {
  let attivitaActions;

  beforeEach(() => {
    attivitaActions = new AttivitaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AttA_EseAna_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    const dati = { dati:"dati" };

    const result = await attivitaActions.eseguiAnalisi(dati);

    expect(responseSpy).toHaveBeenCalledWith('/ESEGUI_ANALISI', dati);
    expect(result).toEqual({
      uscite_anno: [], 
      entrate_anno: [], 
      isOK: false,
      responseStatus: 401,
    });
  });

  /** UT_AttA_EseAna_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ entrate_anno:[48000, 12000], uscite_anno:[24000, 42000] }),
    });

    const dati = { dati:"dati" };

    const result = await attivitaActions.eseguiAnalisi(dati);

    expect(responseSpy).toHaveBeenCalledWith('/ESEGUI_ANALISI', dati);
    expect(result).toEqual({
      uscite_anno: [24000, 42000], 
      entrate_anno: [48000, 12000], 
      isOK: true,
      responseStatus: 200,
    });
  });
});

describe('Vari test su "ottieniDatiAttivita', () => {
  let attivitaActions;

  beforeEach(() => {
    attivitaActions = new AttivitaActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_AttA_OttDtiAna_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await attivitaActions.ottieniDatiAttivita();

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_DATI_ATTIVITA', {});
    expect(result).toEqual({
      primo_intervallo: null,
      secondo_intervallo: null, 
      numero_clienti: null, 
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_AttA_OttDtiAna_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ result:[{primo_intervallo:[8, 14], secondo_intervallo:[16, 22], numero_clienti:2}] }),
    });

    const result = await attivitaActions.ottieniDatiAttivita();

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_DATI_ATTIVITA', {});
    expect(result).toEqual({
      primo_intervallo: [8, 14],
      secondo_intervallo: [16, 22], 
      numero_clienti: 2, 
      isOK: true, 
      responseStatus: 200,
    });
  });
});









