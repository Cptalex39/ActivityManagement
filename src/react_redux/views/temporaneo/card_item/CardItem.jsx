// React e Redux
import { useState, useRef, Fragment } from 'react';
import { Card, Table } from 'react-bootstrap';
// Riutilizzabile
import StyledComponents from './StyledCardItem';
import { OperazioniNuovoItem, OperazioniCercaItems, OperazioniRicercaEntrateUscite, OperazioniLogin, OperazioniModificaProfilo, OperazioniFileItems, OperazioniItemEsistente } from '../Operazioni';
import { getInputTag, getTextAreaTag } from '../Tags';
import { handleChange, handleClick } from '../Handle';
import { getColor } from '../Colori';
import { getTotaleEntrateAnno, getQuantitaEntrateAnno } from '../Calcoli';

export function CardNuovoItem({campi, indici, eseguiSalvataggio}) {
  let maxHeight = "2000px";

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }
  
  return (
    <center>
      <StyledComponents.StyledCard>
        <StyledComponents.StyledCardHeader>{campi["header"]}</StyledComponents.StyledCardHeader>
        <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
          {indici.map((i) => {
            const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
              getTextAreaTag(1, true, StyledComponents)
            );
            return ( 
              <Fragment key={i}>
                <StyledComponents.StyledRow>
                  <NomeTag 
                    rows={1}
                    name={campi.name[i]}
                    id={campi.id[i]}
                    type={campi.type[i]}
                    step={campi.step[i]}
                    value={(campi.value[i] !== " €") ? campi.value[i] : ""}
                    placeholder={campi.placeholder[i]}
                    onChange={campi.onChange}
                    onClick={campi.onClick}
                    onBlur={campi.onBlur}
                    onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                  />
                  {campi.options[i]}
                </StyledComponents.StyledRow>
                {(campi.errore[i] !== "") && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
              </Fragment>
            );
          })}
        </StyledComponents.SlideContainer>
        <OperazioniNuovoItem 
          eseguiSalvataggio={eseguiSalvataggio} 
          vistaItem={"card"}
          StyledComponents={StyledComponents}
        />
      </StyledComponents.StyledCard>
    </center>
  );
}

export function CardRicercaItems({campi, indici, handleSearch}) {
  const [isVisible, setIsVisible] = useState(true);
  const [arrowUp, setArrowUp] = useState(true);
  let maxHeight = (isVisible) ? "2000px" : "0px";
  let InputTag = getInputTag(1, true, StyledComponents);
  let TextAreaTag = getTextAreaTag(1, true, StyledComponents);

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }

  return (
    <center>
      <StyledComponents.StyledCard>
        <StyledComponents.StyledCardHeader>{campi["header"]}</StyledComponents.StyledCardHeader>
        <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
          {indici.map((i) => {
            const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
              getTextAreaTag(1, true, StyledComponents)
            );
            return ( 
              <Fragment key={i}>
                <StyledComponents.StyledRow>
                  <NomeTag 
                    rows={1}
                    name={campi.name[i]}
                    id={campi.id[i]}
                    type={campi.value[i]}
                    value={(campi.value[i] !== " €") ? campi.value[i] : ""}
                    placeholder={campi.placeholder[i]}
                    onChange={campi.onChange}
                    onClick={campi.onClick}
                    onBlur={campi.onBlur}
                    onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                  />
                </StyledComponents.StyledRow>
              </Fragment>
            );
          })}
        </StyledComponents.SlideContainer>
        <OperazioniCercaItems
          setIsVisible={setIsVisible}
          arrowUp={arrowUp}
          setArrowUp={setArrowUp}
          handleSearch={handleSearch} 
          vistaItem={"card"}
          StyledComponents={StyledComponents}
        />
      </StyledComponents.StyledCard>
    </center>
  );
}

