// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { clienteSliceActions } from '../store/reducers/ClienteReducer';
import { autenticazioneSliceActions } from '../store/reducers/AutenticazioneReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloRicercaClienti, controlloModificaProfiloCliente } from '../../utils/Controlli';
import { encryptPassword, generateRandomString, passwordIsCorrect, PEPPER_HEX } from '../../utils/Sicurezza';

export class ClienteActions extends Actions {
  dispatch = useDispatch();

  constructor() {
    super();
  }

  /**
   * Azione che azzera la lista dei clienti.
   */
  azzeraLista() {
    this.dispatch(clienteSliceActions.aggiornaClienti({
      clienti: [], 
      listaDaAggiornare: "clienti", 
    }));
  }

  /**
   * Azione che registra un nuovo cliente nel sistema.
   * 
   * @param {Object} nuovoCliente - dati del nuovo cliente.
   * @param {Function} setNuovoCliente - setter dei dati del nuovo cliente.
   * 
   * @returns {Object} risultato response operazione.
   */
  async registrazioneCliente(nuovoCliente, setNuovoCliente) {    
    nuovoCliente.salt_hex = generateRandomString(32);
    nuovoCliente.password = encryptPassword(nuovoCliente.password, nuovoCliente.salt_hex, PEPPER_HEX);

    const response = await super.getResponse("/INSERISCI_ITEM", nuovoCliente);

    return {
      isOK: response.ok ? true : false, 
      responseStatus: response.status, 
    }
  }

  async ricercaClienti(datiRicerca, setDatiRicerca) {
    const risultatoControllo = controlloRicercaClienti(datiRicerca);
    setDatiRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    const response = await super.getResponse("/VISUALIZZA_ITEMS", datiRicerca);

    if(response.ok) {
      const result = await response.json();
      
      this.dispatch(clienteSliceActions.aggiornaClienti({
        clienti: result.items, 
        listaDaAggiornare: "clienti", 
      }))
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  /**
   * Azione per selezionare un operazione sul cliente.
   * 
   * @param {String} icon - icona dell'operazione selezionata.
   * @param {Object} item - item selezionato.
   * @param {Array<number>} selectedIdsModifica - id dei clienti selezionati per la modifica.
   * @param {Function} setSelectedIdsModifica - setter degli id selezionati per la modifica.
   * @param {Array<number>} selectedIdsEliminazione - id dei clienti selezionati per l'eliminazione.
   * @param {Function} setSelectedIdsEliminazione - setter degli id selezionati per l'eliminazione.
   * @param {Function} setSelectedPencilCount - setter per il conteggio del numero di clienti selezionati per la modifica.
   * @param {Function} setSelectedTrashCount - setter per il conteggio del numero di clienti selezionati per l'eliminazione.
   */
  selezioneOperazioneCliente(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, 
    setSelectedIdsEliminazione, setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 0
        }))
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 2
        }))
        setSelectedIdsEliminazione(prevIds => [...prevIds, item.id]);
        setSelectedTrashCount(prevCount => prevCount + 1);
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  aggiornaCliente(id_cliente, nome_attributo, nuovo_valore) {
    this.dispatch(clienteSliceActions.aggiornaCliente({
      id_cliente: id_cliente,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore,
    }))
  }

  async eliminaCliente(username) {
    const dati = {
      username: username,
      tipo_item: "cliente", 
    }

    const response = await super.getResponse("/ELIMINA_ITEM", dati);

    if(response.ok) {
      this.dispatch(clienteSliceActions.eliminaCliente({
        username: username, 
        listaDaAggiornare: "clienti", 
      }))
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async richiestaEliminazioneProfilo(username) {
    const dati = {
      username: username
    }

    const response = await super.getResponse("RICHIESTA_ELIMINAZIONE", dati);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async riattivaCliente(username) {
    const dati = {
      username: username
    }

    const response = await super.getResponse("RIATTIVA_CLIENTE", dati);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async ottieniClientiDaEliminare() {
    const response = await super.getResponse("/OTTIENI_CLIENTI_DA_ELIMINARE", {});

    return {
      items: response.ok ? (await response.json()).items : [], 
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async modificaProfilo(dati) {
    let isPasswordCorrect = false;
    // otteniamo la password attuale e la confrontiamo con la password attuale inserita in input
    let response = await super.getResponse("/OTTIENI_PASSWORD", dati)
    if(response.ok) {
      let result = (await response.json()).result[0];
      isPasswordCorrect = passwordIsCorrect(dati.password_attuale, result.password, result.salt_hex);
    }
    // se entrambe le password combaciano allora procediamo con le modifiche
    if(isPasswordCorrect) {
      if(dati.nuova_password !== "") {
        dati.salt_hex = generateRandomString(32)
        dati.nuova_password = encryptPassword(dati.nuova_password, dati.salt_hex, PEPPER_HEX);
      }
      response = await super.getResponse("/MODIFICA_PROFILO_CLIENTE", dati);
      if(response.ok) {
        this.dispatch(autenticazioneSliceActions.aggiornaProfiloCliente({
          email: dati.email, 
          contatto: dati.contatto, 
          indirizzo: dati.indirizzo, 
          username: dati.username
        }));
      }
    }

    return {
      isPasswordCorrect: isPasswordCorrect, 
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }
}









