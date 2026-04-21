export const handleLogin = async (e, actions, datiLogin, setDatiLogin, navigate, lingua) => {
  e.preventDefault();
  
  const result = await actions.login(datiLogin, setDatiLogin, lingua);

  if(result === null) {
    return;
  }

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante il login, riprova più tardi." : "Error while logging in, please try again later.");
  }
  else {
    navigate("/");
  }
}

export const handleModificaProfilo = async (e, actions, username, ruolo, datiProfilo, setDatiProfilo, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler modificare il profilo?" : "Are you sure you want to edit your profile?")) {
    alert(lingua === "italiano" ? "Modifica annullata." : "Modification cancelled.");
    return;
  }

  const resultLogin = await actions.eseguiLogin(username, "");
  
  if(!resultLogin.isOK) {
    alert(lingua === "italiano" ? "Errore durante la modifica del profilo, riprova più tardi.": "Error while editing profile, please try again later.");
    return;
  }

  let datiProfiloAggiornati = {
    ...datiProfilo, 
    password_db: resultLogin.password_db,
    salt_hex_db: resultLogin.salt_hex_db
  }
  
  const resultModifica = await actions.modificaProfilo(ruolo, datiProfiloAggiornati, setDatiProfilo, lingua);
  
  if(resultModifica === null) {
    return;
  }

  setDatiProfilo(datiProfiloAggiornati);

  if(!resultModifica.isOK) {
    alert(lingua === "italiano" ? "Errore durante la modifica del profilo, riprova più tardi." : "Error while editing profile, please try again later.");
  }
  else {
    alert(lingua === "italiano" ? "Il profilo è stato modificato con successo." : "The profile was successfully modified.");
  }
}








