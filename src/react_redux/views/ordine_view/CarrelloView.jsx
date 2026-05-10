import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { CarrelloActions } from "../../actions/CarrelloActions";
import { FaPlusCircle, FaMinusCircle, FaTrashAlt } from "react-icons/fa";

const CarrelloView = ({ carrello, setCarrello, setPagina }) => {
  const carrelloState = useSelector((state) => state.carrello.value);
  const carrelloActions = new CarrelloActions();
  const navigate = useNavigate();
  
  const incrementaQuantita = (servizio) => {
    carrelloActions.aggiungiAlCarrello(servizio, 1);
  };

  const decrementaQuantita = (servizio) => {
    carrelloActions.decrementaQuantita(servizio.id);
  };
  
  const ottieniQuantitaItem = (servizio) => {
    const index = carrelloState.items.findIndex(i => i.id === servizio.id);
    return index >= 0 ? carrelloState.items[index].quantita : 0;
  }

  const rimuoviDalCarrello = (servizio) => {
    carrelloActions.rimuoviDalCarrello(servizio.id);
  }

  const totale = carrelloState.items.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);
  
  // --- STILI OTTIMIZZATI ---
  const titleStyle = {
    color: "white",
    fontSize: "56px", 
    marginBottom: "40px",
    fontWeight: "900"
  };

  const itemBoxStyle = {
    background: "white",
    color: "black",
    padding: "30px", // Ridotto padding per box più piccoli
    marginBottom: "25px",
    maxWidth: "700px", // Box più stretto e centrato
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
  };

  const buttonStyle = {
    padding: "15px 30px", 
    fontSize: "32px",
    fontWeight: "bold",
    cursor: "pointer",
    borderRadius: "12px",
    border: "2px solid #ccc",
    backgroundColor: "#f0f0f0",
    marginRight: "15px",
  };

  const removeButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#ff0000",
    color: "white",
    border: "none",
    marginLeft: "30px",
    fontSize: "20px"
  };

  const vaiAlCheckout = () => {
    navigate("/checkout");
  }

  return (
    <>
      <Header />

      <div className="main-content" />    
      
      <div style={{ marginTop: "40px", paddingBottom: "100px", fontFamily: "sans-serif" }}>

        <h1 style={titleStyle}>CARRELLO</h1>

        {carrelloState.items.length === 0 && (
          <p style={{ color: "white", fontSize: "32px" }}>Il carrello è vuoto</p>
        )}
        
        {carrelloState.items.map((item, index) => (
          <div key={index} style={itemBoxStyle}>
            
            {/* Nome e Prezzoo */}
            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong style={{ fontSize: "42px" }}>{item.nome}</strong>
              <span style={{ fontSize: "38px", color: "black", fontWeight: "900" }}>
                €{(item.prezzo * item.quantita).toFixed(2)}
              </span>
            </div>

            {/* Info e Categoria */}
            <div style={{ marginBottom: "25px", borderBottom: "2px solid #eee", paddingBottom: "15px" }}>
              <p style={{ fontSize: "24px", margin: "5px 0", color: "#110909" }}>
                Prezzo: €{item.prezzo.toFixed(2)} | Qtà: <strong>{item.quantita}</strong>
              </p>
              <div style={{ 
                  fontSize: "22px", 
                  fontWeight: "bold", 
                  color: "#666", 
                  marginTop: "10px",
                  background: "#f1f1f1",
                  padding: "8px 15px",
                  borderRadius: "8px",
                  display: "inline-block"
              }}>
                {item.tipo === "Servizio" ? "SERVIZIO IN STRUTTURA" : "PRODOTTO SPEDIBILE"}
              </div>
            </div>

            {/* Azioni */}
            <h4 style={{textAlign:"center"}}>Quantità</h4>
            <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px"}}>
              <div style={{ display: "flex", gap: "20px", }}>
                <FaMinusCircle onClick={() => decrementaQuantita(item)} size={40} style={{ cursor:"pointer", }} />
                {ottieniQuantitaItem(item)}
                <FaPlusCircle onClick={() => incrementaQuantita(item)} size={40} style={{ cursor:"pointer", }} />
                <FaTrashAlt onClick={() => rimuoviDalCarrello(item)} size={40} style={{ cursor:"pointer", }} />
              </div>
            </div>

          </div>
        ))}

        {/* Totale finale compatto ma visibile */}
        <div style={{ 
          marginTop: "60px", 
          padding: "30px", 
          background: "rgba(255,255,255,0.1)",
          border: "4px solid white", 
          maxWidth: "700px",
          borderRadius: "20px",
          textAlign: "center"
        }}>
          <h4 style={{ color: "white", fontSize: "32px", margin: "0 0 10px 0" }}>TOTALE DA PAGARE</h4>
          <span style={{ color: "white", fontSize: "80px", fontWeight: "900" }}>
            €{totale.toFixed(2)}
          </span>
        </div>

        <br />

      {totale > 0 && (
        <button
          style={{     
            padding: "25px 50px",       // Padding molto più grande
            backgroundColor: "blue",    // Mantenuto il tuo colore blu
            color: "white",
            border: "none",
            borderRadius: "15px",       // Arrotondamento più marcato per box grandi
            cursor: "pointer",
            fontSize: "86px",           // Scritta gigante
            fontWeight: "900",          // Super grassetto
            width: "100%",              // Prende tutta la larghezza del box
            maxWidth: "700px",          // Maa si ferma alla larghezza dei box prodotti
            textTransform: "uppercase", // Tutto maiuscolo per massima visibilità
            boxShadow: "0 10px 20px rgba(0, 0, 255, 0.3)", // Ombra blu coerente
            display: "block"            // Per centrarlo correttamente
          }}

          onClick={vaiAlCheckout}
        >
          Vai al checkout
        </button>
      )}
      </div>
    </>
  );
};

export default CarrelloView;