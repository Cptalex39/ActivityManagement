// React e Redux
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// View
import Header from "../components/Header.jsx";
import { OperazioniForms } from "../forms/OperazioniForms";
import { SpesaForms } from "../forms/SpesaForms";
// Actions
import { SpesaActions } from "../../actions/SpesaActions";
// Riutilizzabile
import { PaginaWeb } from '@gianlucascisciolo/riutilizzoreact';
// Utils
import { controlloRicercaSpese } from "../../../utils/Controlli.js";

const Spese = () => {
  const spesaActions = new SpesaActions();
  const spesaForms = new SpesaForms();
  const operazioniForms = new OperazioniForms();
  const spesaState = useSelector((state) => state.spesa.value);
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  
  const [spese, setSpese] = useState(-1);
  const [tipoFile, setTipoFile] = useState("");
  const [selectedTrashCount, setSelectedTrashCount] = useState(0);
  const [selectedPencilCount, setSelectedPencilCount] = useState(0);
  const [selectedIdsEliminazione, setSelectedIdsEliminazione] = useState([]);
  const [selectedIdsModifica, setSelectedIdsModifica] = useState([]);

  const [nuovaSpesa, setNuovaSpesa] = useState({
    tipo_item: "spesa", 
    tipo_selezione: 0,
    nome: "",
    giorno: "",
    descrizione: "",
    totale: "",
    note: "", 
    errore_nome: "",
    errore_giorno: "",
    errore_descrizione: "",
    errore_totale: "",
    errore_note: "",
  });
  
  const [datiRicerca, setDatiRicerca] = useState({
    tipo_item: "spesa", 
    nome: "", 
    descrizione: "", 
    totale_min: "",
    totale_max: "",  
    primo_giorno: "", 
    ultimo_giorno: "", 
    note: ""
  });

  /**
   * Funzione che ci permette di selezionare un'operazione: modifica (pencil) o eliminazione (trash).
   * 
   * @param {string} icon - stringa rappresentante l'operazione selezionata (pencil o trash).
   * @param {Object} item - oggetto in cui selezioniamo l'operazione 
   */
  const selectOperation = (icon, item) => {
    spesaActions.selezioneOperazioneSpesa(
      icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
      setSelectedPencilCount, setSelectedTrashCount
    );
  }

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
    spesaActions.aggiornaSpesa(item.id, name, value);
    if(["giorno_spesa"].includes(e.target.id)) {
      e.target.type = (!e.target.value) ? "text" : "date";
    }
  };

  /**
   * Funzione che calcola il totale delle spese presenti
   * 
   * @returns {string} 
   * - Una stringa rappresentante il totale delle spese, seguito dal simbolo € se è presente almeno una spesa. 
   * - Una stringa vuota ("") nel caso in cui non sono presenti delle spese.
   */
  const getTotaleSpese = () => {
    let totaleSpese = 0;
    if(spesaState.spese && spesaState.spese.length > 0) {
      for(let spesa of spesaState.spese) {
        totaleSpese += parseFloat(spesa.totale);
      }
      return "Totale: " + parseFloat(totaleSpese).toFixed(2) + " €";
    }
    else {
      return "";
    }
  }
  
  const campiNuovaSpesa = spesaForms.getCampiNuovaSpesa(
    nuovaSpesa, 
    (e) => operazioniForms.handleInputChange(e, setNuovaSpesa), 
    (e) => operazioniForms.handleInputClick(e, setNuovaSpesa), 
    (e) => operazioniForms.handleInputBlur(e, setNuovaSpesa) 
  );
  const campiRicercaSpese = spesaForms.getCampiRicercaSpese(
    datiRicerca, 
    (e) => operazioniForms.handleInputChange(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputClick(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputBlur(e, setDatiRicerca)
  );
  const campiFile = spesaForms.getCampiFile(
    datiRicerca, 
    (e) => operazioniForms.handleInputChange(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputClick(e), 
    (e) => operazioniForms.handleInputBlur(e) 
  );

  /**
   * Funzione che esegue l'eliminazione delle spese selezionate.
   * 
   * @param {Event} e - Evento coinvolto.
   * @returns {void}
   */
  const handleDelete = async (e) => {
    e.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare le spese?")) {
      alert("Eliminazione annullata.");
      return;
    }

    const result = await spesaActions.eliminaSpese(selectedIdsEliminazione, setSelectedIdsEliminazione, spesaState.spese);

    if(!result.isOK) {
      alert("Errore durante l\'eliminazione delle spese, riprova più tardi.");
      return;
    }
    alert("Eliminazione completata con successo.");
  }

  /**
   * Funzione che esegue l'eliminazione delle spese presenti nel range di 2 date definite nel form (estreme incluse).
   * 
   * @param {Event} e - Evento coinvolto.
   * @returns {void}
   */
  const handleDeleteRangeFile = async (e) => {
    e.preventDefault();

    if (!confirm("Sei sicuro di voler eliminare le spese?")) {
      alert("Eliminazione annullata.");
      return;
    }

    const risultatoControllo = controlloRicercaSpese(datiRicerca);
    setDatiRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    const result = await spesaActions.handleDeleteSpeseRangeFile(datiRicerca);

    if(!result.isOK) {
      alert("Errore durante l\'eliminazione delle spese, riprova più tardi."); 
      return;
    }
    alert("Eliminazione completata con successo.");
  }

  useEffect(() => {
    spesaActions.azzeraLista();
  }, []);

  return (
    <>
      <Header />

      <div className="main-content" />

      <PaginaWeb 
        componenti={ 
          {
            // Items
            tipoItem: "spesa", 
            items: spesaState.spese,  
            setItems: null, 
            servizi: null, 
            // Handle operations
            handleBlurItem: handleBlurItem, 
            operazioneModifica: operazioneModifica,
            operazioneElimina: operazioneElimina, 
            handleInsert: () => spesaActions.inserimentoSpesa(nuovaSpesa, setNuovaSpesa), 
            handleSearch: () => spesaActions.ricercaSpese(datiRicerca, setDatiRicerca), 
            handleEdit:   () => spesaActions.modificaSpese(spesaState.spese, selectedIdsModifica, setSelectedIdsModifica),  
            handleDelete: handleDelete, 
            handleSearchRangeFilePDF: () => spesaActions.handleSearchSpeseRangeFile("pdf", setTipoFile, datiRicerca, setDatiRicerca, setSpese),
            handleSearchRangeFileExcel: () => spesaActions.handleSearchSpeseRangeFile("excel", setTipoFile, datiRicerca, setDatiRicerca, setSpese),
            handleDeleteRangeFile: handleDeleteRangeFile,
            // Campi
            campiNuovoItem: campiNuovaSpesa, 
            campiRicercaItems: campiRicercaSpese,
            campiItemEsistente: spesaForms.getCampiSpesaEsistente, 
            campiFile: campiFile,
            // Indici
            indiciNuovoItem: [...Array(campiNuovaSpesa.label.length).keys()], 
            indiciRicercaItems: [...Array(campiRicercaSpese.label.length).keys()], 
            indiciFile: [...Array(campiFile.label.length).keys()], 
            // Selects
            selectedIdsModifica: selectedIdsModifica, 
            selectedIdsEliminazione: selectedIdsEliminazione, 
            // Informazioni
            visualizzazioneInformazioni: true,
            totaleItems: getTotaleSpese(),
          }
        }
        elementi={["search", "insert", "file"]}
        vistaItem={stileState.vistaItem} 
        vistaForm={stileState.vistaForm}
      />
    </>
  );
}

export default Spese;









