// React e Redux
import { useState, Fragment } from 'react';
// Riutilizzabile
import StyledComponents from './StyledRowItem';
import { OperazioniNuovoItem, OperazioniCercaItems, OperazioniRicercaEntrateUscite, OperazioniLogin, OperazioniModificaProfilo, OperazioniFileItems, OperazioniItemEsistente } from '../Operazioni';
import { getInputTag, getTextAreaTag } from '../Tags';
import { handleChange, handleClick } from '../Handle';

export function RowNuovoItem({campi, indici, eseguiSalvataggio}) {
  let InputTag = getInputTag(1, true, StyledComponents);
  let TextAreaTag = getTextAreaTag(1, true, StyledComponents);

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }

  return (
    <StyledComponents.StyledRow>
      <OperazioniNuovoItem eseguiSalvataggio={eseguiSalvataggio} vistaItem={"row"} StyledComponents={StyledComponents} />
      {indici.map((i) => {
        const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
          getTextAreaTag(1, true, StyledComponents)
        );
        return ( 
          <Fragment key={i}>
            <StyledComponents.StyledCol>
              <div style={{width: "100%"}}>
                <StyledComponents.StyledRow>
                  <NomeTag 
                    rows={1}
                    style={(["prezzo", "totale"].includes(campi.name[i])) ? {maxWidth:"90%"} : null}
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
                  {(["prezzo", "totale"].includes(campi.name[i])) && (
                    <StyledComponents.StyledEuroNotSelected
                      style={{
                        maxWidth: "10%",
                        marginLeft: "-6px", 
                      }} 
                      size={StyledComponents.grandezzaIcona} 
                      onClick={null} 
                    />
                  )}
                  {campi.options[i]}
                </StyledComponents.StyledRow>
                {(campi.errore[i] !== "") && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
              </div>
            </StyledComponents.StyledCol>
          </Fragment>
        );
      })}
    </StyledComponents.StyledRow>
  );
}

export function RowRicercaItems({campi, indici, handleSearch}) {
  let [visibilita, setVisibilita] = useState([true, true, true, true, true, true, true, true]);
  const [arrowUp, setArrowUp] = useState(true);
  let InputTag = getInputTag(1, true, StyledComponents);
  let TextAreaTag = getTextAreaTag(1, true, StyledComponents);

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }

  return (
    <StyledComponents.StyledRow>
      <OperazioniCercaItems 
        visibilita={visibilita} 
        setVisibilita={setVisibilita} 
        arrowUp={arrowUp} 
        setArrowUp={setArrowUp} 
        handleSearch={handleSearch}
        vistaItem={"row"}
        StyledComponents={StyledComponents}
      />
      {indici.map((i) => {
        const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
          getTextAreaTag(1, true, StyledComponents)
        );
        return ( 
          <Fragment key={i}>
            <StyledComponents.StyledCol>
              <div style={{width: "100%"}}>
                <StyledComponents.StyledRow>
                  {(visibilita[i]) && (
                    <>
                      <NomeTag 
                        style={(["prezzo_min", "prezzo_max", "totale_min", "totale_max"].includes(campi.name[i])) ? {maxWidth:"90%"} : null}
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
                      {(["prezzo_min", "prezzo_max", "totale_min", "totale_max"].includes(campi.name[i])) && (
                        <StyledComponents.StyledEuroNotSelected
                          style={{
                            maxWidth: "20%",
                            marginLeft: "-6px", 
                          }} 
                          size={StyledComponents.grandezzaIcona} 
                          onClick={null} 
                        />
                      )}
                    </>
                  )}
                </StyledComponents.StyledRow>
              </div>
            </StyledComponents.StyledCol>
          </Fragment>
        );
      })} 
    </StyledComponents.StyledRow>
  );
}

