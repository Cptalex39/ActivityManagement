// React e Redux
import { useState } from "react";
import { useSelector } from "react-redux";
// View
import Header from "../components/Header";
import { OperazioniForms } from "../forms/OperazioniForms";
import { AutenticazioneForms } from "../forms/AutenticazioneForms";
// Actions
import { AutenticazioneActions } from "../../actions/AutenticazioneActions"
// Riutilizzabile
import { FormProfilo } from '@gianlucascisciolo/riutilizzoreact';
import { CardProfilo } from '@gianlucascisciolo/riutilizzoreact';
import { RowProfilo } from '@gianlucascisciolo/riutilizzoreact';

const Profilo = () => {
  const stileState = useSelector((state) => state.stile.value);
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const attivitaState = useSelector((state) => state.attivita.value);
  const autenticazioneActions = new AutenticazioneActions();
  const autenticazioneForms = new AutenticazioneForms();
  const operazioniForms = new OperazioniForms();
  const [datiProfilo, setDatiProfilo] = useState({
    username_attuale: autenticazioneState.username, 
    nuovo_username: autenticazioneState.username, 
    note: (autenticazioneState.note) ? autenticazioneState.note : "", 
    password_attuale: "",
    nuova_password: "", 
    conferma_nuova_password: "", 
    errore_nuovo_username: "", 
    errore_note: "", 
    errore_password_attuale: "", 
    errore_nuova_password: "", 
    errore_conferma_nuova_password: "",   
  });
  
  const ProfiloTag = (stileState.vistaForm === "form") ? FormProfilo : (
    (stileState.vistaForm === "card") ? CardProfilo : RowProfilo
  );
  const campiProfilo = autenticazioneForms.getCampiProfilo(datiProfilo, (e) => operazioniForms.handleInputChange(e, setDatiProfilo), null, null);

  return (
    <>
      <Header />

      <div className="main-content"></div>

      <ProfiloTag  
        campi={campiProfilo} 
        indici={[...Array(campiProfilo.label.length).keys()]} 
        eseguiModificaProfilo={() => autenticazioneActions.modificaProfilo(autenticazioneState.username, autenticazioneState.ruolo, datiProfilo, setDatiProfilo)} 
      />
    </>
  )
}

export default Profilo;