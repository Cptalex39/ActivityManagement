import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header.jsx";
import { OperazioniForms } from "../forms/OperazioniForms";
import { ServizioForms } from "../forms/ServizioForms";
import { ServizioActions } from "../../actions/ServizioActions";
import { PaginaWeb } from '@gianlucascisciolo/riutilizzoreact';

const Servizi = () => {
  const servizioActions = new ServizioActions();
  const servizioForms = new ServizioForms();
  const operazioniForms = new OperazioniForms();
  const servizioState = useSelector((state) => state.servizio.value);
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value);

  const [selectedTrashCount, setSelectedTrashCount] = useState(0);
  const [selectedPencilCount, setSelectedPencilCount] = useState(0);
  const [selectedIdsEliminazione, setSelectedIdsEliminazione] = useState([]);
  const [selectedIdsModifica, setSelectedIdsModifica] = useState([]);

  const [nuovoServizio, setNuovoServizio] = useState({
    tipo_item: "servizio", 
    tipo_selezione: 0,
    nome: "",
    tipo: "", 
    prezzo: "", 
    descrizione: "", 
    note: "", 
    errore_nome: "", 
    errore_tipo: "", 
    errore_prezzo: "", 
    errore_descrizione: "",
    errore_note: ""
  });
  
  const [datiRicerca, setDatiRicerca] = useState({
    id_cliente: -1, 
    tipo_item: "servizio", 
    nome: "", 
    tipo: "", 
    prezzo_min: "",
    prezzo_max: "",  
    in_uso: ""
  });

  /**
   * Funzione che ci permette di selezionare un'operazione: modifica (pencil) o eliminazione (trash).
   * 
   * @param {string} icon - stringa rappresentante l'operazione selezionata (pencil o trash).
   * @param {Object} item - oggetto in cui selezioniamo l'operazione 
   */
  const selectOperation = (icon, item) => {
    servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
      setSelectedPencilCount, setSelectedTrashCount
    );
  };

  /**
   * Funzione che ci permette di selezionare la matita (operazione di modifica).
   * 
   * @param {Object} item - oggetto in cui selezioniamo l'operazione di modifica (pencil)
   */
  const operazioneModifica = (item) => {
    selectOperation("pencil", item);
  };

  /**
   * Funzione che ci permette di selezionare il cestino (operazione di eliminazione).
   * 
   * @param {Object} item - oggetto in cui selezioniamo l'operazione di eliminazione (trash) 
   */
  const operazioneElimina = (item) => {
    selectOperation("trash", item);
  };

  /**
   * Funzione che ci permette di eseguire delle operazioni quando un elemento dell'oggetto item perde il focus.
   * 
   * @param {Event} e - Evento con target specifico.
   * @param {Object} item - Oggetto coinvolto.
   */
  const handleBlurItem = (e, item) => {
    const { name, value } = e.target;
    servizioActions.aggiornaServizio(item.id, name, value);
  };

  const campiNuovoServizio = servizioForms.getCampiNuovoServizio(
    nuovoServizio, 
    (e) => operazioniForms.handleInputChange(e, setNuovoServizio), 
    (e) => operazioniForms.handleInputClick(e, setNuovoServizio), 
    (e) => operazioniForms.handleInputBlur(e, setNuovoServizio)
  );
  
  const campiRicercaServizi = servizioForms.getCampiRicercaServizi(
    datiRicerca, 
    (e) => operazioniForms.handleInputChange(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputClick(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputBlur(e, setDatiRicerca)
  );

  /**
   * Funzione che esegue l'eliminazione dei servizi selezionati.
   * 
   * @param {Event} e - Evento coinvolto.
   * @returns {void}
   */
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare i servizi?")) {
      alert("Eliminazione annullata.");
      return;
    }

    const result = await servizioActions.eliminaServizi(selectedIdsEliminazione, setSelectedIdsEliminazione, servizioState.servizi);

    if(!result.isOK) {
      alert("Errore durante l\'eliminazione dei servizi, riprova più tardi.");
      return;
    }

    alert("Eliminazione completata con successo.");
  }

  useEffect(() => {
    servizioActions.azzeraLista();
  }, []);
  
  return (
    <>
      <Header />
      <div className="main-content" />
      <PaginaWeb 
        componenti={{
          tipoItem: "servizio", 
          items: servizioState.servizi, 
          setItems: null, 
          servizi: null, 
          handleBlurItem: handleBlurItem, 
          operazioneModifica: operazioneModifica,
          operazioneElimina: operazioneElimina, 
          handleInsert: () => servizioActions.inserisciServizio(nuovoServizio, setNuovoServizio), 
          handleSearch: () => servizioActions.ricercaServizi(datiRicerca, setDatiRicerca), 
          handleEdit:   () => servizioActions.modificaServizi(servizioState.servizi, selectedIdsModifica, setSelectedIdsModifica), 
          handleDelete: handleDelete, 
          campiNuovoItem: campiNuovoServizio, 
          campiRicercaItems: campiRicercaServizi,
          campiItemEsistente: servizioForms.getCampiServizioEsistente, 
          indiciNuovoItem: [...Array(campiNuovoServizio.label.length).keys()], 
          indiciRicercaItems: [...Array(campiRicercaServizi.label.length).keys()], 
          selectedIdsModifica: selectedIdsModifica, 
          selectedIdsEliminazione: selectedIdsEliminazione, 
        }}
        elementi={["search", "insert"]}
        vistaItem={stileState.vistaItem} 
        vistaForm={stileState.vistaForm}
      />
    </>
  );
}

export default Servizi;