// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { clienteSliceActions } from '../store/reducers/ClienteReducer';
// Utils
import { controlloCliente } from "../../utils/Controlli";

export class ClienteActions {
  dispatch = useDispatch();

  constructor() {
    
  }

  azzeraLista() {
    this.dispatch(clienteSliceActions.aggiornaClienti({
      clienti: [],
    }));
  }

  async getAllClienti(setClienti, lingua) {
    const response = await fetch('/OTTIENI_TUTTI_GLI_ITEMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({tipo_item: "cliente"}),
    });

    if(response.status === 200) {
      const result = await response.json();
      setClienti(result.items);
    }
    else {
      alert(lingua === "italiano" ? "Errore durante l\'ottenimento dei clienti per l\'inserimento di un nuovo lavoro, riprova più tardi." : "Error while obtaining clients for new job entry, try again later.");
    }
  }
  
  async inserimentoCliente(e, nuovoCliente, setNuovoCliente, lingua) {
    e.preventDefault();
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler salvare il cliente?" : "Are you sure you want to save the client?")) {
      if (controlloCliente(nuovoCliente, setNuovoCliente, lingua) > 0) 
        return;

      nuovoCliente["giorno_attuale"] = nuovoCliente["giorno"];
      nuovoCliente["contatto_attuale"] = nuovoCliente["contatto"];
      nuovoCliente["email_attuale"] = nuovoCliente["email"];
      nuovoCliente["note_attuale"] = nuovoCliente["note"];
            
      const response = await fetch('/INSERISCI_ITEM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuovoCliente),
      });

      if(response.status === 200) {
        const result = await response.json();
        nuovoCliente.id = result.id;
        
        this.dispatch(clienteSliceActions.inserimentoCliente({
          nuovoCliente: nuovoCliente
        }))
        
        alert(lingua === "italiano" ? "L\'inserimento del cliente è andato a buon fine." : "Client input was successful.");
      }
      else if(response.status === 400) {
        alert(lingua === "italiano" ? "Errore: cliente gia\' presente." : "Error: client already present.")
      }
      else {
        alert(lingua === "italiano" ? "Errore durante il salvataggio del nuovo cliente, riprova più tardi." : "Error while saving new client, please try again later.");
      }
    }
    else {
      alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    }
  }

  async ricercaClienti(e, datiRicerca, lingua) {
    e.preventDefault();
        
    const response = await fetch('/VISUALIZZA_ITEMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datiRicerca),
    });

    if(response.status === 200) {
      const result = await response.json();
      
      this.dispatch(clienteSliceActions.aggiornaClienti({
        clienti: result.items, 
      }))

    }
    else {
      alert(lingua === "italiano" ? "Errore durante la ricerca dei clienti, riprova più tardi." : "Error while customer search, please try again later.");
    }
  }

  selezioneOperazioneCliente(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, 
    setSelectedIdsEliminazione, setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 0
        }))
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(clienteSliceActions.getClientePrimaDellaModifica({
          id_cliente: item.id,
        }))
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 2
        }))
        setSelectedIdsEliminazione(prevIds => [...prevIds, item.id]);
        setSelectedTrashCount(prevCount => prevCount + 1);
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
    else if(icon === "pencil") {
      if(selectedIdsModifica.includes(item.id)) {
        this.dispatch(clienteSliceActions.getClientePrimaDellaModifica({
          id_cliente: item.id,
        }))
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 0
        }))
        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(clienteSliceActions.aggiornaTipoSelezione({
          id_cliente: item.id, 
          nuova_selezione: 1
        }))
        setSelectedIdsModifica(prevIdsModifica => [...prevIdsModifica, item.id]);
        setSelectedPencilCount(prevCount => prevCount + 1);
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  async modificaClienti(e, selectedIdsModifica, setSelectedIdsModifica, clienti, lingua) {
    e.preventDefault();
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler modificare i clienti?" : "Are you sure you want to edit the clients?")) {
      let clientiDaNonModificare = clienti.filter(cliente => !selectedIdsModifica.includes(cliente.id));
      let clientiDaModificare = clienti.filter(cliente => selectedIdsModifica.includes(cliente.id));
      let idClientiNonModificati = [];
      let idClientiModificati = [];
      let esitoModifica = lingua === "italiano" ? "Esito modifica:\n" : "Modification outcome:\n";
            
      for(let i = 0; i < clientiDaModificare.length; i++) {
        const dati = {
          tipo_item: "cliente", 
          item: clientiDaModificare[i] 
        }
        const response = await fetch('/MODIFICA_ITEM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dati),
        });
        if(response.status === 200) {           
          esitoModifica += lingua === "italiano" ? "Cliente numero " + (i+1) + ": modifica avvenuta con successo.\n" : "Client number " + (i+1) + ": successful modification.\n";
          idClientiModificati.push(clientiDaModificare[i].id);
        }
        else if(response.status === 400) {
          esitoModifica += lingua === "italiano" ? "Cliente numero " + (i+1) + ": errore durante la modifica: cliente gia\' presente.\n" : "Client number " + (i+1) + ": error while editing: client already present.\n";
          idClientiNonModificati.push(clientiDaModificare[i].id);
        }
        else {
          esitoModifica += lingua === "italiano" ? "Cliente numero " + (i+1) + ": errore durante la modifica.\n" : "Client number " + (i+1) + ": error while editing.\n";
          idClientiNonModificati.push(clientiDaModificare[i].id);
        }
      }

      let clientiAggiornati = [];
      for (let i = 0; i < clienti.length; i++) {
        let clienteAggiornato = { ...clienti[i] };
        if(clienteAggiornato.tipo_selezione === 1) {
          clienteAggiornato.tipo_selezione = 0;
        }
        clientiAggiornati.push(clienteAggiornato);
      }
      this.dispatch(clienteSliceActions.aggiornaClienti({
        clienti: clientiAggiornati, 
      }))

      for(let id of idClientiNonModificati) {
        this.dispatch(clienteSliceActions.getClientePrimaDellaModifica({
          id_cliente: id,
        }));
      }

      for(let id of idClientiModificati) {
        this.dispatch(clienteSliceActions.getClienteDopoLaModifica({
          id_cliente: id
        }));
      }

      setSelectedIdsModifica([]);

      alert(esitoModifica);
    }
    else {
      alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving cancelled.");
    }
  }

  aggiornaCliente(id_cliente, nome_attributo, nuovo_valore) {
    this.dispatch(clienteSliceActions.aggiornaCliente({
      id_cliente: id_cliente,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore,
    }))
  }

  async eliminaClienti(e, selectedIdsEliminazione, setSelectedIdsEliminazione, clienti, lingua) {
    e.preventDefault();
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare i clienti?" : "Are you sure you want to eliminate clients?")) {
      const dati = {
        tipo_item: "cliente", 
        ids: selectedIdsEliminazione
      }

      const itemsRestanti = (clienti && clienti !== -1) ? clienti.filter(cliente => !dati.ids.includes(cliente.id)) : -1;
      
      const response = await fetch('/ELIMINA_ITEMS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dati),
      });
      if(response.status === 200) {
        this.dispatch(clienteSliceActions.aggiornaClienti({
          clienti: itemsRestanti, 
        }))
        setSelectedIdsEliminazione([]);
        alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
      }
      else {
        alert(lingua === "italiano" ? "Errore durante l\'eliminazione dei clienti, riprova più tardi." : "Error while deleting clients, try again later.");
      }
    }
    else {
      alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    }
  }
}