export function CardItemEsistente({ item, campi, indici, operazioneModifica, operazioneElimina, handleBlurItem }) {
  const inputRefs = useRef([]); // Array di riferimenti per ogni input
  const [localValues, setLocalValues] = useState(() =>
    indici.reduce((acc, i) => ({ ...acc, [i]: campi.value[i] }), {})
  ); // Gestione dello stato locale

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }
  
  return (
    <StyledComponents.StyledCard>
      <StyledComponents.StyledCardHeader>{campi["header"]}</StyledComponents.StyledCardHeader>
      <StyledComponents.SlideContainer>
        {indici.map((i) => {
          const NomeTag = campi.type[i]
            ? getInputTag(campi.tipoSelezione, campi.valoreModificabile[i], StyledComponents)
            : getTextAreaTag(campi.tipoSelezione, campi.valoreModificabile[i], StyledComponents);

          return (
            <Fragment key={`input-${i}`}>
              <StyledComponents.StyledRow>
                <NomeTag
                  ref={(el) => (inputRefs.current[i] = el)} // Assegna il riferimento
                  rows={1}
                  name={campi.name[i]}
                  id={campi.id[i]}
                  type={campi.type[i]}
                  step={campi.step[i]}
                  value={localValues[i]} // stato locale per il valore
                  placeholder={campi.placeholder[i]}
                  onChange={(e) => handleChange(e, i, setLocalValues)} // Aggiorna lo stato locale
                  onBlur={(e) => handleBlurItem(e, item)}
                  onClick={(e) => handleClick(e)}
                  readOnly={item.tipo_selezione !== 1}
                  onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                />
                {campi.options[i]}
              </StyledComponents.StyledRow>
              {(campi.errore[i]) && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
            </Fragment>
          );
        })}
      </StyledComponents.SlideContainer>
      <OperazioniItemEsistente 
        operazioneModifica={operazioneModifica} 
        operazioneElimina={operazioneElimina} 
        item={item} 
        vistaItem={"card"} 
        StyledComponents={StyledComponents} 
      />
    </StyledComponents.StyledCard>
  );
}

export function CardFileItems({campi, indici, ottieniFileRangePDF, ottieniFileRangeExcel, eliminaItemsRange}) {
  let maxHeight = "2000px";

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }
  
  return (
    <center>
      <StyledComponents.StyledCard>
        <StyledComponents.StyledCardHeader>{campi["header"]}</StyledComponents.StyledCardHeader>
        <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
          {indici.map((i) => {
            const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
              getTextAreaTag(1, true, StyledComponents)
            );
            return ( 
              <Fragment key={i}>
                <NomeTag 
                  key={i}
                  rows={1}
                  name={campi.name[i]}
                  id={campi.id[i]}
                  type={campi.type[i]}
                  step={campi.step[i]}
                  value={campi.value[i]}
                  placeholder={campi.placeholder[i]}
                  onChange={campi.onChange}
                  onClick={campi.onClick}
                  onBlur={campi.onBlur}
                  onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                />
              </Fragment>
            );
          })}
        </StyledComponents.SlideContainer>
        <OperazioniFileItems 
          ottieniFileRangePDF={ottieniFileRangePDF} 
          ottieniFileRangeExcel={ottieniFileRangeExcel} 
          eliminaItemsRange={eliminaItemsRange} 
          vistaItem={"card"}
          StyledComponents={StyledComponents}
        />
      </StyledComponents.StyledCard>
    </center>
  );
}

export function CardLogin({campi, indici, eseguiLogin}) {
  let maxHeight = "2000px";
  const [inputType, setInputType] = useState('password');

  const onChangeVisibilityPassword = (e) => {
    e.preventDefault();
    setInputType(inputType === 'text' ? 'password' : 'text');
  };

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }
  
  return (
    <center>
      <StyledComponents.StyledCard>
        <StyledComponents.StyledCardHeader>{campi["header"]}</StyledComponents.StyledCardHeader>
        <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
          {indici.map((i) => {
            const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
              getTextAreaTag(1, true, StyledComponents)
            );
            const StyledEyeTag = (inputType === "password") ? StyledComponents.StyledEyeClosedNotSelected : StyledComponents.StyledEyeOpenNotSelected;
            return ( 
              <Fragment key={i}>
                <StyledComponents.StyledRow>
                  <NomeTag 
                    style={(campi.name[i] === "password") ? {maxWidth:"80%"} : null}
                    rows={1}
                    name={campi.name[i]} 
                    id={campi.id[i]}
                    type={(campi.name[i] === "password") ? inputType : campi.type[i]}
                    step={campi.step[i]}
                    min={campi.min[i]}
                    value={campi.value[i]}
                    placeholder={campi.placeholder[i]}
                    onChange={campi.onChange}
                    onClick={campi.onClick}
                    onBlur={campi.onBlur}
                    onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                  />
                  {(campi.name[i] === "password") && (
                    <StyledEyeTag
                      style={{
                        maxWidth: "20%",
                        marginLeft: "-6px", 
                        marginTop: "13px"
                      }} 
                      size={StyledComponents.grandezzaIcona} 
                      onClick={onChangeVisibilityPassword} 
                    />
                  )}
                </StyledComponents.StyledRow>
                {campi.options[i]}
                {(campi.errore[i]) && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
              </Fragment>
            );
          })}
        </StyledComponents.SlideContainer>
        <OperazioniLogin
          eseguiLogin={eseguiLogin} 
          vistaItem={"card"}
          StyledComponents={StyledComponents}
        />
      </StyledComponents.StyledCard>
    </center>
  );
}

