import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClienteActions } from "../../actions/ClienteActions";
import { AutenticazioneActions } from "../../actions/AutenticazioneActions";
import Header from "../components/Header";
import { controlloModificaProfiloCliente } from "../../../utils/Controlli";

const ProfiloCliente = () => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const autenticazioneActions = new AutenticazioneActions();
  const clienteActions = new ClienteActions();
  const navigate = useNavigate();
  const [mostraElimina, setMostraElimina] = useState(false);
  const [mostraModifica, setMostraModifica] = useState(false);
  const [datiProfilo, setDatiProfilo] = useState({
    id: autenticazioneState.id_utente, 
    email: autenticazioneState.email, 
    contatto: autenticazioneState.contatto, 
    indirizzo: autenticazioneState.indirizzo, 
    username: autenticazioneState.username, 
    password_attuale: "", 
    nuova_password: "", 
    conferma_nuova_password: "", 
    errore_email: null, 
    errore_contatto: null,
    errore_indirizzo: null,
    errore_username: null, 
    errore_password_attuale: null,
    errore_nuova_password: null,
  })

  const [mostraPasswordAttuale, setMostraPasswordAttuale] = useState(false);
  const [mostraNuovaPassword, setMostraNuovaPassword] = useState(false);
  const [mostraConfermaNuovaPassword, setMostraConfermaNuovaPassword] = useState(false);
  
  const handleEliminaProfilo = async () => {
    const result = await clienteActions.richiestaEliminazioneProfilo(autenticazioneState.username);
    
    if(result.isOK) {
      alert("Richiesta eliminazione profilo inviata. Riceverai tramite e-mail una risposta nei prossimi giorni.");
      autenticazioneActions.logout(navigate);
    }
    else {
      alert("Operazione fallita... Riprova più tardi.");
    }
  };

  const handleModificaProfilo = async () => {
    const risultatoControllo = controlloModificaProfiloCliente(datiProfilo);
    setDatiProfilo(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    const result = await clienteActions.modificaProfilo(datiProfilo);
    if(!result.isPasswordCorrect) {
      setDatiProfilo(prevState => ({
        ...prevState, 
        errore_password_attuale: "La password attuale inserita non è corretta."
      }))
      return;
    }
    if(result.isOK) {
      alert("Modifica profilo eseguita correttamente.");
      setMostraModifica(false);
    }
  };

  const boxStyle = { 
    background: "rgba(255,255,255,0.1)", 
    padding: "40px", 
    borderRadius: "15px", 
    marginBottom: "45px", 
    maxWidth: "900px", 
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: "20px"
  };

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

  return (
    <div style={{ color: "white", marginTop: "40px", paddingBottom: "100px", fontFamily: "sans-serif" }}>
      <Header />

      <div className="main-content"></div>

      <h2 style={{ fontSize: "48px", marginBottom: "40px" }}>Profilo Cliente</h2>

      {/* BOX INFO CLIENTE */}
      <div style={boxStyle}>
        <p style={{ margin: "15px 0" }}><strong>{autenticazioneState.nome} {autenticazioneState.cognome}</strong></p>
        <p style={{ margin: "15px 0" }}><strong>Email:</strong> 
          <input type="text" placeholder="Email" value={datiProfilo.email} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              email: e.target.value
            }))}  
          />
          {datiProfilo.errore_email && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{datiProfilo.errore_email}</label></>)}
        </p>
        <p style={{ margin: "15px 0" }}><strong>Contatto:</strong> 
          <input type="text" placeholder="Contatto" value={datiProfilo.contatto} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              contatto: e.target.value
            }))}
          />
          {datiProfilo.errore_contatto && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{datiProfilo.errore_contatto}</label></>)}
        </p>
        <p style={{ margin: "15px 0" }}><strong>Ultimo indirizzo:</strong> 
          <input type="text" placeholder="indirizzo" value={datiProfilo.indirizzo} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              indirizzo: e.target.value
            }))}
          />
          {datiProfilo.errore_indirizzo && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{datiProfilo.errore_indirizzo}</label></>)}
        </p>
        <p style={{ margin: "15px 0" }}><strong>Username:</strong> 
          <input type="text" placeholder="Username" value={datiProfilo.username} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              username: e.target.value
            }))}  
          />
          {datiProfilo.errore_username && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{datiProfilo.errore_username}</label></>)}
        </p>
        <p style={{ margin: "15px 0" }}><strong>Password attuale:</strong> 
          <input type={mostraPasswordAttuale ? "text" : "password"} placeholder="Password attuale" value={datiProfilo.password_attuale} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              password_attuale: e.target.value
            }))}  
          />
          <br />
          <button
            type="button"
            onClick={() => setMostraPasswordAttuale(!mostraPasswordAttuale)}
          >
            {mostraPasswordAttuale ? "Nascondi" : "Mostra"}
          </button>
          {datiProfilo.errore_password_attuale && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{datiProfilo.errore_password_attuale}</label></>)}
        </p>
        <h3>Cambio password</h3>
        <p style={{ margin: "15px 0" }}><strong>Nuova password:</strong> 
          <input type={mostraNuovaPassword ? "text" : "password"} placeholder="Nuova password" value={datiProfilo.nuova_password} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              nuova_password: e.target.value
            }))}
          />
          <br />
          <button
            type="button"
            onClick={() => setMostraNuovaPassword(!mostraNuovaPassword)}
          >
            {mostraNuovaPassword ? "Nascondi" : "Mostra"}
          </button>
        </p>
        <p style={{ margin: "15px 0" }}><strong>Conferma nuova password:</strong> 
          <input type={mostraConfermaNuovaPassword ? "text" : "password"} placeholder="Conferma nuova password" value={datiProfilo.conferma_nuova_password} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              conferma_nuova_password: e.target.value
            }))}  
          />
          <br />
          <button
            type="button"
            onClick={() => setMostraConfermaNuovaPassword(!mostraConfermaNuovaPassword)}
          >
            {mostraConfermaNuovaPassword ? "Nascondi" : "Mostra"}
          </button>
          {datiProfilo.errore_nuova_password && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{datiProfilo.errore_nuova_password}</label></>)}
        </p>
        <div style={{ marginTop: "35px" }}>
          {!mostraModifica ? (
            <button 
              onClick={() => setMostraModifica(true)} 
              style={{ ...buttonActionStyle, backgroundColor: "#0056b3", color: "white" }}
            >
              Modifica Profilo
            </button>
          ) : (
            <div style={{ background: "rgba(0, 0, 255, 0.2)", padding: "30px", borderRadius: "12px", border: "2px solid blue" }}>
              <p style={{ fontWeight: "bold", fontSize: "24px", margin: "0 0 20px 0" }}>Sei sicuro di voler procedere?</p>
              <button onClick={handleModificaProfilo} style={{ ...buttonActionStyle, backgroundColor: "blue", color: "white", marginRight: "20px" }}>Sì, modifica</button>
              <button onClick={() => setMostraModifica(false)} style={buttonActionStyle}>Annulla</button>
            </div>
          )}
        </div>
        <div style={{ marginTop: "35px" }}>
          {!mostraElimina ? (
            <button 
              onClick={() => setMostraElimina(true)} 
              style={{ ...buttonActionStyle, backgroundColor: "#dc3545", color: "white" }}
            >
              Elimina Profilo
            </button>
          ) : (
            <div style={{ background: "rgba(255, 0, 0, 0.2)", padding: "30px", borderRadius: "12px", border: "2px solid red" }}>
              <p style={{ fontWeight: "bold", fontSize: "24px", margin: "0 0 20px 0" }}>Sei sicuro di voler procedere?</p>
              <button onClick={handleEliminaProfilo} style={{ ...buttonActionStyle, backgroundColor: "red", color: "white", marginRight: "20px" }}>Si, elimina</button>
              <button onClick={() => setMostraElimina(false)} style={buttonActionStyle}>Annulla</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfiloCliente;