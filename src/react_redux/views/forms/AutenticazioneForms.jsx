// React e Redux
import { useSelector } from 'react-redux';

export class AutenticazioneForms {
  attivitaState = useSelector((state) => state.attivita.value);

  constructor() {
    
  }

  getCampiLogin(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: "Login", 
      label: ["Username*", "Password*"],  
      type: [null, "password"],
      step: [null, null],  
      min: [null, null], 
      name: ["username", "password"], 
      id: ["username_login", "password_login"], 
      value: [item.username, item.password], 
      placeholder: ["Username*", "Password*"],
      errore: [item.errore_username, item.errore_password], 
      options: [null, null], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiProfilo(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: "Profilo", 
      label: ["Nuovo username*", "Password attuale*", "Nuova password", "Conferma nuova password"],
      type: [null, "password", "password", "password"],
      step: [null, null, null, null],  
      min: [null, null, null, null], 
      name: ["nuovo_username", "password_attuale", "nuova_password", "conferma_nuova_password"], 
      id: ["nuovo_username_profilo", "password_attuale_profilo", "nuova_password_profilo", "conferma_nuova_password_profilo"], 
      value: [item.nuovo_username, item.password_attuale, item.nuova_password, item.conferma_nuova_password], 
      placeholder: ["Nuovo username*", "Password attuale*", "Nuova password", "Conferma nuova password"],
      errore: [item.errore_nuovo_username, item.errore_password_attuale, item.errore_nuova_password, item.errore_conferma_nuova_password], 
      options: [null, null, null, null], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };
}









