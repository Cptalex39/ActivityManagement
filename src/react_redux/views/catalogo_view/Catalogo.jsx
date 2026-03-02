// React e Redux
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import styled from 'styled-components';
// Views
import Header from "../components/Header";
// Actions
import { ServizioActions } from "../../actions/ServizioActions";

/*** Styled Components ***/

const CatalogoContainer = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 40px;
`;

const FiltroContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
`;

const FiltroButton = styled.button`
  border-radius: 40px;
  border: 3px solid #000000;
  background-color: ${props => props.$attivo ? '#0050EF' : '#000000'};
  color: #FFFFFF;
  padding: 10px 30px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #0050EF;
  }
`;

const CardCatalogo = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 20px;
  padding: 25px;
  color: #FFFFFF;
  width: 320px;
  text-align: center;
  transition: 0.3s all ease-out;
  &:hover {
    border: 2px solid #0050EF;
  }
`;

const NomeServizio = styled.h3`
  font-size: 22px;
  margin-bottom: 5px;
`;

const TipoBadge = styled.span`
  display: inline-block;
  background-color: ${props => props.$tipo === 'prodotto' ? '#FF6B00' : '#0050EF'};
  color: #FFFFFF;
  padding: 3px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 10px;
`;

const Prezzo = styled.p`
  font-size: 26px;
  font-weight: bold;
  color: #0050EF;
  margin: 10px 0;
`;

const QuantitaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin: 15px 0;
`;

const QuantitaButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #0050EF;
  background-color: transparent;
  color: #0050EF;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #0050EF;
    color: #FFFFFF;
  }
  &:disabled {
    border-color: #555;
    color: #555;
    cursor: not-allowed;
    &:hover {
      background-color: transparent;
      color: #555;
    }
  }
`;

const QuantitaDisplay = styled.span`
  font-size: 24px;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
`;

const AzioniContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
`;

const ButtonPrenota = styled.button`
  border-radius: 40px;
  border: none;
  background-color: #0050EF;
  color: #FFFFFF;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #003BB5;
  }
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const ButtonOrdina = styled.button`
  border-radius: 40px;
  border: none;
  background-color: #FF6B00;
  color: #FFFFFF;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #CC5500;
  }
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const RiepilogoContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 20px;
  padding: 25px;
  color: #FFFFFF;
  margin-top: 40px;
  margin-bottom: 40px;
  text-align: center;
`;

const TotaleText = styled.p`
  font-size: 28px;
  font-weight: bold;
  color: #0050EF;
