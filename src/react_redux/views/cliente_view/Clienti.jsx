// React e Redux
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// Views
import Header from "../components/Header.jsx";
import { OperazioniForms } from '../forms/OperazioniForms';
import { ClienteForms } from '../forms/ClienteForms';
// Actions
import { ClienteActions } from "../../actions/ClienteActions.js";
// Riutilizzabile
import { PaginaWeb } from '@gianlucascisciolo/riutilizzoreact';

const Clienti = () => {
  const clienteState = useSelector((state) => state.cliente.value);
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const clienteActions = new ClienteActions();
  const clienteForms = new ClienteForms();
  const operazioniForms = new OperazioniForms();

  const [selectedTrashCount, setSelectedTrashCount] = useState(0);
  const [selectedPencilCount, setSelectedPencilCount] = useState(0);
  const [selectedIdsEliminazione, setSelectedIdsEliminazione] = useState([]);
  const [selectedIdsModifica, setSelectedIdsModifica] = useState([]);

  //const clientiEliminazione = clienteState.clienti?.filter(c => c.profilo_eliminato === true) || [];
  // Possibili clienti da eliminare
  const clientiEliminazione = [
    {
      nome: "Mario", 
      cognome: "Rossi",
    },
    {
      nome: "Laura",
      cognome: "Bianchi",
    }
  ];


  const handleDownloadOrdini = (cliente) => {
    const contenuto = `Ordini di ${cliente.nome} ${cliente.cognome}\nEmail: ${cliente.email}\n\nLista ordini in sospeso e completati...`;
    const blob = new Blob([contenuto], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ordini_${cliente.nome}_${cliente.cognome}.txt`;
    link.click();
  };
  
  const [nuovoCliente, setNuovoCliente] = useState({
    tipo_item: "cliente", 
    tipo_selezione: 0,
    nome: "",
    cognome: "",
    contatto: "", 
    email: "", 
    note: "", 
    errore_nome: "", 
    errore_cognome: "", 
    errore_contatto: "",
    errore_email: "", 
    errore_note: ""
  });

  const [datiRicerca, setDatiRicerca] = useState({
    tipo_item: "cliente", 
    nome: "", 
    cognome: "", 
    contatto: "", 
    email: "", 
    note: ""
  });

  const selectOperation = (icon, item) => {
    clienteActions.selezioneOperazioneCliente(
      icon, item, selectedIdsModifica, setSelectedIdsModifica, selectedIdsEliminazione, setSelectedIdsEliminazione, 
      setSelectedPencilCount, setSelectedTrashCount
    );
  };

  const handleBlurItem = (e, item) => {
    const { name, value } = e.target;
    clienteActions.aggiornaCliente(item.id, name, value);
  };

  useEffect(() => {
    clienteActions.azzeraLista();
  }, []);
  const campiNuovoCliente = clienteForms.getCampiNuovoCliente(nuovoCliente, (e) => operazioniForms.handleInputChange(e, setNuovoCliente), null, null)
  const campiRicercaClienti = clienteForms.getCampiRicercaClienti(datiRicerca, (e) => operazioniForms.handleInputChange(e, setDatiRicerca), null, null, attivitaState)
  
  return (
    <>
      <Header />
      
      <div className="main-content">
        <PaginaWeb
          componenti={
            {
              // Items
              tipoItem: "cliente",
              items: clienteState.clienti,
              setItems: null,
              servizi: null,
              // Stati
              stileState: stileState,
              // Actions
              lavoroActions: null,
              // Handle operations
              handleBlurItem: handleBlurItem,
              handleInsert: (e) => clienteActions.inserimentoCliente(e, nuovoCliente, setNuovoCliente, attivitaState.lingua),
              handleSearch: (e) => clienteActions.ricercaClienti(e, datiRicerca, attivitaState.lingua),
              handleEdit: (e) => clienteActions.modificaClienti(e, selectedIdsModifica, setSelectedIdsModifica, clienteState.clienti, attivitaState.lingua),
              handleDelete: (e) => clienteActions.eliminaClienti(e, selectedIdsEliminazione, setSelectedIdsEliminazione, clienteState.clienti, attivitaState.lingua),
              // Campi
              campiNuovoItem: campiNuovoCliente,
              campiRicercaItems: campiRicercaClienti,
              campiItemEsistente: clienteForms.getCampiClienteEsistente,
              // Indici
              indiciNuovoItem: [...Array(campiNuovoCliente.label.length).keys()],
              indiciRicercaItems: [...Array(campiRicercaClienti.label.length).keys()],
              // Selects
              selectOperation: selectOperation,
              selectedIdsModifica: selectedIdsModifica,
              selectedIdsEliminazione: selectedIdsEliminazione,
            }
          }
          elementi={["search"]}
          vistaItem={stileState.vistaItem}
          vistaForm={stileState.vistaForm}
        />
      </div>
  
        {clientiEliminazione.length > 0 && (
          <div className="contenitore-1" style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "20px", color: "red" }}>
            {attivitaState.lingua === "italiano"
              ? "Clienti con richiesta eliminazione profilo"
              : "Customers with profile deletion request"}
          </h2>
          {clientiEliminazione.map(cliente => (
            <div key={cliente.id} style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              backgroundColor: "#fff3cd",
              color: "black"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h4>{cliente.nome} {cliente.cognome}</h4>
                  <p>Email: {cliente.email} | Telefono: {cliente.contatto}</p>
                </div>
                <button
                  onClick={() => handleDownloadOrdini(cliente)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {attivitaState.lingua === "italiano" ? "Ottieni file ordini" : "Get orders file"}
                </button>

                <button
                  onClick={() => deleteClient(cliente)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#800000",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  {attivitaState.lingua === "italiano" ? "Elimina cliente" : "Delete client"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Clienti;