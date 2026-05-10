// React e Redux
import { useState, Fragment } from 'react';
// Riutilizzabile
import StyledComponents from './StyledFormItem';
import { 
  OperazioniNuovoItem, OperazioniCercaItems, OperazioniRicercaEntrateUscite, OperazioniLogin, 
  OperazioniModificaProfilo, OperazioniFileItems, OperazioniItemEsistente, 
  OperazioniCambioTipoForm, OperazioniCambioTipoForm2 
} from '../Operazioni';
import { getInputTag, getTextAreaTag } from '../Tags';

export function CambioTipoForm({elementi, tipoForm, setTipoForm, StyledComponents}) {
  let maxHeight = "2000px";

  return (
    <StyledComponents.StyledForm>
      <OperazioniCambioTipoForm2
        elementi={elementi}
        tipoForm={tipoForm}
        setTipoForm={setTipoForm}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  );
}

export function CambioTipoForm2({elementi, tipoForm, setTipoForm, StyledComponents}) {
  let maxHeight = "2000px";

  return (
    <StyledComponents.StyledForm>
      <OperazioniCambioTipoForm2
        elementi={elementi}
        tipoForm={tipoForm}
        setTipoForm={setTipoForm}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  );
}

export function FormNuovoItem({campi, indici, eseguiSalvataggio}) {
  return (
    <StyledComponents.StyledForm>
      <StyledComponents.StyledHeader>{campi["header"]}</StyledComponents.StyledHeader>  
      <StyledComponents.SlideContainer style={{
        maxHeight: "2000px", 
        overflowY: "auto" 
      }}>
        {indici.map((i) => {
          const NomeTag = campi.type[i] 
            ? getInputTag(1, true, StyledComponents) 
            : getTextAreaTag(1, true, StyledComponents);

          return ( 
            <Fragment key={i}>
              <StyledComponents.StyledLabel htmlFor={campi.name[i]}>{campi.label[i]}</StyledComponents.StyledLabel>
              {(campi.name[i] === "prezzo") ? (
                <StyledComponents.StyledRow>
                  <>
                    <NomeTag 
                      style={(["prezzo", "totale"].includes(campi.name[i])) 
                        ? {marginLeft:"-10%", marginRight:0, minWidth:"105%"} 
                        : null}
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
                    />
                    {(["prezzo", "totale"].includes(campi.name[i])) && (
                      <StyledComponents.StyledEuroNotSelected
                        style={{
                          maxWidth: "5%",
                          marginTop: "13px"
                        }} 
                        size={StyledComponents.grandezzaIcona} 
                        onClick={null} 
                      />
                    )}
                    {campi.options[i]}
                  </>
                </StyledComponents.StyledRow>
              ) : (
                <>
                  <NomeTag 
                    style={(["prezzo", "totale"].includes(campi.name[i])) 
                      ? {marginLeft:"-10%", marginRight:0, minWidth:"105%"} 
                      : null}
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
                  />
                  {(["prezzo", "totale"].includes(campi.name[i])) && (
                    <StyledComponents.StyledEuroNotSelected
                      style={{
                        maxWidth: "5%",
                        marginTop: "13px"
                      }} 
                      size={StyledComponents.grandezzaIcona} 
                      onClick={null} 
                    />
                  )}
                  {campi.options[i]}
                </>
              )}
              {(campi.errore[i] !== "") && (<StyledComponents.StyledSpanErrore>{campi.errore[i]}</StyledComponents.StyledSpanErrore>)}
            </Fragment>
          );
        })}
        <br /> <br />
      </StyledComponents.SlideContainer>
      <OperazioniNuovoItem eseguiSalvataggio={eseguiSalvataggio} vistaItem={"form"} StyledComponents={StyledComponents} />
    </StyledComponents.StyledForm>
  );
}

export function FormRicercaItems({campi, indici, handleSearch}) {
  const [isVisible, setIsVisible] = useState(true);
  const [arrowUp, setArrowUp] = useState(true);
  let maxHeight = (isVisible) ? "2000px" : "0px";
  let InputTag = getInputTag(1, true, StyledComponents);
  let TextAreaTag = getTextAreaTag(1, true, StyledComponents);

  return (
    <StyledComponents.StyledForm>
      <StyledComponents.StyledHeader>{campi["header"]}</StyledComponents.StyledHeader>
      <StyledComponents.SlideContainer style={{
        maxHeight: "2000px", 
        overflowY: "auto"
      }}>
        {indici.map((i) => {
          const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
            getTextAreaTag(1, true, StyledComponents)
          );
          return ( 
            <Fragment key={i}>
              <StyledComponents.StyledLabel htmlFor={campi.name[i]}>{campi.label[i]}</StyledComponents.StyledLabel>
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
              />
            </Fragment>
          );
        })}
        <br /> <br />
      </StyledComponents.SlideContainer>
      <OperazioniCercaItems
        setIsVisible={setIsVisible}
        arrowUp={arrowUp}
        setArrowUp={setArrowUp}
        handleSearch={handleSearch}
        vistaItem={"form"}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  );
}

