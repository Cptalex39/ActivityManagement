import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { OrdineActions } from "../../actions/OrdineActions";
import { CarrelloActions } from "../../actions/CarrelloActions";
import { CartaActions } from "../../actions/CartaActions";
import { AutenticazioneActions } from "../../actions/AutenticazioneActions";

// Componente CheckoutView - VERSIONE FULL XXL
const CheckoutView = () => {
  const navigate = useNavigate();
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const carrelloState = useSelector((state) => state.carrello.value);
  const cartaState = useSelector((state) => state.carta.value);
  const autenticazioneActions = new AutenticazioneActions();
  const ordineActions = new OrdineActions();
  const carrelloActions = new CarrelloActions();
  const cartaActions = new CartaActions();
  
  const [idCartaSelezionata, setIdCartaSelezionata] = useState(0);

  const [nuovoOrdine, setNuovoOrdine] = useState({
    tipo_item: "ordine", 
    codice: "", 
    data_creazione: "", 
    items: "", 
    metodo_pagamento: "", 
    data_prenotazione: null, 
    ora_prenotazione: null, 
    indirizzo: autenticazioneState.indirizzo, 
    indirizzo_attuale: autenticazioneState.indirizzo, 
    numero_carta: null, 
    id_cliente: autenticazioneState.id_utente, 
  })

  // Calcolo del totale
  const totale = carrelloState.items.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);

  const getCodice = () => {
    const date = new Date();
    return date.getFullYear()+"-"+(date.getMonth()+1).toString().padStart(2,'0')+"-"+date.getDate().toString().padStart(2,'0')+
           "_" + date.getHours().toString().padStart(2,'0')+":"+date.getMinutes().toString().padStart(2,'0')+
           ":"+date.getSeconds().toString().padStart(2,'0')+":" + date.getMilliseconds();
  }

  // Funzione di conferma ordine con validazioni
  const confermaOrdine = async () => {
    if (!nuovoOrdine.metodo_pagamento) {
      alert("Seleziona un metodo di pagamento!");
      return;
    }

    if (nuovoOrdine.metodo_pagamento === "Struttura") {
      if (!nuovoOrdine.data_prenotazione || !nuovoOrdine.ora_prenotazione) {
        alert("Seleziona data e orario per la prenotazione.");
        return;
      }
    }

    if (nuovoOrdine.metodo_pagamento === "Spedizione") {
      if (!nuovoOrdine.indirizzo) {
        alert("Inserisci l'indirizzo per la spedizione.");
        return;
      }
      if (!nuovoOrdine.numero_carta) {
        alert("Seleziona una carta.");
        return;
      }
    }

    if (nuovoOrdine.metodo_pagamento === "Corriere" && !nuovoOrdine.indirizzo) {
      alert("Inserisci l'indirizzo per la consegna.");
      return;
    }
    
    let ordineCompleto = {
      ...nuovoOrdine,
      items: JSON.stringify(carrelloState.items.map(item => ({ ...item }))),
      totale: totale, 
    };

    const result = await ordineActions.inserimentoOrdine(ordineCompleto);

    if(result.isOK && ordineCompleto.indirizzo !== ordineCompleto.indirizzo_attuale) {
      autenticazioneActions.aggiornaIndirizzo(nuovoOrdine.indirizzo);
    }
    
    await carrelloActions.svuotaCarrello();

    navigate("/conferma-ordine");
  };

  const tornaPaginaNuovoOrdine = () => {
    navigate("/nuovo-ordine")
  }

  const selezionaCarta = (idCarta, numeroCarta) => {
    setIdCartaSelezionata(idCarta === idCartaSelezionata ? 0 : idCarta);
    setNuovoOrdine(prevState => ({
      ...prevState, 
      numero_carta: idCarta === idCartaSelezionata ? "" : numeroCarta.slice(-4), 
    }));
  }

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

  const buttonActionStyle = {
    padding: "20px 35px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "20px",
    transition: "0.2s opacity"
  };

  useEffect(() => {
    cartaActions.ottenimentoCarteCliente(autenticazioneState.id_utente);
  }, []);
  
  return (
    <>
      <Header />      

      <div className="main-content" />

      <div style={{ color: "white", marginTop: "50px", paddingBottom: "120px", fontFamily: "sans-serif" }}>
        <h3 style={{ fontSize: "64px", fontWeight: "900", marginBottom: "50px", textTransform: "uppercase" }}>
          Checkout
        </h3>

        {/* RIEPILOGO ARTICOLI XXL */}
        <div style={{ ...sectionStyle, background: "white", color: "black" }}>
          <h4 style={{ fontSize: "42px", marginTop: 0, borderBottom: "4px solid #eee", paddingBottom: "20px" }}>Riepilogo Articoli</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {carrelloState.items.map((item, idx) => (
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
                  {item.tipo === "Servizio" ? "Servizio in Struttura" : "Prodotto Spedibile"}
                </small>
              </li>
            ))}
          </ul>

          {/* TOTALE */}
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
          <select value={nuovoOrdine.metodo_pagamento} style={inputStyle}
            onChange={(e) => setNuovoOrdine(prevState => ({
              ...prevState, 
              metodo_pagamento: e.target.value, 
            }))}
          >
            <option value="">-- Scegli come pagare --</option>
            <option value="Struttura">Pagamento in Struttura</option>
            <option value="Spedizione">Pagamento Online + Spedizione</option>
            <option value="Corriere">Pagamento alla Consegna (Corriere)</option>
          </select>

          {/* LOGICA SEZIONI DINAMICHE */}
          {nuovoOrdine.metodo_pagamento === "Struttura" && (
            <div style={sectionStyle}>
              <h4 style={{ fontSize: "36px", marginTop: 0, color: "#007bff" }}>Appuntamento</h4>
              <label style={labelStyle}>Data</label>
              <input type="date" value={nuovoOrdine.data_prenotazione} style={inputStyle} 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  data_prenotazione: e.target.value, 
                }))}
              />
              <label style={labelStyle}>Orario</label>
              <input type="time" value={nuovoOrdine.ora_prenotazione} style={inputStyle} 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  ora_prenotazione: e.target.value, 
                }))}
              />
            </div>
          )}

          {nuovoOrdine.metodo_pagamento === "Spedizione" && (
            <div style={sectionStyle}>
              <h4 style={{ fontSize: "36px", marginTop: 0, color: "#28a745" }}>Spedizione & Carta</h4>
              <label style={labelStyle}>Indirizzo di Consegna</label>
              <input type="text" value={nuovoOrdine.indirizzo} style={inputStyle} placeholder="Via, n°, Città, CAP" 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  indirizzo: e.target.value, 
                }))}
              />
              <label style={labelStyle}>Seleziona una carta</label>
              {cartaState.carte.map((carta, i) => (
                <>
                  <div key={i} style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span style={{ fontSize: "24px" }}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}>(Scad: {carta.mese_scadenza+"/"+carta.anno_scadenza})</small></span>
                    <button onClick={() => selezionaCarta(carta.id, carta.numero)} 
                      style={{ 
                        ...buttonActionStyle, 
                        backgroundColor: carta.id === idCartaSelezionata ? "#007BFF" : "#FFFFFF", 
                        color: "black", 
                        padding: "10px 20px", 
                        fontSize: "16px" 
                      }}>
                        {carta.id === idCartaSelezionata ? "Deseleziona" : "Seleziona"}
                      </button>
                  </div>
                </>
              ))}
              {cartaState.carte.length < 1 && (
                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "24px" }}>Carte non presenti... aggiungine una nel tuo profilo.</span>
                </div>
              )}
            </div>
          )}

          {nuovoOrdine.metodo_pagamento === "Corriere" && (
            <div style={sectionStyle}>
              <h4 style={{ fontSize: "36px", marginTop: 0, color: "#ffc107" }}>Indirizzo Corriere</h4>
              <label style={labelStyle}>Indirizzo di Consegna</label>
              <input type="text" value={nuovoOrdine.indirizzo} style={inputStyle} placeholder="Via, n°, Città, CAP" 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  indirizzo: e.target.value, 
                }))}
              />
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
    </>
  );
};

export default CheckoutView;