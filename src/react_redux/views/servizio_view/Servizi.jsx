// React e Redux
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
// View
import Header from "../components/Header.jsx";
import { OperazioniForms } from "../forms/OperazioniForms";
import { ServizioForms } from "../forms/ServizioForms";
import { handleInsert, handleSearch, handleEdit, handleDelete } from "../operazioni/ServizioOperazioni.js";
// Actions
import { ServizioActions } from "../../actions/ServizioActions";
// Riutilizzabile
import PaginaWeb from "../../../riutilizzabile/pagine_web/PaginaWeb.jsx";

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
    prezzo: "",
    note: "", 
    errore_nome: "", 
    errore_prezzo: "", 
    errore_note: ""
  });
  
  const [datiRicerca, setDatiRicerca] = useState({
    tipo_item: "servizio", 
    nome: "", 
    prezzo_min: "",
    prezzo_max: "",  
    note: "", 
    in_uso: ""
  });

  const selectOperation = (icon, item) => {
    servizioActions.selezioneOperazioneServizio(
      icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
      setSelectedPencilCount, setSelectedTrashCount
    );
  };

  const handleBlurItem = (e, item) => {
    const { name, value } = e.target;
    servizioActions.aggiornaServizio(item.id, name, value);
  };

  useEffect(() => {
    servizioActions.azzeraLista();
  }, []);

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

  return (
    <>
      <Header />

      <div className="main-content" />
      
      <PaginaWeb 
        componenti={ 
          {
            // Items
            tipoItem: "servizio", 
            items: servizioState.servizi, 
            setItems: null, 
            servizi: null, 
            // Stati
            stileState: stileState, 
            // Actions
            lavoroActions: null, 
            // Handle operations
            handleBlurItem: handleBlurItem, 
            handleInsert: (e) => handleInsert(e, servizioActions, nuovoServizio, setNuovoServizio, attivitaState.lingua), 
            handleSearch: (e) => handleSearch(e, servizioActions, datiRicerca, attivitaState.lingua), 
            handleEdit:   (e) => handleEdit(e, servizioActions, servizioState.servizi, selectedIdsModifica, setSelectedIdsModifica, attivitaState.lingua), 
            handleDelete: (e) => handleDelete(e, servizioActions, selectedIdsEliminazione, setSelectedIdsEliminazione, servizioState.servizi, attivitaState.lingua), 
            // Campi
            campiNuovoItem: campiNuovoServizio, 
            campiRicercaItems: campiRicercaServizi,
            campiItemEsistente: servizioForms.getCampiServizioEsistente, 
            // Indici
            indiciNuovoItem: [...Array(campiNuovoServizio.label.length).keys()], 
            indiciRicercaItems: [...Array(campiRicercaServizi.label.length).keys()], 
            // Selects
            selectOperation: selectOperation, 
            selectedIdsModifica: selectedIdsModifica, 
            selectedIdsEliminazione: selectedIdsEliminazione, 
          }
        }
        elementi={["search", "insert"]}
        vistaItem={stileState.vistaItem} 
        vistaForm={stileState.vistaForm}
      />
    </>
  );
}

export default Servizi;