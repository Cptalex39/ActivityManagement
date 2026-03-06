// React e Redux
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// Views
import Header from "../components/Header";
import { OperazioniForms } from '../forms/OperazioniForms';
import { AutenticazioneForms } from '../forms/AutenticazioneForms';
import { handleLogin } from '../operazioni/AutenticazioneOperazioni';
// Actions
import { AutenticazioneActions } from "../../actions/AutenticazioneActions";
// Riutilizzabile
import { FormLogin } from "../../../riutilizzabile/form_item/FormItem";
import { CardLogin } from '../../../riutilizzabile/card_item/CardItem';
import { RowLogin } from '../../../riutilizzabile/row_item/RowItem';

const Login = () => {
  const autenticazioneActions = new AutenticazioneActions();
  const autenticazioneForms = new AutenticazioneForms();
  const operazioniForms = new OperazioniForms();
  const [datiLogin, setDatiLogin] = useState({
    username: "", 
    password: "", 
    errore_username: "", 
    errore_password: ""
  });
  const navigate = useNavigate();
  const stileState = useSelector((state) => state.stile.value);
  const attivitaState = useSelector((state) => state.attivita.value)

  const LoginTag = (stileState.vistaForm === "form") ? FormLogin : (
    (stileState.vistaForm === "card") ? CardLogin : RowLogin
  )
  const campiLogin = autenticazioneForms.getCampiLogin(datiLogin, (e) => operazioniForms.handleInputChange(e, setDatiLogin), null, null);
  
  return (
    <>
      <Header />

      <div className="main-content" />
      
      <LoginTag 
        campi={campiLogin}
        indici={[...Array(campiLogin.label.length).keys()]}
        eseguiLogin={(e) => handleLogin(e, autenticazioneActions, datiLogin, setDatiLogin, navigate, attivitaState.lingua)} 
      />
    </>
  );
};

export default Login;
