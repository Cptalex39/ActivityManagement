import { useState } from "react";
import { NavbarApp } from "../components/navbar/NavbarApp";
//registazioe
const RegistrazioneCliente = ({ chiudi }) => {
  const [dati, setDati] = useState({
    nome: "",
    cognome: "",
    username: "",
    password: "",
    conferma_passworld: "",
    email: "",
    telefono: "",
  });

  const registra = () => {
    if (!dati.telefono || !dati.conferma_passworld ||!dati.cognome || !dati.nome || !dati.username || !dati.password || !dati.email) {
      alert("Compila tutti i campi");
      return;
    }

    alert(`Registrazione completata con successo per ${dati.username}:
Esegui il login per accedere`);
    chiudi();
  };

  return (
    <>
      <NavbarApp />

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
              value={dati.conferma_passworld}
              onChange={(e) =>
                setDati({ ...dati, conferma_passworld: e.target.value })
              }
            />
            <br /><br />

             <input
              type="text"
              placeholder="Telefono"
              value={dati.telefono}
              onChange={(e) =>
                setDati({ ...dati, telefono: e.target.value })
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