// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { autenticazioneSliceActions } from '../store/reducers/AutenticazioneReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloLogin, controlloProfilo } from "../../utils/Controlli";

export class AutenticazioneActions extends Actions {
  dispatch = useDispatch();
  
  constructor() {
    super();
  }
  
  /**
   * Azione per eseguire il login
   * 
   * @param {Object} datiLogin - dati del login.
   * @param {Function} setDatiLogin - setter dei dati del login.
   * @param {String} lingua - lingua del sistema attuale.
   * 
   * @returns {Object} risultato response operazione.
   */
  async login(datiLogin, setDatiLogin, lingua) {
    const response = await super.getResponse("/LOGIN", datiLogin);

    if(response.ok) {
      const result = await response.json();

      const nuoviDati = {
        ...datiLogin,
        num_utenti: result.utente ? 1 : 0,
        password_db: result.utente ? result.utente.password : null,
        salt_hex_db: result.utente ? result.utente.salt_hex : null,
      };
          
      setDatiLogin(nuoviDati);

      if (controlloLogin(nuoviDati, setDatiLogin, lingua) > 0) {
        return null;
      }

      this.dispatch(autenticazioneSliceActions.login({
        username: datiLogin.username,
        ruolo: datiLogin.ruolo,
        note: datiLogin.note,
      }));
    }
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  /**
   * Azione per eeguire il logout
   * 
   * @param {Function} navigate - routing dell'applicazione
   */
  logout(navigate) {
    this.dispatch(autenticazioneSliceActions.logout());
    navigate("/");
  }

  /**
   * Azione per eseguire il login.
   * 
   * @param {String} username - username login.
   * @param {String} password - password login.
   * 
   * @returns {Object} (risultato response operazione) AND (password e salt_hex (se presente nel DB)).
   */
  async eseguiLogin(username, password) {
    const datiLogin = {
      username: username,
      password: password, 
    };
    
    const response = await super.getResponse("/LOGIN", datiLogin);
    const result = await response.json();

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
      password_db: result.utente ? result.utente.password : null,
      salt_hex_db: result.utente ? result.utente.salt_hex : null,  
    }
  }

  /**
   * Azione per modificare il profilo.
   * 
   * @param {String} ruolo - ruolo profilo.
   * @param {Object} datiProfilo - dati del profilo aggiornati.
   * @param {Function} setDatiProfilo - setter dei dati del profilo.
   * @param {String} lingua - lingua attuale del sistema.
   * 
   * @returns {Object} risultato response operazione.
   */
  async modificaProfilo(ruolo, datiProfilo, setDatiProfilo, lingua) {
    if(controlloProfilo(datiProfilo, setDatiProfilo, lingua) > 0) {
      return null;
    }

    const response = await super.getResponse("/MODIFICA_PROFILO", datiProfilo);
    
    if(response.ok) {
      this.dispatch(autenticazioneSliceActions.login({
        isOK: response.ok, 
        responseStatus: response.status, 
        username: datiProfilo.nuovo_username,
        ruolo: ruolo,
        note: datiProfilo.note,
      }));
    }

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  /**
   * Azione per eseguire l'eliminazione del profilo.
   * 
   * @param {Object} dati - dati del profilo.
   * 
   * @returns {Object} risultato response operazione.
   */
  async eliminazioneProfilo(dati) {
    dati = {
      ...dati, 
      stato: "DELETION_REQUEST",
    };

    const response = await super.getResponse("/AGGIORNA_STATO_PROFILO", dati);

    return {
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }
}









