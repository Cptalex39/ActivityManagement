import { servizioReducer, servizioSliceActions } from "../../../../../react_redux/store/reducers/ServizioReducer";

const stateWithServices1 = {
  value: {
    servizi: [
      { 
        id:1, 
        tipo:"Prodotto",
        nome:"Forbici", 
        descrizione:"Forbici dalla punta arrotondata",
        prezzo:10.12,
        in_uso:"Si",
        note:"Forbici nere",
        tipo_selezione:2 
      }, 
      { 
        id:2, 
        tipo:"Prodotto",
        nome:"Matita",
        descrizione:"Matita con spessore 1mm",
        prezzo:5.06,
        in_uso:"Si",
        note:"Matita colore giallo", 
        tipo_selezione:1 
      }
    ]
  }
};

const stateWithoutServices1 = {
  value: {
    servizi: []
  }
};

const stateWithoutServices2 = {
  value: {
    servizi: -1
  }
};

describe('Vari test su "aggiornaServizi"', () => {
  /** RT_UT_SerR_AgnServizi_01 **/
  test('servizi aggiornati', () => {
    const action = servizioSliceActions.aggiornaServizi({
      servizi: [
        { 
          id:3, 
          tipo:"Prodotto",
          nome:"Quaderno", 
          descrizione:"Quaderno a quadrettini",
          prezzo:2.48,
          in_uso:"Si",
          note:"Quderno verde",
          tipo_selezione:1 
        }, 
        { 
          id:4, 
          tipo:"Prodotto",
          nome:"Gomma",
          descrizione:"Gomma da cancellare",
          prezzo:8.42,
          in_uso:"Si",
          note:"Gomma colore bianco", 
          tipo_selezione:2 
        }
      ]
    });

    const valueExpected = {
      value: {
        servizi: [
          { 
            id:3, 
            tipo:"Prodotto",
            nome:"Quaderno", 
            descrizione:"Quaderno a quadrettini",
            prezzo:2.48,
            in_uso:"Si",
            note:"Quderno verde",
            tipo_selezione:1 
          }, 
          { 
            id:4, 
            tipo:"Prodotto",
            nome:"Gomma",
            descrizione:"Gomma da cancellare",
            prezzo:8.42,
            in_uso:"Si",
            note:"Gomma colore bianco", 
            tipo_selezione:2 
          }
        ],
      },
    };

    const result = servizioReducer(stateWithServices1, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaTipoSelezione"', () => {
  /** RT_UT_SerR_AgnTipSel_01 **/
  test('servizi = []', () => {
    const action = servizioSliceActions.aggiornaTipoSelezione({
      id_servizio: 4, 
      nuova_selezione: 0,
    });

    const valueExpected = stateWithoutServices1;

    const result = servizioReducer(stateWithoutServices1, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_SerR_AgnTipSel_02 **/
  test('servizi = -1', () => {
    const action = servizioSliceActions.aggiornaTipoSelezione({
      id_servizio: 4, 
      nuova_selezione: 0,
    });

    const valueExpected = stateWithoutServices2;

    const result = servizioReducer(stateWithoutServices2, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_SerR_AgnTipSel_03 **/
  test('servizi non vuoto, servizio non presente', () => {
    const action = servizioSliceActions.aggiornaTipoSelezione({
      id_servizio: 4, 
      nuova_selezione: 0,
    });

    const valueExpected = stateWithServices1;

    const result = servizioReducer(stateWithServices1, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_SerR_AgnTipSel_04 **/
  test('servizi non vuoto, servizio presente', () => {
    const action = servizioSliceActions.aggiornaTipoSelezione({
      id_servizio: 2, 
      nuova_selezione: 0,
    });

    const valueExpected = {
      value: {
        servizi: [
          { 
            id:1, 
            tipo:"Prodotto",
            nome:"Forbici", 
            descrizione:"Forbici dalla punta arrotondata",
            prezzo:10.12,
            in_uso:"Si",
            note:"Forbici nere",
            tipo_selezione:2 
          }, 
          { 
            id:2, 
            tipo:"Prodotto",
            nome:"Matita",
            descrizione:"Matita con spessore 1mm",
            prezzo:5.06,
            in_uso:"Si",
            note:"Matita colore giallo", 
            tipo_selezione:0
          }
        ]
      }
    };

    const result = servizioReducer(stateWithServices1, action);

    expect(result).toEqual(valueExpected);
  });
});

describe('Vari test su "aggiornaServizio"', () => {
  /** RT_UT_SerR_AgnServizio_01 **/
  test('servizi = []', () => {
    const action = servizioSliceActions.aggiornaServizio({
      id_servizio: 2, 
      nome_attributo: "prezzo", 
      nuovo_valore: 40.22
    });

    const valueExpected = stateWithoutServices1;

    const result = servizioReducer(stateWithoutServices1, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_SerR_AgnServizio_02 **/
  test('servizi = -1', () => {
    const action = servizioSliceActions.aggiornaServizio({
      id_servizio: 2, 
      nome_attributo: "prezzo", 
      nuovo_valore: 40.22
    });

    const valueExpected = stateWithoutServices2;

    const result = servizioReducer(stateWithoutServices2, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_SerR_AgnServizio_03 **/
  test('servizi non vuoto, servizio non presente', () => {
    const action = servizioSliceActions.aggiornaServizio({
      id_servizio: 4, 
      nome_attributo: "prezzo", 
      nuovo_valore: 40.22
    });

    const valueExpected = stateWithServices1;

    const result = servizioReducer(stateWithServices1, action);

    expect(result).toEqual(valueExpected);
  });

  /** RT_UT_SerR_AgnServizio_04 **/
  test('servizi non vuoto, servizio presente', () => {
    const action = servizioSliceActions.aggiornaServizio({
      id_servizio: 2, 
      nome_attributo: "prezzo", 
      nuovo_valore: 40.22
    });

    const valueExpected = {
      value: {
        servizi: [
          { 
            id:1, 
            tipo:"Prodotto",
            nome:"Forbici", 
            descrizione:"Forbici dalla punta arrotondata",
            prezzo:10.12,
            in_uso:"Si",
            note:"Forbici nere",
            tipo_selezione:2 
          }, 
          { 
            id:2, 
            tipo:"Prodotto",
            nome:"Matita",
            descrizione:"Matita con spessore 1mm",
            prezzo:40.22,
            in_uso:"Si",
            note:"Matita colore giallo", 
            tipo_selezione:1 
          }
        ]
      }
    };

    const result = servizioReducer(stateWithServices1, action);

    expect(result).toEqual(valueExpected);
  });
});








