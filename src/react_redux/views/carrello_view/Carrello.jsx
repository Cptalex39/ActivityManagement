// React e Redux
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// Views
import HeaderCliente from "../components/HeaderCliente";
// Actions
import { CarrelloActions } from "../../actions/CarrelloActions";

/*** Styled Components ***/

const CarrelloContainer = styled.div`
  margin-left: 5%;
  margin-right: 5%;
  margin-top: 40px;
`;

const Titolo = styled.h2`
  color: #FFFFFF;
  margin-bottom: 30px;
  font-size: 32px;
  text-align: center;
`;

const CarrelloVuoto = styled.p`
  color: #FFFFFF;
  font-size: 20px;
  text-align: center;
  margin-top: 60px;
`;

const ItemCard = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  padding: 20px 25px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
  transition: 0.3s all ease-out;
  &:hover {
    border: 1px solid #0050EF;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemNome = styled.h4`
  font-size: 20px;
  margin: 0 0 5px 0;
`;

const ItemDettaglio = styled.p`
  font-size: 14px;
  color: #AAA;
  margin: 0;
`;

const TipoBadge = styled.span`
  display: inline-block;
  background-color: ${props => props.$tipo === 'prodotto' ? '#FF6B00' : '#0050EF'};
  color: #FFFFFF;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  margin-left: 10px;
`;

const QuantitaContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 30px;
`;

const QuantitaButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #0050EF;
  background-color: transparent;
  color: #0050EF;
  font-size: 20px;
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
`;

const QuantitaDisplay = styled.span`
  font-size: 20px;
  font-weight: bold;
  min-width: 30px;
  text-align: center;
  color: #FFFFFF;
`;

const PrezzoItem = styled.div`
  text-align: right;
  min-width: 120px;
`;

const PrezzoUnitario = styled.p`
  font-size: 14px;
  color: #AAA;
  margin: 0;
`;

const PrezzoTotale = styled.p`
  font-size: 20px;
  font-weight: bold;
  color: #0050EF;
  margin: 0;
`;

const RimuoviButton = styled.button`
  background: transparent;
  border: none;
  color: #FF4444;
  font-size: 22px;
  cursor: pointer;
  margin-left: 15px;
  transition: 0.3s all ease-out;
  &:hover {
    color: #FF0000;
    transform: scale(1.2);
  }
`;

const RiepilogoBox = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 20px;
  padding: 30px;
  color: #FFFFFF;
  margin-top: 30px;
  margin-bottom: 40px;
`;

const RiepilogoRiga = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  &:last-of-type {
    border-bottom: none;
  }
`;

const TotaleFinale = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #0050EF;
`;

const TotaleLabel = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

const TotaleValore = styled.span`
  font-size: 28px;
  font-weight: bold;
  color: #0050EF;
`;

const AzioniContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
`;

const ButtonPrimario = styled.button`
  border-radius: 40px;
  border: none;
  background-color: #0050EF;
  color: #FFFFFF;
  padding: 12px 35px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #003BB5;
  }
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const ButtonSecondario = styled.button`
  border-radius: 40px;
  border: none;
  background-color: #FF6B00;
  color: #FFFFFF;
  padding: 12px 35px;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #CC5500;
  }
`;

const ButtonSvuota = styled.button`
  border-radius: 40px;
  border: 2px solid #FF4444;
  background-color: transparent;
  color: #FF4444;
  padding: 10px 25px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #FF4444;
    color: #FFFFFF;
  }
`;

const ContatoreBadge = styled.span`
  background-color: #0050EF;
  color: #FFFFFF;
  border-radius: 50%;
  padding: 2px 8px;
  font-size: 14px;
  margin-left: 8px;
`;

/*** Componente Carrello ***/

