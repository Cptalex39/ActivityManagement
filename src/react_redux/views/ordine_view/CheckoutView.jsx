import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { OrdineActions } from "../../actions/OrdineActions";
import { CarrelloActions } from "../../actions/CarrelloActions";
import { CartaActions } from "../../actions/CartaActions";
import { AutenticazioneActions } from "../../actions/AutenticazioneActions";
import { AttivitaActions } from "../../actions/AttivitaActions";
import { controlloOrdine, controlloCarta } from "../../../utils/Controlli";

const CheckoutView = () => {
  const navigate = useNavigate();
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const carrelloState = useSelector((state) => state.carrello.value);
  const cartaState = useSelector((state) => state.carta.value);
  const autenticazioneActions = new AutenticazioneActions();
  const ordineActions = new OrdineActions();
  const carrelloActions = new CarrelloActions();
  const cartaActions = new CartaActions();
  const attivitaActions = new AttivitaActions();

  const dataAttuale = new Date();
  
  const [idCartaSelezionata, setIdCartaSelezionata] = useState(0);

  const [nuovaCartaSelezionata, setNuovaCartaSelezionata] = useState(false);

  const [numeroOrdini, setNumeroOrdini] = useState(null); 

  const [indiceTrattinoInt1, setIndiceTrattinoInt1] = useState(-1);
  const [indiceTrattinoInt2, setIndiceTrattinoInt2] = useState(-1);
  const [minInt1, setMinInt1] = useState(-1);
  const [maxInt1, setMaxInt1] = useState(-1);
  const [minInt2, setMinInt2] = useState(-1);
  const [maxInt2, setMaxInt2] = useState(-1);
  const [numeroClienti, setNumeroClienti] = useState(-1);


  const [nuovoOrdine, setNuovoOrdine] = useState({
    tipo_item: "ordine", 
    codice: "", 
    data_creazione: "", 
    items: "", 
    metodo_pagamento: "", 
    data_prenotazione: null, 
    ora_prenotazione: null, 
    indirizzo: autenticazioneState.indirizzo, 
    indirizzo_attuale: autenticazioneState.indirizzo, 
    numero_carta: null, 
    id_cliente: autenticazioneState.id_utente, 
  })

  const [datiNuovaCarta, setDatiNuovaCarta] = useState({
    tipo_item: "carta",
    numero: "", 
    mese_scadenza: "",
    anno_scadenza: "",  
    cvv_cvs: "", 
    nome_titolare: "", 
    is_visa: false, 
    is_mastercard: false,
    id_cliente: autenticazioneState.id_utente, 
    errore_data_scadenza: null,
    errore_circuito: null,
    errore_numero: null,
    errore_cvv_cvs: null,
    errore_nome_titolare: null,
  });

  const [isButtonVisaSelected, setIsButtonVisaSelected] = useState(false);
  const [isButtonMastercardSelected, setIsButtonMastercardSelected] = useState(false);

  const isVisa = () => {
    setIsButtonVisaSelected(!isButtonVisaSelected);
    setIsButtonMastercardSelected(false);
    setDatiNuovaCarta(prevState => ({
      ...prevState, 
      is_visa: !isButtonVisaSelected,
      is_mastercard: false, 
    }));
  };
  const isMastercard = () => {
    setIsButtonMastercardSelected(!isButtonMastercardSelected);
    setIsButtonVisaSelected(false);
    setDatiNuovaCarta(prevState => ({
      ...prevState, 
      is_visa: false,
      is_mastercard: !isButtonMastercardSelected, 
    }));  
  }

  // Calcolo del totale
  const totale = carrelloState.items.reduce((sum, item) => sum + (item.prezzo * item.quantita), 0);

  const getCodice = () => {
    const date = new Date();
    return date.getFullYear()+"-"+(date.getMonth()+1).toString().padStart(2,'0')+"-"+date.getDate().toString().padStart(2,'0')+
           "_" + date.getHours().toString().padStart(2,'0')+":"+date.getMinutes().toString().padStart(2,'0')+
           ":"+date.getSeconds().toString().padStart(2,'0')+":" + date.getMilliseconds();
  }

  // Funzione di conferma ordine con validazioni
  const confermaOrdine = async () => {
    if(nuovaCartaSelezionata) {
      const risultatoControllo = controlloCarta(datiNuovaCarta);
      setDatiNuovaCarta(risultatoControllo);
      
      if(risultatoControllo.num_errori > 0) {
        return;
      }
    }

    if(!controlloOrdine(nuovoOrdine)) {
      return;
    }
    
    let ordineCompleto = {
      ...nuovoOrdine,
      items: JSON.stringify(carrelloState.items.map(item => ({ ...item }))),
      totale: totale, 
      numero_clienti: numeroClienti
    };

    const response = await ordineActions.inserimentoOrdine(ordineCompleto);
   
    if(response.isOK && response.problema) {
      alert("Errore, l'orario selezionato non è più disponibile. Selezionare un altro orario.");
      return;
    }
     
    if(response.isOK && ordineCompleto.indirizzo !== ordineCompleto.indirizzo_attuale) {
      autenticazioneActions.aggiornaIndirizzo(nuovoOrdine.indirizzo);
    }
       
    await carrelloActions.svuotaCarrello();
       
    navigate("/conferma-ordine");
    /*
    */
  };

  const tornaPaginaNuovoOrdine = () => {
    navigate("/nuovo-ordine")
  }

  const selezionaCarta = (idCarta, numeroCarta) => {
    setNuovaCartaSelezionata(false);
    setIdCartaSelezionata(idCarta === idCartaSelezionata ? 0 : idCarta);
    setNuovoOrdine(prevState => ({
      ...prevState, 
      numero_carta: idCarta === idCartaSelezionata ? "" : numeroCarta.slice(-4)
    }));
  }

  const labelStyle = {
    display: "block",
    fontSize: "28px",
    fontWeight: "900",
    marginBottom: "15px",
    color: "white",
    textTransform: "uppercase"
  };

  const inputStyle = {
    width: "100%",
    maxWidth: "750px",
    padding: "25px",
    fontSize: "26px",
    borderRadius: "15px",
    border: "3px solid #ccc",
    marginBottom: "35px",
    boxSizing: "border-box",
    color: "black",
    fontWeight: "bold"
  };

  const sectionStyle = {
    background: "rgba(255,255,255,0.08)",
    padding: "45px",
    borderRadius: "25px",
    marginBottom: "40px",
    maxWidth: "850px",
    border: "1px solid rgba(255,255,255,0.2)"
  };

  const buttonActionStyle = {
    padding: "20px 35px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "20px",
    transition: "0.2s opacity"
  };

  useEffect(() => {
    cartaActions.ottenimentoCarteCliente(autenticazioneState.id_utente);
  }, []);

useEffect(() => {
  const caricaDati = async () => {
    try {
      let result = await attivitaActions.ottieniDatiAttivita();
      
      // Calcoliamo gli indici localmente per usarli subito
      const idx1 = result.primo_intervallo ? result.primo_intervallo.indexOf('-') : -1;
      const idx2 = result.secondo_intervallo ? result.secondo_intervallo.indexOf('-') : -1;

      setIndiceTrattinoInt1(idx1);
      setIndiceTrattinoInt2(idx2);

      setMinInt1(result.primo_intervallo && idx1 !== -1 ? result.primo_intervallo.slice(0, idx1) : -1);
      setMaxInt1(result.primo_intervallo && idx1 !== -1 ? result.primo_intervallo.slice(idx1 + 1) : -1);
      setMinInt2(result.secondo_intervallo && idx2 !== -1 ? result.secondo_intervallo.slice(0, idx2) : -1);
      setMaxInt2(result.secondo_intervallo && idx2 !== -1 ? result.secondo_intervallo.slice(idx2 + 1) : -1);
      setNumeroClienti(result.numero_clienti)
    } 
    catch (error) {
      console.error("Errore nel caricamento:", error);
    }
  };

  caricaDati();
}, []);

  return (
    <>
      <Header />      

      <div className="main-content" />

      <div style={{ color: "white", marginTop: "50px", paddingBottom: "120px", fontFamily: "sans-serif" }}>
        <h3 style={{ fontSize: "64px", fontWeight: "900", marginBottom: "50px", textTransform: "uppercase" }}>
          Checkout
        </h3>

        <div style={{ ...sectionStyle, background: "white", color: "black" }}>
          <h4 style={{ fontSize: "42px", marginTop: 0, borderBottom: "4px solid #eee", paddingBottom: "20px" }}>Riepilogo ordine</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {carrelloState.items.map((item, idx) => (
              <li key={idx} style={{ padding: "25px 0", borderBottom: "2px solid #f0f0f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: "36px" }}>{item.nome}</strong>
                  <span style={{ fontSize: "36px", color: "blue", fontWeight: "900" }}>
                    €{(item.prezzo * item.quantita).toFixed(2)}
                  </span>
                </div>
                <div style={{ fontSize: "26px", color: "#666", marginTop: "10px" }}>
                  Qtà: <strong>{item.quantita}</strong> | Unitario: €{item.prezzo.toFixed(2)}
                </div>
                <small style={{ fontSize: "20px", color: "#999", textTransform: "uppercase", fontWeight: "bold" }}>
                  {item.tipo === "Servizio" ? "Servizio in Struttura" : "Prodotto Spedibile"}
                </small>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "35px", textAlign: "right", padding: "30px", background: "#f8f9fa", borderRadius: "20px", border: "2px solid #eee" }}>
            <span style={{ fontSize: "32px", color: "#555", fontWeight: "bold" }}>TOTALE DA PAGARE:</span>
            <div style={{ fontSize: "85px", color: "#28a745", fontWeight: "900", lineHeight: "1" }}>
              €{totale.toFixed(2)}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "850px" }}>
          <p style={{ fontSize: "28px", marginBottom: "50px", color: "#4ade80", fontWeight: "bold" }}>
            🏪 I Servizi verranno eseguiti presso la nostra struttura.
          </p>

          <label style={labelStyle}>Metodo di Pagamento</label>
          <select value={nuovoOrdine.metodo_pagamento} style={inputStyle}
            onChange={(e) => setNuovoOrdine(prevState => ({
              ...prevState, 
              metodo_pagamento: e.target.value, 
            }))}
          >
            <option value="">-- Scegli come pagare --</option>
            <option value="Struttura">Pagamento in Struttura</option>
            <option value="Spedizione">Pagamento Online + Spedizione</option>
            <option value="Corriere">Pagamento alla Consegna (Corriere)</option>
          </select>

          {nuovoOrdine.metodo_pagamento === "Struttura" && (
            <div style={sectionStyle}>
              <h4 style={{ fontSize: "36px", marginTop: 0, color: "#007bff" }}>Appuntamento</h4>
              <label style={labelStyle}>Giorno</label>
              <input type="date" value={nuovoOrdine.data_prenotazione} style={inputStyle} 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  data_prenotazione: e.target.value, 
                }))}
                onBlur={async (e) => {
                  e.preventDefault();
                  const risultato = await ordineActions.ottieniNumeroOrdiniDataPerOrario({data_prenotazione: nuovoOrdine.data_prenotazione});
                  setNumeroOrdini(risultato.numero_ordini);
                }}
              />
              {(numeroOrdini) && (
                <>
                  <label style={labelStyle}>Orari</label>
                  {(parseInt(minInt1) > -1 && parseInt(maxInt1) > -1) && Array.from({ length: parseInt(maxInt1) - parseInt(minInt1) + 1 }, (_, index) => parseInt(minInt1) + index).map((i) => {
                    const orario = ("0" + i).slice(-2) + ":00";
                    console.log(orario+": "+numeroOrdini[orario]);
                    const ordiniAttuali = numeroOrdini && numeroOrdini[orario] ? numeroOrdini[orario] : 0;
                    return ordiniAttuali < parseInt(numeroClienti) ? (
                      <button 
                        key={orario} 
                        style={{ 
                          backgroundColor: (orario === nuovoOrdine.ora_prenotazione ? "#007bff" : "#FFFFFF"), 
                          color: "#000000",
                          padding: "10px 20px",
                          borderRadius: "20px",
                          margin: "5px",
                          border: "1px solid #ccc",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setNuovoOrdine(prevState => ({
                            ...prevState, 
                            ora_prenotazione: orario !== nuovoOrdine.ora_prenotazione ? orario : null,
                          }));
                        }}
                      >
                        {orario}
                      </button>
                    ) : null;
                  })}
                  {(parseInt(minInt2) > -1 && parseInt(maxInt2) > -1) && Array.from({ length: parseInt(maxInt2) - parseInt(minInt2) + 1 }, (_, index) => parseInt(minInt2) + index).map((i) => {
                    const orario = ("0" + i).slice(-2) + ":00";
                    const ordiniAttuali = numeroOrdini && numeroOrdini[orario] ? numeroOrdini[orario] : 0;
                    console.log(orario+": "+numeroOrdini[orario]);
                    return ordiniAttuali < parseInt(numeroClienti) ? (
                      <button 
                        key={orario} 
                        style={{ 
                          backgroundColor: (orario === nuovoOrdine.ora_prenotazione ? "#007bff" : "#FFFFFF"), 
                          color: "#000000",
                          padding: "10px 20px",
                          borderRadius: "20px",
                          margin: "5px",
                          border: "1px solid #ccc",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setNuovoOrdine(prevState => ({
                            ...prevState, 
                            ora_prenotazione: orario !== nuovoOrdine.ora_prenotazione ? orario : null,
                          }));
                        }}
                      >
                        {orario}
                      </button>
                    ) : null;
                  })}
                </>
              )}
            </div>
          )}

          {nuovoOrdine.metodo_pagamento === "Spedizione" && (
            <div style={sectionStyle}>
              <h4 style={{ fontSize: "36px", marginTop: 0, color: "#28a745" }}>Spedizione & Carta</h4>
              <label style={labelStyle}>Indirizzo di Consegna</label>
              <input type="text" value={nuovoOrdine.indirizzo} style={inputStyle} placeholder="Via, n°, Città, CAP" 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  indirizzo: e.target.value, 
                }))}
              />
              <label style={labelStyle}>Seleziona una carta</label>
              {cartaState.carte.map((carta, i) => {
                const dataScadenza = new Date(parseInt(carta.anno_scadenza), parseInt(carta.mese_scadenza), 1);
                return (
                  <>
                    <div key={i} style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
                      {dataScadenza < dataAttuale ? (
                        <span style={{ fontSize: "24px", color:"#FF0000", fontWeight:"bold"}}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}><br/>CARTA SCADUTA IL GIORNO: {"1/"+(parseInt(carta.mese_scadenza)+1)+"/"+carta.anno_scadenza}</small></span>
                      ) : (
                        <>
                          <span style={{ fontSize: "24px", color:"#FFFFFF", fontWeight:"bold" }}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}><br/>LA CARTA SCADE IL GIORNO: {"1/"+(parseInt(carta.mese_scadenza)+1)+"/"+carta.anno_scadenza}</small></span>
                          <button onClick={() => selezionaCarta(carta.id, carta.numero)} 
                            style={{ 
                              ...buttonActionStyle, 
                              backgroundColor: carta.id === idCartaSelezionata ? "#007BFF" : "#FFFFFF", 
                              color: "black", 
                              padding: "10px 20px", 
                              fontSize: "16px" 
                            }}
                          >
                            {carta.id === idCartaSelezionata ? "Deseleziona" : "Seleziona"}
                          </button>
                        </>
                      )}
                    </div>
                  </>
                );
              })}
              {cartaState.carte.length < 1 && (
                <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ fontSize: "24px" }}>Carte non presenti... aggiungine una nella pagina "Carte".</span>
                </div>
              )}
              <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px"}}>
                <input type="text" placeholder="Numero carta (13/16 cifre)" value={datiNuovaCarta.numero} minLength={1} maxLength={16} style={inputStyle} 
                  onChange={(e) => {
                    setNuovaCartaSelezionata(false);
                    setDatiNuovaCarta(prevState => ({
                      ...prevState, 
                      numero: e.target.value
                    }));
                  }}  
                />
                {datiNuovaCarta.errore_numero && (
                  <label style={{padding:"10px", color: "#FF0000", backgroundColor:"#000000"}}>{datiNuovaCarta.errore_numero}</label>  
                )}
                <div style={{ display: "flex", gap: "20px" }}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <select 
                      value={datiNuovaCarta.mese_scadenza} 
                      style={inputStyle}
                      onChange={(e) => setDatiNuovaCarta(prevState => ({
                        ...prevState, 
                        mese_scadenza: e.target.value 
                      }))}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const mese = i + 1;
                        const valoreFormattato = mese < 10 ? `0${mese}` : `${mese}`;
                        
                        return (
                          <option key={mese} value={valoreFormattato}>
                            {valoreFormattato}
                          </option>
                        );
                      })}
                    </select>   
                    <input type="number" placeholder="AAAA" value={datiNuovaCarta.anno_scadenza} style={inputStyle} 
                      onChange={(e) => setDatiNuovaCarta(prevState => ({
                        ...prevState, 
                        anno_scadenza: e.target.value
                      }))}  
                    />
                  </div>
                  <input type="text" placeholder="CVV / CVS" value={datiNuovaCarta.cvv_cvs} minLength={1} maxLength={3} style={inputStyle} 
                    onChange={(e) => setDatiNuovaCarta(prevState => ({
                      ...prevState, 
                      cvv_cvs: e.target.value
                    }))}  
                  />
                </div>
                {datiNuovaCarta.errore_data_scadenza && (
                  <label style={{padding:"10px", color: "#FF0000", backgroundColor:"#000000"}}>{datiNuovaCarta.errore_data_scadenza}</label>  
                )}
                {datiNuovaCarta.errore_cvv_cvs && (
                  <label style={{padding:"10px", color: "#FF0000", backgroundColor:"#000000"}}>{datiNuovaCarta.errore_cvv_cvs}</label>  
                )}
                <input type="text" placeholder="Nome titolare" value={datiNuovaCarta.nome_titolare} minLength={1} maxLength={60} style={inputStyle} 
                  onChange={(e) => setDatiNuovaCarta(prevState => ({
                    ...prevState, 
                    nome_titolare: e.target.value
                  }))}  
                />
                {datiNuovaCarta.errore_nome_titolare && (
                  <label style={{padding:"10px", color: "#FF0000", backgroundColor:"#000000"}}>{datiNuovaCarta.errore_nome_titolare}</label>  
                )}
                <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", }}>
                  <button onClick={isVisa} style={{ backgroundColor:(isButtonVisaSelected ? "#007bff" : "#FFFFFF"), color:"#000000" }}>
                    VISA
                  </button>
                  <button onClick={isMastercard} style={{ backgroundColor:(isButtonMastercardSelected ? "#007bff" : "#FFFFFF"), color:"#000000"}}>
                    MASTERCARD
                  </button>
                </div>
                {datiNuovaCarta.errore_circuito && (
                  <label style={{padding:"10px", color: "#FF0000", backgroundColor:"#000000"}}>{datiNuovaCarta.errore_circuito}</label>  
                )}
                <button 
                  style={{ ...buttonActionStyle, backgroundColor: nuovaCartaSelezionata ? "#007bff" : "#FFFFFF", color: "#000000" }}
                  onClick={() => {
                    if(!nuovaCartaSelezionata) {
                      setNuovoOrdine(prevState => ({
                        ...prevState, 
                        numero_carta: datiNuovaCarta.numero.slice(-4)
                      }));
                    }
                    setNuovaCartaSelezionata(!nuovaCartaSelezionata);
                    setIdCartaSelezionata(0);
                  }} 
                >
                  {nuovaCartaSelezionata ? "Deseleziona" : "Seleziona"}
                </button>
              </div>
            </div>
          )}

          {nuovoOrdine.metodo_pagamento === "Corriere" && (
            <div style={sectionStyle}>
              <h4 style={{ fontSize: "36px", marginTop: 0, color: "#ffc107" }}>Indirizzo Corriere</h4>
              <label style={labelStyle}>Indirizzo di Consegna</label>
              <input type="text" value={nuovoOrdine.indirizzo} style={inputStyle} placeholder="Via, n°, Città, CAP" 
                onChange={(e) => setNuovoOrdine(prevState => ({
                  ...prevState, 
                  indirizzo: e.target.value, 
                }))}
              />
            </div>
          )}

          <button
            onClick={confermaOrdine}
            style={{
              width: "100%",
              maxWidth: "750px",
              padding: "35px",
              backgroundColor: "blue",
              color: "white",
              border: "none",
              borderRadius: "20px",
              fontSize: "42px",
              fontWeight: "900",
              cursor: "pointer",
              textTransform: "uppercase",
              boxShadow: "0 15px 40px rgba(0,0,255,0.4)",
              marginTop: "30px",
              transition: "transform 0.1s active"
            }}
          >
            Conferma e Concludi
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutView;