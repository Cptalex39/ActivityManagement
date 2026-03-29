import { useState } from "react";
import { useSelector } from "react-redux";
import { NavbarApp } from "./components/navbar/NavbarApp.jsx";
import CustomerHome from "./customer_view/CustomerHome.jsx";

const Home = () => {
  const auth = useSelector((state) => state.autenticazione.value);
  const [clienteLogged, setClienteLogged] = useState(false);

  return (
    <>
      {/* Navbar Admin o Guest */}
      {auth.isLogged ? (
        <NavbarApp />
      ) : clienteLogged ? (
        <CustomerHome setClienteLogged={setClienteLogged} />
      ) : (
        <NavbarApp /> // Guest
      )}

      {/* Pulsante "Entra come cliente" */}
      {!auth.isLogged && !clienteLogged && (
        <div style={{ padding: "30px" }}>
          <button
            onClick={() => setClienteLogged(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0050EF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Entra come cliente
          </button>
        </div>
      )}
    </>
  );
};

export default Home;