// React e Redux
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
// Views
import HeaderCliente from "../components/HeaderCliente";
// Actions
import { CarrelloActions } from "../../actions/CarrelloActions";

/*** Styled Components ***/

const CheckoutContainer = styled.div`
  margin-top: 40px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 5%;
`;

const Titolo = styled.h2`
  color: #FFFFFF;
  margin-bottom: 30px;
  font-size: 32px;
  text-align: center;
`;

const Sezione = styled.div`
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 16px;
  padding: 25px;
  color: #FFFFFF;
  margin-bottom: 20px;
`;

const SezioneTitolo = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  color: #0050EF;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
  color: #CCC;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  border: 2px solid #333;
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-size: 16px;
  box-sizing: border-box;
  transition: 0.3s all ease-out;
  &:focus {
    border-color: #0050EF;
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 15px;
  border-radius: 10px;
  border: 2px solid #333;
  background-color: rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  font-size: 16px;
  min-height: 80px;
  box-sizing: border-box;
  resize: vertical;
  transition: 0.3s all ease-out;
  &:focus {
    border-color: #0050EF;
    outline: none;
  }
`;

const OpzioniContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const OpzioneButton = styled.button`
  border-radius: 12px;
  border: 2px solid ${props => props.$attivo ? '#0050EF' : '#555'};
  background-color: ${props => props.$attivo ? 'rgba(0, 80, 239, 0.2)' : 'transparent'};
  color: ${props => props.$attivo ? '#0050EF' : '#AAA'};
  padding: 12px 20px;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: 0.3s all ease-out;
  flex: 1;
  min-width: 150px;
  &:hover {
    border-color: #0050EF;
    color: #0050EF;
  }
`;

const RiepilogoRiga = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TotaleFinale = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 12px;
  border-top: 2px solid #0050EF;
  font-size: 24px;
  font-weight: bold;
`;

const TotaleValore = styled.span`
  color: #0050EF;
`;

const ButtonConferma = styled.button`
  width: 100%;
  border-radius: 40px;
  border: none;
  background-color: #0050EF;
  color: #FFFFFF;
  padding: 15px;
  cursor: pointer;
  font-weight: bold;
  font-size: 20px;
  margin-top: 25px;
  transition: 0.3s all ease-out;
  &:hover {
    background-color: #003BB5;
  }
  &:disabled {
    background-color: #333;
    cursor: not-allowed;
  }
`;

const ButtonIndietro = styled.button`
  width: 100%;
  border-radius: 40px;
  border: 2px solid #555;
  background-color: transparent;
  color: #AAA;
  padding: 12px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
  transition: 0.3s all ease-out;
  &:hover {
    border-color: #FFFFFF;
    color: #FFFFFF;
  }
`;

const ErroreText = styled.p`
  color: #FF4444;
  font-size: 14px;
  margin-top: 5px;
`;

/*** Componente Checkout ***/

const Checkout = () => {
  const carrelloActions = new CarrelloActions();
  const navigate = useNavigate();
  const { tipoLavoro } = useParams(); // 'ordine' o 'prenotazione' dall'URL

  const carrelloState = useSelector((state) => state.carrello.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const lingua = attivitaState.lingua;

  const items = carrelloState.items;
  const isOrdine = tipoLavoro === "ordine";
  const isPrenotazione = tipoLavoro === "prenotazione";

  // Se il carrello è vuoto, redirect al catalogo
  if (items.length === 0) {
    return (
      <>
        <HeaderCliente />
        <div className="main-content" />
        <CheckoutContainer>
          <Titolo>{lingua === "italiano" ? "Carrello vuoto" : "Cart is empty"}</Titolo>
          <p style={{ color: "#FFFFFF", textAlign: "center", fontSize: "18px" }}>
            {lingua === "italiano"
              ? "Non hai articoli nel carrello. Torna al catalogo per aggiungerne."
              : "You have no items in your cart. Go back to the catalog to add some."
            }
          </p>
          <ButtonConferma onClick={() => navigate('/catalogo')}>
            {lingua === "italiano" ? "Vai al Catalogo" : "Go to Catalog"}
          </ButtonConferma>
        </CheckoutContainer>
      </>
    );
  }

  // Form state
  const [nomeCliente, setNomeCliente] = useState("");
  const [metodoPagamento, setMetodoPagamento] = useState("");
  const [tipoRitiro, setTipoRitiro] = useState("");
  const [indirizzoSpedizione, setIndirizzoSpedizione] = useState("");
  const [dataPrenotazione, setDataPrenotazione] = useState("");
  const [oraPrenotazione, setOraPrenotazione] = useState("");
  const [note, setNote] = useState("");
  const [errori, setErrori] = useState({});
  const [invioInCorso, setInvioInCorso] = useState(false);

  const getTotale = () => {
    let totale = 0;
    for (const item of items) {
      totale += item.prezzo * item.quantita;
    }
    return totale;
  };

  const validaForm = () => {
    const nuoviErrori = {};

    if (!nomeCliente.trim()) {
      nuoviErrori.nomeCliente = lingua === "italiano" ? "Inserisci il tuo nome." : "Enter your name.";
    }
    if (!metodoPagamento) {
      nuoviErrori.metodoPagamento = lingua === "italiano" ? "Seleziona un metodo di pagamento." : "Select a payment method.";
    }
    if (isOrdine && !tipoRitiro) {
      nuoviErrori.tipoRitiro = lingua === "italiano" ? "Seleziona la modalità di ritiro." : "Select pickup method.";
    }
    if (isOrdine && tipoRitiro === "spedizione" && !indirizzoSpedizione.trim()) {
      nuoviErrori.indirizzoSpedizione = lingua === "italiano" ? "Inserisci l'indirizzo di spedizione." : "Enter the shipping address.";
    }
    if (isPrenotazione && !dataPrenotazione) {
      nuoviErrori.dataPrenotazione = lingua === "italiano" ? "Seleziona una data per la prenotazione." : "Select a booking date.";
    }
    if (isPrenotazione && !oraPrenotazione) {
      nuoviErrori.oraPrenotazione = lingua === "italiano" ? "Seleziona un orario per la prenotazione." : "Select a booking time.";
    }

    setErrori(nuoviErrori);
    return Object.keys(nuoviErrori).length === 0;
  };

  const handleConferma = async (e) => {
    e.preventDefault();
    if (!validaForm()) return;

    const conferma = confirm(
      lingua === "italiano"
        ? `Confermi ${isOrdine ? "l'ordine" : "la prenotazione"} per un totale di ${getTotale().toFixed(2)} €?`
        : `Confirm the ${isOrdine ? "order" : "booking"} for a total of ${getTotale().toFixed(2)} €?`
    );
    if (!conferma) return;

    setInvioInCorso(true);

    const datiCheckout = {
      tipo_lavoro: tipoLavoro,
      cliente: nomeCliente.trim(),
      id_cliente: null, // CR: sarà valorizzato con il login cliente
      metodo_pagamento: metodoPagamento,
      tipo_ritiro: isOrdine ? tipoRitiro : null,
      indirizzo_spedizione: (isOrdine && tipoRitiro === "spedizione") ? indirizzoSpedizione.trim() : null,
      data_prenotazione: isPrenotazione ? dataPrenotazione : null,
      ora_prenotazione: isPrenotazione ? oraPrenotazione : null,
      items: items,
      totale: getTotale(),
      note: note.trim(),
    };

    const risultato = await carrelloActions.checkout(datiCheckout, lingua);
    setInvioInCorso(false);

    if (risultato.success) {
      navigate('/catalogo');
    }
  };

  const opzioniPagamento = isOrdine
    ? [
        { key: "online", label: lingua === "italiano" ? "Paga Online" : "Pay Online" },
        { key: "in_struttura", label: lingua === "italiano" ? "Paga in Struttura" : "Pay at Location" },
        { key: "al_corriere", label: lingua === "italiano" ? "Paga al Corriere" : "Pay on Delivery" },
      ]
    : [
        { key: "online", label: lingua === "italiano" ? "Paga Online" : "Pay Online" },
        { key: "in_struttura", label: lingua === "italiano" ? "Paga in Struttura" : "Pay at Location" },
      ];

  return (
    <>
      <HeaderCliente />
      <div className="main-content" />

      <CheckoutContainer>
        <Titolo>
          {isOrdine
            ? (lingua === "italiano" ? "Checkout Ordine" : "Order Checkout")
            : (lingua === "italiano" ? "Checkout Prenotazione" : "Booking Checkout")
          }
        </Titolo>

        {/* Dati Cliente */}
        <Sezione>
          <SezioneTitolo>{lingua === "italiano" ? "I tuoi Dati" : "Your Details"}</SezioneTitolo>
          <FormGroup>
            <Label>{lingua === "italiano" ? "Nome e Cognome *" : "Full Name *"}</Label>
            <Input
              type="text"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              placeholder={lingua === "italiano" ? "Es. Mario Rossi" : "E.g. John Smith"}
            />
            {errori.nomeCliente && <ErroreText>{errori.nomeCliente}</ErroreText>}
          </FormGroup>
        </Sezione>

        {/* Data e Ora Prenotazione */}
        {isPrenotazione && (
          <Sezione>
            <SezioneTitolo>{lingua === "italiano" ? "Data e Ora Prenotazione" : "Booking Date and Time"}</SezioneTitolo>
            <FormGroup>
              <Label>{lingua === "italiano" ? "Data *" : "Date *"}</Label>
              <Input type="date" value={dataPrenotazione} onChange={(e) => setDataPrenotazione(e.target.value)} min={new Date().toISOString().split('T')[0]} />
              {errori.dataPrenotazione && <ErroreText>{errori.dataPrenotazione}</ErroreText>}
            </FormGroup>
            <FormGroup>
              <Label>{lingua === "italiano" ? "Ora *" : "Time *"}</Label>
              <Input type="time" value={oraPrenotazione} onChange={(e) => setOraPrenotazione(e.target.value)} />
              {errori.oraPrenotazione && <ErroreText>{errori.oraPrenotazione}</ErroreText>}
            </FormGroup>
          </Sezione>
        )}

        {/* Modalità Ritiro (solo ordini) */}
        {isOrdine && (
          <Sezione>
            <SezioneTitolo>{lingua === "italiano" ? "Modalità di Ritiro" : "Pickup Method"}</SezioneTitolo>
            <OpzioniContainer>
              <OpzioneButton $attivo={tipoRitiro === "ritiro_in_struttura"} onClick={() => setTipoRitiro("ritiro_in_struttura")}>
                {lingua === "italiano" ? "Ritiro in Struttura" : "Pickup at Location"}
              </OpzioneButton>
              <OpzioneButton $attivo={tipoRitiro === "spedizione"} onClick={() => setTipoRitiro("spedizione")}>
                {lingua === "italiano" ? "Spedizione a Domicilio" : "Home Delivery"}
              </OpzioneButton>
            </OpzioniContainer>
            {errori.tipoRitiro && <ErroreText>{errori.tipoRitiro}</ErroreText>}

            {tipoRitiro === "spedizione" && (
              <FormGroup style={{ marginTop: "15px" }}>
                <Label>{lingua === "italiano" ? "Indirizzo di Spedizione *" : "Shipping Address *"}</Label>
                <TextArea
                  value={indirizzoSpedizione}
                  onChange={(e) => setIndirizzoSpedizione(e.target.value)}
                  placeholder={lingua === "italiano" ? "Via, CAP, Città, Provincia" : "Street, ZIP, City, State"}
                />
                {errori.indirizzoSpedizione && <ErroreText>{errori.indirizzoSpedizione}</ErroreText>}
              </FormGroup>
            )}
          </Sezione>
        )}

        {/* Metodo di Pagamento */}
        <Sezione>
          <SezioneTitolo>{lingua === "italiano" ? "Metodo di Pagamento" : "Payment Method"}</SezioneTitolo>
          <OpzioniContainer>
            {opzioniPagamento.map((opzione) => (
              <OpzioneButton key={opzione.key} $attivo={metodoPagamento === opzione.key} onClick={() => setMetodoPagamento(opzione.key)}>
                {opzione.label}
              </OpzioneButton>
            ))}
          </OpzioniContainer>
          {errori.metodoPagamento && <ErroreText>{errori.metodoPagamento}</ErroreText>}
        </Sezione>

        {/* Note */}
        <Sezione>
          <SezioneTitolo>{lingua === "italiano" ? "Note (facoltativo)" : "Notes (optional)"}</SezioneTitolo>
          <TextArea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={lingua === "italiano" ? "Aggiungi note o richieste speciali..." : "Add notes or special requests..."}
          />
        </Sezione>

        {/* Riepilogo */}
        <Sezione>
          <SezioneTitolo>{lingua === "italiano" ? "Riepilogo" : "Summary"}</SezioneTitolo>
          {items.map((item) => (
            <RiepilogoRiga key={item.id}>
              <span>{item.nome} x {item.quantita}</span>
              <span style={{ fontWeight: "bold" }}>{(item.prezzo * item.quantita).toFixed(2)} €</span>
            </RiepilogoRiga>
          ))}
          <TotaleFinale>
            <span>{lingua === "italiano" ? "Totale" : "Total"}</span>
            <TotaleValore>{getTotale().toFixed(2)} €</TotaleValore>
          </TotaleFinale>
        </Sezione>

        {/* Bottoni */}
        <ButtonConferma onClick={handleConferma} disabled={invioInCorso}>
          {invioInCorso
            ? (lingua === "italiano" ? "Invio in corso..." : "Submitting...")
            : isOrdine
              ? (lingua === "italiano" ? "Conferma Ordine" : "Confirm Order")
              : (lingua === "italiano" ? "Conferma Prenotazione" : "Confirm Booking")
          }
        </ButtonConferma>

        <ButtonIndietro onClick={() => navigate('/carrello')}>
          {lingua === "italiano" ? "← Torna al Carrello" : "← Back to Cart"}
        </ButtonIndietro>
      </CheckoutContainer>

      <br /><br /><br />
    </>
  );
};

export default Checkout;