export const handleInsert = async (e, actions, nuovaSpesa, setNuovaSpesa) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler salvare la spesa?")) {
    alert("Salvataggio annullato.");
    return;
  }

  const result = await actions.inserimentoSpesa(nuovaSpesa, setNuovaSpesa);

  if(result === null) {
    return;
  }

  if(result.isOK) {
    alert("L\'inserimento della spesa è andato a buon fine.");
  } 
  else {
    if(result.responseStatus === 400) {
      alert("Errore: spesa gia\' presente.")
    }
    else {
      alert("Errore durante il salvataggio della nuova spesa, riprova più tardi.");
    }
  }
}

export const handleSearch = async (e, actions, datiRicerca) => {
  e.preventDefault();
  
  const result = await actions.ricercaSpese(datiRicerca)

  if(!result.isOK) {
    alert("Errore durante la ricerca delle spese, riprova più tardi.");
    return;
  }
}

export const handleEdit = async (e, actions, spese, selectedIdsModifica, setSelectedIdsModifica) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler modificare le spese?")) {
    alert("Salvataggio annullato.");
    return;
  }

  const result = await actions.modificaSpese(spese, selectedIdsModifica, setSelectedIdsModifica);

  let esitoModifica = "Esito modifica:\n";
  
  for(let i = 0; i < result.esitiModifiche.length; i++) {
    if(result.esitiModifiche[i][0]) {
      esitoModifica += "Spesa numero " + (i+1) + ": modifica avvenuta con successo.\n";
    }
    else {
      if(result.esitiModifiche[i][1] == 400) {
        esitoModifica += "Spesa numero " + (i+1) + ": errore durante la modifica: spesa gia\' presente.\n";
      }
      else {
        esitoModifica += "Spesa numero " + (i+1) + ": errore durante la modifica.\n";
      }
    }
  }
  alert(esitoModifica);
}



export const handleSearchRangeFile = async (e, actions, tipoFile, setTipoFile, datiRicerca, spese, setSpese) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler ottenere il file?")) {
    alert("Operazione annullata.");
    return;
  }

  const result = await actions.handleSearchSpeseRangeFile(tipoFile, setTipoFile, datiRicerca, setSpese);

  if(!result.isOK) {
    alert("Errore durante il recupero dei dati.");
    return;
  }
}











