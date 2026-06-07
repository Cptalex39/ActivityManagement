import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Header.jsx";
import { OrdineActions } from "../../actions/OrdineActions.js";
import { controlloRicercaOrdini } from "../../../utils/Controlli.js";

const Ordini = () => {
  const sezioneTitoloStyle = { marginTop: 0, marginBottom: "15px", fontSize: "18px", fontWeight: "bold" };
  const flexColumnStyle = { display: "flex", flexDirection: "column", flex: "1 1 0px", minWidth: "140px" };
  const inputStyle = { padding: "10px 8px", borderRadius: "4px", border: "1px solid #ccc", width: "100%", boxSizing: "border-box", fontSize: "14px", lineHeight: "1.2" };
  const buttonStyle = { padding: "10px 20px", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", fontSize: "14px", alignSelf: "flex-end" };
  const divStyle = { marginLeft: "10%", marginRight: "10%", flexDirection: "column", alignItems: "center", height: "100vh" };
  const colStyle = { margin: "20px" };
  const rowStyle = { marginBottom: "100px" };
  const hStyle = { textAlign:"center", backgroundColor:"#000000", color:"gray", marginBottom: "100px" };

  const ordineState = useSelector((state) => state.ordine.value);
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  
  const ordineActions = new OrdineActions();
  
  const [pagamentiDaConfermare, setPagamentiDaConfermare] = useState([]);
  const [ordiniUltime48Ore, setOrdiniUltime48Ore] = useState([]);
  const [ordiniRicerca, setOrdiniRicerca] = useState([]);
  const [bottone1Selezionato, setBottone1Selezionato] = useState("");
  const [bottoneRicerca, setBottoneRicerca] = useState("");
  
  const [filtriRicerca, setFiltriRicerca] = useState({
    tipo_item: "ordine", 
    id_cliente: autenticazioneState.ruolo === "cliente" ? autenticazioneState.id_utente : 0, 
    metodo_pagamento: "", 
    data_creazione_min: "", 
    data_creazione_max: "", 
    data_prenotazione_min: "", 
    data_prenotazione_max: "", 
    nome_cliente: "", 
    cognome_cliente: "", 
    email_cliente: "", 
    contatto_cliente: "", 
    username_cliente: ""
  });
  
  const selezionaBottone = async (tipoBottone, bottone) => {
    if(tipoBottone === 1) {
      setBottone1Selezionato(bottone === bottone1Selezionato ? "" : bottone);
    }
    else if(tipoBottone === "RICERCA") {
      setFiltriRicerca(prevState => ({
        ...prevState, 
        metodo_pagamento: bottone === bottoneRicerca ? "" : bottone, 
      }));
      setBottoneRicerca(bottone === bottoneRicerca ? "" : bottone);
    }

    if(tipoBottone === 1 && bottone === "PAGAMENTI_DA_CONFERMARE" && bottone !== bottone1Selezionato) {
      const result = await ordineActions.ottieniPagamentiDaConfermare({ id_cliente: autenticazioneState.ruolo === "cliente" ? autenticazioneState.id_utente : 0 });
      if(result.isOK) setPagamentiDaConfermare(result.items);
    }
    else if(tipoBottone === 1 && bottone === "ORDINI_ULTIME_48_ORE" && bottone !== bottone1Selezionato) {
      const result = await ordineActions.ottieniOrdiniUltime48Ore({ id_cliente: autenticazioneState.ruolo === "cliente" ? autenticazioneState.id_utente : 0 });
      if(result.isOK) setOrdiniUltime48Ore(result.items);
    }
  }

  const getDataCreazione = (data_creazione, isOrarioIncluso) => {
    const date = new Date(data_creazione);
    return "giorno: "+("00"+date.getDate()).slice(-2)+"/"+("00"+(date.getMonth()+1)).slice(-2)+"/"+(date.getFullYear()) + (
      isOrarioIncluso ? " alle ore "+("00"+date.getHours()).slice(-2)+":"+("00"+date.getMinutes()).slice(-2)+":"+("00"+date.getSeconds()).slice(-2) : ""
    );
  }

  const eseguiRicerca = async () => {
    const risultatoControllo = controlloRicercaOrdini(filtriRicerca);
    setFiltriRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    const result = await ordineActions.ricercaOrdini(filtriRicerca);
    if(result.isOK) {
      setOrdiniRicerca(result.items);
    }
  }

  const ottieniPDF = (e) => {
    e.preventDefault();

    const risultatoControllo = controlloRicercaOrdini(filtriRicerca);
    setFiltriRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    ordineActions.ottieniFileOrdini("pdf", filtriRicerca);
  };

  const ottieniExcel = (e) => {
    e.preventDefault();

    const risultatoControllo = controlloRicercaOrdini(filtriRicerca);
    setFiltriRicerca(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    ordineActions.ottieniFileOrdini("excel", filtriRicerca);
  };

  const segnaComeConfermato = async (codice) => {
    if (window.confirm("Sei sicuro di voler Confermare questo pagamento?")) {
      const result = await ordineActions.confermaPagamento({ codice: codice });
      if(result.isOK) {
        alert("Pagamento confermato.");
        setPagamentiDaConfermare(prev => prev.filter(o => o.codice !== codice));
        setOrdiniUltime48Ore(prev => prev.map(o => (o.codice === codice ? { ...o, is_pagato: 1 } : o)));
      } else {
        alert("Operazione fallita.")
      }
    } else {
      alert("Operazione annullata.");
    }
  };

  const eliminaOrdine = async (codice) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo pagamento?")) {
      alert("Operazione annullata.");
      return;
    }
    const result = await ordineActions.eliminaPagamentoDaConfermare({ codice: codice });
    if(result.isOK) {
      alert("Ordine eliminato.");
      setPagamentiDaConfermare(prev => prev.filter(o => o.codice !== codice));
      setOrdiniUltime48Ore(prev => prev.filter(o => o.codice !== codice));
    } else {
      alert("Operazione fallita.");
    }
  };

  const renderOrdiniTag = (ordini) => {
    return (
      <div style={{ marginBottom: "30px" }}>
        {(ordini && ordini.length > 0) ? (
          ordini.map((o) => (
            <div key={o.codice} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "15px", backgroundColor: "#101010", color: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h4>{o.cognome_cliente + " " + o.nome_cliente}</h4>
                  <ul>
                    <li>Ordine creato il {getDataCreazione(o.data_creazione, true)}</li>
                    <li>Totale: € {o.totale.toFixed(2)}</li>
                    <li>Metodo pagamento: {o.metodo_pagamento}</li>
                    {((bottone1Selezionato === "PAGAMENTI_DA_CONFERMARE" || bottone1Selezionato === "ORDINI_ULTIME_48_ORE") && o.is_pagato === 0) && (
                      <span style={{ padding: "5px 10px", borderRadius: "15px", backgroundColor: "red", color: "white", height: "fit-content" }}>Pagamento da confermare</span>
                    )}
                    {((bottone1Selezionato === "RICERCA_ORDINI_OTTIENI_FILE" || bottone1Selezionato === "ORDINI_ULTIME_48_ORE") && o.is_pagato === 1) && (
                      <li><span style={{ padding: "5px 10px", borderRadius: "15px", backgroundColor: "green", height: "fit-content" }}>Pagamento confermato</span></li>
                    )}
                  </ul>
                </div>
              </div>
              <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#000000", borderRadius: "5px", fontSize: "14px" }}>
                {o.metodo_pagamento === "Struttura" && (
                  <>
                    <p><strong>Dettagli Prenotazione:</strong></p>
                    <ul><li>Prenotazione effettuata per il {getDataCreazione(o.data_prenotazione, false)} alle ore {o.ora_prenotazione}</li></ul>
                  </>
                )}
                {o.metodo_pagamento === "Spedizione" && (
                  <>
                    <p><strong>Dettagli Spedizione:</strong></p>
                    <ul><li>Indirizzo: {o.indirizzo}</li><li>💳 **** **** **** {o.numero_carta}</li></ul>
                  </>
                )}
                {o.metodo_pagamento === "Corriere" && (
                  <>
                    <p><strong>Dettagli Corriere:</strong></p>
                    <ul><li>Indirizzo: {o.indirizzo}</li></ul>
                  </>
                )}
              </div>
              <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#000000", borderRadius: "5px", fontSize: "14px" }}>
              <p><strong>Dettagli Ordine:</strong></p>
              {JSON.parse(o.items).map((item) => (
                  <ul key={item.id}>
                    <li>{item.nome} ({item.tipo}): {item.prezzo.toFixed(2)} (x{item.quantita}) {"-->"} totale: € {(item.prezzo*item.quantita).toFixed(2)}</li>
                    <ul><li>Descrizione: {item.descrizione}</li><li>Note: {item.note}</li></ul>
                  </ul>
              ))}
              <ul><li>Totale ordine: € {o.totale.toFixed(2)}</li></ul>
              </div>
              {autenticazioneState.ruolo === "Amministratore" && (bottone1Selezionato === "PAGAMENTI_DA_CONFERMARE" || (bottone1Selezionato === "ORDINI_ULTIME_48_ORE" && o.is_pagato === 0)) && (
                <div style={{ marginTop: "10px", textAlign: "right" }}>
                  <button onClick={() => segnaComeConfermato(o.codice)} style={{ padding: "5px 10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", marginRight: "10px" }}>Conferma</button>
                  <button onClick={() => eliminaOrdine(o.codice)} style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: "3px", cursor: "pointer" }}>Elimina</button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={hStyle}>Nessun ordine trovato.</p>
        )}
      </div>
    );
  }

  const renderFormRicerca = () => {
    return (
      <div style={{ marginBottom: "25px", padding: "20px", border: "1px solid #007bff", borderRadius: "8px", backgroundColor: "#e9f2fd", color: "black" }}>
        <h3 style={{ ...sezioneTitoloStyle, color: "#0056b3" }}>Ricerca ordini / Ottieni file</h3>
        <p>Verranno ricercati solamente gli ordini in cui è stato confermato il pagamento.</p>

        <div style={flexColumnStyle}>
          <label style={{ fontSize: "13px", marginBottom: "5px" }}>Tipo</label>
          <select name="metodo_pagamento" value={filtriRicerca.metodo_pagamento} style={inputStyle}
            onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, metodo_pagamento: e.target.value }))} 
          >
            <option value="">Selezionare un metodo di pagamento</option>
            <option value="Tutte">Tutte</option>
            <option value="Struttura">Struttura</option>
            <option value="Spedizione">Spedizione</option>
            <option value="Corriere">Corriere</option>
          </select>
        </div>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "15px" }}>
          {["Struttura", "Spedizione", "Corriere", "Tutte"].includes(filtriRicerca.metodo_pagamento) && (
            <>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Data creazione minima</label>
                <input type="date" name="data_creazione_min" value={filtriRicerca.data_creazione_min} style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, data_creazione_min: e.target.value }))} 
                />
              </div>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Data creazione massima</label>
                <input type="date" name="data_creazione_max" value={filtriRicerca.data_creazione_max} style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, data_creazione_max: e.target.value }))} 
                />
              </div>
            </>
          )}
          {["Struttura"].includes(filtriRicerca.metodo_pagamento) && (
            <>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Data prenotazione minima</label>
                <input type="date" name="data_prenotazione_min" value={filtriRicerca.data_prenotazione_min} style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, data_prenotazione_min: e.target.value }))} 
                />
              </div>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Data prenotazione massima</label>
                <input type="date" name="data_prenotazione_max" value={filtriRicerca.data_prenotazione_max} style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, data_prenotazione_max: e.target.value }))} 
                />
              </div>
            </>
          )}
          {["Struttura", "Spedizione", "Corriere", "Tutte"].includes(filtriRicerca.metodo_pagamento) && autenticazioneState.ruolo === "Amministratore" && (
            <>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Nome cliente</label>
                <input type="text" name="nome_cliente" value={filtriRicerca.nome_cliente} placeholder="Cerca..." style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, nome_cliente: e.target.value }))} 
                />
              </div>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Cognome cliente</label>
                <input type="text" name="cognome_cliente" value={filtriRicerca.cognome_cliente} placeholder="Cerca..." style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, cognome_cliente: e.target.value }))} 
                />
              </div>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Email cliente</label>
                <input type="text" name="email_cliente" value={filtriRicerca.email_cliente} placeholder="Cerca..." style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, email_cliente: e.target.value }))} 
                />
              </div>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Contatto cliente</label>
                <input type="text" name="contatto_cliente" value={filtriRicerca.contatto_cliente} placeholder="Cerca..." style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, contatto_cliente: e.target.value }))} 
                />
              </div>
              <div style={{...flexColumnStyle, flex: "1.5 1 0px"}}>
                <label style={{ fontSize: "13px", marginBottom: "5px" }}>Username cliente</label>
                <input type="text" name="username_cliente" value={filtriRicerca.username_cliente} placeholder="Cerca..." style={inputStyle} 
                  onChange={(e) => setFiltriRicerca(prevState => ({ ...prevState, username_cliente: e.target.value }))} 
                />
              </div>
            </>
          )}
          <div className="row" style={{ width: "100%", marginTop: "15px" }}>
            {["Struttura", "Spedizione", "Corriere", "Tutte"].includes(filtriRicerca.metodo_pagamento) && (
              <>
                <div className="col">
                  <button 
                    onClick={() => setFiltriRicerca(prevState => ({
                      ...prevState, 
                      data_creazione_min: "", 
                      data_creazione_max: "", 
                      data_prenotazione_min: "", 
                      data_prenotazione_max: "",
                      nome_cliente: "",
                      cognome_cliente: "",
                      email_cliente: "",
                      contatto_cliente: "",
                      username_cliente: ""
                    }))} 
                    style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}
                  >
                    Pulisci
                  </button>
                </div>
                <div className="col"><button onClick={eseguiRicerca} style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}>Esegui ricerca</button></div>
                <div className="col"><button onClick={ottieniPDF} style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}>Ottieni PDF</button></div>
                <div className="col"><button onClick={ottieniExcel} style={{ ...buttonStyle, backgroundColor: "#6c757d", color: "white" }}>Ottieni Excel</button></div>
              </>
            )}
          </div>
        </div>

        {filtriRicerca.errore_tipo && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_tipo}</label><br/></>
        )}
        {filtriRicerca.errore_data_creazione && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_data_creazione}</label><br/></>  
        )}
        {filtriRicerca.errore_data_prenotazione && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_data_prenotazione}</label><br/></>  
        )}
        {filtriRicerca.errore_nome_cliente && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_nome_cliente}</label><br/></>  
        )}
        {filtriRicerca.errore_cognome_cliente && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_cognome_cliente}</label><br/></>  
        )}
        {filtriRicerca.errore_email_cliente && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_email_cliente}</label><br/></>  
        )}
        {filtriRicerca.errore_contatto_cliente && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_contatto_cliente}</label><br/></>
        )}
        {filtriRicerca.errore_username_cliente && (
          <><label style={{padding:"10px", color: "#FF0000"}}>{filtriRicerca.errore_username_cliente}</label><br/></>
        )}
      </div>
    );
  }
  
  return (
    <>
      <Header />
      <div className="main-content" />
      <div style={divStyle}>
        <div className="row" style={rowStyle}>
          <div className="col" style={colStyle}>
            <button style={{...buttonStyle, backgroundColor: bottone1Selezionato === "PAGAMENTI_DA_CONFERMARE" ? "#007BFF" : "#FFFFFF"}} onClick={() => selezionaBottone(1, "PAGAMENTI_DA_CONFERMARE")}>Pagamenti da confermare</button>
          </div>
          <div className="col" style={colStyle}>
            <button style={{...buttonStyle, backgroundColor: bottone1Selezionato === "ORDINI_ULTIME_48_ORE" ? "#007BFF" : "#FFFFFF"}} onClick={() => selezionaBottone(1, "ORDINI_ULTIME_48_ORE")}>Ordini ultime 48 ore</button>
          </div>
          <div className="col" style={colStyle}>
            <button style={{...buttonStyle, backgroundColor: bottone1Selezionato === "RICERCA_ORDINI_OTTIENI_FILE" ? "#007BFF" : "#FFFFFF"}} onClick={() => selezionaBottone(1, "RICERCA_ORDINI_OTTIENI_FILE")}>Ricerca ordini / Ottieni file</button>
          </div>
        </div>

        {bottone1Selezionato === "PAGAMENTI_DA_CONFERMARE" && (
          <div className="row">
            <div className="col" style={colStyle}>
              <h3 style={hStyle}>PAGAMENTI DA CONFERMARE</h3>
              {renderOrdiniTag(pagamentiDaConfermare)}
            </div>
          </div>
        )}
        {bottone1Selezionato === "ORDINI_ULTIME_48_ORE" && (
          <div className="row">
            <div className="col" style={colStyle}>
              <h3 style={hStyle}>ORDINI ULTIME 48 ORE</h3>
              {renderOrdiniTag(ordiniUltime48Ore)}
            </div>
          </div>
        )}
        {bottone1Selezionato === "RICERCA_ORDINI_OTTIENI_FILE" && (
          <div className="row">
            <div className="col" style={colStyle}>
              <h3 style={hStyle}>RICERCA ORDINI / OTTIENI FILE</h3>
              {renderFormRicerca()}
              {renderOrdiniTag(ordiniRicerca)}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Ordini;









