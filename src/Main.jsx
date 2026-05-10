// React e Redux
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
// Store
import store from "./react_redux/store/store.js";
// View
import App from "./react_redux/views/App.jsx";
import Login from "./react_redux/views/autenticazione_view/Login.jsx";
import LoginAdmin from "./react_redux/views/autenticazione_view/LoginAdmin.jsx";
import Profilo from "./react_redux/views/autenticazione_view/Profilo.jsx";
import ProfiloCliente from "./react_redux/views/cliente_view/ProfiloCliente.jsx";
import Attivita from "./react_redux/views/attivita_view/Attivita.jsx";
import Clienti from "./react_redux/views/cliente_view/Clienti.jsx";
import Servizi from "./react_redux/views/servizio_view/Servizi.jsx";
import Spese from "./react_redux/views/spesa_view/Spese.jsx";
import RegistrazioneCliente from "./react_redux/views/cliente_view/RegistrazioneCliente.jsx";
import CatalogoServiziView from "./react_redux/views/ordine_view/CatalogoServiziView.jsx";
import Ordini from "./react_redux/views/ordine_view/Ordini.jsx";
import CarrelloView from "./react_redux/views/ordine_view/CarrelloView.jsx";
import CheckoutView from "./react_redux/views/ordine_view/CheckoutView.jsx";
import ConfermaOrdine from "./react_redux/views/ordine_view/ConfermaOrdine.jsx";
import Carte from "./react_redux/views/carta_view/Carte.jsx";

const Root = () => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {(autenticazioneState.isLogged === false) && (
          <>
            <Route path="/registrazione" element={<RegistrazioneCliente />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login-admin" element={<LoginAdmin />} />
          </>
        )}

        {(autenticazioneState.isLogged === true) && (
          <>
            <Route path="/profilo" element={<Profilo />} />
            <Route path="/profilo-cliente" element={<ProfiloCliente />} />
            <Route path="/clienti" element={<Clienti />} />
            <Route path="/servizi" element={<Servizi />} />
            <Route path="/nuovo-ordine" element={<CatalogoServiziView />} />
            <Route path="/ordini" element={<Ordini />} />
            <Route path="/spese" element={<Spese />} />
            <Route path="/analisi" element={<Attivita />} />
            <Route path="/carrello" element={<CarrelloView />} />
            <Route path="/checkout" element={<CheckoutView />} />
            <Route path="/conferma-ordine" element={<ConfermaOrdine />} />
            <Route path="/carte" element={<Carte />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Root />
    </Provider>
  </React.StrictMode>
);