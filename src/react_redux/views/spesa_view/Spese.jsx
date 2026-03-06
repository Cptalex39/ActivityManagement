// React e Redux
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// View
import Header from "../components/Header.jsx";
import { OperazioniForms } from "../forms/OperazioniForms";
import { SpesaForms } from "../forms/SpesaForms";
import { handleInsert, handleSearch, handleEdit, handleDelete, handleSearchRangeFile, handleDeleteRangeFile } from "../operazioni/SpesaOperazioni.js";
// Actions
import { SpesaActions } from "../../actions/SpesaActions";
// Riutilizzabile
import PaginaWeb from "../../../riutilizzabile/pagine_web/PaginaWeb.jsx";

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

  const selectOperation = (icon, item) => {
    spesaActions.selezioneOperazioneSpesa(
      icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
      setSelectedPencilCount, setSelectedTrashCount
    );
  }

  const handleBlurItem = (e, item) => {
    const { name, value } = e.target;
    spesaActions.aggiornaSpesa(item.id, name, value);
    if(["giorno_spesa"].includes(e.target.id)) {
      e.target.type = (!e.target.value) ? "text" : "date";
    }
  };

  const getTotaleSpese = () => {
    let totaleSpese = 0;
    if(spesaState.spese && spesaState.spese.length > 0) {
      for(let spesa of spesaState.spese) {
        totaleSpese += parseFloat(spesa.totale);
      }
      return "Total: " + parseFloat(totaleSpese).toFixed(2) + " €";
    }
    else {
      return "";
    }
  }

  useEffect(() => {
    spesaActions.azzeraLista();
  }, []);

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
            // Stati
            stileState: stileState, 
            // Actions
            lavoroActions: null, 
            // Handle operations
            handleBlurItem: handleBlurItem, 
            handleInsert: (e) => handleInsert(e, spesaActions, nuovaSpesa, setNuovaSpesa, attivitaState.lingua), 
            handleSearch: (e) => handleSearch(e, spesaActions, datiRicerca, attivitaState.lingua), 
            handleEdit:   (e) => handleEdit(e, spesaActions, spesaState.spese, selectedIdsModifica, setSelectedIdsModifica, attivitaState.lingua),  
            handleDelete: (e) => handleDelete(e, spesaActions, selectedIdsEliminazione, setSelectedIdsEliminazione, spesaState.spese, attivitaState.lingua), 
            handleSearchRangeFilePDF: (e) => handleSearchRangeFile(e, spesaActions, "pdf", setTipoFile, datiRicerca, spese, setSpese, attivitaState.lingua),
            handleSearchRangeFileExcel: (e) => handleSearchRangeFile(e, spesaActions, "excel", setTipoFile, datiRicerca, spese, setSpese, attivitaState.lingua),
            handleDeleteRangeFile: (e) => handleDeleteRangeFile(e, spesaActions, datiRicerca, attivitaState.lingua),
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
            selectOperation: selectOperation, 
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









