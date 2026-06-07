export const handleInsert = async (e, actions, nuovoServizio, setNuovoServizio) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler salvare il servizio?")) {
    alert("Salvataggio annullato.");
    return;
  }

  let nuovoServizioAggiornato = {
    ...nuovoServizio, 
  };

  setNuovoServizio(prevState => ({
    ...prevState, 
    nome_attuale: nuovoServizio.nome,
    prezzo_attuale: nuovoServizio.prezzo, 
    note_attuale: nuovoServizio.note, 
    in_uso: "Si", 
    in_uso_attuale: "Si",
  }))
  
  const result = await actions.inserisciServizio(nuovoServizio, setNuovoServizio);

  if(result === null) {
    return;
  }

  if(result.isOK) {
    alert("L\'inserimento del servizio è andato a buon fine.");
  }
  else {
    if(result.responseStatus === 400) {
      alert("Errore: servizio gia\' presente.");
    }
    else {
      alert("Errore durante il salvataggio del nuovo servizio, riprova più tardi.");
    }
  }
}

export const handleSearch = async (e, actions, datiRicerca) => {
  e.preventDefault();

  const result = await actions.ricercaServizi(datiRicerca);

  if(!result.isOK) {
    alert("Errore durante la ricerca dei servizi, riprova più tardi.");
    return;
  }
}

export const handleEdit = async (e, actions, servizi, selectedIdsModifica, setSelectedIdsModifica) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler modificare i servizi?")) {
    alert("Salvataggio annullato.");
    return;
  }

  const result = await actions.modificaServizi(servizi, selectedIdsModifica, setSelectedIdsModifica);

  let esitoModifica = "Esito modifica:\n";

  for(let i = 0; i < result.esitiModifiche.length; i++) {
    if(result.esitiModifiche[i][0]) {
      esitoModifica += "Servizio numero " + (i+1) + ": modifica avvenuta con successo.\n";
    }
    else {
      if(result.esitiModifiche[i][1] == 400) {
        esitoModifica += "Servizio numero " + (i+1) + ": errore durante la modifica: spesa gia\' presente.\n";
      }
      else {
        esitoModifica += "Servizio numero " + (i+1) + ": errore durante la modifica.\n";
      }
    }
  }
  alert(esitoModifica);
}