export function CardProfilo({campi, indici, eseguiModificaProfilo}) {
  let maxHeight = "2000px";
  const [passwordAttualeType, setPasswordAttualeType] = useState('password');
  const [nuovaPasswordType, setNuovaPasswordType] = useState('password');
  const [confermaNuovaPasswordType, setConfermaNuovaPasswordType] = useState('password');

  const onChangeVisibilityPassword = (e, nome) => {
    e.preventDefault();
    if(nome === "password_attuale") {
      setPasswordAttualeType(passwordAttualeType === 'text' ? 'password' : 'text');
    }
    else if(nome === "nuova_password") {
      setNuovaPasswordType(nuovaPasswordType === 'text' ? 'password' : 'text');
    }
    else if(nome === "conferma_nuova_password") {
      setConfermaNuovaPasswordType(confermaNuovaPasswordType === 'text' ? 'password' : 'text');
    } 
  };

  return (
    <center>
      <StyledComponents.StyledCard>
        <StyledComponents.StyledCardHeader>{campi["header"]}</StyledComponents.StyledCardHeader>  
        <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
          {indici.map((i) => {
            const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
              getTextAreaTag(1, true, StyledComponents)
            );
            const StyledEyeTag = (
              (
                campi.name[i] === "password_attuale" && passwordAttualeType === "password" || 
                campi.name[i] === "nuova_password" && nuovaPasswordType === "password" || 
                campi.name[i] === "conferma_nuova_password" && confermaNuovaPasswordType === "password"
              ) ? StyledComponents.StyledEyeClosedNotSelected : StyledComponents.StyledEyeOpenNotSelected
            );
            return ( 
              <Fragment key={i}>
                <StyledComponents.StyledRow>
                  <NomeTag 
                    style={(campi.name[i].includes("password")) ? {maxWidth:"80%"} : null}
                    rows={1}
                    name={campi.name[i]} 
                    id={campi.id[i]}
                    type={(campi.name[i].includes("password")) ? (
                      (campi.name[i] === "password_attuale") ? passwordAttualeType : (
                        (campi.name[i] === "nuova_password")) ? nuovaPasswordType : confermaNuovaPasswordType
                    ) : campi.type[i]}
                    step={campi.step[i]}
                    min={campi.min[i]}
                    value={campi.value[i]}
                    placeholder={campi.placeholder[i]}
                    onChange={campi.onChange}
                    onClick={campi.onClick}
                    onBlur={campi.onBlur}
                    onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                  />
                  {(campi.name[i].includes("password")) && (
                    <StyledEyeTag
                      style={{
                        maxWidth: "20%",
                        marginLeft: "-6px", 
                        marginTop: "13px"
                      }} 
                      size={StyledComponents.grandezzaIcona} 
                      onClick={(e) => onChangeVisibilityPassword(e, campi.name[i])} 
                    />
                  )}
                </StyledComponents.StyledRow>
                {campi.options[i]}

                {(campi.errore[i]) && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
              </Fragment>
            );
          })}
        </StyledComponents.SlideContainer>
        <OperazioniModificaProfilo 
          eseguiModificaProfilo={eseguiModificaProfilo}
          vistaItem={"card"}
          StyledComponents={StyledComponents}
        />
      </StyledComponents.StyledCard>
    </center>
  );
}

