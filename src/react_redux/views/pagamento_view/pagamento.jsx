// React e Redux
import { useState } from "react";
import Header from "../components/Header.jsx";
import { PagamentoActions } from "../../actions/PagamentoActions";

const Pagamenti = () => {
  const pagamentoActions = new PagamentoActions();

  const [pagamenti, setPagamenti] = useState([
    {
      id: 1,
      cliente: "Mario Rossi",
      data: "2026-03-15",
      totale: 25.50,
      metodo: "Struttura",
      stato: "completato",
      dettagli: { prenotazione: { data: "2026-03-20", ora: "10:00" } }
    },
    {
      id: 2,
      cliente: "Luigi Bianchi",
      data: "2026-03-16",
      totale: 45.00,
      metodo: "Spedizione",
      stato: "completato",
      dettagli: { spedizione: { indirizzo: "Via Roma 123, Milano", carta: "**** **** **** 1234" } }
    },
    {
      id: 3,
      cliente: "Giulia Verdi",
      data: "2026-03-17",
      totale: 15.75,
      metodo: "Struttura",
      stato: "in_sospeso",
      dettagli: { prenotazione: { data: "2026-03-25", ora: "15:30" } }
    },
    {
      id: 4,
      cliente: "Paolo Neri",
      data: "2026-03-18",
      totale: 32.00,
      metodo: "Corriere",
      stato: "in_sospeso",
      dettagli: { corriere: { indirizzo: "Piazza Duomo 45, Torino" } }
    }
  ]);

  const [tabAttiva, setTabAttiva] = useState("tutti"); // "tutti", "completati", "sospesi"

  const segnaComeCompletato = (id) => {
    pagamentoActions.confermaPagamentoInSospeso(id);

    setPagamenti(prev =>
      prev.map(p => (p.id === id ? { ...p, stato: "COMPLETATO" } : p))
    );
  };

  const annullaPagamento = (id) => {
    if (window.confirm("Sei sicuro di voler annullare questo pagamento?")) {
      pagamentoActions.annullaPagamentoInSospeso(id);
      setPagamenti(prev => prev.filter(p => p.id !== id));
    }
  };

  const pagamentiCompletati = pagamenti.filter(p => p.stato === "completato");
  const pagamentiInSospeso = pagamenti.filter(p => p.stato === "in_sospeso");

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="contenitore-1">
          <h2>Pagamenti</h2>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className="tab-link"
              onClick={() => setTabAttiva("tutti")}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                backgroundColor: tabAttiva === "tutti" ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Tutti i Pagamenti
            </button>
            <button 
              className="tab-link"
              onClick={() => setTabAttiva("completati")}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                backgroundColor: tabAttiva === "completati" ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Completati
            </button>
            <button 
              className="tab-link"
              onClick={() => setTabAttiva("sospesi")}
              style={{
                padding: "10px 20px",
                margin: "0 5px",
                backgroundColor: tabAttiva === "sospesi" ? "#007bff" : "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              In Sospeso
            </button>
          </div>

          {/* Completati */}
          {(tabAttiva === "tutti" || tabAttiva === "completati") && (
            <div className="sezione-pagamenti">
              <h3 style={{ color: "blue" }}>Pagamenti Completati</h3>
              {pagamentiCompletati.length === 0 ? (
                <p>Nessun pagamento completato.</p>
              ) : (
                <div className="lista-pagamenti">
                  {pagamentiCompletati.map(p => (
                    <div 
                      key={p.id} 
                      className="card-pagamento"
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        padding: "15px",
                        marginBottom: "15px",
                        backgroundColor: "#2469ae",
                        color: "white"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <h4>{p.cliente}</h4>
                          <p>Data ordine: {p.data}</p>
                          <p>Totale: €{p.totale.toFixed(2)}</p>
                          <p>Metodo: {p.metodo}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span 
                            style={{
                              padding: "5px 10px",
                              borderRadius: "15px",
                              backgroundColor: "green",
                              color: "white"
                            }}
                          >
                            Completato
                          </span>
                        </div>
                      </div>

                      {p.metodo === "Struttura" && p.dettagli.prenotazione && (
                        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#1b5289", borderRadius: "5px" }}>
                          <strong>Dettagli Prenotazione:</strong>
                          <p>Data: {p.dettagli.prenotazione.data}</p>
                          <p>Ora: {p.dettagli.prenotazione.ora}</p>
                        </div>
                      )}
                      {p.metodo === "Spedizione" && p.dettagli.spedizione && (
                        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#1b5289", borderRadius: "5px" }}>
                          <strong>Dettagli Spedizione:</strong>
                          <p>Indirizzo: {p.dettagli.spedizione.indirizzo}</p>
                          <p>Carta: {p.dettagli.spedizione.carta}</p>
                        </div>
                      )}
                      {p.metodo === "Corriere" && p.dettagli.corriere && (
                        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#1b5289", borderRadius: "5px" }}>
                          <strong>Dettagli Corriere:</strong>
                          <p>Indirizzo: {p.dettagli.corriere.indirizzo}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* In sospeso */}
          {(tabAttiva === "tutti" || tabAttiva === "sospesi") && (
            <div className="sezione-pagamenti">
              <h3 style={{ color: "orange" }}>Pagamenti In Sospeso</h3>
              {pagamentiInSospeso.length === 0 ? (
                <p>Nessun pagamento in sospeso.</p>
              ) : (
                <div className="lista-pagamenti">
                  {pagamentiInSospeso.map(p => (
                    <div 
                      key={p.id} 
                      className="card-pagamento"
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "8px",
                        color:"black",
                        padding: "15px",
                        marginBottom: "15px",
                        backgroundColor: "#fff3cd"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div>
                          <h4>{p.cliente}</h4>
                          <p>Data ordine: {p.data}</p>
                          <p>Totale: €{p.totale.toFixed(2)}</p>
                          <p>Metodo: {p.metodo}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span 
                            style={{
                              padding: "5px 10px",
                              borderRadius: "15px",
                              backgroundColor: "orange",
                              color: "white"
                            }}
                          >
                            In Sospeso
                          </span>
                        </div>
                      </div>

                      {p.metodo === "Struttura" && p.dettagli.prenotazione && (
                        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
                          <strong>Dettagli Prenotazione:</strong>
                          <p>Data: {p.dettagli.prenotazione.data}</p>
                          <p>Ora: {p.dettagli.prenotazione.ora}</p>
                        </div>
                      )}
                      {p.metodo === "Spedizione" && p.dettagli.spedizione && (
                        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
                          <strong>Dettagli Spedizione:</strong>
                          <p>Indirizzo: {p.dettagli.spedizione.indirizzo}</p>
                          <p>Carta: {p.dettagli.spedizione.carta}</p>
                        </div>
                      )}
                      {p.metodo === "Corriere" && p.dettagli.corriere && (
                        <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
                          <strong>Dettagli Corriere:</strong>
                          <p>Indirizzo: {p.dettagli.corriere.indirizzo}</p>
                        </div>
                      )}

                      {/* Bottoni solo per in sospeso */}
                      <div style={{ marginTop: "10px", textAlign: "right" }}>
                        <button 
                          onClick={() => segnaComeCompletato(p.id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "green",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer",
                            marginRight: "10px"
                          }}
                        >
                          Segna come Completato
                        </button>
                        <button 
                          onClick={() => annullaPagamento(p.id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "3px",
                            cursor: "pointer"
                          }}
                        >
                          Annulla Pagamento
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Pagamenti;