export function RowItemEsistente({ item, campi, indici, operazioneModifica, operazioneElimina, tipoItem, handleBlurItem }) {
  const NomeTagHeader = getInputTag(campi.tipoSelezione, false, StyledComponents);
  const [localValues, setLocalValues] = useState(() =>
    indici.reduce((acc, i) => ({ ...acc, [i]: campi.value[i] }), {})
  ); // Gestione dello stato locale

  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }
    
  return (
    <StyledComponents.StyledRow>
      <OperazioniItemEsistente 
        operazioneModifica={operazioneModifica} 
        operazioneElimina={operazioneElimina} 
        item={item} 
        vistaItem={"card"} 
        StyledComponents={StyledComponents} 
      />
      
      <StyledComponents.StyledCol>
        <div style={{width: "100%"}}>
          <StyledComponents.StyledRow>
            <NomeTagHeader
              rows={1}
              name="header"
              value={campi.header}
              placeholder={campi.header}
              readOnly
            />
          </StyledComponents.StyledRow>
        </div>
      </StyledComponents.StyledCol>
      
      {indici.map((i) => {
        const NomeTag = (campi.type[i]) ? getInputTag(campi.tipoSelezione, campi.valoreModificabile[i], StyledComponents) : (
          getTextAreaTag(campi.tipoSelezione, campi.valoreModificabile[i], StyledComponents)
        );
        return ( 
          <Fragment key={i}>
            <StyledComponents.StyledCol>
            <div style={{width: "100%"}}>
              <StyledComponents.StyledRow>
                <NomeTag 
                  style={["prezzo", "totale"].includes(campi.name[i]) ? {maxWidth:"80%"} : null}
                  rows={1}
                  name={campi.name[i]}
                  id={campi.id[i]}
                  type={campi.type[i]}
                  step={campi.step[i]}
                  value={localValues[i]}
                  placeholder={campi.placeholder[i]}
                  onChange={(e) => handleChange(e, i, setLocalValues)}
                  onBlur={(e) => handleBlurItem(e, item)} 
                  onClick={(e) => handleClick(e)}
                  readOnly={item.tipo_selezione !== 1}
                  onContextMenu={(e) => handleRightClick(e, campi.placeholder[i])}
                />
                {(["prezzo", "totale"].includes(campi.name[i])) && (
                  <StyledComponents.StyledEuroNotSelected
                    style={{ maxWidth: "20%", marginLeft: "-6px" }} 
                    size={StyledComponents.grandezzaIcona} 
                  />
                )}
                {campi.options[i]}
              </StyledComponents.StyledRow>
              {(campi.errore[i]) && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
            </div>
            </StyledComponents.StyledCol>
          </Fragment>
        );
      })}
    </StyledComponents.StyledRow>
  )
}

export function RowFileItems({campi, indici, ottieniFileRangePDF, ottieniFileRangeExcel, eliminaItemsRange}) {
  const handleRightClick = (e, placeholder) => {
    e.preventDefault();
    alert(placeholder);
  }

  return (
    <StyledComponents.StyledRow>
      <OperazioniFileItems 
        ottieniFileRangePDF={ottieniFileRangePDF} 
        ottieniFileRangeExcel={ottieniFileRangeExcel} 
        eliminaItemsRange={eliminaItemsRange}
        vistaItem={"row"} 
        StyledComponents={StyledComponents}
      />
      {indici.map((i) => {
        const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
          getTextAreaTag(1, true, StyledComponents)
        );
        return ( 
          <Fragment key={i}>
            <StyledComponents.StyledCol>
              <div style={{width: "100%"}}>
                <StyledComponents.StyledRow>
                  <NomeTag 
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
                </StyledComponents.StyledRow>
              </div>
            </StyledComponents.StyledCol>
          </Fragment>
        );
      })}
    </StyledComponents.StyledRow>
  )
}

