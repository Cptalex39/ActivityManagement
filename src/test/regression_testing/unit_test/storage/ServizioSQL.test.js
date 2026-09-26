// import { ServizioSQL } from "../../../../db/ServizioSQL.js";
import { ServizioSQL } from "../../../../../storage/ServizioSQL";

describe("Test su 'eliminazioneServizi'", () => {
  let servizioSQL;
  
  beforeEach(() => {
    servizioSQL = new ServizioSQL();
  });
  
  /** RT_UT_SerSQL_EliSer_01 **/
  test("Query per l'eliminazione dei servizi", () => {
    const ids = [1, 2, 3, 4]
    
    const query = servizioSQL.sql_eliminazione_servizi(ids).replace(/\s+/g, ' ').trim();
    
    expect(query).toEqual("DELETE FROM servizio WHERE id IN (?, ?, ?, ?);");
  });
  
  /** RT_UT_SerSQL_EliSer_02 **/
  test("Dovrebbe restituire un array con i parametri per l'eliminazione dei servizi.", () => {
    const ids = [1, 2, 3, 4];
    expect(servizioSQL.params_eliminazione_servizi(ids)).toEqual([]);
  });
});









