import { useState } from "react";
import { useSelector } from "react-redux";
import { CustomerNavbar } from "./CustomerNavbar.jsx";
import CatalogoServiziView from "./CatalogoServiziView.jsx";
import CarrelloView from "./CarrelloView.jsx";
import CheckoutView from "./CheckoutView.jsx";
import CustomerProfiloView from "./CustomerProfiloView.jsx";

const CustomerHome = ({ setClienteLogged }) => {

  const [pagina, setPagina] = useState("catalogo");
  const [carrello, setCarrello] = useState([]);
  const [ordini, setOrdini] = useState([]);
  const [carteSalvate, setCarteSalvate] = useState([]);

  const mockServizi = [
    { id: 1, nome: "Taglio capelli", prezzo: 10.0, tipo: "service" },
    { id: 2, nome: "Pizza Margherita", prezzo: 12.5, tipo: "product" },
    { id: 3, nome: "Penna nera", prezzo: 0.5, tipo: "product" },
  ];

  const aggiungiAlCarrello = (servizio) => {

    const index = carrello.findIndex((item) => item.id === servizio.id);

    if (index >= 0) {

      const nuovoCarrello = [...carrello];
      nuovoCarrello[index].quantita += 1;
      setCarrello(nuovoCarrello);

    } else {

      setCarrello([...carrello, { ...servizio, quantita: 1 }]);

    }
  };

const attivitaState = useSelector((state) => state.attivita.value);

  return (
    <>

      <CustomerNavbar
        setClienteLogged={setClienteLogged}
        setPagina={setPagina}
        carrello={carrello}
      />

      <div style={{ padding: "20px" }}>

        {pagina === "catalogo" && (
          <h2 style={{ color: "white" }}>
            {attivitaState.lingua === "italiano"
              ? "Benvenuto Cliente"
              : "Welcome Customer"}
          </h2>
            )}
          {pagina === "catalogo" && (
           <h3 style={{ color: "white" }}>
          {attivitaState.lingua === "italiano"
            ? "Catalogo servizi"
            : "Service catalog"}
        </h3>
         )}
        {/* CATALOGO */}
        {pagina === "catalogo" && (
          <CatalogoServiziView
            servizi={mockServizi}
            carrello={carrello}
            aggiungiAlCarrello={aggiungiAlCarrello}
            setPagina={setPagina}
          />
        )}

        {/* CARRELLO */}
        {pagina === "carrello" && (
          <>
            

            <CarrelloView carrello={carrello} setCarrello={setCarrello} />

            {carrello.length > 0 && (
              <button
                onClick={() => setPagina("checkout")}
                style={{
                  marginTop: "15px",
                  padding: "8px 15px",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Vai al checkout
              </button>
            )}
          </>
        )}

        {/* CHECKOUT */}
        {pagina === "checkout" && (
          <CheckoutView
            carrello={carrello}
            setCarrello={setCarrello}
            setPagina={setPagina}
            setOrdini={setOrdini}
            carteSalvate={carteSalvate}
          />
        )}

        {/* PROFILO */}
        {pagina === "profilo" && (
          <CustomerProfiloView ordini={ordini} 
           carteSalvate={carteSalvate}
           setCarteSalvate={setCarteSalvate}
          />
        )}

      </div>

    </>
  );
};

export default CustomerHome;