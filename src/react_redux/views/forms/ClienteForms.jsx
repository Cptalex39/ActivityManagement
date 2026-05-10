// React e Redux
import { useSelector } from 'react-redux';
import { useState, useEffect } from "react";
// Utils
import { controlloCliente } from "../../../utils/Controlli";

export class ClienteForms {
  attivitaState = useSelector((state) => state.attivita.value);

  constructor() {
    
  }
  
  getCampiRicercaClienti(item, handleOnChange, handleOnClick, handleOnBlur) {
    return {
      header: "Ricerca clienti",  
      label: ["Nome", "Cognome", "Telefono / cellulare", "Email"], 
      type: [null, null, "text", "text"],  
      step: [null, null, null, null], 
      min: [null, null, null, null], 
      name: ["nome", "cognome", "contatto", "email"], 
      id: ["ricerca_nome_cliente", "ricerca_cognome_cliente", "ricerca_contatto_cliente", "ricerca_email_cliente"], 
      value: [item.nome, item.cognome, item.contatto, item.email], 
      placeholder: ["Nome", "Cognome", "Telefono / cellulare", "Email"], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    };
  };

  getCampiClienteEsistente(item, handleOnChange, handleOnClick, handleOnBlur) {
    const attivitaState = useSelector((state) => state.attivita.value);
    const [errori, setErrori] = useState({
      errore_contatto: "", 
      errore_email: "", 
    });

    useEffect(() => {
      controlloCliente(item, setErrori);
    }, [item]);

    return {
      header: "Cliente", 
      label: [null, null, null], 
      tipoSelezione: item.tipo_selezione,  
      type: [null, "text", "text"],  
      step: [null, null, null], 
      min: [null, null, null], 
      name: ["nome_e_cognome", "contatto", "email"], 
      id: ["nome_e_cognome_cliente", "contatto_cliente", "email_cliente"], 
      value: [item.nome + " " + item.cognome, item.contatto, item.email], 
      placeholder: ["Nome e cognome", "Telefono / cellulare", "Email"], 
      errore: [null, errori.errore_contatto, errori.errore_email], 
      valoreModificabile: [false, true, true], 
      options: [null, null, null], 
      onChange: handleOnChange, 
      onClick: handleOnClick, 
      onBlur: handleOnBlur
    }
  };
}









