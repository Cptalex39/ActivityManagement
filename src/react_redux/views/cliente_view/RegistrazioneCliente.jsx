import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { ClienteActions } from "../../actions/ClienteActions";
import { controlloRegistrazione } from "../../../utils/Controlli";

const RegistrazioneCliente = ({ chiudi }) => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const navigate = useNavigate();
  const clienteActions = new ClienteActions();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [dati, setDati] = useState({
    nome: "",
    cognome: "",
    username: "",
    password: "",
    conferma_password: "",
    email: "",
    contatto: "",
    note: "",
    tipo_item: "cliente",
    errore_nome: null,
    errore_cognome: null,
    errore_username: null,
    errore_email: null,  
    errore_password: null,
    errore_contatto: null,  
  });

  const registra = async () => {
    const risultatoControllo = controlloRegistrazione(dati);
    setDati(risultatoControllo);

    if(risultatoControllo.num_errori > 0) {
      return;
    }

    const response = await clienteActions.registrazioneCliente(dati, setDati);

    if(response.isOK) {
      alert(`Registrazione completata con successo per ${dati.username}: \nEsegui il login per accedere`);
      navigate("/login");
    }
    else {
      alert("Errore durante la registrazione... Riprova più tardi.");
    }

  };

  return (
    <>
      <Header />

      <div className="main-content">

        <div className="contenitore-1">
           <br /><br />

          <h2>Registrazione Cliente</h2>
           <br /><br />

          <div className="center">

            <input
              type="text"
              placeholder="Nome"
              value={dati.nome}
              onChange={(e) =>
                setDati({ ...dati, nome: e.target.value })
              }
            />
            {dati.errore_nome && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{dati.errore_nome}</label></>)}

            <br /><br />

             <input
              type="text"
              placeholder="Cognome"
              value={dati.cognome}
              onChange={(e) =>
                setDati({ ...dati, cognome: e.target.value })
              }
            />
            {dati.errore_cognome && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{dati.errore_cognome}</label></>)}

            <br /><br />

            <input
              type="text"
              placeholder="Username"
              value={dati.username}
              onChange={(e) =>
                setDati({ ...dati, username: e.target.value })
              }
            />
            {dati.errore_username && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{dati.errore_username}</label></>)}
            <br /><br />

            <input
              type="text"
              placeholder="Email"
              value={dati.email}
              onChange={(e) =>
                setDati({ ...dati, email: e.target.value })
              }
            />
            {dati.errore_email && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{dati.errore_email}</label></>)}

            <br /><br />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={dati.password}
              onChange={(e) =>
                setDati({ ...dati, password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Nascondi" : "Mostra"}
            </button>

            <br /><br />
            

            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Conferma Password"
              value={dati.conferma_password}
              onChange={(e) =>
                setDati({ ...dati, conferma_password: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Nascondi" : "Mostra"}
            </button>

            {dati.errore_password && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{dati.errore_password}</label></>)}
            
            <br /><br />

            <input
              type="text"
              placeholder="Contatto"
              value={dati.contatto}
              onChange={(e) =>
                setDati({ ...dati, contatto: e.target.value })
              }
            />
            {dati.errore_contatto && (<><br /><label style={{color:"#FF0000", fontWeight: "bold"}}>{dati.errore_contatto}</label></>)}

            <br /><br />

            <button className="btn-primary" onClick={registra}>
              <h2>Registati</h2>
            </button>
               <br /><br />
            <br /><br />

          </div>
        </div>

      </div>
    </>
  );
};

export default RegistrazioneCliente;









