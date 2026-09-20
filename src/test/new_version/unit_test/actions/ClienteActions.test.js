import { ClienteActions } from "../../../../react_redux/actions/ClienteActions";
import { Actions } from "../../../../react_redux/actions/Actions";
import { clienteSliceActions } from "../../../../react_redux/store/reducers/ClienteReducer";
import { autenticazioneSliceActions } from "../../../../react_redux/store/reducers/AutenticazioneReducer";
import { encryptPassword, generateRandomString, passwordIsCorrect, PEPPER_HEX } from "../../../../utils/Sicurezza";
import { controlloRicercaClienti } from "../../../../utils/Controlli";

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../../utils/Sicurezza', () => ({
  ...jest.requireActual('../../../../utils/Sicurezza'),
  generateRandomString: jest.fn(),
  encryptPassword: jest.fn(),
  passwordIsCorrect: jest.fn(),
  PEPPER_HEX: "TEST_PEPPER",
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

  /** UT_CliA_AzzLis_01 **/
  test('Lista azzerata', () => {
    const result = clienteActions.azzeraLista();

    expect(mockDispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaClienti({clienti:[], listaDaAggiornare:"clienti"})
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "registrazioneCliente"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_RegCli_01 **/
  test('response.ok = false', async () => {
    const nuovoCliente = {nome:"Mario"}
    generateRandomString.mockReturnValue("12345678901234567890123456789012");
    encryptPassword.mockReturnValue("password_criptata");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const result = await clienteActions.registrazioneCliente(nuovoCliente);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', { ...nuovoCliente, salt_hex:"12345678901234567890123456789012", password:"password_criptata" });
    expect(result).toEqual({isOK:false, responseStatus:401})
    expect(nuovoCliente).toEqual({
      nome: "Mario", 
      salt_hex:"12345678901234567890123456789012", 
      password: "password_criptata", 
    });
  }); 

  /** UT_CliA_RegCli_02 **/
  test('response.ok = true', async () => {
    const nuovoCliente = {nome:"Mario"}
    generateRandomString.mockReturnValue("12345678901234567890123456789012");
    encryptPassword.mockReturnValue("password_criptata");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });

    const result = await clienteActions.registrazioneCliente(nuovoCliente);

    expect(responseSpy).toHaveBeenCalledWith('/INSERISCI_ITEM', { ...nuovoCliente, salt_hex:"12345678901234567890123456789012", password:"password_criptata" });
    expect(result).toEqual({isOK:true, responseStatus:200})
    expect(nuovoCliente).toEqual({
      nome: "Mario", 
      salt_hex:"12345678901234567890123456789012", 
      password: "password_criptata", 
    });
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

  /** UT_CliA_RicCli_01 **/
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

  /** UT_CliA_RicCli_02 **/
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

  /** UT_CliA_RicCli_03 **/
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

describe('Vari test su "selezioneOperazioneCliente"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_SelOpCli_01 **/
  test('icon != "trash"', () => {
    const icon = "test";
    const item = {item:"item"};
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();

    const result = clienteActions.selezioneOperazioneCliente(
      icon, item, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    expect(mockSetSelectedIdsModifica).not.toHaveBeenCalled();
    expect(mockSetSelectedIdsEliminazione).not.toHaveBeenCalled();
    expect(mockSetSelectedPencilCount).not.toHaveBeenCalled();
    expect(mockSetSelectedTrashCount).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  /** UT_CliA_SelOpCli_02 **/
  test('icon = "trash" AND selectedIdsEliminazione.includes(item.id) = true', () => {
    const icon = "trash";
    const item = {id:6};
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedTrashCount = selectedIdsEliminazione.length;

    const result = clienteActions.selezioneOperazioneCliente(
      icon, item, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
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
      clienteSliceActions.aggiornaTipoSelezione({
        id_cliente: item.id, 
        nuova_selezione: 0,
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  /** UT_CliA_SelOpCli_03 **/
  test('icon = "trash" AND selectedIdsEliminazione.includes(item.id) = false', () => {
    const icon = "trash";
    const item = {id:5};
    const mockSetSelectedIdsModifica = jest.fn();
    const selectedIdsEliminazione = [2,4,6,8,10];
    const mockSetSelectedIdsEliminazione = jest.fn();
    const mockSetSelectedPencilCount = jest.fn();
    const mockSetSelectedTrashCount = jest.fn();
    const selectedTrashCount = selectedIdsEliminazione.length;

    const result = clienteActions.selezioneOperazioneCliente(
      icon, item, mockSetSelectedIdsModifica, selectedIdsEliminazione, mockSetSelectedIdsEliminazione, 
      mockSetSelectedPencilCount, mockSetSelectedTrashCount
    );

    const updaterModifiedFn = mockSetSelectedIdsModifica.mock.calls[0][0];
    expect(typeof updaterModifiedFn).toBe('function');
    expect(mockSetSelectedIdsModifica).toHaveBeenCalledTimes(1);

    const prevIdsModifica = [1, 5, 9];
    expect(updaterModifiedFn(prevIdsModifica)).toEqual([1, 9]);

    const updaterDeleteFn = mockSetSelectedIdsEliminazione.mock.calls[0][0];
    expect(typeof updaterDeleteFn).toBe('function');
    expect(updaterDeleteFn(selectedIdsEliminazione)).toEqual([2,4,6,8,10,5]);
    const nuovoArrayTrash = updaterDeleteFn(selectedIdsEliminazione); 
    expect(nuovoArrayTrash).toEqual([2,4,6,8,10,5]);
    expect(mockSetSelectedIdsEliminazione).toHaveBeenCalledTimes(1); 
    
    expect(mockSetSelectedPencilCount).toHaveBeenCalledTimes(1);
    const counterPencilFn = mockSetSelectedPencilCount.mock.calls[0][0];
    expect(typeof counterPencilFn).toBe('function');
    expect(mockSetSelectedTrashCount).toHaveBeenCalledTimes(1);

    expect(counterPencilFn(5)).toBe(4);
    expect(counterPencilFn(0)).toBe(0);

    const counterTrashFn = mockSetSelectedTrashCount.mock.calls[0][0];
    expect(typeof counterTrashFn).toBe('function');
    expect(counterTrashFn(selectedTrashCount)).toEqual(nuovoArrayTrash.length);
    expect(mockSetSelectedTrashCount).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalledWith( 
      clienteSliceActions.aggiornaTipoSelezione({
        id_cliente: item.id, 
        nuova_selezione: 2, 
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "aggiornaCliente"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_AgnCli_01 **/
  test('Cliente aggiornato', () => {
    const result = clienteActions.aggiornaCliente(5, "username", "nuovo_username");

    expect(mockDispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaCliente({
        id_cliente: 5,
        nome_attributo: "username", 
        nuovo_valore: "nuovo_username"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });
});

describe('Vari test su "eliminaCliente"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_EliCli_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    const result = await clienteActions.eliminaCliente("test_username");

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEM', { username:"test_username", tipo_item:"cliente" });
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401,
    });
  });

  /** UT_CliA_EliCli_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });
    
    const result = await clienteActions.eliminaCliente("test_username");

    expect(responseSpy).toHaveBeenCalledWith('/ELIMINA_ITEM', { username:"test_username", tipo_item:"cliente" });
    expect(mockDispatch).toHaveBeenCalledWith(
      clienteSliceActions.eliminaCliente({
        username: "test_username", 
        listaDaAggiornare: "clienti"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200,
    })
  });
});

describe('Vari test su "richiestaEliminazioneProfilo"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_RicEliPro_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    const result = await clienteActions.richiestaEliminazioneProfilo("test_username");

    expect(responseSpy).toHaveBeenCalledWith('/RICHIESTA_ELIMINAZIONE', { username:"test_username" });
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401
    })
  });

  /** UT_CliA_RicEliPro_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });
    
    const result = await clienteActions.richiestaEliminazioneProfilo("test_username");

    expect(responseSpy).toHaveBeenCalledWith('/RICHIESTA_ELIMINAZIONE', { username:"test_username" });
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200
    })
  });
});

describe('Vari test su "riattivaCliente"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_RiaCli_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    const result = await clienteActions.riattivaCliente("test_username");

    expect(responseSpy).toHaveBeenCalledWith('/RIATTIVA_CLIENTE', { username:"test_username" });
    expect(result).toEqual({
      isOK: false, 
      responseStatus: 401
    })
  });

  /** UT_CliA_RiaCli_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
    });
    
    const result = await clienteActions.riattivaCliente("test_username");

    expect(responseSpy).toHaveBeenCalledWith('/RIATTIVA_CLIENTE', { username:"test_username" });
    expect(result).toEqual({
      isOK: true, 
      responseStatus: 200
    })
  });
});

describe('Vari test su "ottieniClientiDaEliminare"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_OttCliEli_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });
    
    const result = await clienteActions.ottieniClientiDaEliminare();

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_CLIENTI_DA_ELIMINARE', {});
    expect(result).toEqual({
      items: [], 
      isOK: false, 
      responseStatus: 401
    })
  });

  /** UT_CliA_OttCliEli_02 **/
  test('response.ok = true', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue({ items:[{user:"m.rossi"}, {user:"l.verdi"}] }),
    });
    
    const result = await clienteActions.ottieniClientiDaEliminare();

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_CLIENTI_DA_ELIMINARE', {});
    expect(result).toEqual({
      items: [{user:"m.rossi"}, {user:"l.verdi"}], 
      isOK: true, 
      responseStatus: 200
    })
  });
});

describe('Vari test su "modificaProfilo"', () => {
  let clienteActions;

  beforeEach(() => {
    clienteActions = new ClienteActions();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** UT_CliA_ModPro_01 **/
  test('response.ok = false', async () => {
    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: false,
      status: 401,
    });

    const dati = {
      username: "test_username"
    }

    const result = await clienteActions.modificaProfilo(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_PASSWORD', dati);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isPasswordCorrect: false, 
      isOK: false, 
      responseStatus: 401, 
    });
  });

  /** UT_CliA_ModPro_02 **/
  test('response.ok = true AND password_attuale != password', async () => {
    passwordIsCorrect.mockReturnValue(false);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse').mockResolvedValue({
      ok: true,
      status: 200, 
      json: jest.fn().mockResolvedValue({ result:[{password:"password", salt_hex:"salt_hex"}] }),
    });

    const dati = {
      username: "username", 
      password_attuale: "password_attuale"
    }

    const result = await clienteActions.modificaProfilo(dati);

    expect(responseSpy).toHaveBeenCalledWith('/OTTIENI_PASSWORD', dati);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isPasswordCorrect: false, 
      isOK: true, 
      responseStatus: 200, 
    });
  });

  /** UT_CliA_ModPro_03 **/
  test('(prima response).ok = true AND password_attuale = password AND nuova_password = "" AND (seconda response).ok = false', async () => {
    passwordIsCorrect.mockReturnValue(true);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ 
        ok: true,
        status: 200, 
        json: jest.fn().mockResolvedValue({ result:[{password:"password_attuale", salt_hex:"salt_hex"}] }),
      })
      .mockResolvedValueOnce({ 
        ok: false, 
        status: 401 
      });

    const dati = {
      username: "username", 
      password_attuale: "password_attuale", 
      nuova_password: "",
    }

    const result = await clienteActions.modificaProfilo(dati);

    expect(generateRandomString).not.toHaveBeenCalled();
    expect(encryptPassword).not.toHaveBeenCalled();
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD", dati);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_CLIENTE", dati);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isPasswordCorrect: true, 
      isOK: false, 
      responseStatus: 401, 
    });
  });

  /** UT_CliA_ModPro_04 **/
  test('(prima response).ok = true AND password_attuale = password AND nuova_password != "" AND (seconda response).ok = false', async () => {
    passwordIsCorrect.mockReturnValue(true);
    generateRandomString.mockReturnValue("12345678901234567890123456789012")
    encryptPassword.mockReturnValue("password_criptata");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ 
        ok: true,
        status: 200, 
        json: jest.fn().mockResolvedValue({ result:[{password:"password_attuale", salt_hex:"salt_hex"}] }),
      })
      .mockResolvedValueOnce({ 
        ok: false, 
        status: 401 
      });

    const dati = {
      username: "username", 
      password_attuale: "password_attuale", 
      nuova_password: "nuova_password",
    }

    const result = await clienteActions.modificaProfilo(dati);

    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD", dati);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_CLIENTE", dati);
    expect(mockDispatch).not.toHaveBeenCalled();
    expect(result).toEqual({
      isPasswordCorrect: true, 
      isOK: false, 
      responseStatus: 401, 
    });
  });

  /** UT_CliA_ModPro_05 **/
  test('(prima response).ok = true AND password_attuale = password AND nuova_password = "" AND (seconda response).ok = true', async () => {
    passwordIsCorrect.mockReturnValue(true);

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ 
        ok: true,
        status: 200, 
        json: jest.fn().mockResolvedValue({ result:[{password:"password_attuale", salt_hex:"salt_hex"}] }),
      })
      .mockResolvedValueOnce({ 
        ok: true, 
        status: 200 
      });

    const dati = {
      username: "username", 
      password_attuale: "password_attuale", 
      nuova_password: "",
      email: "email", 
      contatto: "contatto", 
      indirizzo: "indirizzo", 
      username: "username"
    }

    const result = await clienteActions.modificaProfilo(dati);

    expect(generateRandomString).not.toHaveBeenCalled();
    expect(encryptPassword).not.toHaveBeenCalled();
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD", dati);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_CLIENTE", dati);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.aggiornaProfiloCliente({
        email: "email", 
        contatto: "contatto", 
        indirizzo: "indirizzo", 
        username: "username"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isPasswordCorrect: true, 
      isOK: true, 
      responseStatus: 200, 
    });
  });

  /** UT_CliA_ModPro_06 **/
  test('(prima response).ok = true AND password_attuale = password AND nuova_password != "" AND (seconda response).ok = true', async () => {
    passwordIsCorrect.mockReturnValue(true);
    generateRandomString.mockReturnValue("12345678901234567890123456789012")
    encryptPassword.mockReturnValue("password_criptata");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ 
        ok: true,
        status: 200, 
        json: jest.fn().mockResolvedValue({ result:[{password:"password_attuale", salt_hex:"salt_hex"}] }),
      })
      .mockResolvedValueOnce({ 
        ok: true, 
        status: 200 
      });

    const dati = {
      username: "username", 
      password_attuale: "password_attuale", 
      nuova_password: "",
      email: "email", 
      contatto: "contatto", 
      indirizzo: "indirizzo", 
      username: "username"
    }

    const result = await clienteActions.modificaProfilo(dati);
    
    expect(generateRandomString).not.toHaveBeenCalled();
    expect(encryptPassword).not.toHaveBeenCalled();
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD", dati);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_CLIENTE", dati);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.aggiornaProfiloCliente({
        email: "email", 
        contatto: "contatto", 
        indirizzo: "indirizzo", 
        username: "username"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isPasswordCorrect: true, 
      isOK: true, 
      responseStatus: 200, 
    });
  });

  /** UT_CliA_ModPro_07 **/
  test('(prima response).ok = true AND password_attuale = password AND nuova_password != "" AND (seconda response).ok = true AND dati.nuova_password inserita', async () => {
    passwordIsCorrect.mockReturnValue(true);
    generateRandomString.mockReturnValue("12345678901234567890123456789012")
    encryptPassword.mockReturnValue("password_criptata");

    const responseSpy = jest.spyOn(Actions.prototype, 'getResponse')
      .mockResolvedValueOnce({ 
        ok: true,
        status: 200, 
        json: jest.fn().mockResolvedValue({ result:[{password:"password_attuale", salt_hex:"salt_hex"}] }),
      })
      .mockResolvedValueOnce({ 
        ok: true, 
        status: 200 
      });

    const dati = {
      username: "username", 
      password_attuale: "password_attuale", 
      nuova_password: "NuovaPassword10!!",
      conferma_nuova_password: "NuovaPassword10!!",
      email: "email", 
      contatto: "contatto", 
      indirizzo: "indirizzo", 
      username: "username"
    }

    const result = await clienteActions.modificaProfilo(dati);
    
    expect(generateRandomString).toHaveBeenCalledTimes(1);
    expect(encryptPassword).toHaveBeenCalledTimes(1);
    expect(responseSpy).toHaveBeenNthCalledWith(1, "/OTTIENI_PASSWORD", dati);
    expect(responseSpy).toHaveBeenNthCalledWith(2, "/MODIFICA_PROFILO_CLIENTE", dati);
    expect(mockDispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.aggiornaProfiloCliente({
        email: "email", 
        contatto: "contatto", 
        indirizzo: "indirizzo", 
        username: "username"
      })
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      isPasswordCorrect: true, 
      isOK: true, 
      responseStatus: 200, 
    });
  });
});







