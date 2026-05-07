import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { ClienteActions } from "../../actions/ClienteActions";

//registazioe
const RegistrazioneCliente = ({ chiudi }) => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);
  const navigate = useNavigate();
  const clienteActions = new ClienteActions();

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
  });

  const registra = async () => {
    const response = await clienteActions.registrazioneCliente(dati, setDati, "italiano");

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

            <br /><br />

             <input
              type="text"
              placeholder="Cognome"
              value={dati.cognome}
              onChange={(e) =>
                setDati({ ...dati, cognome: e.target.value })
              }
            />

            <br /><br />


            <input
              type="text"
              placeholder="Username"
              value={dati.username}
              onChange={(e) =>
                setDati({ ...dati, username: e.target.value })
              }
            />
            <br /><br />

            <input
              type="text"
              placeholder="Email"
              value={dati.email}
              onChange={(e) =>
                setDati({ ...dati, email: e.target.value })
              }
            />

            <br /><br />

            <input
              type="text"
              placeholder="Password"
              value={dati.password}
              onChange={(e) =>
                setDati({ ...dati, password: e.target.value })
              }
            />
            <br /><br />

            <input
              type="text"
              placeholder="Conferma Password"
              value={dati.conferma_password}
              onChange={(e) =>
                setDati({ ...dati, conferma_password: e.target.value })
              }
            />
            <br /><br />

             <input
              type="text"
              placeholder="Contatto"
              value={dati.contatto}
              onChange={(e) =>
                setDati({ ...dati, contatto: e.target.value })
              }
            />


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









