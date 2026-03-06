// React e Redux
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
// Views
import Header from "../components/Header";
import { OperazioniForms } from '../forms/OperazioniForms';
import { handleSearchEntrateLavori, handleSearchUsciteSpese, handleSearchEntrateServizi } from '../operazioni/AttivitaOperazioni';
// Actions
import { LavoroActions } from "../../actions/LavoroActions";
import { SpesaActions } from "../../actions/SpesaActions";
import { ServizioActions } from "../../actions/ServizioActions";
// Riutilizzabile
import { CardEntrateItems, CardEntrateItemsByName, CardUsciteItems, CardRicavi, CardEntrateUscite } from '../../../riutilizzabile/card_item/CardItem';
import { FormEntrateUscite } from '../../../riutilizzabile/form_item/FormItem';
import { RowEntrateUscite } from "../../../riutilizzabile/row_item/RowItem";


const Attivita = () => {
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const lavoroActions = new LavoroActions();
  const spesaActions = new SpesaActions();
  const servizioActions = new ServizioActions();
  const [entrateLavori, setEntrateLavori] = useState(-1);
  const [usciteSpese, setUsciteSpese] = useState(-1);
  const [entrateServizi, setEntrateServizi] = useState(-1);
  const [aggiornamento, setAggiornamento] = useState(0);
  const [initialPositions, setInitialPositions] = useState([]);
  const operazioniForms = new OperazioniForms();
  const [aggiornamento2, setAggiornamento2] = useState(false);

  const [datiRicerca, setDatiRicerca] = useState({
    primo_anno: (new Date()).getFullYear() - 5, 
    ultimo_anno: (new Date()).getFullYear()
  });

  const getEntrateLavori = async (e) => {
    e.preventDefault();
    
    setEntrateLavori([]);
    setEntrateServizi([]);
    setUsciteSpese([]);

    handleSearchEntrateLavori(lavoroActions, setEntrateLavori, datiRicerca, attivitaState.lingua);
  };
  
  useEffect(() => {
    if(entrateLavori.length > 0) {
      handleSearchUsciteSpese(spesaActions, setUsciteSpese, datiRicerca);
      handleSearchEntrateServizi(servizioActions, setEntrateServizi, datiRicerca, attivitaState.lingua); 
    }
  }, [entrateLavori]);

  return (
    <>
      <Header />
      
      <div className="main-content" />
      
      {(stileState.vistaForm === "form") && (
        <FormEntrateUscite 
          datiRicerca={datiRicerca}
          setDatiRicerca={setDatiRicerca}
          handleInputChange={operazioniForms.handleInputChange}
          eseguiRicerca={(e) => getEntrateLavori(e, setEntrateLavori, datiRicerca, attivitaState.lingua)} 
          lingua={attivitaState.lingua}
        />
      )}
      {(stileState.vistaForm === "card") && (
        <center>
          <CardEntrateUscite 
            datiRicerca={datiRicerca}
            setDatiRicerca={setDatiRicerca}
            handleInputChange={operazioniForms.handleInputChange}
            eseguiRicerca={(e) => getEntrateLavori(e, setEntrateLavori, datiRicerca, attivitaState.lingua)} 
            lingua={attivitaState.lingua}
          />
        </center>
      )}
      {(stileState.vistaForm === "row") && (
        <center>
          <RowEntrateUscite 
            datiRicerca={datiRicerca}
            setDatiRicerca={setDatiRicerca}
            handleInputChange={operazioniForms.handleInputChange}
            eseguiRicerca={(e) => getEntrateLavori(e, setEntrateLavori, datiRicerca, attivitaState.lingua)} 
            lingua={attivitaState.lingua}
          />
        </center>
      )}
      
      <br /> <br /> <br /> <br />
      
      <center>
        <Row>
          {(entrateLavori.length > 0 && entrateLavori !== -1) ? (
            <Col><CardEntrateItems entrateItems={entrateLavori} lingua={attivitaState.lingua} etichettaIta="Entrate lavori" etichettaEng="Revenue jobs" /></Col>
          ) : (<Col></Col>)}
          {(usciteSpese.length > 0 && usciteSpese !== -1) ? (
            <Col><CardUsciteItems usciteItems={usciteSpese} lingua={attivitaState.lingua} etichettaIta="Uscite spese" etichettaEng="Exit expenses" /></Col>
          ) : (<Col></Col>)}
        </Row>
        <br /> <br /> <br /> <br />
        <Row>
          {(entrateServizi.length > 0 && entrateServizi !== -1) ? (
            <Col><Col><CardEntrateItemsByName entrateItems={entrateServizi} lingua={attivitaState.lingua} tipoItemIta="SERVIZIO" tipoItemEng="SERVICE" etichettaIta="Entrate servizi" etichettaEng="Revenue services" /></Col></Col>
          ) : (<Col></Col>)}
          {((entrateLavori.length > 0 && entrateLavori !== -1) && (usciteSpese.length > 0 && usciteSpese !== -1)) ? (
            <Col><CardRicavi entrate={entrateLavori} uscite={usciteSpese} lingua={attivitaState.lingua} /></Col>
          ) : (<Col></Col>)}
        </Row>
      </center>

      <br /> <br /> <br /> <br />
    </>
  );
}

export default Attivita;