const Carrello = () => {
  const carrelloActions = new CarrelloActions();
  const navigate = useNavigate();
  const carrelloState = useSelector((state) => state.carrello.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const lingua = attivitaState.lingua;

  const items = carrelloState.items;

  const getTotale = () => {
    let totale = 0;
    for (const item of items) {
      totale += item.prezzo * item.quantita;
    }
    return totale;
  };

  const getNumeroItems = () => {
    let count = 0;
    for (const item of items) {
      count += item.quantita;
    }
    return count;
  };

  const handleSvuota = () => {
    if (confirm(lingua === "italiano" ? "Sei sicuro di voler svuotare il carrello?" : "Are you sure you want to empty the cart?")) {
      carrelloActions.svuotaCarrello();
    }
  };

  const handleProcediPrenotazione = () => {
    carrelloActions.impostaTipoLavoro("prenotazione");
    navigate('/checkout/prenotazione');
  };

  const handleProcediOrdine = () => {
    carrelloActions.impostaTipoLavoro("ordine");
    navigate('/checkout/ordine');
  };

  return (
    <>
      <HeaderCliente />
      <div className="main-content" />

      <CarrelloContainer>
        <Titolo>
          {lingua === "italiano" ? "Il tuo Carrello" : "Your Cart"}
          {items.length > 0 && <ContatoreBadge>{getNumeroItems()}</ContatoreBadge>}
        </Titolo>

        {items.length === 0 ? (
          <>
            <CarrelloVuoto>
              {lingua === "italiano"
                ? "Il carrello è vuoto. Torna al catalogo per aggiungere servizi o prodotti."
                : "The cart is empty. Go back to the catalog to add services or products."
              }
            </CarrelloVuoto>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <ButtonPrimario onClick={() => navigate('/catalogo')}>
                {lingua === "italiano" ? "Vai al Catalogo" : "Go to Catalog"}
              </ButtonPrimario>
            </div>
          </>
        ) : (
          <>
            {items.map((item) => (
              <ItemCard key={item.id}>
                <ItemInfo>
                  <ItemNome>
                    {item.nome}
                    <TipoBadge $tipo={item.tipo}>
                      {item.tipo === "prodotto"
                        ? (lingua === "italiano" ? "Prodotto" : "Product")
                        : (lingua === "italiano" ? "Servizio" : "Service")
                      }
                    </TipoBadge>
                  </ItemNome>
                  {item.note && <ItemDettaglio>{item.note}</ItemDettaglio>}
                </ItemInfo>

                <QuantitaContainer>
                  <QuantitaButton onClick={() => carrelloActions.decrementaQuantita(item.id)}>
                    −
                  </QuantitaButton>
                  <QuantitaDisplay>{item.quantita}</QuantitaDisplay>
                  <QuantitaButton onClick={() => carrelloActions.incrementaQuantita(item.id)}>
                    +
                  </QuantitaButton>
                </QuantitaContainer>

                <PrezzoItem>
                  <PrezzoUnitario>{parseFloat(item.prezzo).toFixed(2)} € / {lingua === "italiano" ? "unità" : "unit"}</PrezzoUnitario>
                  <PrezzoTotale>{(item.prezzo * item.quantita).toFixed(2)} €</PrezzoTotale>
                </PrezzoItem>

                <RimuoviButton onClick={() => carrelloActions.rimuoviDalCarrello(item.id)} title={lingua === "italiano" ? "Rimuovi" : "Remove"}>
                  ✕
                </RimuoviButton>
              </ItemCard>
            ))}

            <RiepilogoBox>
              <h3 style={{ marginBottom: "15px", fontSize: "22px" }}>
                {lingua === "italiano" ? "Riepilogo Ordine" : "Order Summary"}
              </h3>
              {items.map((item) => (
                <RiepilogoRiga key={item.id}>
                  <span>{item.nome} x {item.quantita}</span>
                  <span style={{ color: "#0050EF", fontWeight: "bold" }}>
                    {(item.prezzo * item.quantita).toFixed(2)} €
                  </span>
                </RiepilogoRiga>
              ))}
              <TotaleFinale>
                <TotaleLabel>{lingua === "italiano" ? "Totale" : "Total"}</TotaleLabel>
                <TotaleValore>{getTotale().toFixed(2)} €</TotaleValore>
              </TotaleFinale>

              <AzioniContainer>
                <ButtonPrimario onClick={handleProcediPrenotazione}>
                  {lingua === "italiano" ? "Prenota" : "Book"}
                </ButtonPrimario>
                <ButtonSecondario onClick={handleProcediOrdine}>
                  {lingua === "italiano" ? "Ordina" : "Order"}
                </ButtonSecondario>
              </AzioniContainer>

              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <ButtonSvuota onClick={handleSvuota}>
                  {lingua === "italiano" ? "Svuota Carrello" : "Empty Cart"}
                </ButtonSvuota>
              </div>
            </RiepilogoBox>
          </>
        )}
      </CarrelloContainer>

      <br /><br /><br />
    </>
  );
};

export default Carrello;