export function FormLogin({campi, indici, eseguiLogin}) {
  let maxHeight = "2000px";
  const [inputType, setInputType] = useState('password');

  const onChangeVisibilityPassword = (e) => {
    e.preventDefault();
    setInputType(inputType === 'text' ? 'password' : 'text');
  };

  return (
    <StyledComponents.StyledForm>
      <StyledComponents.StyledHeader>{campi["header"]}</StyledComponents.StyledHeader>  
      <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
        {indici.map((i) => {
          const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
            getTextAreaTag(1, true, StyledComponents)
          );
          const StyledEyeTag = (inputType === "password") ? StyledComponents.StyledEyeClosedNotSelected : StyledComponents.StyledEyeOpenNotSelected;
          return ( 
            <Fragment key={i}>
              <StyledComponents.StyledLabel htmlFor={campi.name[i]}>{campi.label[i]}</StyledComponents.StyledLabel>
              <StyledComponents.StyledRow>
                <NomeTag 
                  style={
                    campi.name[i] !== "password"
                      ? { marginLeft: "-10%", marginRight: 0, minWidth: "115%", width: "100%" }
                      : { marginLeft: "-10%", marginRight: 0, minWidth: "105%" }
                  }
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
                />
                {(campi.name[i] === "password") && (
                  <StyledEyeTag
                    style={{
                      maxWidth: "5%",
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
        <br /> <br />
      </StyledComponents.SlideContainer>
      <OperazioniLogin 
        eseguiLogin={eseguiLogin}
        vistaItem={"form"}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  );
}

export function FormProfilo({campi, indici, eseguiModificaProfilo}) {
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
    <StyledComponents.StyledForm>
      <StyledComponents.StyledHeader>{campi["header"]}</StyledComponents.StyledHeader>  
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
              <StyledComponents.StyledLabel htmlFor={campi.name[i]}>{campi.label[i]}</StyledComponents.StyledLabel>
              <StyledComponents.StyledRow>
                <NomeTag 
                  style={
                    !campi.name[i].includes("password")
                      ? { marginLeft: "-10%", marginRight: 0, minWidth: "115%", width: "100%" }
                      : { marginLeft: "-10%", marginRight: 0, minWidth: "105%" }
                  }
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
                />
                {(campi.name[i].includes("password")) && (
                  <StyledEyeTag 
                    style={{
                      maxWidth: "5%",
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
        <br /> <br />
      </StyledComponents.SlideContainer>
      <OperazioniModificaProfilo 
        eseguiModificaProfilo={eseguiModificaProfilo}
        vistaItem={"form"}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  );
}

export function FormFileItems({campi, indici, ottieniFileRangePDF, ottieniFileRangeExcel, eliminaItemsRange}) {
  const [isVisible, setIsVisible] = useState(true);
  const [arrowUp, setArrowUp] = useState(true);
  let maxHeight = (isVisible) ? "2000px" : "0px";
  let InputTag = getInputTag(1, true, StyledComponents);
  let TextAreaTag = getTextAreaTag(1, true, StyledComponents);

  return (
    <StyledComponents.StyledForm>
      <StyledComponents.StyledHeader>{campi["header"]}</StyledComponents.StyledHeader>
      <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
        {indici.map((i) => {
          const NomeTag = (campi.type[i]) ? getInputTag(1, true, StyledComponents) : (
            getTextAreaTag(1, true, StyledComponents)
          );
          return ( 
            <Fragment key={i}>
              <StyledComponents.StyledLabel htmlFor={campi.name[i]}>{campi.label[i]}</StyledComponents.StyledLabel>
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
              />
            </Fragment>
          );
        })}
        <br /> <br />
      </StyledComponents.SlideContainer>
      <OperazioniFileItems 
        ottieniFileRangePDF={ottieniFileRangePDF} 
        ottieniFileRangeExcel={ottieniFileRangeExcel} 
        eliminaItemsRange={eliminaItemsRange} 
        vistaItem={"form"}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  );
}

export function FormEntrateUscite({datiRicerca, setDatiRicerca, handleInputChange, eseguiRicerca, lingua}) {
  let maxHeight = "2000px";
  return (
    <StyledComponents.StyledForm>
      <StyledComponents.StyledHeader>{lingua === "italiano" ? "Ricerca entrate e uscite" : "Searching for inputs and outputs"}</StyledComponents.StyledHeader>
      <StyledComponents.SlideContainer style={{maxHeight: `${maxHeight}`}}>
        <StyledComponents.StyledLabel htmlFor="primo_anno">{lingua === "italiano" ? "Primo anno" : "First year"}</StyledComponents.StyledLabel>
        <StyledComponents.StyledInputModifica
          rows={1}
          name="primo_anno"
          id="primo_anno"
          type="number"
          step={1}
          value={datiRicerca.primo_anno}
          placeholder={lingua === "italiano" ? "Primo anno" : "First year"}
          onChange={(e) => handleInputChange(e, setDatiRicerca)}
        />
        <StyledComponents.StyledLabel htmlFor="ultimo_anno">{lingua === "italiano" ? "Ultimo anno" : "Last year"}</StyledComponents.StyledLabel>
        <StyledComponents.StyledSelectModifica 
          name="ultimo_anno" 
          id="ultimo_anno"
          value={datiRicerca.ultimo_anno}
          onChange={(e) => handleInputChange(e, setDatiRicerca)}
        >
          <option value={parseInt(datiRicerca.primo_anno)+1}>{parseInt(datiRicerca.primo_anno)+1}</option>
          <option value={parseInt(datiRicerca.primo_anno)+2}>{parseInt(datiRicerca.primo_anno)+2}</option>
          <option value={parseInt(datiRicerca.primo_anno)+3}>{parseInt(datiRicerca.primo_anno)+3}</option>
          <option value={parseInt(datiRicerca.primo_anno)+4}>{parseInt(datiRicerca.primo_anno)+4}</option>
          <option value={parseInt(datiRicerca.primo_anno)+5}>{parseInt(datiRicerca.primo_anno)+5}</option>
        </StyledComponents.StyledSelectModifica>
        <br /> <br />
      </StyledComponents.SlideContainer>
      <OperazioniRicercaEntrateUscite 
        eseguiRicerca={(e) => eseguiRicerca(e)}  
        vistaItem={"form"}
        StyledComponents={StyledComponents}
      />
    </StyledComponents.StyledForm>
  )
}









