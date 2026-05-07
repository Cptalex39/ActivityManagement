import { useState } from "react";
import { useSelector } from "react-redux";
import Header from "./components/Header.jsx";
import { Navigate, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.autenticazione.value);
  const [clienteLogged, setClienteLogged] = useState(false);
  const autenticazioneState = useSelector((state) => state.autenticazione.value);

  return (
    <>
      <Header />      

      <div className="main-content" />
    </>
  );
};

export default Home;