export function CardWidget({nome, img, id, onClickWidget, backgroundColor}) {  
  return (
    <Card 
      style={{ 
        width: "300px", 
        height: "400px", 
        backgroundColor: backgroundColor, 
        borderRadius: "50px", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        onClickWidget(e, id);
      }}
      draggable={false}
    >
      <Card.Img 
        style={{ 
          width: "220px", 
          height: "220px", 
          borderRadius: "20px",
          marginTop: "40px", 
          marginBottom: "20px", 
          pointerEvents: "none", // Ignora eventi per prevenire interferenze
        }} 
        variant="top" 
        src={img} 
      />
      <Card.Body>
        <Card.Title
          style={{color: "#FFFFFF", textAlign: "center"}}
        >{nome}</Card.Title>
      </Card.Body>
    </Card>
  );
}

export function CardEntrateItems({ entrateItems, lingua, etichettaIta, etichettaEng }) {
  return (
    <Card
      style={{
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50px',
        paddingLeft: "50px", 
        paddingRight: "50px",
        paddingBottom: "50px",
        overflowX: 'auto',
      }}
    >
      <Card.Body>
        <center>
          <Card.Title style={{ color: '#FFFFFF' }}>{lingua === "italiano" ? etichettaIta : etichettaEng}</Card.Title>
        </center>
      </Card.Body>
      <center>
        <Table
          striped
          bordered
          hover
          variant='dark'
          style={{
            borderRadius: '50px',
            marginTop: '0',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "ANNO" : "YEAR"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GEN" : "JAN"}</th>
              <th style={{color: "#FFFFFF"}}>FEB</th>
              <th style={{color: "#FFFFFF"}}>MAR</th>
              <th style={{color: "#FFFFFF"}}>APR</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "MAG" : "MAY"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GIU" : "JUN"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "LUG" : "JUL"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "AGO" : "AUG"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "SET" : "SEP"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "OTT" : "OCT"}</th>
              <th style={{color: "#FFFFFF"}}>NOV</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "DIC" : "DEC"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "TOT ENTRATE" : "TOT REVENUE"}</th>
            </tr>
          </thead>
          <tbody>
            {entrateItems.map((item, i) => (
              (i > 1) && (
                <tr key={i}>
                  {Object.values(item).map((value, j) => (
                    <td 
                      style={{
                        color: getColor(value, j, "entrata"),
                        fontWeight: (j === 0) ? "bold" : null,
                      }} 
                      key={j}
                    >
                      {(j > 0) ? parseFloat(value).toFixed(2) + " €" : value}
                    </td>
                  ))}
                </tr>
              )
            ))}
          </tbody>
          <tbody>
            <tr>
              {Object.values(entrateItems[0]).map((value, j) => (
                <td
                  style={{
                    color: getColor(value, j, "entrata"),
                    fontWeight: (j === 0) ? "bold" : null,
                  }}  
                  key={j}
                >
                  {(j > 0) ? parseFloat(value).toFixed(2) + " €" : value}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </center>
    </Card>
  );
}

export function CardEntrateItemsByName({ entrateItems, lingua, tipoItemIta, tipoItemEng, etichettaIta, etichettaEng }) {
  const [annoTmp, setAnnoTmp] = useState(0);
  return (
    <Card
      style={{
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50px',
        paddingLeft: "50px", 
        paddingRight: "50px",
        paddingBottom: "50px",
        overflowX: 'auto',
      }}
    >
      <Card.Body>
        <center>
          <Card.Title style={{ color: '#FFFFFF' }}>{lingua === "italiano" ? etichettaIta : etichettaEng}</Card.Title>
        </center>
      </Card.Body>
      <center>
        <Table
          striped
          bordered
          hover
          variant='dark'
          style={{
            borderRadius: '50px',
            marginTop: '0',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          <thead></thead>
          <tbody>
            {entrateItems.map((entrata, i) => (
              <Fragment key={i}>
                {(i === 0 || entrateItems[i].anno !== entrateItems[i-1].anno) && (
                  <>
                    <tr><th colSpan={14}>{lingua==="italiano" ? "ANNO" : "YEAR"} = {entrata.anno}</th></tr>
                    <tr>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? tipoItemIta : tipoItemEng}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GEN" : "JAN"}</th>
                      <th style={{color: "#FFFFFF"}}>FEB</th>
                      <th style={{color: "#FFFFFF"}}>MAR</th>
                      <th style={{color: "#FFFFFF"}}>APR</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "MAG" : "MAY"}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GIU" : "JUN"}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "LUG" : "JUL"}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "AGO" : "AUG"}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "SET" : "SEP"}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "OTT" : "OCT"}</th>
                      <th style={{color: "#FFFFFF"}}>NOV</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "DIC" : "DEC"}</th>
                      <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "TOT ENTRATE" : "TOT REVENUE"}</th>
                    </tr>
                  </>
                )}
                <tr>                
                  <td style={{ color: "#FFFFFF", fontWeight: "bold", }}>
                    {entrata.nome}
                  </td>
                  <td style={{ color: getColor(entrata.totale_gennaio, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_gennaio} = {parseFloat(entrata.totale_gennaio).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_febbraio, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_febbraio} = {parseFloat(entrata.totale_febbraio).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_marzo, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_marzo} = {parseFloat(entrata.totale_marzo).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_aprile, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_aprile} = {parseFloat(entrata.totale_aprile).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_maggio, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_maggio} = {parseFloat(entrata.totale_maggio).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_giugno, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_giugno} = {parseFloat(entrata.totale_giugno).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_luglio, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_luglio} = {parseFloat(entrata.totale_luglio).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_agosto, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_agosto} = {parseFloat(entrata.totale_agosto).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_settembre, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_settembre} = {parseFloat(entrata.totale_settembre).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_ottobre, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_ottobre} = {parseFloat(entrata.totale_ottobre).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_novembre, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_novembre} = {parseFloat(entrata.totale_novembre).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(entrata.totale_dicembre, 1, "entrata"), fontWeight: "bold", }}>
                    x {entrata.quantita_dicembre} = {parseFloat(entrata.totale_dicembre).toFixed(2) + " €"}
                  </td>
                  <td style={{ color: getColor(getTotaleEntrateAnno(entrata), 1, "entrata"), fontWeight: "bold", }}>
                    x {getQuantitaEntrateAnno(entrata)} = {parseFloat(getTotaleEntrateAnno(entrata)).toFixed(2) + " €"}
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </Table>
      </center>
    </Card>
  );
}

export function CardUsciteItems({ usciteItems, lingua, etichettaIta, etichettaEng }) {
  return (
    <Card
      style={{
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50px',
        paddingLeft: "50px", 
        paddingRight: "50px",
        paddingBottom: "50px",
        overflowX: 'auto',
      }}
    >
      <Card.Body>
        <center>
          <Card.Title style={{ color: '#FFFFFF' }}>{lingua === "italiano" ? etichettaIta : etichettaEng}</Card.Title>
        </center>
      </Card.Body>
      <center>
        <Table
          striped
          bordered
          hover
          variant='dark'
          style={{
            borderRadius: '50px',
            marginTop: '0',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "ANNO" : "YEAR"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GEN" : "JAN"}</th>
              <th style={{color: "#FFFFFF"}}>FEB</th>
              <th style={{color: "#FFFFFF"}}>MAR</th>
              <th style={{color: "#FFFFFF"}}>APR</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "MAG" : "MAY"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GIU" : "JUN"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "LUG" : "JUL"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "AGO" : "AUG"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "SET" : "SEP"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "OTT" : "OCT"}</th>
              <th style={{color: "#FFFFFF"}}>NOV</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "DIC" : "DEC"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "TOT USCITE" : "TOT EXIT"}</th>
            </tr>
          </thead>
          <tbody>
            {usciteItems.map((uscita, i) => (
              (i > 1) && (
                <tr key={i}>
                  {Object.values(uscita).map((value, j) => (
                    <td
                      style={{
                        color: getColor(-value, j, "uscita"),
                        fontWeight: (j === 0) ? "bold" : null,
                      }}  
                      key={j}
                    >
                      {(j > 0) ? parseFloat(-value).toFixed(2) + " €" : value}
                    </td>
                  ))}
                </tr>
              )
            ))}
          </tbody>
          <tbody>
            <tr>
              {Object.values(usciteItems[0]).map((value, j) => (
                <td
                  style={{
                    color: getColor(-value, j, "uscita"),
                    fontWeight: (j === 0) ? "bold" : null,
                  }}  
                  key={j}
                >
                  {(j > 0) ? parseFloat(-value).toFixed(2) + " €" : value}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </center>
    </Card>
  );
}

export function CardRicavi({ entrate, uscite, lingua }) {
  return (
    <Card
      style={{
        display: 'inline-block',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: '50px',
        paddingLeft: "50px", 
        paddingRight: "50px",
        paddingBottom: "50px",
        overflowX: 'auto',
      }}
    >
      <Card.Body>
        <center>
          <Card.Title style={{ color: '#FFFFFF' }}>{lingua === "italiano" ? "Ricavi" : "Revenues"}</Card.Title>
        </center>
      </Card.Body>
      <center>
        <Table
          striped
          bordered
          hover
          variant='dark'
          style={{
            borderRadius: '50px',
            marginTop: '0',
            marginBottom: '10px',
            textAlign: 'center',
          }}
        >
          <thead>
            <tr>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "ANNO" : "YEAR"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GEN" : "JAN"}</th>
              <th style={{color: "#FFFFFF"}}>FEB</th>
              <th style={{color: "#FFFFFF"}}>MAR</th>
              <th style={{color: "#FFFFFF"}}>APR</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "MAG" : "MAY"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "GIU" : "JUN"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "LUG" : "JUL"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "AGO" : "AUG"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "SET" : "SEP"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "OTT" : "OCT"}</th>
              <th style={{color: "#FFFFFF"}}>NOV</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "DIC" : "DEC"}</th>
              <th style={{color: "#FFFFFF"}}>{lingua === "italiano" ? "TOT RICAVI" : "TOT EARNINGS"}</th>
            </tr>
          </thead>
          <tbody>
            {entrate.map((entrata, i) => (
              i > 1 && (
                <tr key={i}>
                  <td                  
                    style={{
                      fontWeight: "bold",
                    }} 
                  >{entrata.Anno}</td>
                  {uscite[i] && (
                    <>
                  <td style={{color:getColor(entrata.gen - uscite[i].gen)}}>{parseFloat(entrata.gen - uscite[i].gen).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.feb - uscite[i].feb)}}>{parseFloat(entrata.feb - uscite[i].feb).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.mar - uscite[i].mar)}}>{parseFloat(entrata.mar - uscite[i].mar).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.apr - uscite[i].apr)}}>{parseFloat(entrata.apr - uscite[i].apr).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.mag - uscite[i].mag)}}>{parseFloat(entrata.mag - uscite[i].mag).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.giu - uscite[i].giu)}}>{parseFloat(entrata.giu - uscite[i].giu).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.lug - uscite[i].lug)}}>{parseFloat(entrata.lug - uscite[i].lug).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.ago - uscite[i].ago)}}>{parseFloat(entrata.ago - uscite[i].ago).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.set - uscite[i].set)}}>{parseFloat(entrata.set - uscite[i].set).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.ott - uscite[i].ott)}}>{parseFloat(entrata.ott - uscite[i].ott).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.nov - uscite[i].nov)}}>{parseFloat(entrata.nov - uscite[i].nov).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.dic - uscite[i].dic)}}>{parseFloat(entrata.dic - uscite[i].dic).toFixed(2)} €</td>
                  <td style={{color:getColor(entrata.totale_anno - uscite[i].totale_anno)}}>{parseFloat(entrata.totale_anno - uscite[i].totale_anno).toFixed(2)} €</td>
                </>
                )}
                </tr>
              )
            ))}
            <tr key={0}>
              <td
                style={{
                  fontWeight: "bold",
                }} 
              >{entrate[0].Anno}</td>
              <td style={{color:getColor(entrate[0].gen - uscite[0].gen, 1)}}>{parseFloat(entrate[0].gen - uscite[0].gen).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].feb - uscite[0].feb)}}>{parseFloat(entrate[0].feb - uscite[0].feb).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].mar - uscite[0].mar)}}>{parseFloat(entrate[0].mar - uscite[0].mar).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].apr - uscite[0].apr)}}>{parseFloat(entrate[0].apr - uscite[0].apr).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].mag - uscite[0].mag)}}>{parseFloat(entrate[0].mag - uscite[0].mag).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].giu - uscite[0].giu)}}>{parseFloat(entrate[0].giu - uscite[0].giu).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].lug - uscite[0].lug)}}>{parseFloat(entrate[0].lug - uscite[0].lug).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].ago - uscite[0].ago)}}>{parseFloat(entrate[0].ago - uscite[0].ago).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].set - uscite[0].set)}}>{parseFloat(entrate[0].set - uscite[0].set).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].ott - uscite[0].ott)}}>{parseFloat(entrate[0].ott - uscite[0].ott).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].nov - uscite[0].nov)}}>{parseFloat(entrate[0].nov - uscite[0].nov).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].dic - uscite[0].dic)}}>{parseFloat(entrate[0].dic - uscite[0].dic).toFixed(2)} €</td>
              <td style={{color:getColor(entrate[0].totale_anno - uscite[0].totale_anno)}}>{parseFloat(entrate[0].totale_anno - uscite[0].totale_anno).toFixed(2)} €</td>
            </tr>
          </tbody>
        </Table>
      </center>
    </Card>
  );
}

