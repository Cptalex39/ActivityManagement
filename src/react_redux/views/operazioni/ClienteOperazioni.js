export const handleInsert = async (e, actions, nuovoCliente, setNuovoCliente, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler salvare il cliente?" : "Are you sure you want to save the client?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
  }

  const result = await actions.inserimentoCliente(nuovoCliente, setNuovoCliente, lingua);

  if(result === null) {
    return;
  }

  if(result.isOK) {
    alert(lingua === "italiano" ? "L\'inserimento del cliente è andato a buon fine." : "Client input was successful.");
  } 
  else {
    if(response.status === 400) {
      alert(lingua === "italiano" ? "Errore: cliente gia\' presente." : "Error: client already present.")
    }
    else {
      alert(lingua === "italiano" ? "Errore durante il salvataggio del nuovo cliente, riprova più tardi." : "Error while saving new client, please try again later.");
    }
  }
}

export const handleDelete = async (e, actions, selectedIdsEliminazione, setSelectedIdsEliminazione, clienti, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare i clienti?" : "Are you sure you want to eliminate clients?")) {
    alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    return;
  }

  const result = await actions.eliminaClienti(selectedIdsEliminazione, setSelectedIdsEliminazione, clienti);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'eliminazione dei clienti, riprova più tardi." : "Error while deleting clients, try again later.");
    return;
  }

  alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
}

export const handleSearch = async (e, actions, datiRicerca, lingua) => {
  e.preventDefault();

  const result = await actions.ricercaClienti(datiRicerca);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca dei clienti, riprova più tardi." : "Error while customer search, please try again later.");;
    return;
  }
}

export const handleGetAllClienti = async (actions, setClienti, lingua) => {
  const result = await actions.getAllClienti(setClienti);
  
  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'ottenimento dei clienti per l\'inserimento di un nuovo lavoro, riprova più tardi." : "Error while obtaining clients for new job entry, try again later.");
  }
}









