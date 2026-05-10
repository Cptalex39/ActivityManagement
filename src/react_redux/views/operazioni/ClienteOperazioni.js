export const handleInsert = async (e, actions, nuovoCliente, setNuovoCliente) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler salvare il cliente?")) {
    alert("Salvataggio annullato.");
  }

  setNuovoCliente(prevState => ({
    ...prevState, 
    giorno_attuale: nuovoCliente.giorno,
    contatto_attuale: nuovoCliente.contatto,
    email_attuale: nuovoCliente.email,
    note_attuale: nuovoCliente.note,
  }));

  const result = await actions.inserimentoCliente(nuovoCliente, setNuovoCliente);

  if(result === null) {
    return;
  }

  if(result.isOK) {
    alert("L\'inserimento del cliente è andato a buon fine.");
  } 
  else {
    if(response.status === 400) {
      alert("Errore: cliente gia\' presente.")
    }
    else {
      alert("Errore durante il salvataggio del nuovo cliente, riprova più tardi.");
    }
  }
}

export const handleDelete = async (e, actions, selectedIdsEliminazione, setSelectedIdsEliminazione, clienti) => {
  e.preventDefault();

  if (!confirm("Sei sicuro di voler eliminare i clienti?")) {
    alert("Eliminazione annullata.");
    return;
  }

  const result = await actions.eliminaClienti(selectedIdsEliminazione, setSelectedIdsEliminazione, clienti);

  if(!result.isOK) {
    alert("Errore durante l\'eliminazione dei clienti, riprova più tardi.");
    return;
  }

  alert("Eliminazione completata con successo.");
}

export const handleSearch = async (e, actions, datiRicerca) => {
  e.preventDefault();

  const result = await actions.ricercaClienti(datiRicerca);

  if(!result.isOK) {
    alert("Errore durante la ricerca dei clienti, riprova più tardi.");;
    return;
  }
}









