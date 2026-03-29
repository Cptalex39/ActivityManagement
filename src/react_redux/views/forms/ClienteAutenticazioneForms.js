import { useSelector } from 'react-redux';

export class ClienteAutenticazioneForms {
  attivitaState = useSelector((state) => state.attivita.value);
  lingua = this.attivitaState.lingua;

  constructor() {}

  // Login cliente
  getCampiLogin(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: this.lingua === "italiano" ? "Login Cliente" : "Customer Login",
      label: ["Email*", "Password*"],
      type: [null, "password"],
      name: ["email", "password"],
      id: ["email_cliente", "password_cliente"],
      value: [item.email, item.password],
      placeholder: ["Email*", "Password*"],
      errore: [item.errore_email, item.errore_password],
      onChange: handleOnChange,
      onClick: handleOnClick,
      onBlur: handleOnBlur,
    };
  }

  // Registrazione cliente
  getCampiRegistrazione(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: this.lingua === "italiano" ? "Registrazione Cliente" : "Customer Signup",
      label: [
        this.lingua === "italiano" ? "Nome*" : "First Name*",
        this.lingua === "italiano" ? "Cognome*" : "Last Name*",
        "Email*",
        this.lingua === "italiano" ? "Password*" : "Password*",
        this.lingua === "italiano" ? "Conferma Password*" : "Confirm Password*",
      ],
      type: [null, null, null, "password", "password"],
      name: ["nome", "cognome", "email", "password", "conferma_password"],
      id: ["nome_cliente", "cognome_cliente", "email_cliente", "password_cliente", "conferma_password_cliente"],
      value: [
        item.nome,
        item.cognome,
        item.email,
        item.password,
        item.conferma_password,
      ],
      placeholder: [
        this.lingua === "italiano" ? "Nome*" : "First Name*",
        this.lingua === "italiano" ? "Cognome*" : "Last Name*",
        "Email*",
        this.lingua === "italiano" ? "Password*" : "Password*",
        this.lingua === "italiano" ? "Conferma Password*" : "Confirm Password*",
      ],
      errore: [
        item.errore_nome,
        item.errore_cognome,
        item.errore_email,
        item.errore_password,
        item.errore_conferma_password,
      ],
      onChange: handleOnChange,
      onClick: handleOnClick,
      onBlur: handleOnBlur,
    };
  }
}