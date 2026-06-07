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

  const getRicavi = (entrate, uscite) => {
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
