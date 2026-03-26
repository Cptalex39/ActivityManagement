// Import dei componenti di React Bootstrap per creare le card e i pulsanti
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// Componente CatalogoServiziView
// Riceve come props:
// - servizi → lista dei servizi/prodotti da mostrare
// - aggiungiAlCarrello → funzione per aggiungere un elemento al carrello
// - setPagina → funzione per cambiare pagina (anche se in questo componente non viene usata)
const CatalogoServiziView = ({ servizi, aggiungiAlCarrello, setPagina }) => {
  return (

    // Contenitore principale del catalogo
    // Utilizza una griglia CSS per mostrare le card dei servizi
    <div
      style={{
        display: "grid", // layout a griglia
        gridTemplateColumns: "repeat(auto-fill, 250px)", // crea colonne da 250px adattandosi allo spazio disponibile
        gap: "20px", // spazio tra le card
        marginTop: "30px", // margine superiore
      }}
    >

      {/* Ciclo su tutti i servizi ricevuti */}
      {servizi.map((servizio) => (

        // Per ogni servizio viene creata una Card
        // key è necessario in React quando si renderizza una lista
        <Card key={servizio.id} style={{ width: "250px" }}>

          <Card.Body>

            {/* Nome del servizio o prodotto */}
            <Card.Title>  {servizio.nome}</Card.Title>

            {/* Prezzo del servizio */}
            <Card.Text>Prezzo: €{servizio.prezzo}</Card.Text>

            {/* Tipo del servizio */}
            {/* Se il tipo è "service" viene mostrato servizio in struttura */}
            {/* altrimenti prodotto spedibile */}
            <Card.Text>
              Tipo: {servizio.tipo === "service" ? "Servizio in struttura" : "Prodotto spedibile"}
            </Card.Text>

            {/* Pulsante che aggiunge il servizio al carrello */}
            {/* Quando viene cliccato richiama la funzione aggiungiAlCarrello */}
            <Button
              variant="primary"
              onClick={() => aggiungiAlCarrello(servizio)}
            >
              Aggiungi al carrello
            </Button>

          </Card.Body>

        </Card>
      ))}
    </div>
  );
};

export default CatalogoServiziView;