import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerProfiloView = ({ ordini, carteSalvate, setCarteSalvate, setClienteLogged }) => {
  const navigate = useNavigate();

  const clienteMock = {
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@email.it",
    telefono: "3331234567"
  };

  const [nuovaCarta, setNuovaCarta] = useState("");
  const [dataScadenza, setDataScadenza] = useState("");
  const [cvv, setCvv] = useState("");
  const [mostraConferma, setMostraConferma] = useState(false);

  const [ricercaData, setRicercaData] = useState("");
  const [ricercaOra, setRicercaOra] = useState("");
  const [ricercaMetodo, setRicercaMetodo] = useState("");
  const [dataMin, setDataMin] = useState("");
  const [dataMax, setDataMax] = useState("");

  const [filtriFile, setFiltriFile] = useState({
    dataInizio: "",
    dataFine: "",
    formato: "pdf"
  });

  const salvaCarta = () => {
    if (!nuovaCarta || !dataScadenza || !cvv) {
      alert("Compila tutti i campi della carta.");
      return;
    }
    const carta = { numero: nuovaCarta, scadenza: dataScadenza, cvv: cvv };
    setCarteSalvate(prev => [...prev, carta]);
    setNuovaCarta("");
    setDataScadenza("");
    setCvv("");
  };

  const rimuoviCarta = (indexToRemove) => {
    if (window.confirm("Sei sicuro di voler rimuovere questa carta?")) {
      setCarteSalvate(prev => prev.filter((_, index) => index !== indexToRemove));
    }
  };

  const handleEliminaProfilo = () => {
    alert(`Profilo cancellato con successo! 🗑️`);
    if (setClienteLogged) setClienteLogged(false);
    navigate("/");
  };

  const handleDownloadFile = (e) => {
    e.preventDefault();
    const contenuto = `Report Ordini\nPeriodo: ${filtriFile.dataInizio} - ${filtriFile.dataFine}`;
    const blob = new Blob([contenuto], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `export.${filtriFile.formato}`;
    link.click();
  };

  const ordiniFiltrati = ordini.filter((ordine) => {
    let matchData = true;
    let matchOra = true;
    let matchMetodo = true;
    let matchRange = true;

    if (ricercaData) {
      const [anno, mese, giorno] = ricercaData.split("-");
      const dataFormattata = `${giorno}/${mese}/${anno}`;
      matchData = ordine.data.includes(dataFormattata) || ordine.prenotazione?.data === ricercaData;
    }

    if (ricercaOra) {
      matchOra = ordine.data.includes(ricercaOra) || ordine.prenotazione?.ora === ricercaOra;
    }

    if (ricercaMetodo) {
      matchMetodo = ordine.metodo === ricercaMetodo;
    }

    const dataRiferimento = ordine.prenotazione?.data || ""; 
    if (dataMin && dataRiferimento) matchRange = matchRange && dataRiferimento >= dataMin;
    if (dataMax && dataRiferimento) matchRange = matchRange && dataRiferimento <= dataMax;

    return matchData && matchOra && matchMetodo && matchRange;
  });

  // --- CONFIGURAZIONE STILI "EXTRA LARGE" ---
  const boxStyle = { 
    background: "rgba(255,255,255,0.1)", 
    padding: "40px", 
    borderRadius: "15px", 
    marginBottom: "45px", 
    maxWidth: "900px", 
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: "20px"
  };

  const inputStyle = { 
    padding: "18px", 
    borderRadius: "10px", 
    border: "1px solid #ccc", 
    color: "black", 
    fontSize: "20px",
    width: "100%",
    boxSizing: "border-box"
  };

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    fontSize: "18px",
    fontWeight: "bold",
    flex: "1 1 250px",
    gap: "10px"
  };

  const buttonActionStyle = {
    padding: "20px 35px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "20px",
    transition: "0.2s opacity"
  };

  return (
    <div style={{ color: "white", marginTop: "40px", paddingBottom: "100px", fontFamily: "sans-serif" }}>
      <h2 style={{ fontSize: "48px", marginBottom: "40px" }}>Profilo Cliente</h2>

      {/* BOX INFO CLIENTE */}
      <div style={boxStyle}>
        <p style={{ margin: "15px 0" }}><strong>Nome:</strong> {clienteMock.nome} {clienteMock.cognome}</p>
        <p style={{ margin: "15px 0" }}><strong>Email:</strong> {clienteMock.email}</p>
        <p style={{ margin: "15px 0" }}><strong>Telefono:</strong> {clienteMock.telefono}</p>
        <div style={{ marginTop: "35px" }}>
          {!mostraConferma ? (
            <button 
              onClick={() => setMostraConferma(true)} 
              style={{ ...buttonActionStyle, backgroundColor: "#dc3545", color: "white" }}
            >
              Elimina Profilo
            </button>
          ) : (
            <div style={{ background: "rgba(255, 0, 0, 0.2)", padding: "30px", borderRadius: "12px", border: "2px solid red" }}>
              <p style={{ fontWeight: "bold", fontSize: "24px", margin: "0 0 20px 0" }}>Sei sicuro di voler procedere?</p>
              <button onClick={handleEliminaProfilo} style={{ ...buttonActionStyle, backgroundColor: "red", color: "white", marginRight: "20px" }}>Sì, elimina</button>
              <button onClick={() => setMostraConferma(false)} style={buttonActionStyle}>Annulla</button>
            </div>
          )}
        </div>
      </div>

      {/* SEZIONE CARTE SALVATE */}
      <h3 style={{ fontSize: "36px", marginBottom: "25px" }}>Carte Salvate</h3>
      <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
        <input type="text" placeholder="Numero carta (16 cifre)" value={nuovaCarta} onChange={(e) => setNuovaCarta(e.target.value)} style={inputStyle} />
        <div style={{ display: "flex", gap: "20px" }}>
          <input type="text" placeholder="MM/AA" value={dataScadenza} onChange={(e) => setDataScadenza(e.target.value)} style={inputStyle} />
          <input type="text" placeholder="CVV" value={cvv} onChange={(e) => setCvv(e.target.value)} style={inputStyle} />
        </div>
        <button onClick={salvaCarta} style={{ ...buttonActionStyle, backgroundColor: "#007bff", color: "white" }}>
          Salva carta
        </button>
      </div>

      <div style={{ marginBottom: "50px" }}>
        {carteSalvate.length === 0 && <p style={{ opacity: 0.7, fontSize: "22px" }}>Nessuna carta salvata</p>}
        {carteSalvate.map((carta, i) => (
          <div key={i} style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: "24px" }}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}>(Scad: {carta.scadenza})</small></span>
            <button onClick={() => rimuoviCarta(i)} style={{ ...buttonActionStyle, backgroundColor: "white", color: "black", padding: "10px 20px", fontSize: "16px" }}>Rimuovi</button>
          </div>
        ))}
      </div>

      <hr style={{ margin: "80px 0", opacity: 0.2 }} />

      {/* SEZIONE STORICO ORDINI */}
      <h3 style={{ fontSize: "42px", marginBottom: "35px" }}>Storico Ordini</h3>

      {/* BOX ESPORTAZIONE */}
      <div style={{ ...boxStyle, background: "rgba(40, 167, 69, 0.15)", borderColor: "#28a745" }}>
        <h4 style={{ marginTop: 0, fontSize: "30px", color: "#28a745" }}>Esporta Documenti</h4>
        <form onSubmit={handleDownloadFile} style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={labelStyle}>Da: <input type="date" style={inputStyle} value={filtriFile.dataInizio} onChange={(e) => setFiltriFile({...filtriFile, dataInizio: e.target.value})} /></label>
          <label style={labelStyle}>A: <input type="date" style={inputStyle} value={filtriFile.dataFine} onChange={(e) => setFiltriFile({...filtriFile, dataFine: e.target.value})} /></label>
          <label style={labelStyle}>Formato: 
            <select style={inputStyle} value={filtriFile.formato} onChange={(e) => setFiltriFile({...filtriFile, formato: e.target.value})}>
              <option value="pdf">PDF (.pdf)</option>
              <option value="xlsx">Excel (.xlsx)</option>
            </select>
          </label>
          <button type="submit" style={{ ...buttonActionStyle, backgroundColor: "#28a745", color: "white", flex: "1", minHeight: "65px" }}>Scarica Report</button>
        </form>
      </div>

      {/* BOX FILTRI */}
      <div style={{ ...boxStyle, background: "rgba(0, 123, 255, 0.15)", borderColor: "#007bff" }}>
        <h4 style={{ marginTop: 0, fontSize: "30px", color: "#007bff" }}>Filtra Ricerca</h4>
        <div style={{ display: "flex", gap: "30px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <label style={labelStyle}>Data: <input type="date" value={ricercaData} onChange={(e) => setRicercaData(e.target.value)} style={inputStyle}/></label>
          <label style={labelStyle}>Ora: <input type="time" value={ricercaOra} onChange={(e) => setRicercaOra(e.target.value)} style={inputStyle}/></label>
          <label style={labelStyle}>Metodo Pagamento: 
            <select value={ricercaMetodo} onChange={(e) => setRicercaMetodo(e.target.value)} style={inputStyle}>
              <option value="">Tutti i metodi</option>
              <option value="Struttura">Struttura</option>
              <option value="Spedizione">Spedizione</option>
              <option value="Corriere">Corriere</option>
            </select>
          </label>
          {(ricercaData || ricercaOra || ricercaMetodo) && (
            <button 
              onClick={() => { setRicercaData(""); setRicercaOra(""); setRicercaMetodo(""); }} 
              style={{ ...buttonActionStyle, backgroundColor: "#6c757d", color: "white", minHeight: "65px" }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* LISTA ORDINI */}
      <div style={{ marginTop: "50px" }}>
        {ordini.length === 0 ? (
          <p style={{ fontSize: "24px" }}>Nessun ordine effettuato.</p>
        ) : ordiniFiltrati.length === 0 ? (
          <p style={{ color: "orange", fontSize: "28px", fontWeight: "bold" }}>Nessun ordine trovato per i filtri selezionati.</p>
        ) : (
          ordiniFiltrati.map((ordine, index) => {
            const totale = ordine.prodotti.reduce((sum, item) => sum + item.prezzo * item.quantita, 0);
            return (
              <div key={index} style={{ background: "white", color: "black", padding: "40px", borderRadius: "20px", marginBottom: "40px", maxWidth: "850px", boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}>
                <h5 style={{ fontSize: "30px", margin: "0 0 20px 0", color: "#333" }}>Ordine #{ordine.id || index + 1}</h5>
                <p style={{ fontSize: "22px" }}><strong>Data ordine:</strong> {ordine.data}</p>
                <ul style={{ paddingLeft: "30px", fontSize: "22px" }}>
                  {ordine.prodotti.map((item, i) => (
                    <li key={i} style={{ marginBottom: "15px" }}>
                      <strong>{item.nome}</strong> x {item.quantita} — <span style={{ color: "#28a745", fontWeight: "bold" }}>€{(item.prezzo * item.quantita).toFixed(2)}</span>
                      <br />
                      <small style={{ color: "#777", fontSize: "18px" }}>Tipo: {item.tipo === "service" ? "Servizio in struttura" : "Prodotto spedibile"}</small>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: "3px solid #eee", paddingTop: "25px", marginTop: "25px", fontSize: "24px" }}>
                  <p><strong>Totale Finale:</strong> <span style={{ fontSize: "32px", color: "blue", fontWeight: "bold" }}>€{totale.toFixed(2)}</span></p>
                  <p><strong>Metodo Utilizzato:</strong> {ordine.metodo}</p>
                </div>

                {/* DETTAGLIi SPECIFICI */}
                {ordine.metodo === "Struttura" && ordine.prenotazione && (
                  <div style={{ marginTop: "25px", padding: "25px", background: "#f1f8ff", borderRadius: "12px", borderLeft: "8px solid #007bff" }}>
                    <strong style={{ fontSize: "22px" }}>Dettagli Appuntamento:</strong>
                    <p style={{ margin: "15px 0", fontSize: "20px" }}>📅 Data: {ordine.prenotazione.data}<br />⏰ Ora: {ordine.prenotazione.ora}</p>
                  </div>
                )}
                {ordine.metodo === "Spedizione" && ordine.spedizione && (
                  <div style={{ marginTop: "25px", padding: "25px", background: "#f4fff4", borderRadius: "12px", borderLeft: "8px solid #28a745" }}>
                    <strong style={{ fontSize: "22px" }}>Dettagli Spedizione:</strong>
                    <p style={{ margin: "15px 0", fontSize: "20px" }}>📦 Indirizzo: {ordine.spedizione.indirizzo}<br />💳 Carta: **** **** **** {ordine.spedizione.carta.slice(-4)}</p>
                  </div>
                )}
                {ordine.metodo === "Corriere" && ordine.corriere && (
                  <div style={{ marginTop: "25px", padding: "25px", background: "#fff9f1", borderRadius: "12px", borderLeft: "8px solid #ff9800" }}>
                    <strong style={{ fontSize: "22px" }}>Dettagli Corriere:</strong>
                    <p style={{ margin: "15px 0", fontSize: "20px" }}>📦 Indirizzo: {ordine.corriere.indirizzo}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerProfiloView;