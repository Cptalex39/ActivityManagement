import { useState } from "react";
import { OrdineActions } from "../../actions/OrdineActions";

// Componente CheckoutView - VERSIONE FULL XXL
const CheckoutView = ({ carrello, setCarrello, setPagina, setOrdini, carteSalvate }) => {
  const ordineActions = new OrdineActions();
  // Stati per la gestione del form
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [pagamento, setPagamento] = useState("");
  const [dataPrenotazione, setDataPrenotazione] = useState("");
  const [oraPrenotazione, setOraPrenotazione] = useState("");
  const [numeroCarta, setNumeroCarta] = useState("");
  const [dataScadenzaCarta, setDataScadenzaCarta] = useState("");
  const [cvvCarta, setCvvCarta] = useState("");
  const [cartaSelezionata, setCartaSelezionata] = useState("");
  const [ordineConfermato, setOrdineConfermato] = useState(false);

  // Calcolo del totale
  const totale = carrello.reduce((sum, item) => sum + item.prezzo * item.quantita, 0);

  // Funzione di conferma ordine con validazioni
  const confermaOrdine = () => {
    if (!pagamento) {
      alert("Seleziona un metodo di pagamento!");
      return;
    }

    if (pagamento === "Struttura") {
      if (!dataPrenotazione || !oraPrenotazione) {
        alert("Seleziona data e orario per la prenotazione.");
        return;
      }
    }

    if (pagamento === "Spedizione") {
      if (!indirizzo) {
        alert("Inserisci l'indirizzo per la spedizione.");
        return;
      }
      if (!cartaSelezionata && (!numeroCarta || !dataScadenzaCarta || !cvvCarta)) {
        alert("Inserisci tutti i dati della carta.");
        return;
      }
    }

    if (pagamento === "Corriere" && !indirizzo) {
      alert("Inserisci l'indirizzo per la consegna.");
      return;
    }

    const nuovoOrdine = {
      id: Date.now(),
      data: new Date().toLocaleString(),
      prodotti: carrello.map(item => ({ ...item })),
      totale,
      metodo: pagamento,
      prenotazione: pagamento === "Struttura" ? { data: dataPrenotazione, ora: oraPrenotazione } : null,
      spedizione: pagamento === "Spedizione" ? { indirizzo, carta: cartaSelezionata || numeroCarta } : null,
      corriere: pagamento === "Corriere" ? { indirizzo } : null
    };

    ordineActions.inserimentoOrdine(nuovoOrdine);

    setOrdini(prev => [...prev, nuovoOrdine]);
    setOrdineConfermato(true);
    setCarrello([]);
  };

  // --- STILI XXL ---
  const labelStyle = {
    display: "block",
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "15px",
    color: "white",
    textTransform: "uppercase"
  };

  const inputStyle = {
    width: "100%",
    maxWidth: "750px",
    padding: "25px",
    fontSize: "26px",
    borderRadius: "15px",
    border: "3px solid #ccc",
    marginBottom: "35px",
    boxSizing: "border-box",
    color: "black",
    fontWeight: "bold"
  };

  const sectionStyle = {
    background: "rgba(255,255,255,0.08)",
    padding: "45px",
    borderRadius: "25px",
    marginBottom: "40px",
    maxWidth: "850px",
    border: "1px solid rgba(255,255,255,0.2)"
  };

  // Schermata di conferma post-ordine
  if (ordineConfermato) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "120px", padding: "40px" }}>
        <h3 style={{ fontSize: "72px", fontWeight: "900" }}>Ordine confermato! 🎉</h3>
        <p style={{ fontSize: "36px", opacity: 0.9 }}>Il tuo ordine è in fase di elaborazione.</p>
        <button 
          onClick={() => setPagina("prodotti")} 
          style={{ 
            marginTop: "50px", 
            padding: "30px 60px", 
            fontSize: "32px", 
            fontWeight: "bold", 
            borderRadius: "20px", 
            cursor: "pointer",
            backgroundColor: "white",
            color: "black",
            border: "none"
          }}
        >
          Torna allo Shop
        </button>
      </div>
    );
  }

  return (
    <div style={{ color: "white", marginTop: "50px", paddingBottom: "120px", fontFamily: "sans-serif" }}>
      <h3 style={{ fontSize: "64px", fontWeight: "900", marginBottom: "50px", textTransform: "uppercase" }}>
        Checkout
      </h3>

      {/* RIEPILOGO ARTICOLI XXL */}
      <div style={{ ...sectionStyle, background: "white", color: "black" }}>
        <h4 style={{ fontSize: "42px", marginTop: 0, borderBottom: "4px solid #eee", paddingBottom: "20px" }}>
          Riepilogo Articoli
        </h4>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {carrello.map((item, idx) => (
            <li key={idx} style={{ padding: "25px 0", borderBottom: "2px solid #f0f0f0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "36px" }}>{item.nome}</strong>
                <span style={{ fontSize: "36px", color: "blue", fontWeight: "900" }}>
                  €{(item.prezzo * item.quantita).toFixed(2)}
                </span>
              </div>
              <div style={{ fontSize: "26px", color: "#666", marginTop: "10px" }}>
                Qtà: <strong>{item.quantita}</strong> | Unitario: €{item.prezzo.toFixed(2)}
              </div>
              <small style={{ fontSize: "20px", color: "#999", textTransform: "uppercase", fontWeight: "bold" }}>
                {item.tipo === "service" ? "Servizio in Struttura" : "Prodotto Spedibile"}
              </small>
            </li>
          ))}
        </ul>

        {/* TOTALE GIGANTE */}
        <div style={{ marginTop: "35px", textAlign: "right", padding: "30px", background: "#f8f9fa", borderRadius: "20px", border: "2px solid #eee" }}>
          <span style={{ fontSize: "32px", color: "#555", fontWeight: "bold" }}>TOTALE DA PAGARE:</span>
          <div style={{ fontSize: "85px", color: "#28a745", fontWeight: "900", lineHeight: "1" }}>
            €{totale.toFixed(2)}
          </div>
        </div>
      </div>

      {/* SEZIONE INPUT E PAGAMENTO */}
      <div style={{ maxWidth: "850px" }}>
        <p style={{ fontSize: "28px", marginBottom: "50px", color: "#4ade80", fontWeight: "bold" }}>
          🏪 I Servizi verranno eseguiti presso la nostra struttura.
        </p>

        <label style={labelStyle}>Metodo di Pagamento</label>
        <select value={pagamento} onChange={(e) => setPagamento(e.target.value)} style={inputStyle}>
          <option value="">-- Scegli come pagare --</option>
          <option value="Struttura">Pagamento in Struttura</option>
          <option value="Spedizione">Pagamento Online + Spedizione</option>
          <option value="Corriere">Pagamento alla Consegna (Corriere)</option>
        </select>

        {/* LOGICA SEZIONI DINAMICHE */}
        {pagamento === "Struttura" && (
          <div style={sectionStyle}>
            <h4 style={{ fontSize: "36px", marginTop: 0, color: "#007bff" }}>Appuntamento</h4>
            <label style={labelStyle}>Data</label>
            <input type="date" value={dataPrenotazione} onChange={(e) => setDataPrenotazione(e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Orario</label>
            <input type="time" value={oraPrenotazione} onChange={(e) => setOraPrenotazione(e.target.value)} style={inputStyle} />
          </div>
        )}

        {pagamento === "Spedizione" && (
          <div style={sectionStyle}>
            <h4 style={{ fontSize: "36px", marginTop: 0, color: "#28a745" }}>Spedizione & Carta</h4>
            <label style={labelStyle}>Indirizzo di Consegna</label>
            <input type="text" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} style={inputStyle} placeholder="Via, n°, Città, CAP" />

            {carteSalvate?.length > 0 && (
              <div style={{ marginBottom: "30px", padding: "20px", border: "2px dashed #666", borderRadius: "15px" }}>
                <label style={{ ...labelStyle, fontSize: "22px" }}>Usa una carta salvata</label>
                <select value={cartaSelezionata} onChange={(e) => { setCartaSelezionata(e.target.value); setNumeroCarta(e.target.value); }} style={inputStyle}>
                  <option value="">Seleziona...</option>
                  {carteSalvate.map((carta, i) => (
                    <option key={i} value={carta.numero}>
                      **** {carta.numero.slice(-4)} | Scad: {carta.scadenza}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!cartaSelezionata && (
              <>
                <label style={labelStyle}>Numero Carta (16 cifre)</label>
                <input type="text" value={numeroCarta} maxLength="16" onChange={(e) => setNumeroCarta(e.target.value)} style={inputStyle} />
                <div style={{ display: "flex", gap: "25px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Scadenza</label>
                    <input type="text" placeholder="MM/AA" value={dataScadenzaCarta} maxLength="5" onChange={(e) => setDataScadenzaCarta(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>CVV</label>
                    <input type="text" value={cvvCarta} maxLength="3" onChange={(e) => setCvvCarta(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {pagamento === "Corriere" && (
          <div style={sectionStyle}>
            <h4 style={{ fontSize: "36px", marginTop: 0, color: "#ffc107" }}>Indirizzo Corriere</h4>
            <label style={labelStyle}>Indirizzo di Consegna</label>
            <input type="text" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} style={inputStyle} placeholder="Via, n°, Città, CAP" />
          </div>
        )}

        {/* BOTTONE CONFERMA FINALEe XXL */}
        <button
          onClick={confermaOrdine}
          style={{
            width: "100%",
            maxWidth: "750px",
            padding: "35px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "20px",
            fontSize: "42px",
            fontWeight: "900",
            cursor: "pointer",
            textTransform: "uppercase",
            boxShadow: "0 15px 40px rgba(0,0,255,0.4)",
            marginTop: "30px",
            transition: "transform 0.1s active"
          }}
        >
          Conferma e Concludi
        </button>
      </div>
    </div>
  );
};

export default CheckoutView;