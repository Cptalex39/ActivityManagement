// Importa useState da React per gestire gli stati del componente
import { useState } from "react";

// Componente CheckoutView
// Riceve tramite props:
// carrello → prodotti nel carrello
// setCarrello → funzione per svuotare/modificare il carrello
// setPagina → per cambiare pagina
// setOrdini → per salvare lo storico ordini
// carteSalvate → lista delle carte salvate nel profilo cliente
const CheckoutView = ({ carrello, setCarrello, setPagina, setOrdini, carteSalvate }) => {

  // Stato per il nome cliente
  const [nome, setNome] = useState("");

  // Stato per email cliente
  const [email, setEmail] = useState("");

  // Stato per indirizzo di spedizione
  const [indirizzo, setIndirizzo] = useState("");

  // Stato per metodo di pagamento selezionato
  const [pagamento, setPagamento] = useState("");

  // Stato per data prenotazione servizio in struttura
  const [dataPrenotazione, setDataPrenotazione] = useState("");

  // Stato per ora prenotazione servizio
  const [oraPrenotazione, setOraPrenotazione] = useState("");

  // Stato per numero carta di pagamento
  const [numeroCarta, setNumeroCarta] = useState("");

  // Stato che indica se l'ordine è stato confermato
  const [ordineConfermato, setOrdineConfermato] = useState(false);

  // Calcolo del totale del carrello
  // Somma prezzo * quantità per ogni prodotto
  const totale = carrello.reduce(
    (sum, item) => sum + item.prezzo * item.quantita,
    0
  );

  // Controlla se nel carrello esistono prodotti spedibili
  const contieneProdottiSpedibili = carrello.some(
    (item) => item.tipo === "product"
  );

  // Controlla se nel carrello esistono servizi in struttura
  const contieneLavori = carrello.some(
    (item) => item.tipo === "service"
  );

  // Funzione chiamata quando l'utente conferma l'ordine
  const confermaOrdine = () => {

  // Controllo metodo pagamento
  if (!pagamento) {
    alert("Seleziona un metodo di pagamento!");
    return;
  }

  // Controlli specifici per ogni tipo
  if (pagamento === "Struttura") {
    if (!dataPrenotazione) {
      alert("Seleziona una data per la prenotazione in struttura.");
      return;
    }
    if (!oraPrenotazione) {
      alert("Seleziona un orario per la prenotazione in struttura.");
      return;
    }
    if (dataPrenotazione && !oraPrenotazione){
      alert("Selezione un'orario per la prenotazione in struttura")
    }
  }

  if (pagamento === "Spedizione") {
    if (!indirizzo) {
      alert("Inserisci l'indirizzo per la spedizione.");
      return;
    }
    if (!numeroCarta) {
      alert("Inserisci il numero della carta per la spedizione.");
      return;
    }
    if (numeroCarta.length < 16) {
      alert("Il numero della carta deve essere almeno di 16 cifre.");
      return;
    }
  }

  if (pagamento === "Corriere") {
    if (!indirizzo) {
      alert("Inserisci l'indirizzo per la consegna tramite corriere.");
      return;
    }
  }

  // Se tutti i controlli sono passati, creo l'ordine
  const nuovoOrdine = {
    id: Date.now(),
    data: new Date().toLocaleString(),
    prodotti: carrello.map(item => ({ ...item })),
    totale,
    metodo: pagamento,
    prenotazione: pagamento === "Struttura" ? { data: dataPrenotazione, ora: oraPrenotazione } : null,
    spedizione: pagamento === "Spedizione" ? { indirizzo, carta: numeroCarta } : null,
    corriere: pagamento === "Corriere" ? { indirizzo } : null
  };

  setOrdini(prev => [...prev, nuovoOrdine]);
  setOrdineConfermato(true);
  setCarrello([]);
};
  // Se l'ordine è stato confermato
  // mostra il messaggio di conferma
  if (ordineConfermato) {
    return (
      <div style={{ color: "white" }}>
        <h3>Ordine confermato! 🎉</h3>
        <p>Grazie {nome}, il tuo ordine è stato ricevuto.</p>
      </div>
    );
  }

  // Render principale della pagina checkout
  return (
    <div style={{ color: "white" }}>

      <h3>Checkout</h3>

      {/* Lista dei prodotti presenti nel carrello */}
      <ul style={{color:"black",backgroundColor:"white", marginRight:"1750px"}}>
        {carrello.map((item, idx) => (
          <li key={idx}>
            <strong> {item.nome}</strong> x {item.quantita} — €
            {(item.prezzo * item.quantita).toFixed(2)}
            <br />

            {/* Tipo di prodotto */}
            <small >
              Tipo: {item.tipo === "service"
                ? "Servizio in struttura"
                : "Prodotto spedibile"}
            </small>
          </li>
        ))}
      </ul>

      {/* Totale ordine */}
      <h4>Totale: €{totale.toFixed(2)}</h4>

      <div style={{ marginTop: "20px" }}>

        {/* Informazione per i servizi */}
        <p>🏪 I Servizi verranno eseguiti presso la struttura.</p>

        {/* Selezione metodo pagamento */}
        <label>
          Metodo di pagamento
          <br />

          <select
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
          >
            <option value="">Seleziona</option>
            <option value="Struttura">Struttura</option>
            <option value="Spedizione">Spedizione</option>
            <option value="Corriere">Corriere</option>
          </select>

        </label>

        <br /><br />

        {/* SEZIONE PRENOTAZIONE IN STRUTTURA */}

        {pagamento === "Struttura" && (

          <>
            <h4>Prenota appuntamento</h4>

            {/* Selezione data */}
            <label>
              Data
              <br />
              <input
                type="date"
                value={dataPrenotazione}
                onChange={(e) => setDataPrenotazione(e.target.value)}
              />
            </label>

            <br /><br />

            {/* Selezione ora */}
            <label>
              Ora
              <br />
              <input
                type="time"
                value={oraPrenotazione}
                onChange={(e) => setOraPrenotazione(e.target.value)}
              />
            </label>

            <br /><br />
          </>
        )}

        {/* SEZIONE SPEDIZIONE */}

        {pagamento === "Spedizione" && (

          <>
            {/* Inserimento indirizzo */}
            <label>
              Indirizzo
              <br />
              <input
                type="text"
                value={indirizzo}
                onChange={(e) => setIndirizzo(e.target.value)}
              />
            </label>

            <br /><br />

            {/* Se esistono carte salvate */}
            {carteSalvate && carteSalvate.length > 0 && (
              <>
                {/* Scelta carta salvata */}
                <label>
                  Scegli carta salvata
                  <br />
                  <select
                    onChange={(e) => setNumeroCarta(e.target.value)}
                  >
                    <option value="">Seleziona carta</option>

                    {carteSalvate.map((carta, i) => (
                      <option key={i} value={carta}>
                        **** **** **** {carta.slice(-4)}
                      </option>
                    ))}

                  </select>
                </label>

                <br /><br />

                {/* Possibilità di inserire carta nuova */}
                <p>Oppure inserisci una nuova carta</p>
              </>
            )}

            {/* Inserimento manuale numero carta */}
            <label>
              Numero carta
              <br />
              <input
                type="text"
                value={numeroCarta}
                onChange={(e) => setNumeroCarta(e.target.value)}
              />
            </label>

            <br /><br />
          </>
        )}

        {/* SEZIONE CORRIERE */}

        {pagamento === "Corriere" && (

          <>
            {/* Inserimento indirizzo consegna */}
            <label>
              Indirizzo
              <br />
              <input
                type="text"
                value={indirizzo}
                onChange={(e) => setIndirizzo(e.target.value)}
              />
            </label>

            <br /><br />
          </>
        )}

        {/* Pulsante conferma ordine */}
        <button
          onClick={confermaOrdine}

         

          style={{
            padding: "8px 15px",
            backgroundColor: "blue",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Conferma ordine
        </button>

      </div>

    </div>
  );
};

export default CheckoutView;