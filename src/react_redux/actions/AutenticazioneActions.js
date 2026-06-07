// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { autenticazioneSliceActions } from '../store/reducers/AutenticazioneReducer';
// Actions
import { Actions } from "./Actions";
// Utils
import { controlloLogin, controlloModificaProfiloUtente } from "../../utils/Controlli";
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

    let isActive = 0;

    if(response.ok) {
      const result = await response.json();

      const nuoviDati = {
        ...datiLogin,
        num_utenti: result.utente ? 1 : 0,
        password_db: result.utente ? result.utente.password : null,
        salt_hex_db: result.utente ? result.utente.salt_hex : null,
        ruolo: result.utente ? result.utente.ruolo : null, 
        indirizzo: result.utente ? result.utente.indirizzo : null, 
      };
      
      if (nuoviDati.num_utenti === 0 || !passwordIsCorrect(datiLogin.password, nuoviDati.password_db, nuoviDati.salt_hex_db)) {
        return null;
      }

      let payload = {
        username: datiLogin.username,
        ruolo: result.utente ? result.utente.ruolo : null, 
        indirizzo: result.utente ? result.utente.indirizzo : null, 
      };

      if (result.utente.ruolo === "Amministratore") {
        payload.primo_intervallo = result.utente.primo_intervallo;
        payload.secondo_intervallo = result.utente.secondo_intervallo;
        payload.numero_clienti = result.utente.numero_clienti;
      }

      if (result.utente.ruolo === "cliente") {
        payload.id = result.utente.id;
        payload.nome = result.utente.nome;
        payload.cognome = result.utente.cognome;
        payload.email = result.utente.email;
        payload.contatto = result.utente.contatto;
        payload.indirizzo = result.utente.indirizzo;
      }

      this.dispatch(autenticazioneSliceActions.login(payload));

      isActive = result.utente.is_active || result.utente.ruolo === "Amministratore" ? 1 : 0;
      if(!isActive) {
        this.dispatch(autenticazioneSliceActions.logout())
      }
    }
    
    return {
      isOK: response.ok, 
      responseStatus: response.status, 
      is_active: isActive
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

  async modificaProfilo(username, ruolo, datiProfilo, setDatiProfilo, navigate) {
    const risultatoControllo = controlloModificaProfiloUtente(datiProfilo);
    setDatiProfilo(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

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
          primo_intervallo: datiProfilo.primo_intervallo,
          secondo_intervallo: datiProfilo.secondo_intervallo,
          numero_clienti: datiProfilo.numero_clienti,
        }));
        alert("Profilo modificato con successo.");
        navigate("/");
      }
      else {
        alert("Modifica profilo fallita.");  
      }
    }
    // le password non combaciano
    else {
      setDatiProfilo(prevState => ({
        ...prevState, 
        errore_password_attuale: "La password non è corretta."
      }))
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









