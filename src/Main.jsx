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
import RegistrazioneCliente from "./react_redux/views/customer_view/RegistrazioneCliente.jsx";
import Pagamenti from "./react_redux/views/pagamento_view/pagamento.jsx";

const Root = () => {
  const autenticazioneState = useSelector((state) => state.autenticazione.value);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {(autenticazioneState.isLogged === false) && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/registrazione" element={<RegistrazioneCliente />} />
          </>
        )}

        {(autenticazioneState.isLogged === true) && (
          <>
            <Route path="/profilo" element={<Profilo />} />
            <Route path="/clienti" element={<Clienti />} />
            <Route path="/servizi" element={<Servizi />} />
            <Route path="/lavori" element={<Lavori />} />
            <Route path="/pagamenti" element={<Pagamenti />} />
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
