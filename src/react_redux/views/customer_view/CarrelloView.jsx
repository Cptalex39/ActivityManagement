// Componente CarrelloView
// Riceve come props:
// - carrello → lista dei prodotti/servizi presenti nel carrello
// - setCarrello → funzione per aggiornare il carrello
// - setPagina → funzione per cambiare pagina (es. andare al checkout)

const CarrelloView = ({ carrello, setCarrello, setPagina }) => {

  // Funzione per rimuovere completamente un elemento dal carrello
  // Riceve l'indice dell'elemento nella lista
  const rimuovi = (index) => {

    // Crea una copia dell'array carrello (per non modificare lo stato direttamente)
    const nuovo = [...carrello];

    // Rimuove l'elemento alla posizione index
    nuovo.splice(index, 1);

    // Aggiorna lo stato del carrello
    setCarrello(nuovo);
  };

  // Funzione per aumentare la quantità di un prodotto
  // Riceve l'id del prodotto
  const aumenta = (id) => {

    // map scorre tutti gli elementi del carrello
    setCarrello(
      carrello.map(i =>
        // Se l'id corrisponde al prodotto cliccato
        i.id === id
          // crea una copia dell'oggetto aumentando la quantità
          ? { ...i, quantita: i.quantita + 1 }
          // altrimenti lascia l'elemento invariato
          : i
      )
    );
  };

  // Funzione per diminuire la quantità di un prodotto
  const diminuisci = (id) => {

    setCarrello(

      // map riduce la quantità del prodotto
      carrello
        .map(i =>
          i.id === id
            ? { ...i, quantita: i.quantita - 1 }
            : i
        )

        // filter rimuove automaticamente i prodotti con quantità 0
        .filter(i => i.quantita > 0)
    );
  };

  // Calcolo del totale del carrello
  // reduce scorre tutti gli elementi e somma prezzo * quantità
  const totale = carrello.reduce((sum, item) => sum + item.prezzo * item.quantita, 0);

  return (

    // Contenitore principale del carrello
    <div style={{ marginTop: "30px" }}>

      {/* Titolo del carrello */}
      <h3 style={{ color: "white" }}>Carrello</h3>

      {/* Se il carrello è vuoto mostra il messaggio */}
      {carrello.length === 0 && <p style={{ color: "white" }}>Carrello vuoto</p>}

      {/* Ciclo sugli elementi del carrello */}
      {carrello.map((item, index) => (

        // Box per ogni prodotto
        <div
          key={index}
          style={{
            background: "white",
            padding: "10px",
            marginBottom: "10px",
            marginRight:" 1500px",
            borderRadius: "8px",
          }}
        >

          {/* Nome prodotto, prezzo e quantità */}
          {<strong> {item.nome}</strong>} — €{item.prezzo} x {item.quantita}

          <br />

          {/* Tipo di prodotto */}
          <small>
          Tipo: {item.tipo === "service" ? "Servizio in struttura" : "Prodotto spedibile"}
          </small>

          {/* Pulsante per aumentare la quantità */}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => aumenta(item.id)}
          >
            +
          </button>

          {/* Pulsante per diminuire la quantità */}
          <button
            onClick={() => diminuisci(item.id)}
          >
            -
          </button>

          {/* Pulsante per rimuovere completamente il prodotto */}
          <button style={{ marginLeft: "20px" }} onClick={() => rimuovi(index)}>
            Rimuovi
          </button>

        </div>
      ))}

      {/* Mostra il totale del carrello */}
      <h4 style={{ color: "white" }}>Totale: €{totale.toFixed(2)}</h4>

     
    </div>
  );
};

export default CarrelloView;