export function CardInformazioni({ totaleItems }) {
  return (
    <StyledComponents.StyledCard>
      <StyledComponents.StyledCardHeader>Informations</StyledComponents.StyledCardHeader>
      <StyledComponents.SlideContainer>
        {totaleItems && (
          <StyledComponents.StyledInputBlock 
            rows={1} 
            name="totale_items" 
            id="totale_items" 
            type="text" 
            value={totaleItems ? totaleItems : "Errore!!"} 
            readOnly 
          />
        )}
      </StyledComponents.SlideContainer>
    </StyledComponents.StyledCard>
  );
}

export function CardEntrateUscite({datiRicerca, setDatiRicerca, handleInputChange, eseguiRicerca, lingua}) {
  let maxHeight = "2000px";
  return (
    <StyledComponents.StyledCard>
      <StyledComponents.StyledCardHeader>{lingua === "italiano" ? "Ricerca entrate e uscite" : "Searching for inputs and outputs"}</StyledComponents.StyledCardHeader>
      <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
        <StyledComponents.StyledInputModifica
          rows={1}
          name="primo_anno"
          id="primo_anno"
          type="number"
          step={1}
          value={datiRicerca.primo_anno}
          placeholder="Primo anno"
          onChange={(e) => handleInputChange(e, setDatiRicerca)}
          onContextMenu={(e) => handleRightClick(e, "Primo anno")}
        />
        <StyledComponents.StyledSelectModifica 
          name="ultimo_anno" 
          id="ultimo_anno"
          value={datiRicerca.ultimo_anno}
          onChange={(e) => handleInputChange(e, setDatiRicerca)}
          onContextMenu={(e) => handleRightClick(e, "Ultimo anno")}
        >
          <option value={parseInt(datiRicerca.primo_anno)+1}>{parseInt(datiRicerca.primo_anno)+1}</option>
          <option value={parseInt(datiRicerca.primo_anno)+2}>{parseInt(datiRicerca.primo_anno)+2}</option>
          <option value={parseInt(datiRicerca.primo_anno)+3}>{parseInt(datiRicerca.primo_anno)+3}</option>
          <option value={parseInt(datiRicerca.primo_anno)+4}>{parseInt(datiRicerca.primo_anno)+4}</option>
          <option value={parseInt(datiRicerca.primo_anno)+5}>{parseInt(datiRicerca.primo_anno)+5}</option>
        </StyledComponents.StyledSelectModifica>
      </StyledComponents.SlideContainer>
      <OperazioniRicercaEntrateUscite 
        eseguiRicerca={(e) => eseguiRicerca(e)} 
        vistaItem={"card"}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledCard>
  )
}








