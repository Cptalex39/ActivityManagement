import { useState } from "react";
import { CartaActions } from "../../actions/CartaActions"; 

// componente che rappresenta la pagina profilo cliente
// riceve:
// - ordini effettuati
// - carte salvate
// - funzione per salvare nuove carte
const CustomerProfiloView = ({ ordini, carteSalvate, setCarteSalvate }) => {
  const cartaActions = new CartaActions();

  // dati mock del cliente (in un'app reale arriverebbero dal backend)
  const clienteMock = {
    nome: "Mario",
    cognome: "Rossi",
    email: "mario.rossi@email.it",
    telefono: "3331234567"
  };

  // stato per inserire una nuova carta
  const [nuovaCarta, setNuovaCarta] = useState("");
  const [datiNuovaCarta, setDatiNuovaCarta] = useState({
    numero: "1111111111111111", 
    data_scadenza: "01/02/2030", 
    cvv_cvs: "246", 
    nome_titolare: clienteMock.cognome + " " + clienteMock.nome, 
    circuito: "Visa", 
    stato: true, 
  });

  // funzione per salvare una carta nel profilo cliente
  const salvaCarta = () => {

    // se il campo è vuoto non fa nulla
    //if (!nuovaCarta) return;

    // controllo lunghezza
    if (nuovaCarta.length < 16) {
      alert("Il numero della carta deve contenere almeno 16 cifre.");
      return;
    }

    cartaActions.inserimentoCarta(datiNuovaCarta, setDatiNuovaCarta, "italiano");


    // aggiunge la carta all'array delle carte salvate
    setCarteSalvate(prev => [...prev, nuovaCarta]);

    if (!nuovaCarta) {
    alert("Il numero della carta deve contenere almeno 16 cifre.");
    return;
  }

    // svuota il campo input
    setNuovaCarta("");
  };


  return (
    <div style={{ color: "white", marginTop: "20px" }}>

      {/* titolo pagina */}
      <h2>Profilo Cliente</h2>

      {/* box con informazioni cliente */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "30px",
          maxWidth: "400px"
        }}
      >
        <p><strong>Nome:</strong> {clienteMock.nome}</p>
        <p><strong>Cognome:</strong> {clienteMock.cognome}</p>
        <p><strong>Email:</strong> {clienteMock.email}</p>
        <p><strong>Telefono:</strong> {clienteMock.telefono}</p>
      </div>

      {/* sezione carte salvate */}
      <h3>Carte Salvate</h3>

      {/* input per inserire nuova carta */}
      <input
        type="text"
        placeholder="Inserisci numero carta"
        value={nuovaCarta}
        onChange={(e) => setNuovaCarta(e.target.value)}
      />

      {/* bottone per salvare carta */}
      <button
      
        onClick={salvaCarta}
        style={{
          marginLeft: "10px",
          backgroundColor: "blue",
          color:"white",
          padding: "5px 10px"
        }}
      > 
        Salva carta
      </button>

      {/* lista carte salvate */}
      <ul>

        {/* se non ci sono carte salvate */}
        {carteSalvate.length === 0 && (
          <p>Nessuna carta salvata</p>
        )}

        {/* mostra le carte salvate mascherando i numeri */}
        {carteSalvate.map((carta, i) => (

          <li key={i}>
            💳 **** **** **** {carta.slice(-4)}
          </li>

        ))}

      </ul>

      <br />

      {/* sezione storico ordini */}
      <h3>Storico Ordini</h3>

      {/* se non esistono ordini */}
      {ordini.length === 0 && (
        <p>Nessun ordine effettuato.</p>
      )}

      {/* ciclo degli ordini */}
      {ordini.map((ordine, index) => {

        // calcolo totale ordine
        const totale = ordine.prodotti.reduce(
          (sum, item) => sum + item.prezzo * item.quantita,
          0
        );

        return (
          <div
            key={index}
            style={{
              background: "white",
              color: "black",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              maxWidth: "500px"
            }}
          >

            {/* numero ordine */}
            <h5>Ordine #{index + 1}</h5>

            {/* data ordine */}
            <p>
              <strong>Data ordine:</strong> {ordine.data}
            </p>

            {/* lista prodotti acquistati */}
            <ul>
              {ordine.prodotti.map((item, i) => (
                <li key={i}>
                  {item.nome} x {item.quantita} — €
                  {(item.prezzo * item.quantita).toFixed(2)}
                  <br />
                  <small>
                    Tipo: {item.tipo === "service"
                      ? "Servizio in struttura"
                      : "Prodotto spedibile"}
                  </small>
                </li>
              ))}
            </ul>

            {/* totale ordine */}
            <strong>Totale: €{totale.toFixed(2)}</strong>

            <br /><br />

            {/* metodo pagamento */}
            <strong>Metodo:</strong> {ordine.metodo}

            {/* se metodo = struttura mostra appuntamento */}
            {ordine.metodo === "Struttura" && ordine.prenotazione && (
              <div style={{ marginTop: "10px" }}>
                <strong>Appuntamento:</strong>
                <p>
                  📅 Data: {ordine.prenotazione.data}
                  <br />
                  ⏰ Ora: {ordine.prenotazione.ora}
                </p>
              </div>
            )}

            {/* se metodo = spedizione mostra indirizzo e carta */}
            {ordine.metodo === "Spedizione" && ordine.spedizione && (
              <div style={{ marginTop: "10px" }}>
                <strong>Spedizione:</strong>
                <p>
                  📦 Indirizzo: {ordine.spedizione.indirizzo}
                  <br />
                  💳 Carta: **** **** **** {ordine.spedizione.carta.slice(-4)}
                </p>
              </div>
            )}

            {/* se metodo = corriere mostra indirizzo */}
            {ordine.metodo === "Corriere" && ordine.corriere && (
              <div style={{ marginTop: "10px" }}>
                <strong>Corriere:</strong>
                <p>
                  📦 Indirizzo: {ordine.corriere.indirizzo}
                </p>
              </div>
            )}

          </div>
        );
      })}

    </div>
  );
};

export default CustomerProfiloView;