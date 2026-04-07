// Componente CarrelloView - VERSIONE FONT XXL / BOX COMPATTI
// Riceve come props:
// - carrello → lista dei prodotti/servizi presenti nel carrello
// - setCarrello → funzione per aggiornare il carrello
// - setPagina → funzione per cambiare pagina (es. andare al checkout)

const CarrelloView = ({ carrello, setCarrello, setPagina }) => {

  const rimuovi = (index) => {
    const nuovo = [...carrello];
    nuovo.splice(index, 1);
    setCarrello(nuovo);
  };

  const aumenta = (id) => {
    setCarrello(
      carrello.map(i =>
        i.id === id ? { ...i, quantita: i.quantita + 1 } : i
      )
    );
  };

  const diminuisci = (id) => {
    setCarrello(
      carrello
        .map(i =>
          i.id === id ? { ...i, quantita: i.quantita - 1 } : i
        )
        .filter(i => i.quantita > 0)
    );
  };

  const totale = carrello.reduce((sum, item) => sum + item.prezzo * item.quantita, 0);

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

  return (
    <div style={{ marginTop: "40px", paddingBottom: "100px", fontFamily: "sans-serif" }}>

      <h1 style={titleStyle}>CARRELLO</h1>

      {carrello.length === 0 && (
        <p style={{ color: "white", fontSize: "32px" }}>Il carrello è vuoto</p>
      )}

      {carrello.map((item, index) => (
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
              Prezzo: €{item.prezzo.toFixed(2)} | Qtà: <strong s>{item.quantita}</strong>
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
              {item.tipo === "service" ? "SERVIZIO IN STRUTTURA" : "PRODOTTO SPEDIBILE"}
            </div>
          </div>

          {/* Azioni */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <button style={buttonStyle} onClick={() => aumenta(item.id)}>+</button>
            <button style={buttonStyle} onClick={() => diminuisci(item.id)}>−</button>
            <button style={removeButtonStyle} onClick={() => rimuovi(index)}>RIMUOVI</button>
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
      
    </div>
  );
};

export default CarrelloView;