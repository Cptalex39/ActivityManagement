import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { CartaActions } from "../../actions/CartaActions";
import { controlloCarta } from "../../../utils/Controlli";

import Header from "../components/Header";

const Carte = () => {
  const inputStyle = { 
    padding: "18px", 
    borderRadius: "10px", 
    border: "1px solid #ccc", 
    color: "black", 
    fontSize: "20px",
    width: "100%",
    boxSizing: "border-box"
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

  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  
  const cartaState = useSelector((state) => state.carta.value);
  const cartaActions = new CartaActions();

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

  const salvaCarta = async () => {
    const risultatoControllo = controlloCarta(datiNuovaCarta);
    setDatiNuovaCarta(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }
       
    await cartaActions.inserimentoCarta(datiNuovaCarta, setDatiNuovaCarta);
    
    alert("Salvataggio carta avvenuto con successo.");
  };
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
  const rimuoviCarta = async (indexToRemove, idCarta) => {
    if (!window.confirm("Sei sicuro di voler rimuovere questa carta?")) {
      alert("Operazione annullata.");
      return;
    }

    const result = await cartaActions.eliminazioneCarta(idCarta, autenticazioneState.id_utente);
    
    if(result.isOK) {
      alert("La carta e\' stata eliminata.");
    }      
  };

  const dataAttuale = new Date();

  useEffect(() => {
    cartaActions.ottenimentoCarteCliente(autenticazioneState.id_utente);
  }, []);

  return (
    <>
      <Header />

      <div className="main-content"></div>

      <div style={{ color: "white", marginTop: "40px", paddingBottom: "100px", fontFamily: "sans-serif" }}>
        <div style={{paddingLeft:"50px"}}>
          <h3 style={{ fontSize: "36px", marginBottom: "25px" }}>Nuova carta</h3>
          <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px"}}>
            <input type="text" placeholder="Numero carta (13/16 cifre)" value={datiNuovaCarta.numero} minLength={1} maxLength={16} style={inputStyle} 
              onChange={(e) => setDatiNuovaCarta(prevState => ({
                ...prevState, 
                numero: e.target.value
              }))}  
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
            <button onClick={salvaCarta} style={{ ...buttonActionStyle, backgroundColor: "#007bff", color: "white" }}>
              Salva carta
            </button>
          </div>
          
          <h3 style={{ fontSize: "36px", marginBottom: "25px" }}>Carte salvate</h3>
          <div style={{ marginBottom: "50px" }}>
            {cartaState.carte.length === 0 && <p style={{ opacity: 0.7, fontSize: "22px" }}>Nessuna carta salvata</p>}
            {cartaState.carte.map((carta, i) => {
              const dataScadenza = new Date(parseInt(carta.anno_scadenza), parseInt(carta.mese_scadenza), 1);
              return (
                <>
                  <div key={i} style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
                    {dataScadenza < dataAttuale ? (
                      <span style={{ fontSize: "24px", color:"#FF0000", fontWeight:"bold"}}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}><br/>CARTA SCADUTA IL GIORNO: {"1/"+(parseInt(carta.mese_scadenza)+1)+"/"+carta.anno_scadenza}</small></span>
                    ) : (
                      <span style={{ fontSize: "24px", color:"#FFFFFF", fontWeight:"bold" }}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}><br/>LA CARTA SCADE IL GIORNO: {"1/"+(parseInt(carta.mese_scadenza)+1)+"/"+carta.anno_scadenza}</small></span>
                    )}
                    <button onClick={() => rimuoviCarta(i, carta.id)} style={{ ...buttonActionStyle, backgroundColor: "white", color: "black", padding: "10px 20px", fontSize: "16px" }}>Rimuovi</button>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Carte;









