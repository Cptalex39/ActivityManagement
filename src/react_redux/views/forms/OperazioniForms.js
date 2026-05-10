export class OperazioniForms {
  handleInputChange = (e, setItem) => {
    e.preventDefault();
    const { name, value, id } = e.target;
  
    let modificabile = true;
    if(["primo_anno"].includes(id)) {
      setItem(prevState => ({
        ...prevState, 
        primo_anno: value, 
        ultimo_anno: parseInt(value) + 1
      }));
      modificabile = false;
    }
    else if(["ultimo_anno"].includes(id)) {
      modificabile = true;
    }
    else if(["nuovo_nome_cliente", "nuovo_cognome_cliente"].includes(id)) {
      if(value.length > 30) {
        modificabile = false;
      }
    }
    else if(["nuove_note_cliente", "nuove_note_servizio", "nuove_note_spesa", "note_profilo"].includes(id)) {
      if(value.length > 200) {
        modificabile = false;
      }
    }
    else if(["nuova_descrizione_spesa"].includes(id)) {
      if(value.length > 1000) {
        modificabile = false;
      }
    }
    else if(["nuovo_nome_servizio"].includes(id)) {
      if(value.length > 100) {
        modificabile = false;
      }
    }
    else if(["nuovo_nome_spesa"].includes(id)) {
      if(value.length > 50) {
        modificabile = false;
      }
    }
    else if (["nuovo_prezzo_servizio", "nuovo_totale_spesa"].includes(id) || id.startsWith("quantita_servizio_")) {
      const isDecimal = !isNaN(value) && Number(value) === parseFloat(value);
      if (!isDecimal || value < 0) {
        modificabile = false;
      }
    }
    else if(["nuova_email_cliente"].includes(id)) {
      if(value.length > 254) {
        modificabile = false;
      }
    }
    else if(["nuovo_contatto_cliente"].includes(id)) {
      if(value === "") {
        modificabile = true;
      }
      else if (!(/^\d+$/.test(value)) || !((value.startsWith("0") && value.length <= 11) || (value.startsWith("3") && value.length <= 10))) {
        modificabile = false;
      }
    }
    else if(["nuovo_username_profilo"].includes(id)) {
      if(value.length > 10) {
        modificabile = false;
      }
    }
    else if(["password_attuale_profilo", "nuova_password_profilo", "conferma_nuova_password_profilo"].includes(id)) {
      if(value.length > 128) {
        modificabile = false;
      }
    }
    
    if(modificabile === true) {
      setItem(prevState => ({
        ...prevState, 
        [name]: value
      }));
    }
  };

  handleInputClick = (e, setItem) => {
    if([
      "nuovo_giorno_spesa", "ricerca_primo_giorno_spesa", "ricerca_ultimo_giorno_spesa", 
      "file_primo_giorno_spesa", "file_ultimo_giorno_spesa" 
    ].includes(e.target.id)) {
      e.target.type = "date";
    }
    if([
      "ricerca_prezzo_min_servizio", "ricerca_prezzo_max_servizio", "nuovo_prezzo_servizio", 
      "ricerca_totale_min_spesa", "ricerca_totale_max_spesa", "nuovo_totale_spesa"
    ].includes(e.target.id)) {
      setItem(prevState => ({
        ...prevState, 
        [e.target.name]: e.target.value.substr(0, e.target.value.length - 2)
      }));
    }
  }

  handleInputBlur = (e, setItem) => {
    if([
      "nuovo_giorno_spesa", "ricerca_primo_giorno_spesa", "ricerca_ultimo_giorno_spesa", 
      "file_primo_giorno_spesa", "file_ultimo_giorno_spesa" 
    ].includes(e.target.id)) {
      e.target.type = (!e.target.value) ? "text" : "date";
    }
    if([
      "ricerca_prezzo_min_servizio", "ricerca_prezzo_max_servizio", "nuovo_prezzo_servizio", 
      "ricerca_totale_min_spesa", "ricerca_totale_max_spesa", "nuovo_totale_spesa"].includes(e.target.id)) {
      setItem(prevState => ({
        ...prevState, 
        [e.target.name]: e.target.value + " €"
      }));
    }
  }
}









