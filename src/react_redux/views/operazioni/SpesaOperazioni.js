export const handleInsert = async (e, actions, nuovaSpesa, setNuovaSpesa, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler salvare la spesa?" : "Are you sure you want to save the expense?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    return;
  }

  const result = await actions.inserimentoSpesa(nuovaSpesa, setNuovaSpesa, lingua);

  if(result === null) {
    return;
  }

  if(result.isOK) {
    alert(lingua === "italiano" ? "L\'inserimento della spesa è andato a buon fine." : "Expense entry was successful.");
  } 
  else {
    if(result.responseStatus === 400) {
      alert(lingua === "italiano" ? "Errore: spesa gia\' presente." : "Error: expense already present.")
    }
    else {
      alert(lingua === "italiano" ? "Errore durante il salvataggio della nuova spesa, riprova più tardi." : "Error while saving new expense, try again later.");
    }
  }
}

export const handleSearch = async (e, actions, datiRicerca, lingua) => {
  e.preventDefault();
  
  const result = await actions.ricercaSpese(datiRicerca)

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca delle spese, riprova più tardi." : "Error while searching expenses, please try again later.");
    return;
  }
}

export const handleEdit = async (e, actions, spese, selectedIdsModifica, setSelectedIdsModifica, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler modificare le spese?" : "Are you sure you want to edit the expenses?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    return;
  }

  const result = await actions.modificaSpese(spese, selectedIdsModifica, setSelectedIdsModifica);

  let esitoModifica = lingua === "italiano" ? "Esito modifica:\n" : "Modification outcome:\n";
  
  for(let i = 0; i < result.esitiModifiche.length; i++) {
    if(result.esitiModifiche[i][0]) {
      esitoModifica += lingua === "italiano" ? "Spesa numero " + (i+1) + ": modifica avvenuta con successo.\n" : "Expense number " + (i+1) + ": successful modification.\n";
    }
    else {
      if(result.esitiModifiche[i][1] == 400) {
        esitoModifica += lingua === "italiano" ? "Spesa numero " + (i+1) + ": errore durante la modifica: spesa gia\' presente.\n" : "Expense number " + (i+1) + ": Error while editing: expense already present.\n";
      }
      else {
        esitoModifica += lingua === "italiano" ? "Spesa numero " + (i+1) + ": errore durante la modifica.\n" : "Expense number " + (i+1) + ": error while editing.\n";
      }
    }
  }
  alert(esitoModifica);
}

export const handleDelete = async (e, actions, selectedIdsEliminazione, setSelectedIdsEliminazione, spese, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare le spese?" : "Are you sure you want to eliminate expenses?")) {
    alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    return;
  }

  const result = await actions.eliminaSpese(selectedIdsEliminazione, setSelectedIdsEliminazione, spese);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'eliminazione delle spese, riprova più tardi." : "Error while deleting expenses, try again later.");
    return;
  }
  alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
}

export const handleSearchRangeFile = async (e, actions, tipoFile, setTipoFile, datiRicerca, spese, setSpese, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler ottenere il file?" : "Are you sure you want to get the file?")) {
    alert(lingua === "italiano" ? "Operazione annullata." : "Operation canceled.");
    return;
  }

  const result = await actions.handleSearchSpeseRangeFile(tipoFile, setTipoFile, datiRicerca, setSpese, lingua);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante il recupero dei dati." : "Error during data recovery.");
    return;
  }
}

export const handleDeleteRangeFile = async (e, actions, datiRicerca, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare le spese?" : "Are you sure you want to eliminate expenses?")) {
    alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    return;
  }

  const result = await actions.handleDeleteSpeseRangeFile(datiRicerca);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'eliminazione delle spese, riprova più tardi." : "Error while deleting expenses, try again later."); 
    return;
  }
  alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
}









