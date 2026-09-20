import { Dispatcher } from "../../../dispatcher/Dispatcher.js"; 
import store from "../../../store/store.js"; 
import { stileSliceActions } from "../../../store/slice/StileSlice.js";
import { attivitaSliceActions } from "../../../store/slice/AttivitaSlice.js";
import { autenticazioneSliceActions } from "../../../store/slice/AutenticazioneSlice.js";
import { clienteSliceActions } from "../../../store/slice/ClienteSlice.js";
import { lavoroSliceActions } from "../../../store/slice/LavoroSlice.js";
import { servizioSliceActions } from "../../../store/slice/ServizioSlice.js";
import { spesaSliceActions } from "../../../store/slice/SpesaSlice.js";

jest.mock("../../../store/store.js", () => ({
  dispatch: jest.fn(),
}));

describe("Dispatcher", () => {
  let dispatcher;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    store.dispatch.mockClear(); // Pulisce i mock tra un test e l'altro
  });

  test("test su 'cambioImmagineSfondo'.", () => {
    const pathImg = "immagine.png";
    dispatcher.cambioImmagineSfondo(pathImg);
    
    expect(store.dispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioImmagineSfondo({ pathImg })
    );
  });

  test("test su 'cambioColoreSfondo'.", () => {
    const coloreRGB = "22, 44, 66";
    dispatcher.cambioColoreSfondo(coloreRGB);

    expect(store.dispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioColoreSfondo({ coloreRGB })
    );
  });

  test("test su 'cambioVistaItem'.", () => {
    const vistaItem = "card";
    dispatcher.cambioVistaItem(vistaItem);

    expect(store.dispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioVistaItem({vistaItem})
    );
  });

  test("test su 'cambioVistaForm'.", () => {
    const vistaForm = "card";
    dispatcher.cambioVistaForm(vistaForm);

    expect(store.dispatch).toHaveBeenCalledWith(
      stileSliceActions.cambioVistaForm({vistaForm})
    );
  });

  /* Attivita */

  test("test su 'modificaWidget'.", () => {
    const nomeWidget = "clienti";
    const tipoVisualizzazione = 1;
    dispatcher.modificaWidget(nomeWidget, tipoVisualizzazione);

    expect(store.dispatch).toHaveBeenCalledWith(
      attivitaSliceActions.modificaWidget({nomeWidget, tipoVisualizzazione})
    );
  });

  test("test su 'widgetSelected'.", () => {
    dispatcher.widgetSelected();

    expect(store.dispatch).toHaveBeenCalledWith(
      attivitaSliceActions.widgetSelected()
    );
  });

  test("test su 'widgetView'.", () => {
    dispatcher.widgetView();

    expect(store.dispatch).toHaveBeenCalledWith(
      attivitaSliceActions.widgetView()
    );
  });

  /* Autenticazione */

  test("test su 'eseguiLogin'.", () => {
    const username = "test_username";
    const ruolo = "test_ruolo"; 
    const note = "Test note";
    dispatcher.eseguiLogin(username, ruolo, note);

    expect(store.dispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.eseguiLogin({username, ruolo, note})
    );
  });

  test("test su 'eseguiLogout'.", () => {
    dispatcher.eseguiLogout();

    expect(store.dispatch).toHaveBeenCalledWith(
      autenticazioneSliceActions.eseguiLogout()
    );
  });

  /* Cliente */

  test("test su 'aggiornaClienti'.", () => {
    const clienti = [
      {
        id: 1,
        tipo_visualizzazione: 0,
        nome: "Mario",
        cognome: "Rossi"
      },
      {
        id: 2,
        tipo_visualizzazione: 0,
        nome: "Elena", 
        cognome: "Verdi"
      }
    ];
    dispatcher.aggiornaClienti(clienti);

    expect(store.dispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaClienti({clienti})
    );
  });

  test("test su 'aggiornaTipoSelezioneCliente'.", () => {
    const id_cliente = 2;
    const nuova_selezione = 1;
    dispatcher.aggiornaTipoSelezioneCliente(id_cliente, nuova_selezione);

    expect(store.dispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaTipoSelezione({id_cliente, nuova_selezione})
    );
  });

  test("test su 'aggiornaCliente'.", () => {
    const id_cliente = 2;
    const nome_attributo = "contatto";
    const nuovo_valore = "0000033333";
    dispatcher.aggiornaCliente(id_cliente, nome_attributo, nuovo_valore);

    expect(store.dispatch).toHaveBeenCalledWith(
      clienteSliceActions.aggiornaCliente({id_cliente, nome_attributo, nuovo_valore})
    );
  });

  test("test su 'getClientePrimaDellaModifica'.", () => {
    const id_cliente = 2;
    dispatcher.getClientePrimaDellaModifica(id_cliente);

    expect(store.dispatch).toHaveBeenCalledWith(
      clienteSliceActions.getClientePrimaDellaModifica({id_cliente})
    );
  });

  test("test su 'getClienteDopoLaModifica'.", () => {
    const id_cliente = 2;
    dispatcher.getClienteDopoLaModifica(id_cliente);

    expect(store.dispatch).toHaveBeenCalledWith(
      clienteSliceActions.getClienteDopoLaModifica({id_cliente})
    );
  });

  test("test su 'inserimentoCliente'.", () => {
    const nuovoCliente = {
      id: 3,
      tipo_visualizzazione: 0,
      nome: "Gianni", 
      cognome: "Bianchi"
    };
    dispatcher.inserimentoCliente(nuovoCliente);

    expect(store.dispatch).toHaveBeenCalledWith(
      clienteSliceActions.inserimentoCliente({nuovoCliente})
    );
  });

  /* Lavoro */

  test("test su 'aggiornaLavori'.", () => {
    const lavori = [
      {
        id: 1,
        tipo_visualizzazione: 0,
        totale: 12.34,
        note: "Note sul primo lavoro"
      },
      {
        id: 2,
        tipo_visualizzazione: 0,
        totale: 56.78,
        note: "Note sul secondo lavoro"
      }
    ];
    dispatcher.aggiornaLavori(lavori);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.aggiornaLavori({lavori})
    );
  });

  test("test su 'aggiornaTipoSelezioneLavoro'.", () => {
    const id_lavoro = 2;
    const nuova_selezione = 1;
    dispatcher.aggiornaTipoSelezioneLavoro(id_lavoro, nuova_selezione);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.aggiornaTipoSelezione({id_lavoro, nuova_selezione})
    );
  });

  test("test su 'aggiornaLavoro'.", () => {
    const id_lavoro = 2;
    const nome_attributo = "note";
    const nuovo_valore = "Note aggiornate secondo lavoro";
    dispatcher.aggiornaLavoro(id_lavoro, nome_attributo, nuovo_valore);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.aggiornaLavoro({id_lavoro, nome_attributo, nuovo_valore})
    );
  });

  test("test su 'getLavoroPrimaDellaModifica'.", () => {
    const id_lavoro = 2;
    dispatcher.getLavoroPrimaDellaModifica(id_lavoro);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.getLavoroPrimaDellaModifica({id_lavoro})
    );
  });

  test("test su 'getLavoroDopoLaModifica'.", () => {
    const id_lavoro = 2;
    dispatcher.getLavoroDopoLaModifica(id_lavoro);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.getLavoroDopoLaModifica({id_lavoro})
    );
  });

  test("test su 'inserimentoLavoro'.", () => {
    const nuovoLavoro = {
      id: 3,
      tipo_visualizzazione: 0,
      totale: 90.12, 
      note: "Note sul terzo lavoro"
    };
    dispatcher.inserimentoLavoro(nuovoLavoro);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.inserimentoLavoro({nuovoLavoro})
    );
  });

  test("test su 'aggiornaEntrateLavori'.", () => {
    const entrateLavori = 123.45;
    dispatcher.aggiornaEntrateLavori(entrateLavori);

    expect(store.dispatch).toHaveBeenCalledWith(
      lavoroSliceActions.aggiornaEntrateLavori({entrateLavori})
    );
  });

  /* Servizio */

  test("test su 'aggiornaServizi'.", () => {
    const servizi = [
      {
        id: 1,
        tipo_visualizzazione: 0,
        nome: "Taglio capelli",
        note: "Note sul primo servizio"
      },
      {
        id: 2,
        tipo_visualizzazione: 0,
        nome: "Rasatura barba",
        note: "Note sul secondo servizio"
      }
    ];
    dispatcher.aggiornaServizi(servizi);

    expect(store.dispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizi({servizi})
    );
  });

  test("test su 'aggiornaTipoSelezioneServizio'.", () => {
    const id_servizio = 2;
    const nuova_selezione = 1;
    dispatcher.aggiornaTipoSelezioneServizio(id_servizio, nuova_selezione);

    expect(store.dispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaTipoSelezione({id_servizio, nuova_selezione})
    );
  });

  test("test su 'aggiornaServizio'.", () => {
    const id_servizio = 2;
    const nome_attributo = "note";
    const nuovo_valore = "Note aggiornate secondo servizio";
    dispatcher.aggiornaServizio(id_servizio, nome_attributo, nuovo_valore);

    expect(store.dispatch).toHaveBeenCalledWith(
      servizioSliceActions.aggiornaServizio({id_servizio, nome_attributo, nuovo_valore})
    );
  });

  test("test su 'getServizioPrimaDellaModifica'.", () => {
    const id_servizio = 2;
    dispatcher.getServizioPrimaDellaModifica(id_servizio);

    expect(store.dispatch).toHaveBeenCalledWith(
      servizioSliceActions.getServizioPrimaDellaModifica({id_servizio})
    );
  });

  test("test su 'getServizioDopoLaModifica'.", () => {
    const id_servizio = 2;
    dispatcher.getServizioDopoLaModifica(id_servizio);

    expect(store.dispatch).toHaveBeenCalledWith(
      servizioSliceActions.getServizioDopoLaModifica({id_servizio})
    );
  });

  test("test su 'inserimentoServizio'.", () => {
    const nuovoServizio = {
      id: 3,
      tipo_visualizzazione: 0,
      nome: "Colorazione capelli",
      note: "Note sul terzo servizio"
    }
    dispatcher.inserimentoServizio(nuovoServizio);

    expect(store.dispatch).toHaveBeenCalledWith(
      servizioSliceActions.inserimentoServizio({nuovoServizio})
    );
  });

  /* Spesa */

  test("test su 'aggiornaSpese'.", () => {
    const spese = [
      {
        id: 1,
        tipo_visualizzazione: 0,
        nome: "Bolletta luce",
        note: "Note sulla prima spesa"
      },
      {
        id: 2,
        tipo_visualizzazione: 0,
        nome: "Bolletta acqua",
        note: "Note sulla seconda spesa"
      }
    ];
    dispatcher.aggiornaSpese(spese);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpese({spese})
    );
  });

  test("test su 'aggiornaTipoSelezioneSpesa'.", () => {
    const id_spesa = 2;
    const nuova_selezione = 1;
    dispatcher.aggiornaTipoSelezioneSpesa(id_spesa, nuova_selezione);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaTipoSelezione({id_spesa, nuova_selezione})
    );
  });

  test("test su 'aggiornaSpesa'.", () => {
    const id_spesa = 2;
    const nome_attributo = "note";
    const nuovo_valore = "Note aggiornate seconda spesa";
    dispatcher.aggiornaSpesa(id_spesa, nome_attributo, nuovo_valore);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaSpesa({id_spesa, nome_attributo, nuovo_valore})
    );
  });

  test("test su 'getSpesaPrimaDellaModifica'.", () => {
    const id_spesa = 2;
    dispatcher.getSpesaPrimaDellaModifica(id_spesa);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.getSpesaPrimaDellaModifica({id_spesa})
    );
  });

  test("test su 'getSpesaDopoLaModifica'.", () => {
    const id_spesa = 2;
    dispatcher.getSpesaDopoLaModifica(id_spesa);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.getSpesaDopoLaModifica({id_spesa})
    );
  });

  test("test su 'inserimentoSpesa'.", () => {
    const nuovaSpesa = {
      id: 3,
      tipo_visualizzazione: 0,
      nome: "Spese varie",
      note: "Note sulla terza spesa"
    }
    dispatcher.inserimentoSpesa(nuovaSpesa);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.inserimentoSpesa({nuovaSpesa})
    );
  });

  test("test su 'aggiornaUsciteSpese'.", () => {
    const usciteSpese = 123.45
    dispatcher.aggiornaUsciteSpese(usciteSpese);

    expect(store.dispatch).toHaveBeenCalledWith(
      spesaSliceActions.aggiornaUsciteSpese({usciteSpese})
    );
  });
});









