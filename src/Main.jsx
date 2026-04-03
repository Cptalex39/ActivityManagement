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
import Profilo from "./react_redux/views/autenticazione_view/Profilo.jsx";
import Attivita from "./react_redux/views/attivita_view/Attivita.jsx";
import Clienti from "./react_redux/views/cliente_view/Clienti.jsx";
import Servizi from "./react_redux/views/servizio_view/Servizi.jsx";
import Spese from "./react_redux/views/spesa_view/Spese.jsx";
import Lavori from "./react_redux/views/lavoro_view/Lavori.jsx";
// CR: Area Cliente
import Catalogo from "./react_redux/views/catalogo_view/Catalogo.jsx";
import Carrello from "./react_redux/views/carrello_view/Carrello.jsx";
import Checkout from "./react_redux/views/carrello_view/Checkout.jsx";

const Root = () => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />

        {/* CR: Route Area Cliente (pubbliche, sempre accessibili) */}
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/carrello" element={<Carrello />} />
        <Route path="/checkout/:tipoLavoro" element={<Checkout />} />

        {(autenticazioneState.isLogged === false) && (
          <Route path="/login" element={<Login />} />
        )}
        {(autenticazioneState.isLogged === true) && (
          <>
            <Route path="/profilo" element={<Profilo />} />
            <Route path="/clienti" element={<Clienti />} />
            <Route path="/servizi" element={<Servizi />} />
            <Route path="/lavori" element={<Lavori />} />
            <Route path="/spese" element={<Spese />} />
            <Route path="/analisi" element={<Attivita />} />
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