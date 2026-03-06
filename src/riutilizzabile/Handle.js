export const handleChange = (e, index, setLocalValues) => {
  e.preventDefault();
  const { name, value, id } = e.target;

  let modificabile = true;

  if([
    "note_cliente", "note_servizio", "note_lavoro", "note_spesa" 
  ].includes(id)) {
    if(value.length > 200) {
      modificabile = false;
    }
  }
  else if([
    "descrizione_spesa" 
  ].includes(id)) {
    if(value.length > 1000) {
      modificabile = false;
    }
  }
  else if([
    "nome_servizio" 
  ].includes(id)) {
    if(value.length > 100) {
      modificabile = false;
    }
  }
  else if ([
    "prezzo_servizio", "totale_spesa" 
  ].includes(id)) {
    const isDecimal = !isNaN(value.substr(0, value)) && Number(value) === parseFloat(value);
    if (!isDecimal || value < 0) {
      modificabile = false;
    }
  }
  else if([
    "email_cliente" 
  ].includes(id)) {
    if(value.length > 254) {
      modificabile = false;
    }
  }
  else if([
    "contatto_cliente" 
  ].includes(id)) {
    if(value === "") {
      modificabile = true;
    }
    else if (!(/^\d+$/.test(value)) || !((value.startsWith("0") && value.length <= 11) || (value.startsWith("3") && value.length <= 10))) {
      modificabile = false;
    }
  }

  // Aggiorna solo lo stato locale
  if(modificabile === true) {
    setLocalValues((prevState) => ({
      ...prevState,
      [index]: value,
    }));
  }
};

export const handleClick = (e) => {
  if(["giorno_spesa", "giorno_lavoro"].includes(e.target.id)) {
    e.target.type = "date";
  }
  else if(["prezzo_servizio", "totale_spesa"].includes(e.target.id)) {
    e.target.value = e.target.value.substr(0, e.target.value.length-2);
  }
}