export function RowLogin({campi, indici, eseguiLogin}) {
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
    <StyledComponents.StyledRow>
      <OperazioniLogin eseguiLogin={eseguiLogin} vistaItem={"row"} StyledComponents={StyledComponents} />
      {indici.map((i) => {
        const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
          getTextAreaTag(1, true, StyledComponents)
        );
        const StyledEyeTag = (inputType === "password") ? StyledComponents.StyledEyeClosedNotSelected : StyledComponents.StyledEyeOpenNotSelected;
        return ( 
          <Fragment key={i}>
            <StyledComponents.StyledCol>
              <div style={{width: "100%"}}>
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
                      }} 
                      size={StyledComponents.grandezzaIcona} 
                      onClick={onChangeVisibilityPassword} 
                    />
                  )}
                </StyledComponents.StyledRow>
                {campi.options[i]}
                {(campi.errore[i]) && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
              </div>
            </StyledComponents.StyledCol>
          </Fragment>
        );
      })}
    </StyledComponents.StyledRow>
  );
}

export function RowProfilo({campi, indici, eseguiModificaProfilo}) {
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
    <StyledComponents.StyledRow>
      <OperazioniModificaProfilo eseguiModificaProfilo={eseguiModificaProfilo} vistaItem={"row"} StyledComponents={StyledComponents} />
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
            <StyledComponents.StyledCol>
              <div style={{width: "100%"}}>
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
                      }} 
                      size={StyledComponents.grandezzaIcona} 
                      onClick={(e) => onChangeVisibilityPassword(e, campi.name[i])} 
                    />
                  )}
                </StyledComponents.StyledRow>
                {campi.options[i]}
                {(campi.errore[i]) && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
              </div>
            </StyledComponents.StyledCol>
          </Fragment>
        );
      })}
    </StyledComponents.StyledRow>
  );
}

export function RowEntrateUscite({datiRicerca, setDatiRicerca, handleInputChange, eseguiRicerca, lingua}) {
  let maxHeight = "2000px";
  return (
    <StyledComponents.StyledRow>
      <OperazioniRicercaEntrateUscite eseguiRicerca={(e) => eseguiRicerca(e)} vistaItem={"row"} StyledComponents={StyledComponents} />
      <StyledComponents.StyledCol>
        <div style={{width: "100%"}}>
          <StyledComponents.StyledRow>
            <StyledComponents.StyledInputBlock
              rows={1}
              name="header"
              value={lingua === "italiano" ? "Ricerca entrate e uscite" : "Searching for inputs and outputs"}
              placeholder={lingua === "italiano" ? "Ricerca entrate e uscite" : "Searching for inputs and outputs"}
              readOnly
            />
          </StyledComponents.StyledRow>
        </div>
      </StyledComponents.StyledCol>
      <StyledComponents.StyledCol>
        <div style={{width: "100%"}}>
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
        </div>
      </StyledComponents.StyledCol>
      <StyledComponents.StyledCol>
        <div style={{width: "100%"}}>
          <StyledComponents.StyledSelectModifica 
            name="ultimo_anno" 
            id="ultimo_anno"
            onContextMenu={(e) => handleRightClick(e, "Ultimo anno")}
            value={datiRicerca.ultimo_anno}
            onChange={(e) => handleInputChange(e, setDatiRicerca)}
          >
            <option value={parseInt(datiRicerca.primo_anno)+1}>{parseInt(datiRicerca.primo_anno)+1}</option>
            <option value={parseInt(datiRicerca.primo_anno)+2}>{parseInt(datiRicerca.primo_anno)+2}</option>
            <option value={parseInt(datiRicerca.primo_anno)+3}>{parseInt(datiRicerca.primo_anno)+3}</option>
            <option value={parseInt(datiRicerca.primo_anno)+4}>{parseInt(datiRicerca.primo_anno)+4}</option>
            <option value={parseInt(datiRicerca.primo_anno)+5}>{parseInt(datiRicerca.primo_anno)+5}</option>
          </StyledComponents.StyledSelectModifica>
        </div>
      </StyledComponents.StyledCol>
    </StyledComponents.StyledRow> 
  );
}









