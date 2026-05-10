// React e Redux
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
// Views
import Header from "../components/Header";
import { OperazioniForms } from '../forms/OperazioniForms';
import { inputStyle, buttonActionStyle, hStyle, ulStyle, entrateStyle, usciteStyle, ricaviStyle } from '../stile/Stile';
// Actions
import { SpesaActions } from "../../actions/SpesaActions";
import { ServizioActions } from "../../actions/ServizioActions";
import { AttivitaActions } from '../../actions/AttivitaActions';
// Riutilizzabile
import { CardEntrateItems, CardEntrateItemsByName, CardUsciteItems, CardRicavi, CardEntrateUscite } from '@gianlucascisciolo/riutilizzoreact';
import { FormEntrateUscite } from '@gianlucascisciolo/riutilizzoreact'
import { RowEntrateUscite } from "@gianlucascisciolo/riutilizzoreact";
import { useAccordionButton } from 'react-bootstrap';

const Attivita = () => {
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const spesaActions = new SpesaActions();
  const servizioActions = new ServizioActions();
  const attivitaActions = new AttivitaActions();
  const [usciteSpese, setUsciteSpese] = useState(-1);
  const [entrateServizi, setEntrateServizi] = useState(-1);
  const [aggiornamento, setAggiornamento] = useState(0);
  const [initialPositions, setInitialPositions] = useState([]);
  const operazioniForms = new OperazioniForms();
  const [aggiornamento2, setAggiornamento2] = useState(false);
  
  const [entrateAnno, setEntrateAnno] = useState([]);
  const [usciteAnno, setUsciteAnno] = useState([]);

  const datiAnno = {
    entrate_gennaio: 10, 
    entrate_febbraio: 20, 
    entrate_marzo: 30, 
    entrate_aprile: 40, 
    entrate_maggio: 50, 
    entrate_giugno: 60, 
    entrate_luglio: 70, 
    entrate_agosto: 80, 
    entrate_settembre: 90, 
    entrate_ottobre: 100, 
    entrate_novembre: 110, 
    entrate_dicembre: 120, 

    uscite_gennaio: 120, 
    uscite_febbraio: 110, 
    uscite_marzo: 100, 
    uscite_aprile: 90, 
    uscite_maggio: 80, 
    uscite_giugno: 70, 
    uscite_luglio: 70, 
    uscite_agosto: 60, 
    uscite_settembre: 50, 
    uscite_ottobre: 40, 
    uscite_novembre: 30, 
    uscite_dicembre: 20, 

    spese_gennaio: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_febbraio: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_marzo: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_aprile: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_maggio: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_giugno: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_luglio: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_agosto: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_settembre: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_ottobre: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_novembre: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y",
    spese_dicembre: "Voglio ottenere, per ogni spesa del mese gdi gennaio (vedi nome), il nome + il totale pagato, quindi, avere una cosa del genere: Nome spesa x: € y", 

    items_ordini_gennaio: "Lista degli items", 
    items_ordini_febbraio: "Lista degli items", 
    items_ordini_marzo: "Lista degli items", 
    items_ordini_aprile: "Lista degli items", 
    items_ordini_maggio: "Lista degli items", 
    items_ordini_giugno: "Lista degli items", 
    items_ordini_luglio: "Lista degli items", 
    items_ordini_agosto: "Lista degli items", 
    items_ordini_settembre: "Lista degli items", 
    items_ordini_ottobre: "Lista degli items", 
    items_ordini_novembre: "Lista degli items", 
    items_ordini_dicembre: "Lista degli items", 
  };

  const itemsOrdini = [
    JSON.parse('[{"id":2,"nome":"Pizza Margherita","prezzo":12.5,"tipo":"Prodotto","note":"Note prodotto 1.","quantita":1}]'), 
    JSON.parse('[{"id":1,"nome":"Taglio capelli","prezzo":10,"tipo":"Servizio","note":"Note servizio 1.","quantita":2},{"id":2,"nome":"Pizza Margherita","prezzo":12.5,"tipo":"Prodotto","note":"Note prodotto 1.","quantita":2},{"id":3,"nome":"Penna nera","prezzo":0.5,"tipo":"Prodotto","note":"Note prodotto 2.","quantita":2}]'), 
    JSON.parse('[{"id":2,"nome":"Pizza Margherita","prezzo":12.5,"tipo":"Prodotto","note":"Note prodotto 1.","quantita":6},{"id":1,"nome":"Taglio capelli","prezzo":10,"tipo":"Servizio","note":"Note servizio 1.","quantita":6},{"id":3,"nome":"Penna nera","prezzo":0.5,"tipo":"Prodotto","note":"Note prodotto 2.","quantita":6}]'), 
    JSON.parse('[{"id":2,"nome":"Pizza Margherita","prezzo":12.5,"tipo":"Prodotto","note":"Note prodotto 1.","quantita":2},{"id":3,"nome":"Penna nera","prezzo":0.5,"tipo":"Prodotto","note":"Note prodotto 2.","quantita":2}]')
  ];

  const getRicavi = (entrate, uscite) => {
    //return entrate - uscite;
    const ricavi = entrate - uscite;
    return (
      <>
        <span style={ricaviStyle(ricavi)}>{ricavi == 0 ? "" : (ricavi < 0 ? "-" : "+")} € {Math.abs(ricavi)}</span>
      </>
    );
  }

  const [datiRicerca, setDatiRicerca] = useState({
    anno: (new Date()).getFullYear()
  });

  const eseguiAnalisi = async(e) => {
    e.preventDefault();
    let result = await attivitaActions.eseguiAnalisi(datiRicerca);
    if(result.isOK) {
      setAnnoSelezionato(datiRicerca.anno);
      setUsciteAnno(result.uscite_anno);
      setEntrateAnno(result.entrate_anno);
      //alert(result.entrate_anno.length)
    }
  }
  const [annoSelezionato, setAnnoSelezionato] = useState(-1);
  
  const getTotaliPerNome = (item) => {
    return item.reduce((acc, item) => {
      acc[item.nome] = (acc[item.nome] || 0) + (item.totale);
      return acc;
    }, {});
  }
  
  return (
    <>
      <Header />
      
      <div className="main-content" />

      <div style={{paddingLeft:"50px"}}>
        <div style={{ maxWidth: "500px", display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px"}}>
        <h3 style={{...hStyle, marginBottom: "10px", }}>Form analisi</h3>
          <input type="number" placeholder="Anno" value={datiRicerca.anno} style={inputStyle} 
            onChange={(e) => setDatiRicerca(prevState => ({
              ...prevState, 
              anno: e.target.value
            }))}  
          />
          
          <button onClick={eseguiAnalisi} style={{ ...buttonActionStyle, backgroundColor: "#007bff", color: "white" }}>
            Esegui analisi
          </button>
        </div>
      </div>

      {annoSelezionato >= 0 && (
        <>
          <h2 style={hStyle}>ANALISI PER L'ANNO {annoSelezionato}</h2>
          {["GENNAIO", "FEBBRAIO", "MARZO", "APRILE", "MAGGIO", "GIUGNO", "LUGLIO", "AGOSTO", "SETTEMBRE", "OTTOBRE", "NOVEMBRE", "DICEMBRE"].map((mese, index) => {
            return (
              <>
                <h2 style={hStyle}>{mese} {annoSelezionato}</h2>
                <ul style={ulStyle}>
                  <li>Entrate: <span style={entrateStyle(entrateAnno[index].totale)}>+ € {entrateAnno[index].totale}</span></li>
                  {entrateAnno[index].totale > 0 && (
                    <ul>
                      {Object.entries(getTotaliPerNome(entrateAnno[index].items)).map(([nome, totale]) => {
                        return <li key={nome}>{nome}: <span style={{color:"#00FF00"}}>+ € {totale}</span></li>
                      })}
                    </ul>
                  )}
                  <li>Uscite: <span style={usciteStyle(usciteAnno[index].totale)}>- € {usciteAnno[index].totale}</span></li>
                  {usciteAnno[index].totale > 0 && (
                    <ul>
                      {Object.entries(getTotaliPerNome(usciteAnno[index].spese)).map(([nome, totale]) => {
                        return <li key={nome}>{nome}: <span style={{color:"#FF0000"}}>- € {totale}</span></li>
                      })}
                    </ul>
                  )}
                  <li>Ricavi: {getRicavi(entrateAnno[index].totale, usciteAnno[index].totale)}</li>
                </ul>
              </>
            )
          })}
          <h2 style={hStyle}>RESOCONTO ANNUALE</h2>
          <ul style={ulStyle}>
            <li>
              Entrate: <span style={entrateStyle(entrateAnno.reduce((acc, item) => acc + item.totale, 0))}>
                + € {entrateAnno.reduce((acc, item) => acc + item.totale, 0)}
              </span>
            </li>
            {entrateAnno.reduce((acc, item) => acc + item.totale, 0) > 0 && (
              <ul>
                {Object.entries(getTotaliPerNome([
                  ...entrateAnno[0].items, ...entrateAnno[1].items, ...entrateAnno[2].items,  ...entrateAnno[3].items, 
                  ...entrateAnno[4].items, ...entrateAnno[5].items, ...entrateAnno[6].items,  ...entrateAnno[7].items, 
                  ...entrateAnno[8].items, ...entrateAnno[9].items, ...entrateAnno[10].items, ...entrateAnno[11].items
                ])).map(([nome, totale]) => {
                  return <li key={nome}>{nome}: <span style={{color:"#00FF00"}}>+ € {totale}</span></li>
                })}
              </ul>
            )}
            <li>
              Uscite: <span style={usciteStyle(usciteAnno.reduce((acc, item) => acc + item.totale, 0))}>
                - € {usciteAnno.reduce((acc, item) => acc + item.totale, 0)}
              </span>
            </li>
            {usciteAnno.reduce((acc, item) => acc + item.totale, 0) > 0 && (
              <ul>
                {Object.entries(getTotaliPerNome([
                  ...usciteAnno[0].spese, ...usciteAnno[1].spese, ...usciteAnno[2].spese,  ...usciteAnno[3].spese, 
                  ...usciteAnno[4].spese, ...usciteAnno[5].spese, ...usciteAnno[6].spese,  ...usciteAnno[7].spese, 
                  ...usciteAnno[8].spese, ...usciteAnno[9].spese, ...usciteAnno[10].spese, ...usciteAnno[11].spese, 
                ])).map(([nome, totale]) => {
                  return <li key={nome}>{nome}: <span style={{color:"#FF0000"}}>- € {totale}</span></li>
                })}
              </ul>
            )}
            <li>
              Ricavi: {getRicavi(
                entrateAnno.reduce((acc, item) => acc + item.totale, 0),
                usciteAnno.reduce((acc, item) => acc + item.totale, 0)
              )}
            </li>
          </ul>
        </>
      )}
      


      <br /> <br /> <br /> <br />
    </>
  );
}

export default Attivita;
