//import { ClienteSQL } from "../../../../db/ClienteSQL.js";
import { ClienteSQL } from "../../../../../storage/ClienteSQL";

describe("Test su 'selezioneClienti'", () => {
  let clienteSQL;
  
  beforeEach(() => {
    clienteSQL = new ClienteSQL();
  });
  
  /** RT_UT_CliSQL_SelCli_01 **/
  test("Dovrebbe restituire un array con i parametri per la selezione dei clienti.", () => {
    const params_in = { 
      nome: "Mario", 
      cognome: "Rossi", 
      contatto: "3333300000", 
      email: "mr@gmail.com"
    };
    expect(clienteSQL.params_selezione_clienti(params_in)).toEqual([
      `%${params_in.nome}%`, 
      `%${params_in.cognome}%`, 
      `%${params_in.contatto}%`, 
      `%${params_in.email}%`
    ]);
  });
});








