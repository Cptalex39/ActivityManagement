// React e Redux
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// Views
import HeaderCliente from "../components/HeaderCliente";
// Actions
import { ServizioActions } from "../../actions/ServizioActions";
import { CarrelloActions } from "../../actions/CarrelloActions";

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

const AggiungiButton = styled.button`
  border-radius: 40px;
  border: none;
  background-color: #0050EF;
  color: #FFFFFF;
  padding: 8px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: 0.3s all ease-out;
  margin-top: 10px;
  &:hover {
    background-color: #003BB5;
  }
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const CarrelloFloatingButton = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  background-color: #0050EF;
  color: #FFFFFF;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 80, 239, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s all ease-out;
  z-index: 1000;
  &:hover {
    background-color: #003BB5;
    transform: scale(1.1);
  }
`;

const CarrelloBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #FF4444;
  color: #FFFFFF;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuccessoMessaggio = styled.span`
  color: #00CC66;
  font-size: 14px;
  font-weight: bold;
  display: block;
  margin-top: 5px;
`;

/*** Componente Catalogo ***/

const Catalogo = () => {
  const servizioActions = new ServizioActions();
  const carrelloActions = new CarrelloActions();
  const navigate = useNavigate();

  const servizioState = useSelector((state) => state.servizio.value);
  const carrelloState = useSelector((state) => state.carrello.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const lingua = attivitaState.lingua;

  const [filtroTipo, setFiltroTipo] = useState("tutti");
  const [quantita, setQuantita] = useState({});
  const [aggiuntoFeedback, setAggiuntoFeedback] = useState({});

  useEffect(() => {
    servizioActions.getCatalogo(filtroTipo, lingua);
  }, [filtroTipo]);

  const incrementa = (id) => {
    setQuantita(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decrementa = (id) => {
    setQuantita(prev => ({ ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) }));
  };

  const handleAggiungiAlCarrello = (item) => {
    const qta = quantita[item.id] || 0;
    if (qta <= 0) {
      alert(lingua === "italiano" ? "Seleziona una quantità maggiore di 0." : "Select a quantity greater than 0.");
      return;
    }
    carrelloActions.aggiungiAlCarrello(item, qta);
    setQuantita(prev => ({ ...prev, [item.id]: 0 }));
    setAggiuntoFeedback(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAggiuntoFeedback(prev => ({ ...prev, [item.id]: false }));
    }, 2000);
  };

  const getNumeroItemsCarrello = () => {
    let count = 0;
    for (const item of carrelloState.items) {
      count += item.quantita;
    }
    return count;
  };

  return (
    <>
      <HeaderCliente />

      <div className="main-content" />

      <CatalogoContainer>
        <center>
          <h2 style={{ color: "#FFFFFF", marginBottom: "30px", fontSize: "32px" }}>
            {lingua === "italiano" ? "Catalogo Servizi e Prodotti" : "Services and Products Catalog"}
          </h2>
        </center>

        <FiltroContainer>
          <FiltroButton $attivo={filtroTipo === "tutti"} onClick={() => setFiltroTipo("tutti")}>
            {lingua === "italiano" ? "Tutti" : "All"}
          </FiltroButton>
          <FiltroButton $attivo={filtroTipo === "servizio"} onClick={() => setFiltroTipo("servizio")}>
            {lingua === "italiano" ? "Servizi" : "Services"}
          </FiltroButton>
          <FiltroButton $attivo={filtroTipo === "prodotto"} onClick={() => setFiltroTipo("prodotto")}>
            {lingua === "italiano" ? "Prodotti" : "Products"}
          </FiltroButton>
        </FiltroContainer>

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
                <QuantitaContainer>
                  <QuantitaButton onClick={() => decrementa(item.id)} disabled={(quantita[item.id] || 0) === 0}>
                    −
                  </QuantitaButton>
                  <QuantitaDisplay>{quantita[item.id] || 0}</QuantitaDisplay>
                  <QuantitaButton onClick={() => incrementa(item.id)}>
                    +
                  </QuantitaButton>
                </QuantitaContainer>
                <AggiungiButton onClick={() => handleAggiungiAlCarrello(item)} disabled={(quantita[item.id] || 0) === 0}>
                  {lingua === "italiano" ? "Aggiungi al Carrello" : "Add to Cart"}
                </AggiungiButton>
                {aggiuntoFeedback[item.id] && (
                  <SuccessoMessaggio>
                    {lingua === "italiano" ? "Aggiunto!" : "Added!"}
                  </SuccessoMessaggio>
                )}
              </CardCatalogo>
            ))
          ) : (
            <p style={{ color: "#FFFFFF", fontSize: "20px" }}>
              {lingua === "italiano" ? "Nessun elemento trovato nel catalogo." : "No items found in catalog."}
            </p>
          )}
        </div>
      </CatalogoContainer>

      {carrelloState.items.length > 0 && (
        <CarrelloFloatingButton onClick={() => navigate('/carrello')}>
          🛒
          <CarrelloBadge>{getNumeroItemsCarrello()}</CarrelloBadge>
        </CarrelloFloatingButton>
      )}

      <br /><br /><br />
    </>
  );
};

export default Catalogo;