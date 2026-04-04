export const handleInsert = async (e, actions, servizi, clienti, nuovoLavoro, setNuovoLavoro, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler salvare il lavoro?" : "Are you sure you want to save the job?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    return;
  }

  const result = await actions.inserimentoLavoro(nuovoLavoro, servizi)

  if(!result.isOK) {
    if(result.responseStatus === 400) {
      alert(lingua === "italiano" ? "Errore: lavoro gia\' presente." : "Error: job already present.")
    }
    else {
      alert(lingua === "italiano" ? "Errore durante il salvataggio del nuovo lavoro, riprova più tardi." : "Error while saving new job, try again later.");
    }
  }
  else {
    alert(lingua === "italiano" ? "L\'inserimento del lavoro è andato a buon fine." : "Job entry was successful.");
  }
}

export const handleSearch = async (e, actions, datiRicerca, lingua) => {
  e.preventDefault();

  const result = await actions.ricercaLavori(datiRicerca, lingua);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante la ricerca dei lavori, riprova più tardi." : "Error during job research, please try again later.");
    return;
  }
}

export const handleEdit = async (e, actions, servizi, lavori, selectedIdsModifica, setSelectedIdsModifica, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler modificare i lavori?" : "Are you sure you want to edit the jobs?")) {
    alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    return;
  }

  const result = await actions.modificaLavori(lavori, selectedIdsModifica, setSelectedIdsModifica)

  let esitoModifica = lingua === "italiano" ? "Esito modifica:\n" : "Modification outcome:\n";

  for(let i = 0; i < result.esitiModifiche.length; i++) {
    if(result.esitiModifiche[i][0]) {
      esitoModifica += lingua === "italiano" ? "Lavoro numero " + (i+1) + ": modifica avvenuta con successo.\n" : "Job number " + (i+1) + ": successful modification.\n";
    }
    else {
      if(result.esitiModifiche[i][1] == 400) {
        esitoModifica += lingua === "italiano" ? "Lavoro numero " + (i+1) + ": errore durante la modifica: spesa gia\' presente.\n" : "Job number " + (i+1) + ": Error while editing: expense already present.\n";
      }
      else {
        esitoModifica += lingua === "italiano" ? "Lavoro numero " + (i+1) + ": errore durante la modifica.\n" : "Job number " + (i+1) + ": error while editing.\n";
      }
    }
  }
  alert(esitoModifica);
}

export const handleDelete = async (e, actions, selectedIdsEliminazione, setSelectedIdsEliminazione, lavori, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare i lavori?" : "Are you sure you want to eliminate jobs?")) {
    alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    return;
  }

  const result = await actions.eliminaLavori(selectedIdsEliminazione, setSelectedIdsEliminazione, lavori);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'eliminazione dei lavori, riprova più tardi." : "Error while deleting jobs, try again later.");
    return;
  }

  alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
}

export const handleSearchRangeFile = async (e, actions, tipoFile, setTipoFile, datiRicerca, setLavori, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler ottenere il file?" : "Are you sure you want to get the file?")) {
    alert(lingua === "italiano" ? "Operazione annullata." : "Operation canceled.");
    return;
  }

  const result = await actions.handleSearchLavoriRangeFile(tipoFile, setTipoFile, datiRicerca, setLavori, lingua);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante il recupero dei dati." : "Error during data recovery.");
    return;
  }
}

export const handleDeleteRangeFile = async (e, actions, datiRicerca, lingua) => {
  e.preventDefault();

  if (!confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare i lavori?" : "Are you sure you want to eliminate jobs?")) {
    alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    return;
  }

  const result = await actions.handleDeleteLavoriRangeFile(datiRicerca);

  if(!result.isOK) {
    alert(lingua === "italiano" ? "Errore durante l\'eliminazione dei lavori, riprova più tardi." : "Error while deleting jobs, try again later.");
    return;
  }

  alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
}









