import { clienteSliceReducer, clienteSliceActions } from "../../../../store/slice/ClienteSlice.js";

describe("clienteSlice reducer", () => {


  test("test su 'aggiornaClienti'", () => {
    const initialState = {
      value: { clienti: [], } 
    };

    const action = clienteSliceActions.aggiornaClienti({ 
      clienti: [
        { nome: "Mario", cognome: "Rossi", contatto: "3333300000", email: "mr@gmail.com", note: "Note sul cliente \'Mario Rossi\'." }, 
        { nome: "Lucia", cognome: "Verdi", contatto: "3030303030", email: "lv@gmail.com", note: "Note sulla cliente \'Lucia Verdi\'." } 
      ] 
    });
    const newState = clienteSliceReducer(initialState, action);
  
    expect(newState.value.clienti).toEqual([
      {"cognome": "Rossi", "contatto": "3333300000", "email": "mr@gmail.com", "nome": "Mario", "note": "Note sul cliente 'Mario Rossi'."}, 
      {"cognome": "Verdi", "contatto": "3030303030", "email": "lv@gmail.com", "nome": "Lucia", "note": "Note sulla cliente 'Lucia Verdi'."}
    ]);
  });

  test("test su 'aggiornaTipoSelezione'", () => {
    const initialState = {
      value: { 
        clienti: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            nome: "Mario", 
            cognome: "Rossi", 
            contatto: "3333300000", 
            email: "mr@gmail.com", 
            note: "Note sul cliente \'Mario Rossi\'." 
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            nome: "Lucia", 
            cognome: "Verdi", 
            contatto: "3030303030", 
            email: "lv@gmail.com", 
            note: "Note sulla cliente \'Lucia Verdi\'." 
          } 
        ]  
      } 
    };

    const action = clienteSliceActions.aggiornaTipoSelezione({ 
      id_cliente: 2, 
      nuova_selezione: 1
    });

    const newState = clienteSliceReducer(initialState, action);
  
    expect(newState.value.clienti).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        nome: "Mario", 
        cognome: "Rossi", 
        contatto: "3333300000", 
        email: "mr@gmail.com", 
        note: "Note sul cliente \'Mario Rossi\'." 
      }, 
      { 
        id: 2, 
        tipo_selezione: 1, 
        nome: "Lucia", 
        cognome: "Verdi", 
        contatto: "3030303030", 
        email: "lv@gmail.com", 
        note: "Note sulla cliente \'Lucia Verdi\'." 
      } 
    ]);
  });

  test("test su 'aggiornaCliente'", () => {
    const initialState = {
      value: { 
        clienti: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            nome: "Mario", 
            cognome: "Rossi", 
            contatto: "3333300000", 
            email: "mr@gmail.com", 
            note: "Note sul cliente \'Mario Rossi\'." 
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            nome: "Lucia", 
            cognome: "Verdi", 
            contatto: "3030303030", 
            email: "lv@gmail.com", 
            note: "Note sulla cliente \'Lucia Verdi\'." 
          } 
        ]  
      } 
    };

    const action = clienteSliceActions.aggiornaCliente({ 
      id_cliente: 2, 
      nome_attributo: "contatto", 
      nuovo_valore: "0000000000"
    });

    const newState = clienteSliceReducer(initialState, action);
  
    expect(newState.value.clienti).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        nome: "Mario", 
        cognome: "Rossi", 
        contatto: "3333300000", 
        email: "mr@gmail.com", 
        note: "Note sul cliente \'Mario Rossi\'." 
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        nome: "Lucia", 
        cognome: "Verdi", 
        contatto: "0000000000", 
        email: "lv@gmail.com", 
        note: "Note sulla cliente \'Lucia Verdi\'." 
      } 
    ]);
  });

  test("test su 'getClientePrimaDellaModifica'", () => {
    const initialState = {
      value: { 
        clienti: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            nome: "Mario", 
            cognome: "Rossi", 
            contatto: "3333300000", 
            contatto_attuale: "0000033333", 
            email: "mr@gmail.com", 
            email_attuale: "MR@GMAIL.COM", 
            note: "Note sul cliente \'Mario Rossi\'.", 
            note_attuale: "NOTE SUL CLIENTE \'MARIO ROSSI\'." 
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            nome: "Lucia", 
            cognome: "Verdi", 
            contatto: "3030303030", 
            contatto_attuale: "0303030303", 
            email: "lv@gmail.com", 
            email_attuale: "LV@GMAIL.COM", 
            note: "Note sulla cliente \'Lucia Verdi\'.", 
            note_attuale: "NOTE SULLA CLIENTE \'LUCIA VERDI\'." 
          } 
        ]  
      } 
    };

    const action = clienteSliceActions.getClientePrimaDellaModifica({ 
      id_cliente: 2, 
    });

    const newState = clienteSliceReducer(initialState, action);
  
    expect(newState.value.clienti).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        nome: "Mario", 
        cognome: "Rossi", 
        contatto: "3333300000", 
        contatto_attuale: "0000033333", 
        email: "mr@gmail.com", 
        email_attuale: "MR@GMAIL.COM", 
        note: "Note sul cliente \'Mario Rossi\'.", 
        note_attuale: "NOTE SUL CLIENTE \'MARIO ROSSI\'." 
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        nome: "Lucia", 
        cognome: "Verdi", 
        contatto: "0303030303", 
        contatto_attuale: "0303030303", 
        email: "LV@GMAIL.COM", 
        email_attuale: "LV@GMAIL.COM", 
        note: "NOTE SULLA CLIENTE \'LUCIA VERDI\'.", 
        note_attuale: "NOTE SULLA CLIENTE \'LUCIA VERDI\'." 
      } 
    ]);
  });

  test("test su 'getClienteDopoLaModifica'", () => {
    const initialState = {
      value: { 
        clienti: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            nome: "Mario", 
            cognome: "Rossi", 
            contatto: "3333300000", 
            contatto_attuale: "0000033333", 
            email: "mr@gmail.com", 
            email_attuale: "MR@GMAIL.COM", 
            note: "Note sul cliente \'Mario Rossi\'.", 
            note_attuale: "NOTE SUL CLIENTE \'MARIO ROSSI\'." 
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            nome: "Lucia", 
            cognome: "Verdi", 
            contatto: "3030303030", 
            contatto_attuale: "0303030303", 
            email: "lv@gmail.com", 
            email_attuale: "LV@GMAIL.COM", 
            note: "Note sulla cliente \'Lucia Verdi\'.", 
            note_attuale: "NOTE SULLA CLIENTE \'LUCIA VERDI\'." 
          } 
        ]  
      } 
    };

    const action = clienteSliceActions.getClienteDopoLaModifica({ 
      id_cliente: 2, 
    });

    const newState = clienteSliceReducer(initialState, action);
  
    expect(newState.value.clienti).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        nome: "Mario", 
        cognome: "Rossi", 
        contatto: "3333300000", 
        contatto_attuale: "0000033333", 
        email: "mr@gmail.com", 
        email_attuale: "MR@GMAIL.COM", 
        note: "Note sul cliente \'Mario Rossi\'.", 
        note_attuale: "NOTE SUL CLIENTE \'MARIO ROSSI\'." 
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        nome: "Lucia", 
        cognome: "Verdi", 
        contatto: "3030303030", 
        contatto_attuale: "3030303030", 
        email: "lv@gmail.com", 
        email_attuale: "lv@gmail.com", 
        note: "Note sulla cliente \'Lucia Verdi\'.", 
        note_attuale: "Note sulla cliente \'Lucia Verdi\'." 
      } 
    ]);
  });

  test("test su 'inserimentoCliente'", () => {
    const initialState = {
      value: { 
        clienti: [
          { 
            id: 1, 
            tipo_selezione: 0, 
            nome: "Mario", 
            cognome: "Rossi", 
            contatto: "3333300000", 
            contatto_attuale: "0000033333", 
            email: "mr@gmail.com", 
            email_attuale: "MR@GMAIL.COM", 
            note: "Note sul cliente \'Mario Rossi\'.", 
            note_attuale: "NOTE SUL CLIENTE \'MARIO ROSSI\'." 
          }, 
          { 
            id: 2, 
            tipo_selezione: 0, 
            nome: "Lucia", 
            cognome: "Verdi", 
            contatto: "3030303030", 
            contatto_attuale: "0303030303", 
            email: "lv@gmail.com", 
            email_attuale: "LV@GMAIL.COM", 
            note: "Note sulla cliente \'Lucia Verdi\'.", 
            note_attuale: "NOTE SULLA CLIENTE \'LUCIA VERDI\'." 
          } 
        ]  
      } 
    };

    const action = clienteSliceActions.inserimentoCliente({ 
      nuovoCliente: { 
        id: 3, 
        tipo_selezione: 0, 
        nome: "Gianni", 
        cognome: "Bianchi", 
        contatto: "3333333333", 
        contatto_attuale: "3333333333", 
        email: "gb@gmail.com", 
        email_attuale: "gb@gmail.com", 
        note: "Note sul cliente \'Gianni Bianchi\'.", 
        note_attuale: "Note sul cliente \'Gianni Bianchi\'." 
      } 
    });

    const newState = clienteSliceReducer(initialState, action);
  
    expect(newState.value.clienti).toEqual([
      { 
        id: 1, 
        tipo_selezione: 0, 
        nome: "Mario", 
        cognome: "Rossi", 
        contatto: "3333300000", 
        contatto_attuale: "0000033333", 
        email: "mr@gmail.com", 
        email_attuale: "MR@GMAIL.COM", 
        note: "Note sul cliente \'Mario Rossi\'.", 
        note_attuale: "NOTE SUL CLIENTE \'MARIO ROSSI\'." 
      }, 
      { 
        id: 2, 
        tipo_selezione: 0, 
        nome: "Lucia", 
        cognome: "Verdi", 
        contatto: "3030303030", 
        contatto_attuale: "0303030303", 
        email: "lv@gmail.com", 
        email_attuale: "LV@GMAIL.COM", 
        note: "Note sulla cliente \'Lucia Verdi\'.", 
        note_attuale: "NOTE SULLA CLIENTE \'LUCIA VERDI\'." 
      }, 
      { 
        id: 3, 
        tipo_selezione: 0, 
        nome: "Gianni", 
        cognome: "Bianchi", 
        contatto: "3333333333", 
        contatto_attuale: "3333333333", 
        email: "gb@gmail.com", 
        email_attuale: "gb@gmail.com", 
        note: "Note sul cliente \'Gianni Bianchi\'.", 
        note_attuale: "Note sul cliente \'Gianni Bianchi\'." 
      }
    ]);
  });
});










