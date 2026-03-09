export const handleInsert = async (e, actions, nuovoServizio, setNuovoServizio, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler salvare il servizio?" : "Are you sure you want to save the service?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
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
  
  const result = await actions.inserisciServizio(nuovoServizio, setNuovoServizio, lingua);

  if(result === null) {
    return;
  }

  if(result.isOK) {
    alert(lingua === "italiano" ? "L\'inserimento del servizio è andato a buon fine." : "Service entry was successful.");
  }
  else {
    if(result.responseStatus === 400) {
      alert(lingua === "italiano" ? "Errore: servizio gia\' presente." : "Error: service already present.")
    }
    else {
      alert(lingua === "italiano" ? "Errore durante il salvataggio del nuovo servizio, riprova più tardi." : "Error while saving the new service, please try again later.");
    }
  }
}

export const handleSearch = async (e, actions, datiRicerca, lingua) => {
  e.preventDefault();

  const result = await actions.ricercaServizi(datiRicerca);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca dei servizi, riprova più tardi." : "Error while searching for services, please try again later.");
    return;
  }
}

export const handleEdit = async (e, actions, servizi, selectedIdsModifica, setSelectedIdsModifica, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler modificare i servizi?" : "Are you sure you want to modify the services?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    return;
  }

  const result = await actions.modificaServizi(servizi, selectedIdsModifica, setSelectedIdsModifica);

  let esitoModifica = lingua === "italiano" ? "Esito modifica:\n" : "Modification outcome:\n";

  for(let i = 0; i < result.esitiModifiche.length; i++) {
    if(result.esitiModifiche[i][0]) {
      esitoModifica += lingua === "italiano" ? "Servizio numero " + (i+1) + ": modifica avvenuta con successo.\n" : "Service number " + (i+1) + ": successful modification.\n";
    }
    else {
      if(result.esitiModifiche[i][1] == 400) {
        esitoModifica += lingua === "italiano" ? "Servizio numero " + (i+1) + ": errore durante la modifica: spesa gia\' presente.\n" : "Service number " + (i+1) + ": Error while editing: expense already present.\n";
      }
      else {
        esitoModifica += lingua === "italiano" ? "Servizio numero " + (i+1) + ": errore durante la modifica.\n" : "Service number " + (i+1) + ": error while editing.\n";
      }
    }
  }
  alert(esitoModifica);
}

export const handleDelete = async (e, actions, selectedIdsEliminazione, setSelectedIdsEliminazione, servizi, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare i servizi? Tutti i lavori presenti attualmente nel database verranno modificati eliminando i servizi selezionati." : "Are you sure you want to delete the services? All jobs currently in the database will be modified by deleting the selected services.")) {
    alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    return;
  }

  const result = await actions.eliminaServizi(selectedIdsEliminazione, setSelectedIdsEliminazione, servizi);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'eliminazione dei servizi, riprova più tardi." : "Error while deleting services, try again later.");
    return;
  }

  alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
}

export const handleGetAllServizi = async (actions, setServizi, lingua) => {
  const result = await actions.getAllItems(setServizi, "servizio");

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'ottenimento dei servizi per l\'inserimento di un nuovo lavoro, riprova più tardi." : "Error while obtaining services for new job entry, try again later.");
  }
}









