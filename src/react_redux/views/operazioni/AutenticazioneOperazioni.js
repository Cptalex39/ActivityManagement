import { controlloLogin } from "../../../utils/Controlli";
import { passwordIsCorrect } from "../../../utils/Sicurezza";

export const handleLogin = async (e, actions, datiLogin, setDatiLogin, navigate) => {
  e.preventDefault();

  const risultatoControllo = controlloLogin(datiLogin);
  setDatiLogin(risultatoControllo);

  if(risultatoControllo.num_errori > 0) {
    return;
  }
  
  const result = await actions.login(datiLogin, setDatiLogin);

  if(result === null) {
    setDatiLogin(prevState => ({
      ...datiLogin, 
      errore_username: null, 
      errore_password: null, 
      errore_login: "Username e/o password errati."
    }));
    return;
  }

  if(!result.isOK) {
    alert("Errore durante il login, riprova più tardi.");
  }
  else {
    if(result.is_active) {
      navigate("/");
    }
    else {
      setDatiLogin(prevState => ({
        ...datiLogin, 
        errore_login: "Errore, l'account risulta non attivo."
      }));
    }
  }
}

export const handleModificaProfilo = async (e, actions, username, ruolo, datiProfilo, setDatiProfilo) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler modificare il profilo?")) {
    alert("Modifica annullata.");
    return;
  }

  const resultLogin = await actions.eseguiLogin(username, "");
  
  if(!resultLogin.isOK) {
    alert("Errore durante la modifica del profilo, riprova più tardi.");
    return;
  }

  let datiProfiloAggiornati = {
    ...datiProfilo, 
    password_db: resultLogin.password_db,
    salt_hex_db: resultLogin.salt_hex_db
  }
  
  const resultModifica = await actions.modificaProfilo(ruolo, datiProfiloAggiornati, setDatiProfilo);
  
  if(resultModifica === null) {
    return;
  }

  setDatiProfilo(datiProfiloAggiornati);

  if(!resultModifica.isOK) {
    alert("Errore durante la modifica del profilo, riprova più tardi.");
  }
  else {
    alert("Il profilo è stato modificato con successo.");
  }
}








