import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CarrelloActions } from "../../actions/CarrelloActions";
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { FormRicercaItems, CardRicercaItems, RowRicercaItems } from "@gianlucascisciolo/riutilizzoreact";
import { ServizioForms } from "../forms/ServizioForms";
import { OperazioniForms } from "../forms/OperazioniForms";
import { ServizioActions } from "../../actions/ServizioActions";

const CatalogoServiziView = () => {
  const carrelloState = useSelector((state) => state.carrello.value);
  const stileState = useSelector((state) => state.stile.value);
  const servizioState = useSelector((state) => state.servizio.value);
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const servizioForms = new ServizioForms();
  const operazioniForms = new OperazioniForms();
  const carrelloActions = new CarrelloActions();
  const servizioActions = new ServizioActions();

  const [datiRicerca, setDatiRicerca] = useState({
    id_cliente: autenticazioneState.id_utente, 
    tipo_item: "servizio", 
    nome: "", 
    tipo: "", 
    prezzo_min: "",
    prezzo_max: "",  
  });
  
  const [pagina, setPagina] = useState("catalogo");

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

  const campiRicercaServizi = servizioForms.getCampiRicercaServizi(
    datiRicerca, 
    (e) => operazioniForms.handleInputChange(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputClick(e, setDatiRicerca), 
    (e) => operazioniForms.handleInputBlur(e, setDatiRicerca)
  );

  const RicercaItemsTag = (stileState.vistaForm === "form") ? FormRicercaItems : (
    (stileState.vistaForm ===  "card") ? CardRicercaItems : RowRicercaItems
  )

  const [servizi, setServizi] = useState([]);

  return (
    <>
      <Header />      

      <div className="main-content" />

      <RicercaItemsTag
        campi={campiRicercaServizi} 
        indici={[...Array(campiRicercaServizi.label.length).keys()]} 
        handleSearch={async () => {
          const result = await servizioActions.ricercaServizi(datiRicerca); 
          if(result.isOK) {
            setServizi(result.servizi);
          }
        }} 
      />

      <button>{servizi.length}</button>

      <div
        style={{
          display: "grid", // layout a griglia
          gridTemplateColumns: "repeat(auto-fill, 250px)", // crea colonne da 250px adattandosi allo spazio disponibile
          gap: "20px", // spazio tra le card
          marginTop: "50px", // margine superiore
          marginLeft: "50px", 
        }}
      >
          

        {/* Ciclo su tutti i servizi ottenuti dalla ricerca */}
        {servizi.map((servizio) => (
          <Card key={servizio.id} style={{ width: "250px" }}>
            <Card.Body>
              {/* Nome del servizio o prodotto */}
              <Card.Title>  {servizio.nome}</Card.Title>
              {/* Prezzo del servizioo */}
              <Card.Text>Prezzo: €{servizio.prezzo}</Card.Text>
              {/* Tipo del servizio */}
              {/* Se il tipo è "Servizio" viene mostrato servizio in struttura */}
              {/* altrimenti prodotto spedibile */}
              <Card.Text>
                <span style={{fontWeight:"bold"}}>Tipo:</span> {servizio.tipo === "Servizio" ? "Servizio in struttura" : "Prodotto spedibile"}
                <br />
                <span style={{fontWeight:"bold"}}>Descrizione:</span> {servizio.descrizione}
                <br />
                <span style={{fontWeight:"bold"}}>Note:</span> {servizio.note}
              </Card.Text>
              {/* Pulsante che aggiunge il servizio al carrello */}
              {/* Quando viene cliccato richiama la funzione aggiungiAlCarrello */}
              <h4 style={{textAlign:"center"}}>Quantità</h4>
              <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px"}}>
                <div style={{ display: "flex", gap: "20px", }}>
                  <FaMinusCircle onClick={() => decrementaQuantita(servizio)} size={40} style={{ cursor:"pointer", }} />
                  {ottieniQuantitaItem(servizio)}
                  <FaPlusCircle onClick={() => incrementaQuantita(servizio)} size={40} style={{ cursor:"pointer", }} />
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default CatalogoServiziView;