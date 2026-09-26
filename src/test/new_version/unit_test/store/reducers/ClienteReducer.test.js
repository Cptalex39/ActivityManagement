import { clienteReducer, clienteSliceActions } from "../../../../../react_redux/store/reducers/ClienteReducer";

const stateWithClienti = {
  value: {
    clienti: [
      { id: 1, nome: "Mario", cognome: "Rossi", username: "mr_user", tipo_selezione: 1   }, 
      { id: 2, nome: "Laura", cognome: "Bianchi", username: "lb_user", tipo_selezione: 2 },
    ],
    clientiDaEliminare: [
      { id: 3, nome: "Filippo", cognome: "Gialli", username: "fg_user", tipo_selezione: 2 }, 
      { id: 4, nome: "Serena",  cognome: "Verdi", username: "sv_user", tipo_selezione: 1  },
    ],
  }
};

describe('Vari test su "eliminaCliente', () => {
  /** UT_CliR_EliCli_01 **/
  test('listaDaAggiornare != "clienti" AND listaDaAggiornare != "clientiDaEliminare"', () => {
    const action = clienteSliceActions.eliminaCliente({
      listaDaAggiornare: "LISTA_DA_AGGIORNARE", 
      username: "lb_user"
    });

    const valueExpected = stateWithClienti

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CliR_EliCli_02 **/
  test('listaDaAggiornare = "clienti", cliente non presente', () => {
    const action = clienteSliceActions.eliminaCliente({
      listaDaAggiornare: "clienti", 
      username: "bl_user"
    });

    const valueExpected = stateWithClienti

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CliR_EliCli_03 **/
  test('listaDaAggiornare = "clienti", cliente presente', () => {
    const action = clienteSliceActions.eliminaCliente({
      listaDaAggiornare: "clienti", 
      username: "lb_user"
    });

    const valueExpected = {
      value: {
        clienti: [
          { id: 1, nome: "Mario", cognome: "Rossi", username: "mr_user", tipo_selezione: 1   }, 
        ],
        clientiDaEliminare: [
          { id: 3, nome: "Filippo", cognome: "Gialli", username: "fg_user", tipo_selezione: 2 }, 
          { id: 4, nome: "Serena",  cognome: "Verdi", username: "sv_user", tipo_selezione: 1  },
        ],
      }
    };

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CliR_EliCli_04 **/
  test('listaDaAggiornare = "clientiDaEliminare", cliente non presente', () => {
    const action = clienteSliceActions.eliminaCliente({
      listaDaAggiornare: "clientiDaEliminare", 
      username: "vs_user"
    });

    const valueExpected = stateWithClienti

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** UT_CliR_EliCli_05 **/
  test('listaDaAggiornare = "clientiDaEliminare", cliente presente', () => {
    const action = clienteSliceActions.eliminaCliente({
      listaDaAggiornare: "clientiDaEliminare", 
      username: "sv_user"
    });

    const valueExpected = {
      value: {
        clienti: [
          { id: 1, nome: "Mario", cognome: "Rossi", username: "mr_user", tipo_selezione: 1   },
          { id: 2, nome: "Laura", cognome: "Bianchi", username: "lb_user", tipo_selezione: 2 }, 
        ],
        clientiDaEliminare: [
          { id: 3, nome: "Filippo", cognome: "Gialli", username: "fg_user", tipo_selezione: 2 }, 
        ],
      }
    };

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });
});









