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

  logout(navigate) {
    this.dispatch(autenticazioneSliceActions.logout());
    navigate("/");
  }

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
}









