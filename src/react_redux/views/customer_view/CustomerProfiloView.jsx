import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartaActions } from "../../actions/CartaActions";
import { ClienteActions } from "../../actions/ClienteActions";
import { AutenticazioneActions } from "../../actions/AutenticazioneActions";
import Header from "../components/Header";

const CustomerProfiloView = () => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const cartaState = useSelector((state) => state.carta.value);
  const autenticazioneActions = new AutenticazioneActions();
  const clienteActions = new ClienteActions();
  const cartaActions = new CartaActions();
  const [ordini, setOrdini] = useState([]);
  const [clienteLogget, setClienteLogged] = useState(true);
  const navigate = useNavigate();
  const [mostraElimina, setMostraElimina] = useState(false);
  const [mostraModifica, setMostraModifica] = useState(false);
  const [ricercaData, setRicercaData] = useState("");
  const [ricercaOra, setRicercaOra] = useState("");
  const [ricercaMetodo, setRicercaMetodo] = useState("");
  const [dataMin, setDataMin] = useState("");
  const [dataMax, setDataMax] = useState("");
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
  });
  const [datiProfilo, setDatiProfilo] = useState({
    id: autenticazioneState.id_utente, 
    email: autenticazioneState.email, 
    contatto: autenticazioneState.contatto, 
    indirizzo: autenticazioneState.indirizzo, 
    username: autenticazioneState.username, 
    password_attuale: "", 
    nuova_password: "", 
    conferma_nuova_password: "", 
  })
  const [filtriFile, setFiltriFile] = useState({
    dataInizio: "",
    dataFine: "",
    formato: "pdf"
  });

  const salvaCarta = async () => {
    if (!datiNuovaCarta.numero || !datiNuovaCarta.mese_scadenza || !datiNuovaCarta.anno_scadenza || !datiNuovaCarta.cvv_cvs || !datiNuovaCarta.nome_titolare || (!datiNuovaCarta.is_visa && !datiNuovaCarta.is_mastercard)) {
      alert("Compila tutti i campi.");
      console.log(datiNuovaCarta);
      return;
    }
    
    await cartaActions.inserimentoCarta(datiNuovaCarta, setDatiNuovaCarta);
    
    alert("Salvataggio carta avvenuto con successo.");
  };

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

  const rimuoviCarta = async (indexToRemove, idCarta) => {
    if (window.confirm("Sei sicuro di voler rimuovere questa carta?")) {
      const result = await cartaActions.eliminazioneCarta(idCarta, autenticazioneState.id_utente);
      if(result.isOK) {
        alert("La carta e\' stata eliminata.");
      }      
    }
  };

  const handleEliminaProfilo = async () => {
    const result = await clienteActions.richiestaEliminazioneProfilo(autenticazioneState.username);
    if(result.isOK) {
      alert("Richiesta eliminazione profilo inviata. Riceverai tramite e-mail il risultato (Conferma/Annullamento) nei prossimi giorni.");
      autenticazioneActions.logout(navigate);
    }
    else {
      alert("Operazione fallita... Riprova più tardi.");
    }
  };

  const handleModificaProfilo = async () => {
    const result = await clienteActions.modificaProfilo(datiProfilo);
    if(!result.isPasswordCorrect) {
      alert("La password attuale inserita non è corretta... Operazione fallita.");
      return;
    }
    if(result.isOK) {
      alert("Modifica profilo eseguita correttamente.");
      setMostraModifica(false);
    }
    /*
    alert("Richiesta eliminazione profilo inviata. Riceverai tramite e-mail il risultato (Conferma/Annullamento) nei prossimi giorni.");
    */
  };

  const handleDownloadFile = (e) => {
    e.preventDefault();
    const contenuto = `Report Ordini\nPeriodo: ${filtriFile.dataInizio} - ${filtriFile.dataFine}`;
    const blob = new Blob([contenuto], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `export.${filtriFile.formato}`;
    link.click();
  };

  const ordiniFiltrati = ordini.filter((ordine) => {
    let matchData = true;
    let matchOra = true;
    let matchMetodo = true;
    let matchRange = true;

    if (ricercaData) {
      const [anno, mese, giorno] = ricercaData.split("-");
      const dataFormattata = `${giorno}/${mese}/${anno}`;
      matchData = ordine.data.includes(dataFormattata) || ordine.prenotazione?.data === ricercaData;
    }

    if (ricercaOra) {
      matchOra = ordine.data.includes(ricercaOra) || ordine.prenotazione?.ora === ricercaOra;
    }

    if (ricercaMetodo) {
      matchMetodo = ordine.metodo === ricercaMetodo;
    }

    const dataRiferimento = ordine.prenotazione?.data || ""; 
    if (dataMin && dataRiferimento) matchRange = matchRange && dataRiferimento >= dataMin;
    if (dataMax && dataRiferimento) matchRange = matchRange && dataRiferimento <= dataMax;

    return matchData && matchOra && matchMetodo && matchRange;
  });

  // --- CONFIGURAZIONE STILI "EXTRA LARGE" ---
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

  const labelStyle = {
    display: "flex",
    flexDirection: "column",
    fontSize: "18px",
    fontWeight: "bold",
    flex: "1 1 250px",
    gap: "10px"
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

  const buttonStyle = {
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
    alignSelf: "flex-end"
  };

  const [filtriRicerca, setFiltriRicerca] = useState({
    termine: "",
    metodo: "",
    dataMin: "",
    dataMax: "",
    stato: ""
  });

  const handleChangeFiltriFile = (e) => {
    const { name, value } = e.target;
    setFiltriFile(prev => ({ ...prev, [name]: value }));
  };

  const handleChangeFiltriRicerca = (e) => {
    const { name, value } = e.target;
    setFiltriRicerca(prev => ({ ...prev, [name]: value }));
  };

  const sezioneTitoloStyle = { marginTop: 0, marginBottom: "15px", fontSize: "18px", fontWeight: "bold" };
  const flexColumnStyle = { display: "flex", flexDirection: "column", flex: "1 1 0px", minWidth: "140px" };

  useEffect(() => {
    cartaActions.ottenimentoCarteCliente(autenticazioneState.id_utente);
  }, []);

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
        </p>
        <p style={{ margin: "15px 0" }}><strong>Contatto:</strong> 
          <input type="text" placeholder="Contatto" value={datiProfilo.contatto} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              contatto: e.target.value
            }))}  
          />
        </p>
        <p style={{ margin: "15px 0" }}><strong>Ultimo indirizzo:</strong> 
          <input type="text" placeholder="indirizzo" value={datiProfilo.indirizzo} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              indirizzo: e.target.value
            }))}  
          />
        </p>
        <p style={{ margin: "15px 0" }}><strong>Username:</strong> 
          <input type="text" placeholder="Username" value={datiProfilo.username} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              username: e.target.value
            }))}  
          />
        </p>
        <p style={{ margin: "15px 0" }}><strong>Password attuale:</strong> 
          <input type="text" placeholder="Password attuale" value={datiProfilo.password_attuale} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              password_attuale: e.target.value
            }))}  
          />
        </p>
        <h3>Cambio password</h3>
        <p style={{ margin: "15px 0" }}><strong>Nuova password:</strong> 
          <input type="text" placeholder="Nuova password" value={datiProfilo.nuova_password} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              nuova_password: e.target.value
            }))}  
          />
        </p>
        <p style={{ margin: "15px 0" }}><strong>Conferma nuova password:</strong> 
          <input type="text" placeholder="Conferma nuova password" value={datiProfilo.conferma_nuova_password} style={inputStyle} 
            onChange={(e) => setDatiProfilo(prevState => ({
              ...prevState, 
              conferma_nuova_password: e.target.value
            }))}  
          />
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
              <button onClick={handleEliminaProfilo} style={{ ...buttonActionStyle, backgroundColor: "red", color: "white", marginRight: "20px" }}>Sì, elimina</button>
              <button onClick={() => setMostraElimina(false)} style={buttonActionStyle}>Annulla</button>
            </div>
          )}
        </div>
      </div>
      
      {/* CARTE */}
      <div style={{paddingLeft:"50px"}}>
        <h3 style={{ fontSize: "36px", marginBottom: "25px" }}>Nuova carta</h3>
        <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px"}}>
          <input type="text" placeholder="Numero carta (16 cifre)" value={datiNuovaCarta.numero} style={inputStyle} 
            onChange={(e) => setDatiNuovaCarta(prevState => ({
              ...prevState, 
              numero: e.target.value
            }))}  
          />
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <input type="text" placeholder="MM" value={datiNuovaCarta.data_scadenza} style={inputStyle} 
                onChange={(e) => setDatiNuovaCarta(prevState => ({
                  ...prevState, 
                  mese_scadenza: e.target.value
                }))}  
              />
              <input type="text" placeholder="AAAA" value={datiNuovaCarta.data_scadenza} style={inputStyle} 
                onChange={(e) => setDatiNuovaCarta(prevState => ({
                  ...prevState, 
                  anno_scadenza: e.target.value
                }))}  
              />
            </div>
            <input type="text" placeholder="CVV / CVS" value={datiNuovaCarta.cvv_cvs} style={inputStyle} 
              onChange={(e) => setDatiNuovaCarta(prevState => ({
                ...prevState, 
                cvv_cvs: e.target.value
              }))}  
            />
          </div>
          <input type="text" placeholder="Nome titolare" value={datiNuovaCarta.nome_titolare} style={inputStyle} 
            onChange={(e) => setDatiNuovaCarta(prevState => ({
              ...prevState, 
              nome_titolare: e.target.value
            }))}  
          />
          <div style={{ display: "flex", gap: "20px", justifyContent: "space-between", }}>
            <button onClick={isVisa} style={{ backgroundColor:(isButtonVisaSelected ? "#007bff" : "#FFFFFF"), color:"#000000" }}>
              VISA
            </button>
            <button onClick={isMastercard} style={{ backgroundColor:(isButtonMastercardSelected ? "#007bff" : "#FFFFFF"), color:"#000000"}}>
              MASTERCARD
            </button>
          </div>
          <button onClick={salvaCarta} style={{ ...buttonActionStyle, backgroundColor: "#007bff", color: "white" }}>
            Salva carta
          </button>
        </div>
        
        <h3 style={{ fontSize: "36px", marginBottom: "25px" }}>Carte salvate</h3>
        <div style={{ marginBottom: "50px" }}>
          {cartaState.carte.length === 0 && <p style={{ opacity: 0.7, fontSize: "22px" }}>Nessuna carta salvata</p>}
          {cartaState.carte.map((carta, i) => (
            <>
              <div key={i} style={{ marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "25px", borderRadius: "12px", maxWidth: "700px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ fontSize: "24px" }}>💳 **** **** **** {carta.numero.slice(-4)} <small style={{ marginLeft: "20px", opacity: 0.8 }}>(Scad: {carta.mese_scadenza+"/"+carta.anno_scadenza})</small></span>
                <button onClick={() => rimuoviCarta(i, carta.id)} style={{ ...buttonActionStyle, backgroundColor: "white", color: "black", padding: "10px 20px", fontSize: "16px" }}>Rimuovi</button>
              </div>
            </>
          ))}
        </div>
      </div>

      <hr style={{ margin: "80px 0", opacity: 0.2 }} />

      {/* SEZIONE STORICO ORDINI */}
      <h3 style={{ fontSize: "42px", marginBottom: "35px" }}>Ordini</h3>

      {/* BOX ESPORTAZIONE */}
      <div style={{ marginBottom: "25px", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f8f9fa", color: "black" }}>
        <h3 style={sezioneTitoloStyle}>Ottieni file ordini</h3>
        <form onSubmit={handleDownloadFile} style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Primo giorno</label><input type="date" name="dataInizio" value={filtriFile.dataInizio} onChange={handleChangeFiltriFile} style={inputStyle} /></div>
          <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Ultimo giorno</label><input type="date" name="dataFine" value={filtriFile.dataFine} onChange={handleChangeFiltriFile} style={inputStyle} /></div>
          <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Email</label><input type="email" name="email" value={filtriFile.email} onChange={handleChangeFiltriFile} placeholder="Email..." style={inputStyle} /></div>
          <div style={flexColumnStyle}><label style={{fontSize:"13px", marginBottom:"5px"}}>Username</label><input type="text" name="username" value={filtriFile.username} onChange={handleChangeFiltriFile} placeholder="Username..." style={inputStyle} /></div>
          <div style={{...flexColumnStyle, flex: "0 0 100px"}}><label style={{fontSize:"13px", marginBottom:"5px"}}>Stato</label>
            <select name="stato" value={filtriFile.stato} onChange={handleChangeFiltriFile} style={inputStyle}>
              <option value="tutti">Tutti</option>
              <option value="completati">Completati</option>
              <option value="in_sospeso">In sospeso</option>
            </select>
          </div>
          <div style={{...flexColumnStyle, flex: "0 0 100px"}}><label style={{fontSize:"13px", marginBottom:"5px"}}>Formato</label>
            <select name="formato" value={filtriFile.formato} onChange={handleChangeFiltriFile} style={inputStyle}><option value="pdf">.PDF</option><option value="xlsx">.XLSX</option></select>
          </div>
          <button type="submit" style={{ ...buttonStyle, backgroundColor: "#28a745", color: "white" }}>Scarica</button>
        </form>
      </div>

      {/* BOX FILTRA RISULTATI */}
      <div style={{ marginBottom: "25px", padding: "20px", border: "1px solid #007bff", borderRadius: "8px", backgroundColor: "#e9f2fd", color: "black" }}>
        <h3 style={{ ...sezioneTitoloStyle, color: "#0056b3" }}>Ricerca ordini</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
            <label style={{ fontSize: "13px", marginBottom: "5px" }}>Nome o Data</label>
            <input type="text" name="termine" value={filtriRicerca.termine} onChange={handleChangeFiltriRicerca} placeholder="Cerca..." style={inputStyle} />
          </div>
          <div style={flexColumnStyle}>
            <label style={{ fontSize: "13px", marginBottom: "5px" }}>Tipo</label>
            <select name="metodo" value={filtriRicerca.metodo} onChange={handleChangeFiltriRicerca} style={inputStyle}>
              <option value="">Tutte</option>
              <option value="Struttura">Struttura</option>
              <option value="Spedizione">Spedizione</option>
              <option value="Corriere">Corriere</option>
            </select>
          </div>
          <div style={flexColumnStyle}>
            <label style={{ fontSize: "13px", marginBottom: "5px" }}>Dal giorno</label>
            <input type="date" name="dataMin" value={filtriRicerca.dataMin} onChange={handleChangeFiltriRicerca} style={inputStyle} />
          </div>
          <div style={flexColumnStyle}>
            <label style={{ fontSize: "13px", marginBottom: "5px" }}>Al giorno</label>
            <input type="date" name="dataMax" value={filtriRicerca.dataMax} onChange={handleChangeFiltriRicerca} style={inputStyle} />
          </div>
          <div style={flexColumnStyle}>
            <label style={{ fontSize: "13px", marginBottom: "5px" }}>Stato</label>
            <select name="stato" value={filtriRicerca.stato} onChange={handleChangeFiltriRicerca} style={inputStyle}>
              <option value="">Tutti</option>
              <option value="completato">Completato</option>
              <option value="in_sospeso">In sospeso</option>
            </select>
          </div>
          <button onClick={() => setFiltriRicerca({termine:"", metodo:"", dataMin:"", dataMax:"", stato:""})} style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}>Pulisci</button>
        </div>
      </div>

      {/* LISTA ORDINI */}
      <div style={{ marginTop: "50px" }}>
        {ordini.length === 0 ? (
          <p style={{ fontSize: "24px" }}>Nessun ordine effettuato.</p>
        ) : ordiniFiltrati.length === 0 ? (
          <p style={{ color: "orange", fontSize: "28px", fontWeight: "bold" }}>Nessun ordine trovato per i filtri selezionati.</p>
        ) : (
          ordiniFiltrati.map((ordine, index) => {
            const totale = ordine.items.reduce((sum, item) => sum + item.prezzo * item.quantita, 0);
            return (
              <div key={index} style={{ background: "white", color: "black", padding: "40px", borderRadius: "20px", marginBottom: "40px", maxWidth: "850px", boxShadow: "0 15px 30px rgba(0,0,0,0.3)" }}>
                <h5 style={{ fontSize: "30px", margin: "0 0 20px 0", color: "#333" }}>Ordine #{ordine.id || index + 1}</h5>
                <p style={{ fontSize: "22px" }}><strong>Data ordine:</strong> {ordine.data}</p>
                <ul style={{ paddingLeft: "30px", fontSize: "22px" }}>
                  {ordine.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: "15px" }}>
                      <strong>{item.nome}</strong> x {item.quantita} — <span style={{ color: "#28a745", fontWeight: "bold" }}>€{(item.prezzo * item.quantita).toFixed(2)}</span>
                      <br />
                      <small style={{ color: "#777", fontSize: "18px" }}>Tipo: {item.tipo === "Servizio" ? "Servizio in struttura" : "Prodotto spedibile"}</small>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: "3px solid #eee", paddingTop: "25px", marginTop: "25px", fontSize: "24px" }}>
                  <p><strong>Totale Finale:</strong> <span style={{ fontSize: "32px", color: "blue", fontWeight: "bold" }}>€{totale.toFixed(2)}</span></p>
                  <p><strong>Metodo Utilizzato:</strong> {ordine.metodo}</p>
                </div>

                {/* DETTAGLIi SPECIFICI */}
                {ordine.metodo === "Struttura" && ordine.prenotazione && (
                  <div style={{ marginTop: "25px", padding: "25px", background: "#f1f8ff", borderRadius: "12px", borderLeft: "8px solid #007bff" }}>
                    <strong style={{ fontSize: "22px" }}>Dettagli Appuntamento:</strong>
                    <p style={{ margin: "15px 0", fontSize: "20px" }}>📅 Data: {ordine.prenotazione.data}<br />⏰ Ora: {ordine.prenotazione.ora}</p>
                  </div>
                )}
                {ordine.metodo === "Spedizione" && ordine.spedizione && (
                  <div style={{ marginTop: "25px", padding: "25px", background: "#f4fff4", borderRadius: "12px", borderLeft: "8px solid #28a745" }}>
                    <strong style={{ fontSize: "22px" }}>Dettagli Spedizione:</strong>
                    <p style={{ margin: "15px 0", fontSize: "20px" }}>📦 Indirizzo: {ordine.spedizione.indirizzo}<br />💳 Carta: **** **** **** {ordine.spedizione.carta.slice(-4)}</p>
                  </div>
                )}
                {ordine.metodo === "Corriere" && ordine.corriere && (
                  <div style={{ marginTop: "25px", padding: "25px", background: "#fff9f1", borderRadius: "12px", borderLeft: "8px solid #ff9800" }}>
                    <strong style={{ fontSize: "22px" }}>Dettagli Corriere:</strong>
                    <p style={{ margin: "15px 0", fontSize: "20px" }}>📦 Indirizzo: {ordine.corriere.indirizzo}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerProfiloView;