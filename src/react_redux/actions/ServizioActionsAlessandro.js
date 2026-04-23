// React e Redux
import { useDispatch } from 'react-redux';
// Reducers
import { servizioSliceActions } from '../store/reducers/ServizioReducer';
// Utils
import { controlloServizio } from "../../utils/Controlli";

export class ServizioActions {
  dispatch = useDispatch();

  constructor() {
    
  }

  azzeraLista() {
    this.dispatch(servizioSliceActions.aggiornaServizi({
      servizi: -1, 
    }));
  }

  async getAllServizi(setServizi, lingua) {
    const response = await fetch('/OTTIENI_TUTTI_GLI_ITEMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({tipo_item: "servizio"}),
    });

    if(response.status === 200) {
      const result = await response.json();
      setServizi(result.items);
    }
    else {
      alert(lingua === "italiano" ? "Errore durante l\'ottenimento dei clienti per l\'inserimento di un nuovo lavoro, riprova più tardi." : "Error while obtaining clients for new job entry, try again later.");
    }
  };

  // CR: Ottenere il catalogo (servizi e prodotti in uso) per la vista cliente
  async getCatalogo(filtroTipo, lingua) {
    const response = await fetch('/VISUALIZZA_CATALOGO', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filtro_tipo: filtroTipo }),
    });

    if(response.status === 200) {
      const result = await response.json();
      this.dispatch(servizioSliceActions.aggiornaCatalogo({
        catalogo: result.items, 
      }));
    }
    else {
      alert(lingua === "italiano" ? "Errore durante il caricamento del catalogo, riprova più tardi." : "Error while loading the catalog, please try again later.");
    }
  };

  async inserisciServizio(e, nuovoServizio, setNuovoServizio, lingua) {
    e.preventDefault();
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler salvare il servizio/prodotto?" : "Are you sure you want to save the service/product?")) {
      if (controlloServizio(nuovoServizio, setNuovoServizio, lingua) > 0) 
        return;

      nuovoServizio["nome_attuale"] = nuovoServizio["nome"];
      nuovoServizio["prezzo_attuale"] = nuovoServizio["prezzo"];
      nuovoServizio["tipo_attuale"] = nuovoServizio["tipo"];  // CR
      nuovoServizio["note_attuale"] = nuovoServizio["note"];
      nuovoServizio["in_uso"] = true;
      nuovoServizio["in_uso_attuale"] = nuovoServizio["in_uso"];
      
      const response = await fetch('/INSERISCI_ITEM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuovoServizio),
      });
      if(response.status === 200) {
        const result = await response.json();
        nuovoServizio.id = result.id;
        nuovoServizio["in_uso"] = "Si";
        nuovoServizio["in_uso_attuale"] = "Si";

        this.dispatch(servizioSliceActions.inserimentoServizio({
          nuovoServizio: nuovoServizio
        }));

        alert(lingua === "italiano" ? "L\'inserimento del servizio/prodotto è andato a buon fine." : "Service/product entry was successful.");
      }
      else if(response.status === 400) {
        alert(lingua === "italiano" ? "Errore: servizio/prodotto gia\' presente." : "Error: service/product already present.")
      }
      else {
        alert(lingua === "italiano" ? "Errore durante il salvataggio del nuovo servizio/prodotto, riprova più tardi." : "Error while saving the new service/product, please try again later.");
      }
    }
    else {
      alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    }
  };

  async ricercaServizi(e, datiRicerca, lingua) {
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
      
      this.dispatch(servizioSliceActions.aggiornaServizi({
        servizi: result.items, 
      }));

    }
    else {
      alert(lingua === "italiano" ? "Errore durante la ricerca dei servizi, riprova più tardi." : "Error while searching for services, please try again later.");
    }
  }

  selezioneOperazioneServizio(
    icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
    setSelectedPencilCount, setSelectedTrashCount
  ) {
    if(icon === "trash") {
      if(selectedIdsEliminazione.includes(item.id)) {
        
        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
          nuova_selezione: 0
        }));
        
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        
        this.dispatch(servizioSliceActions.getServizioPrimaDellaModifica({
          id_servizio: item.id
        }));

        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
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
                
        this.dispatch(servizioSliceActions.getServizioPrimaDellaModifica({
          id_servizio: item.id
        }));

        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
          nuova_selezione: 0
        }))

        setSelectedIdsModifica(prevIdsModifica => prevIdsModifica.filter(itemId => itemId !== item.id));
        setSelectedPencilCount(prevCount => Math.max(prevCount - 1, 0));
      }
      else {
        this.dispatch(servizioSliceActions.aggiornaTipoSelezione({
          id_servizio: item.id, 
          nuova_selezione: 1
        }));

        setSelectedIdsModifica(prevIdsModifica => [...prevIdsModifica, item.id]);
        setSelectedPencilCount(prevCount => prevCount + 1);
        setSelectedIdsEliminazione(prevIds => prevIds.filter(itemId => itemId !== item.id));
        setSelectedTrashCount(prevCount => Math.max(prevCount - 1, 0));
      }
    }
  }

  async modificaServizi(e, servizi, selectedIdsModifica, setSelectedIdsModifica, lingua) {
    e.preventDefault();
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler modificare i servizi/prodotti?" : "Are you sure you want to modify the services/products?")) {
      let serviziDaModificare = servizi.filter(servizio => selectedIdsModifica.includes(servizio.id)); 
      
      let idServiziNonModificati = [];
      let idServiziModificati = [];
      let esitoModifica = lingua === "italiano" ? "Esito modifica:\n" : "Modification outcome:\n";
      for(let i = 0; i < serviziDaModificare.length; i++) {
        const dati = {
          tipo_item: "servizio", 
          item: serviziDaModificare[i] 
        }
        const response = await fetch('/MODIFICA_ITEM', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dati),
        });
        if(response.status === 200) {           
          esitoModifica += lingua === "italiano" ? "Servizio/Prodotto numero " + (i+1) + ": modifica avvenuta con successo.\n" : "Service/Product number " + (i+1) + ": successful modification.\n";
          if(serviziDaModificare[i].prezzo !== serviziDaModificare[i].prezzo_attuale) {
            const result = await response.json();
            let nuovoServizio = { ...serviziDaModificare[i] };
            nuovoServizio["id"] = result.id;
            
            this.dispatch(servizioSliceActions.inserimentoServizio({
              nuovoServizio: nuovoServizio
            }))

          }
          idServiziModificati.push(serviziDaModificare[i].id);
        }
        else if(response.status === 400) {
          esitoModifica += lingua === "italiano" ? "Servizio/Prodotto numero " + (i+1) + ": errore durante la modifica: servizio/prodotto gia\' presente.\n" : "Service/Product number " + (i+1) + ": Error while editing: service/product already present.\n";
          idServiziNonModificati.push(serviziDaModificare[i].id);
        }
        else {
          esitoModifica += lingua === "italiano" ? "Servizio/Prodotto numero " + (i+1) + ": errore durante la modifica.\n" : "Service/Product number " + (i+1) + ": error while editing.\n";
          idServiziNonModificati.push(serviziDaModificare[i].id);
        }
      }

      let serviziAggiornati = [];
      for (let i = 0; i < servizi.length; i++) {
        let servizioAggiornato = { ...servizi[i] };
        if(servizioAggiornato.tipo_selezione === 1) {
          servizioAggiornato.tipo_selezione = 0;
        }
        serviziAggiornati.push(servizioAggiornato);
      }
      
      this.dispatch(servizioSliceActions.aggiornaServizi({
        servizi: serviziAggiornati, 
      }))

      for(let id of idServiziNonModificati) {
        this.dispatch(servizioSliceActions.getServizioPrimaDellaModifica({
          id_servizio: id
        }))
      }

      for(let id of idServiziModificati) {
        this.dispatch(servizioSliceActions.getServizioDopoLaModifica({
          id_servizio: id
        }))
      }
      
      setSelectedIdsModifica([]);

      alert(esitoModifica);
    }
    else {
      alert(lingua === "italiano" ? "Salvataggio annullato." : "Saving Cancelled.");
    }
  }

  aggiornaServizio(id_servizio, nome_attributo, nuovo_valore) {
    this.dispatch(servizioSliceActions.aggiornaServizio({
      id_servizio: id_servizio,
      nome_attributo: nome_attributo,
      nuovo_valore: nuovo_valore
    }));
  }

  async eliminaServizi(e, selectedIdsEliminazione, setSelectedIdsEliminazione, servizi, lingua) {
    e.preventDefault();
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler eliminare i servizi/prodotti? Tutti i lavori presenti attualmente nel database verranno modificati eliminando i servizi/prodotti selezionati." : "Are you sure you want to delete the services/products? All jobs currently in the database will be modified by deleting the selected services/products.")) {
      const dati = {
        tipo_item: "servizio", 
        ids: selectedIdsEliminazione
      }
      
      const itemsRestanti = (servizi && servizi !== -1) ? servizi.filter(servizio => !dati.ids.includes(servizio.id)) : -1;
      
      const response = await fetch('/ELIMINA_ITEMS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dati),
      });
      if(response.status === 200) {          
        this.dispatch(servizioSliceActions.aggiornaServizi({
          servizi: itemsRestanti, 
        }));
        setSelectedIdsEliminazione([]);
        alert(lingua === "italiano" ? "Eliminazione completata con successo." : "Elimination completed successfully.");
      }
      else {
        alert(lingua === "italiano" ? "Errore durante l\'eliminazione dei servizi/prodotti, riprova più tardi." : "Error while deleting services/products, try again later.");
      }
    }
    else {
      alert(lingua === "italiano" ? "Eliminazione annullata." : "Elimination cancelled.");
    }
  }

  async handleSearchEntrateServizi(setEntrateServizi, datiRicerca, lingua) {
    const dati = {
      tipo_item: "servizio", 
      primo_anno: datiRicerca.primo_anno, 
      ultimo_anno: datiRicerca.ultimo_anno
    };
    
    const response = await fetch('/VISUALIZZA_ENTRATE_ITEMS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dati), 
    });
    
    if(response.status === 200) {
      const result = await response.json();
      setEntrateServizi(result.items);
    }
    else {
      alert(lingua === "italiano" ? "Errore durante la ricerca delle entrate dei servizi, riprova più tardi." : "Error while searching for service entries, please try again later.");
    }
  };
}