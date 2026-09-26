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

const stateWithoutClienti1 = {
  value: {
    clienti: [],
    clientiDaEliminare: [
      { id: 3, nome: "Filippo", cognome: "Gialli", username: "fg_user", tipo_selezione: 2 }, 
      { id: 4, nome: "Serena",  cognome: "Verdi", username: "sv_user", tipo_selezione: 1  },
    ],
  }
}

const stateWithoutClienti2 = {
  value: {
    clienti: -1,
    clientiDaEliminare: [
      { id: 3, nome: "Filippo", cognome: "Gialli", username: "fg_user", tipo_selezione: 2 }, 
      { id: 4, nome: "Serena",  cognome: "Verdi", username: "sv_user", tipo_selezione: 1  },
    ],
  }
}

describe('Vari test su "aggiornaClienti', () => {
  /** RT_UT_CliR_AgnClienti_01 **/
  test('listaDaAggiornare != "clienti" AND listaDaAggiornare != "clientiDaEliminare"', () => {
    const action = clienteSliceActions.aggiornaClienti({
      listaDaAggiornare: "LISTA_DA_AGGIORNARE"
    });

    const valueExpected = stateWithClienti;

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnClienti_02 **/
  test('listaDaAggiornare = "clienti"', () => {
    const action = clienteSliceActions.aggiornaClienti({
      listaDaAggiornare: "clienti", 
      clienti: [
        { id: 5, nome: "Matteo", cognome: "Gialli", username: "mg_user", tipo_selezione: 0   }, 
        { id: 6, nome: "Sara",   cognome: "Verdi", username: "sv_user", tipo_selezione: 0    },
      ]
    });

    const valueExpected = {
      value: {
        clienti: [
          { id: 5, nome: "Matteo", cognome: "Gialli", username: "mg_user", tipo_selezione: 0   }, 
          { id: 6, nome: "Sara",   cognome: "Verdi", username: "sv_user", tipo_selezione: 0    },
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

  /** RT_UT_CliR_AgnClienti_03 **/
  test('listaDaAggiornare = "clientiDaEliminare"', () => {
    const action = clienteSliceActions.aggiornaClienti({
      listaDaAggiornare: "clientiDaEliminare", 
      clienti: [
        { id: 5, nome: "Matteo", cognome: "Rossi", username: "mr_user", tipo_selezione: 0   }, 
        { id: 6, nome: "Sara",   cognome: "Bianchi", username: "sb_user", tipo_selezione: 0 },
      ]
    });

    const valueExpected = {
      value: {
        clienti: [
          { id: 1, nome: "Mario", cognome: "Rossi", username: "mr_user", tipo_selezione: 1   }, 
          { id: 2, nome: "Laura", cognome: "Bianchi", username: "lb_user", tipo_selezione: 2 },
        ],
        clientiDaEliminare: [
          { id: 5, nome: "Matteo", cognome: "Rossi", username: "mr_user", tipo_selezione: 0   }, 
          { id: 6, nome: "Sara",   cognome: "Bianchi", username: "sb_user", tipo_selezione: 0 },
        ],
      }
    };

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaTipoSelezione', () => {
  /** RT_UT_CliR_AgnTipSel_01 **/
  test('clienti = []', () => {
    const action = clienteSliceActions.aggiornaTipoSelezione({
      id_cliente: 2, 
      nuova_selezione: 0 
    });

    const valueExpected = stateWithoutClienti1;

    const result = clienteReducer(stateWithoutClienti1, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnTipSel_02 **/
  test('clienti = -1', () => {
    const action = clienteSliceActions.aggiornaTipoSelezione({
      id_cliente: 2, 
      nuova_selezione: 0 
    });

    const valueExpected = stateWithoutClienti2;

    const result = clienteReducer(stateWithoutClienti2, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnTipSel_03 **/
  test('clienti non vuoto, cliente non presente nell\'array', () => {
    const action = clienteSliceActions.aggiornaTipoSelezione({
      id_cliente: 4, 
      nuova_selezione: 0 
    });

    const valueExpected = stateWithClienti;

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnTipSel_04 **/
  test('clienti non vuoto, cliente presente nell\'array', () => {
    const action = clienteSliceActions.aggiornaTipoSelezione({
      id_cliente: 2, 
      nuova_selezione: 0 
    });

    const valueExpected = {
      value: {
        clienti: [
          { id: 1, nome: "Mario", cognome: "Rossi", username: "mr_user", tipo_selezione: 1   }, 
          { id: 2, nome: "Laura", cognome: "Bianchi", username: "lb_user", tipo_selezione: 0 },
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
});

describe('Vari test su "aggiornaCliente', () => {
  /** RT_UT_CliR_AgnCliente_01 **/
  test('clienti = []', () => {
    const action = clienteSliceActions.aggiornaCliente({
      id_cliente: 2, 
      nome_attributo: "nome",
      nuovo_valore: "Vittoria" 
    });

    const valueExpected = stateWithoutClienti1;

    const result = clienteReducer(stateWithoutClienti1, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnCliente_02 **/
  test('clienti = -1', () => {
    const action = clienteSliceActions.aggiornaCliente({
      id_cliente: 2, 
      nome_attributo: "nome",
      nuovo_valore: "Vittoria" 
    });

    const valueExpected = stateWithoutClienti2;

    const result = clienteReducer(stateWithoutClienti2, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnCliente_03 **/
  test('clienti non vuoto, cliente non presente nell\'array', () => {
    const action = clienteSliceActions.aggiornaCliente({
      id_cliente: 4, 
      nome_attributo: "nome",
      nuovo_valore: "Vittoria" 
    });

    const valueExpected = stateWithClienti;

    const result = clienteReducer(stateWithClienti, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_CliR_AgnCliente_04 **/
  test('clienti non vuoto, cliente presente nell\'array', () => {
    const action = clienteSliceActions.aggiornaCliente({
      id_cliente: 2, 
      nome_attributo: "nome",
      nuovo_valore: "Vittoria" 
    });

    const valueExpected = {
      value: {
        clienti: [
          { id: 1, nome: "Mario", cognome: "Rossi", username: "mr_user", tipo_selezione: 1   }, 
          { id: 2, nome: "Vittoria", cognome: "Bianchi", username: "lb_user", tipo_selezione: 2 },
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
});








