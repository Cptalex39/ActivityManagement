import { useState } from "react";
import Header from "../components/Header.jsx";
import { PagamentoActions } from "../../actions/PagamentoActions"

//prova
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
      dettagli: { 
        prenotazione: { 
          data: "2026-03-20", 
          ora: "10:00"
        } 
      }
    },
    {
      id: 2,
      cliente: "Luigi Bianchi",
      data: "2026-03-16",
      totale: 45.00,
      metodo: "Spedizione",
      stato: "completato",
      dettagli: { 
        spedizione: { 
          indirizzo: "Via Roma 123, Milano", 
          carta: "4433221100998877",
          scadenza: "05/27"
        } 
      }
    },
    {
      id: 3,
      cliente: "Giulia Verdi",
      data: "2026-03-17",
      totale: 15.75,
      metodo: "Struttura",
      stato: "in_sospeso",
      dettagli: { 
        prenotazione: { 
          data: "2026-03-25", 
          ora: "15:30"
        } 
      }
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

  // Funzione per offuscare i primi 12 numeri
  const maskCarta = (numero) => {
    if (!numero) return "";
    const pulito = numero.replace(/\s/g, "");
    return "**** **** **** " + pulito.slice(-4);
  };

  const [tabAttiva, setTabAttiva] = useState("tutti");

  const [filtriRicerca, setFiltriRicerca] = useState({
    termine: "",
    metodo: "",
    dataMin: "",
    dataMax: ""
  });

  const [filtriFile, setFiltriFile] = useState({
    dataInizio: "",
    dataFine: "",
    email: "",
    username: "",
    formato: "pdf"
  });

  const segnaComeCompletato = (id) => {
    setPagamenti(prev => prev.map(p => (p.id === id ? { ...p, stato: "completato" } : p)));

    pagamentoActions.confermaPagamentoInSospeso(id);
  };

  const annullaPagamento = (id) => {
    if (window.confirm("Sei sicuro di voler annullare questo pagamento?")) {
      setPagamenti(prev => prev.filter(p => p.id !== id));

      pagamentoActions.annullaPagamentoInSospeso(id);
    }
  };

  const handleDownloadFile = (e) => {
    e.preventDefault();
    const contenuto = `Report Pagamenti\nData: ${filtriFile.dataInizio} - ${filtriFile.dataFine}`;
    const blob = new Blob([contenuto], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `export.${filtriFile.formato}`;
    link.click();
  };

  const handleChangeFiltriFile = (e) => {
    const { name, value } = e.target;
    setFiltriFile(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeFiltriRicerca = (e) => {
    const { name, value } = e.target;
    setFiltriRicerca(prev => ({ ...prev, [name]: value }));
  };

  const pagamentiFiltrati = pagamenti.filter(p => {
    const termine = filtriRicerca.termine.toLowerCase();
    const matchTesto = p.cliente.toLowerCase().includes(termine) || p.data.includes(termine) || p.dettagli?.prenotazione?.ora?.includes(termine);
    const matchMetodo = filtriRicerca.metodo === "" || p.metodo === filtriRicerca.metodo;
    const matchDataMin = filtriRicerca.dataMin === "" || p.data >= filtriRicerca.dataMin;
    const matchDataMax = filtriRicerca.dataMax === "" || p.data <= filtriRicerca.dataMax;
    return matchTesto && matchMetodo && matchDataMin && matchDataMax;
  });

  const pagamentiCompletati = pagamentiFiltrati.filter(p => p.stato === "completato");
  const pagamentiInSospeso = pagamentiFiltrati.filter(p => p.stato === "in_sospeso");

  const sezioneTitoloStyle = { marginTop: 0, marginBottom: "15px", fontSize: "18px", fontWeight: "bold" };
  const flexColumnStyle = { display: "flex", flexDirection: "column", flex: "1 1 0px", minWidth: "140px" };
  
  const inputStyle = { 
    padding: "10px 8px", 
    borderRadius: "4px", 
    border: "1px solid #ccc", 
    width: "100%", 
    boxSizing: "border-box",
    fontSize: "14px",
    lineHeight: "1.2"
  };

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    alignSelf: "flex-end"
  };

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="contenitore-1">
          <h2 style={{ marginBottom: "25px" }}>Pagamenti</h2>

          {/* BOX ESPORTAZIONE */}
          <div style={{ marginBottom: "25px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f8f9fa", color: "black" }}>
            <h3 style={sezioneTitoloStyle}>Esporta</h3>
            <form onSubmit={handleDownloadFile} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Primo giorno</label><input type="date" name="dataInizio" value={filtriFile.dataInizio} onChange={handleChangeFiltriFile} style={inputStyle} /></div>
              <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Ultimo giorno</label><input type="date" name="dataFine" value={filtriFile.dataFine} onChange={handleChangeFiltriFile} style={inputStyle} /></div>
              <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Email</label><input type="email" name="email" value={filtriFile.email} onChange={handleChangeFiltriFile} placeholder="Email..." style={inputStyle} /></div>
              <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Username</label><input type="text" name="username" value={filtriFile.username} onChange={handleChangeFiltriFile} placeholder="Username..." style={inputStyle} /></div>
              <div style={{...flexColumnStyle, flex: "0 0 100px"}}><label style={{fontSize:"13px", marginBottom:"5px"}}>Formato</label>
                <select name="formato" value={filtriFile.formato} onChange={handleChangeFiltriFile} style={inputStyle}><option value="pdf">.PDF</option><option value="xlsx">.XLSX</option></select>
              </div>
              <button type="submit" style={{ ...buttonStyle, backgroundColor: "#28a745", color: "white" }}>Scarica</button>
            </form>
          </div>

          {/* BOX FILTRA RISULTATI */}
          <div style={{ marginBottom: "25px", padding: "20px", border: "1px solid #007bff", borderRadius: "8px", backgroundColor: "#e9f2fd", color: "black" }}>
            <h3 style={{ ...sezioneTitoloStyle, color: "#0056b3" }}>Filtra Risultati</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Nome o Data</label>
                <input type="text" name="termine" value={filtriRicerca.termine} onChange={handleChangeFiltriRicerca} placeholder="Cerca..." style={inputStyle} />
              </div>
              <div style={flexColumnStyle}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Tipologia</label>
                <select name="metodo" value={filtriRicerca.metodo} onChange={handleChangeFiltriRicerca} style={inputStyle}>
                  <option value="">Tutte</option>
                  <option value="Struttura">Struttura</option>
                  <option value="Spedizione">Spedizione</option>
                  <option value="Corriere">Corriere</option>
                </select>
              </div>
              <div style={flexColumnStyle}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Dal giorno</label>
                <input type="date" name="dataMin" value={filtriRicerca.dataMin} onChange={handleChangeFiltriRicerca} style={inputStyle} />
              </div>
              <div style={flexColumnStyle}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Al giorno</label>
                <input type="date" name="dataMax" value={filtriRicerca.dataMax} onChange={handleChangeFiltriRicerca} style={inputStyle} />
              </div>
              <button onClick={() => setFiltriRicerca({termine:"", metodo:"", dataMin:"", dataMax:""})} style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}>Pulisci</button>
            </div>
          </div>

          {/* TABS */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            {["tutti", "completati", "sospesi"].map(t => (
              <button key={t} onClick={() => setTabAttiva(t)} style={{ padding: "10px 20px", backgroundColor: tabAttiva === t ? "#007bff" : "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", textTransform: "capitalize" }}>{t === "tutti" ? "Tutti i Pagamenti" : t}</button>
            ))}
          </div>

          {/* LISTE PAGAMENTI */}
          {(tabAttiva === "tutti" || tabAttiva === "completati") && (
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ color: "blue" }}>Pagamenti Completati</h3>
              {pagamentiCompletati.map(p => (
                <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px", backgroundColor: "#2469ae", color: "white" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><h4>{p.cliente}</h4><p>Data ordine: {p.data} | Totale: €{p.totale.toFixed(2)} | Metodo: {p.metodo}</p></div>
                    <span style={{ padding: "5px 10px", borderRadius: "15px", backgroundColor: "green", height: "fit-content" }}>Completato</span>
                  </div>
                  <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#1b5289", borderRadius: "5px", fontSize: "14px" }}>
                    {p.metodo === "Struttura" && p.dettagli.prenotazione && (
                        <>
                            <p><strong>Dettagli Prenotazione:</strong></p>
                            <p>Data: {p.dettagli.prenotazione.data} | Ora: {p.dettagli.prenotazione.ora}</p>
                        </>
                    )}
                    {p.metodo === "Spedizione" && p.dettagli.spedizione && (
                        <>
                            <p><strong>Dettagli Spedizione:</strong></p>
                            <p>Indirizzo: {p.dettagli.spedizione.indirizzo}</p>
                            <p>Carta: {maskCarta(p.dettagli.spedizione.carta)} | Scadenza: {p.dettagli.spedizione.scadenza}</p>
                        </>
                    )}
                    {p.metodo === "Corriere" && p.dettagli.corriere && (<><p><strong>Dettagli Corriere:</strong></p><p>Indirizzo: {p.dettagli.corriere.indirizzo}</p></>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {(tabAttiva === "tutti" || tabAttiva === "sospesi") && (
            <div>
              <h3 style={{ color: "orange" }}>Pagamenti In Sospeso</h3>
              {pagamentiInSospeso.map(p => (
                <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px", backgroundColor: "#fff3cd", color: "black" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><h4>{p.cliente}</h4><p>Data ordine: {p.data} | Totale: €{p.totale.toFixed(2)} | Metodo: {p.metodo}</p></div>
                    <span style={{ padding: "5px 10px", borderRadius: "15px", backgroundColor: "orange", color: "white", height: "fit-content" }}>In Sospeso</span>
                  </div>
                  <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#fdf0c2", borderRadius: "5px", fontSize: "14px", border: "1px solid #ffeeba" }}>
                    {p.metodo === "Struttura" && p.dettagli.prenotazione && (
                        <>
                            <p><strong>Dettagli Prenotazione:</strong></p>
                            <p>Data: {p.dettagli.prenotazione.data} | Ora: {p.dettagli.prenotazione.ora}</p>
                        </>
                    )}
                    {p.metodo === "Spedizione" && p.dettagli.spedizione && (
                        <>
                            <p><strong>Dettagli Spedizione:</strong></p>
                            <p>Indirizzo: {p.dettagli.spedizione.indirizzo}</p>
                            <p>Carta: {maskCarta(p.dettagli.spedizione.carta)} | Scadenza: {p.dettagli.spedizione.scadenza}</p>
                        </>
                    )}
                    {p.metodo === "Corriere" && p.dettagli.corriere && (<><p><strong>Dettagli Corriere:</strong></p><p>Indirizzo: {p.dettagli.corriere.indirizzo}</p></>)}
                  </div>
                  <div style={{ marginTop: "10px", textAlign: "right" }}>
                    <button onClick={() => segnaComeCompletato(p.id)} style={{ padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", marginRight: "10px" }}>Completa</button>
                    <button onClick={() => annullaPagamento(p.id)} style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Annulla</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Pagamenti;