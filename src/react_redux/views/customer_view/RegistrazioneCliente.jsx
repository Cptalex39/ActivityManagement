import { useState } from "react";
import { NavbarApp } from "../components/navbar/NavbarApp";
import { ClienteActions } from "../../actions/ClienteActions";

const RegistrazioneCliente = ({ /*chiudi*/ }) => {
  const clienteActions = new ClienteActions();

  const [dati, setDati] = useState({
    nome: "Mario", 
    cognome: "Rossi", 
    username: "",
    password: "",
    conferma_password: "Password10!!", 
    contatto: "3333333333", 
    email: "",
    indirizzo_spedizione: "", 
    note: "", 
  });

  const registra = () => {
    if (!dati.username || !dati.password || !dati.email) {
      alert("Compila tutti i campi");
      return;
    }

    clienteActions.registrazioneCliente(dati, setDati, "italiano");

    alert(`Registrazione completata con successo per ${dati.username}:
Esegui il login per accedere`);
    //chiudi();
  };

  return (
    <>
      <NavbarApp />

      <div className="main-content">

        <div className="contenitore-1">

          <h2>Registrazione Cliente</h2>

          <div className="center">

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
              type="email"
              placeholder="Email"
              value={dati.email}
              onChange={(e) =>
                setDati({ ...dati, email: e.target.value })
              }
            />

            <br /><br />

            <input
              type="password"
              placeholder="Password"
              value={dati.password}
              onChange={(e) =>
                setDati({ ...dati, password: e.target.value })
              }
            />

            <br /><br />

            <button className="btn-primary" onClick={registra}>
              Registrati
            </button>

            <br /><br />

          </div>
        </div>

      </div>
    </>
  );
};

export default RegistrazioneCliente;