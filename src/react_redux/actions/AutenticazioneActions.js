// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { autenticazioneSliceActions } from '../store/reducers/AutenticazioneReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloLogin, controlloProfilo } from "../../utils/Controlli";
import { passwordIsCorrect, generateRandomString, encryptPassword, PEPPER_HEX } from '../../utils/Sicurezza';

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
   * 
   * @returns {Object} risultato response operazione.
   */
  async login(datiLogin, setDatiLogin) {
    const response = await super.getResponse("/LOGIN", datiLogin);

    if(response.ok) {
      const result = await response.json();

      const nuoviDati = {
        ...datiLogin,
        num_utenti: result.utente ? 1 : 0,
        password_db: result.utente ? result.utente.password : null,
        salt_hex_db: result.utente ? result.utente.salt_hex : null,
        ruolo: result.utente.ruolo, 
        indirizzo: result.utente.indirizzo, 
      };
          
      setDatiLogin(nuoviDati);

      if (controlloLogin(nuoviDati, setDatiLogin) > 0) {
        return null;
      }

      let payload = {
        username: datiLogin.username,
        ruolo: result.utente.ruolo, 
        indirizzo: result.utente.indirizzo, 
      };

      if (result.utente.ruolo === "cliente") {
        payload.id = result.utente.id;
        payload.nome = result.utente.nome;
        payload.cognome = result.utente.cognome;
        payload.email = result.utente.email;
        payload.contatto = result.utente.contatto;
        payload.indirizzo = result.utente.indirizzo;
      }

      this.dispatch(autenticazioneSliceActions.login(payload));
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
   * 
   * @returns {Object} risultato response operazione.
   */
  async modificaProfilo(username, ruolo, datiProfilo, setDatiProfilo) {
    /*
    if(controlloProfilo(datiProfilo, setDatiProfilo) {
      return null;
    }
    */
    let isPasswordCorrect = false;
    // otteniamo la password attuale e la confrontiamo con la password attuale inserita in input
    let response = await super.getResponse("/OTTIENI_PASSWORD_UTENTE", datiProfilo)
    if(response.ok) { 
      let result = (await response.json()).result[0];
      isPasswordCorrect = passwordIsCorrect(datiProfilo.password_attuale, result.password, result.salt_hex);
      if(isPasswordCorrect) {
        datiProfilo.password_attuale = result.password;
      }
    }
    // se entrambe le password combaciano allora procediamo con le modifiche
    if(isPasswordCorrect) {
      if(datiProfilo.nuova_password !== "") {
        datiProfilo.salt_hex = generateRandomString(32);
        datiProfilo.nuova_password = encryptPassword(datiProfilo.nuova_password, datiProfilo.salt_hex, PEPPER_HEX);
      }
      response = await super.getResponse("/MODIFICA_PROFILO_UTENTE", datiProfilo);
      if(response.ok) {
        this.dispatch(autenticazioneSliceActions.login({
          username: datiProfilo.nuovo_username,
          ruolo: ruolo, 
        }));
      }
    }

    return {
      isPasswordCorrect: isPasswordCorrect, 
      isOK: response.ok, 
      responseStatus: response.status, 
    }
  }

  async aggiornaIndirizzo(nuovoIndirizzo) {
    this.dispatch(autenticazioneSliceActions.aggiornaIndirizzo({
      indirizzo: nuovoIndirizzo,
    }));
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









