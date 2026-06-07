// React e Redux
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
// Views
import Header from "../components/Header.jsx";
import { OperazioniForms } from '../forms/OperazioniForms';
import { ClienteForms } from '../forms/ClienteForms';
// Actions
import { ClienteActions } from "../../actions/ClienteActions.js";
import { OrdineActions } from '../../actions/OrdineActions.js';
// Riutilizzabile
import { PaginaWeb } from '@gianlucascisciolo/riutilizzoreact';

const Clienti = () => {
  const clienteState = useSelector((state) => state.cliente.value);
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const clienteActions = new ClienteActions();
  const ordineActions = new OrdineActions();
  const clienteForms = new ClienteForms();
  const operazioniForms = new OperazioniForms();

  const [selectedTrashCount, setSelectedTrashCount] = useState(0);
  const [selectedPencilCount, setSelectedPencilCount] = useState(0);
  const [selectedIdsEliminazione, setSelectedIdsEliminazione] = useState([]);
  const [selectedIdsModifica, setSelectedIdsModifica] = useState([]);
  const [clientiDaEliminare, setClientiDaEliminare] = useState([]);

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

  const riattivaCliente = async (username) => {
    if(!confirm(`Sei sicuro di voler riattivare il cliente ${username}?`)) {
      alert("Riattivazione annullata.");
      return;
    }
    
    const response = await clienteActions.riattivaCliente(username)

    if(response.isOK) {
      alert("La riattivazione del cliente è avvenuta con successo.");
      setClientiDaEliminare(prevState => prevState.filter(cliente => cliente.username !== username));
    }
  };

  const eliminaCliente = async (username) => {
    if(!confirm(`Sei sicuro di voler eliminare il cliente ${username}?`)) {
      alert("Eliminazione annullata.");
      return;
    }
    
    const response = await clienteActions.eliminaCliente(username)

    if(response.isOK) {
      alert("L\'eliminazione del cliente è avvenuta con successo.");
      setClientiDaEliminare(prevState => prevState.filter(cliente => cliente.username !== username));
    }
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

  const ottieniNumeroPagamentiNonConfermatiCliente = async (idCliente) => {
    const result = await ordineActions.ottieniNumeroPagamentiNonConfermatiCliente({ id_cliente: idCliente, });
    
    if(result.isOK) {
      alert(`Il cliente ha ${result.numero_pagamenti_non_confermati} pagamento/i da confermare: ${result.numero_pagamenti_non_confermati!==0 ? "non puo\' essere eliminato." : "puo\' essere eliminato."}`);
      if(result.numero_pagamenti_non_confermati === 0) {
        setClientiDaEliminare(prevState => prevState.map(cliente => (cliente.id === idCliente ? { ...cliente, is_eliminabile: 1 } : cliente)));
      }
    }
    else {
      alert("Operazione fallita.");
    }
  };

  const campiRicercaClienti = clienteForms.getCampiRicercaClienti(datiRicerca, (e) => operazioniForms.handleInputChange(e, setDatiRicerca), null, null, attivitaState);

  useEffect(() => {
    clienteActions.azzeraLista();

    const fetchClienti = async () => {
      const result = await clienteActions.ottieniClientiDaEliminare();
      setClientiDaEliminare(result.items);
    };

    fetchClienti();
  }, []);
  
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
              // Handle operations
              handleBlurItem: handleBlurItem,
              operazioneModifica: null,
              operazioneElimina: null, 
              handleInsert: null,
              handleSearch: () => clienteActions.ricercaClienti(datiRicerca, setDatiRicerca),
              handleEdit: null,
              handleDelete: null,
              // Campi
              campiRicercaItems: campiRicercaClienti,
              campiItemEsistente: clienteForms.getCampiClienteEsistente,
              // Indici
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
  
        {clientiDaEliminare && clientiDaEliminare.length > 0 && (
          <div className="contenitore-1" style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "20px", color: "red" }}>Clienti con richiesta eliminazione profilo</h2>
          {clientiDaEliminare.map(cliente => (
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
                  <p>Email: {cliente.email} | Contatto: {cliente.contatto}</p>
                </div>
                
                <button onClick={() => riattivaCliente(cliente.username)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#008000",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Riattiva cliente
                </button>

                {cliente.is_eliminabile ? (
                  <button onClick={() => eliminaCliente(cliente.username)}
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
                    Elimina cliente
                  </button>
                ) : (
                  <button onClick={() => ottieniNumeroPagamentiNonConfermatiCliente(cliente.id)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "orange",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Controllo pagamenti
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Clienti;