`;

/*** Componente Catalogo ***/

const Catalogo = () => {
  const servizioActions = new ServizioActions();
  const servizioState = useSelector((state) => state.servizio.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const lingua = attivitaState.lingua;

  const [filtroTipo, setFiltroTipo] = useState("tutti");
  const [quantita, setQuantita] = useState({}); // { id_servizio: quantita }

  // Carica il catalogo al montaggio e quando cambia il filtro
  useEffect(() => {
    servizioActions.getCatalogo(filtroTipo, lingua);
  }, [filtroTipo]);

  const incrementa = (id) => {
    setQuantita(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const decrementa = (id) => {
    setQuantita(prev => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0)
    }));
  };

  const getItemsSelezionati = () => {
    if (!servizioState.catalogo || servizioState.catalogo.length === 0) return [];
    return servizioState.catalogo.filter(item => (quantita[item.id] || 0) > 0);
  };

  const getTotale = () => {
    let totale = 0;
    for (const item of getItemsSelezionati()) {
      totale += item.prezzo * (quantita[item.id] || 0);
    }
    return totale;
  };

  const handlePrenota = (e) => {
    e.preventDefault();
    const selezionati = getItemsSelezionati();
    if (selezionati.length === 0) {
      alert(lingua === "italiano" ? "Seleziona almeno un servizio o prodotto." : "Select at least one service or product.");
      return;
    }
    // CR: Qui in futuro si aprirà la pagina di prenotazione con data/ora
    alert(lingua === "italiano" 
      ? "Funzionalità di prenotazione in fase di sviluppo.\nTotale: " + getTotale().toFixed(2) + " €" 
      : "Booking functionality under development.\nTotal: " + getTotale().toFixed(2) + " €"
    );
  };

  const handleOrdina = (e) => {
    e.preventDefault();
    const selezionati = getItemsSelezionati();
    if (selezionati.length === 0) {
      alert(lingua === "italiano" ? "Seleziona almeno un servizio o prodotto." : "Select at least one service or product.");
      return;
    }
    // CR: Qui in futuro si aprirà la pagina di ordine con spedizione/ritiro e pagamento
    alert(lingua === "italiano" 
      ? "Funzionalità di ordine in fase di sviluppo.\nTotale: " + getTotale().toFixed(2) + " €" 
      : "Order functionality under development.\nTotal: " + getTotale().toFixed(2) + " €"
    );
  };

  return (
    <>
      <Header />

      <div className="main-content" />

      <CatalogoContainer>
        {/* Titolo */}
        <center>
          <h2 style={{ color: "#FFFFFF", marginBottom: "30px", fontSize: "32px" }}>
            {lingua === "italiano" ? "Catalogo Servizi e Prodotti" : "Services and Products Catalog"}
          </h2>
        </center>

        {/* Filtri */}
        <FiltroContainer>
          <FiltroButton 
            $attivo={filtroTipo === "tutti"} 
            onClick={() => setFiltroTipo("tutti")}
          >
            {lingua === "italiano" ? "Tutti" : "All"}
          </FiltroButton>
          <FiltroButton 
            $attivo={filtroTipo === "servizio"} 
            onClick={() => setFiltroTipo("servizio")}
          >
            {lingua === "italiano" ? "Servizi" : "Services"}
          </FiltroButton>
          <FiltroButton 
            $attivo={filtroTipo === "prodotto"} 
            onClick={() => setFiltroTipo("prodotto")}
          >
            {lingua === "italiano" ? "Prodotti" : "Products"}
          </FiltroButton>
        </FiltroContainer>

        {/* Griglia catalogo */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", justifyContent: "center" }}>
          {servizioState.catalogo && servizioState.catalogo.length > 0 ? (
            servizioState.catalogo.map((item) => (
              <CardCatalogo key={item.id}>
                <TipoBadge $tipo={item.tipo}>
                  {item.tipo === "prodotto" 
                    ? (lingua === "italiano" ? "Prodotto" : "Product") 
                    : (lingua === "italiano" ? "Servizio" : "Service")
                  }
                </TipoBadge>
                <NomeServizio>{item.nome}</NomeServizio>
                <Prezzo>{parseFloat(item.prezzo).toFixed(2)} €</Prezzo>
                {item.note && (
                  <p style={{ fontSize: "14px", color: "#AAA", marginBottom: "10px" }}>{item.note}</p>
                )}

                {/* Pulsanti incremento/decremento quantità */}
                <QuantitaContainer>
                  <QuantitaButton 
                    onClick={() => decrementa(item.id)} 
                    disabled={(quantita[item.id] || 0) === 0}
                  >
                    −
                  </QuantitaButton>
                  <QuantitaDisplay>{quantita[item.id] || 0}</QuantitaDisplay>
                  <QuantitaButton onClick={() => incrementa(item.id)}>
                    +
                  </QuantitaButton>
                </QuantitaContainer>
              </CardCatalogo>
            ))
          ) : (
            <p style={{ color: "#FFFFFF", fontSize: "20px" }}>
              {lingua === "italiano" ? "Nessun elemento trovato nel catalogo." : "No items found in catalog."}
            </p>
          )}
        </div>

        {/* Riepilogo e azioni */}
        {getTotale() > 0 && (
          <RiepilogoContainer>
            <h3 style={{ marginBottom: "10px" }}>
              {lingua === "italiano" ? "Riepilogo" : "Summary"}
            </h3>
            {getItemsSelezionati().map((item) => (
              <p key={item.id} style={{ fontSize: "18px", margin: "5px 0" }}>
                {item.nome} x {quantita[item.id]} = {(item.prezzo * quantita[item.id]).toFixed(2)} €
              </p>
            ))}
            <TotaleText>
              {lingua === "italiano" ? "Totale" : "Total"}: {getTotale().toFixed(2)} €
            </TotaleText>
            <AzioniContainer>
              <ButtonPrenota onClick={handlePrenota}>
                {lingua === "italiano" ? "Prenota" : "Book"}
              </ButtonPrenota>
              <ButtonOrdina onClick={handleOrdina}>
                {lingua === "italiano" ? "Ordina" : "Order"}
              </ButtonOrdina>
            </AzioniContainer>
          </RiepilogoContainer>
        )}
      </CatalogoContainer>

      <br /><br /><br />
    </>
  );
};

export default Catalogo;